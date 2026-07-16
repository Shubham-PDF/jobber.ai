import logging

import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import authentication, exceptions

logger = logging.getLogger(__name__)

User = get_user_model()

class ClerkJWTAuthentication(authentication.BaseAuthentication):
    """
    Custom authentication class for Django REST Framework to authenticate users
    using JWTs issued by Clerk.
    """

    def __init__(self):
        super().__init__()
        jwks_url = getattr(settings, "CLERK_JWKS_URL", None)
        logger.info(f"[ClerkAuth] Initializing with JWKS URL: {jwks_url}")
        if jwks_url:
            # PyJWKClient handles fetching and caching JWKS automatically
            self.jwks_client = jwt.PyJWKClient(jwks_url)
        else:
            self.jwks_client = None
            logger.warning("[ClerkAuth] No CLERK_JWKS_URL configured — Clerk auth will be disabled.")

    def authenticate(self, request):
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            logger.debug("[ClerkAuth] No Authorization header present.")
            return None

        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != "bearer":
            logger.debug(f"[ClerkAuth] Malformed Authorization header: {parts[0] if parts else '(empty)'}")
            return None

        token = parts[1]
        logger.debug(f"[ClerkAuth] Received Bearer token (first 20 chars): {token[:20]}...")

        if not self.jwks_client:
            logger.error("[ClerkAuth] JWKS client not configured. Rejecting request.")
            raise exceptions.AuthenticationFailed("Clerk authentication is not configured on the server.")

        try:
            # 1. Fetch the correct signing key from JWKS
            signing_key = self.jwks_client.get_signing_key_from_jwt(token)
            logger.debug(f"[ClerkAuth] Got signing key ID: {signing_key.key_id}")

            # 2. Decode and verify the JWT
            # Clerk tokens are signed using RS256
            # We verify signature, expiration, and issuer (optional but recommended)
            issuer = getattr(settings, "CLERK_ISSUER", None)
            logger.debug(f"[ClerkAuth] Expected issuer: {issuer}")
            decode_options = {
                "verify_aud": False,  # Clerk aud varies depending on configuration, verification is optional
            }
            
            payload = jwt.decode(
                token,
                signing_key.key,
                algorithms=["RS256"],
                issuer=issuer,
                options=decode_options
            )
            logger.info(f"[ClerkAuth] JWT verified successfully. sub={payload.get('sub')}, iss={payload.get('iss')}")
        except jwt.ExpiredSignatureError:
            logger.warning("[ClerkAuth] Token has expired.")
            raise exceptions.AuthenticationFailed("Token has expired.")
        except jwt.InvalidIssuerError:
            actual_issuer = jwt.decode(token, options={"verify_signature": False}).get("iss", "unknown")
            logger.error(f"[ClerkAuth] Issuer mismatch! Expected: {getattr(settings, 'CLERK_ISSUER', None)}, Got: {actual_issuer}")
            raise exceptions.AuthenticationFailed(
                f"Invalid token issuer. Expected: {getattr(settings, 'CLERK_ISSUER', None)}, Got: {actual_issuer}"
            )
        except jwt.InvalidTokenError as e:
            logger.error(f"[ClerkAuth] Invalid token: {str(e)}")
            raise exceptions.AuthenticationFailed(f"Invalid token: {str(e)}")
        except Exception as e:
            logger.error(f"[ClerkAuth] Token verification failed: {str(e)}", exc_info=True)
            raise exceptions.AuthenticationFailed(f"Token verification failed: {str(e)}")

        # 3. Extract claims from verified payload
        clerk_id = payload.get("sub")
        email = payload.get("email") or payload.get("emails", [None])[0]  # Clerk puts email in different claims depending on config
        
        # Fallback to check nested or alternative fields in case it's custom
        if not email:
            # Try to get from extra payload information
            email = payload.get("email_address")
            
        if not clerk_id:
            logger.error(f"[ClerkAuth] No 'sub' claim in payload. Keys: {list(payload.keys())}")
            raise exceptions.AuthenticationFailed("Clerk ID (sub) not found in token.")

        logger.debug(f"[ClerkAuth] Looking up user: clerk_id={clerk_id}, email={email}")

        # 4. Find or auto-provision the user
        user = None
        
        # First try to find by clerk_id
        try:
            user = User.objects.get(clerk_id=clerk_id)
            logger.debug(f"[ClerkAuth] Found existing user by clerk_id: {user.email}")
        except User.DoesNotExist:
            pass

        # If not found by clerk_id but we have an email, try matching by email
        if not user and email:
            try:
                user = User.objects.get(email=email)
                # Link clerk_id to existing user
                user.clerk_id = clerk_id
                user.save(update_fields=["clerk_id"])
                logger.info(f"[ClerkAuth] Linked clerk_id to existing user: {user.email}")
            except User.DoesNotExist:
                pass

        # If user still does not exist, provision a new one
        if not user:
            name = payload.get("name") or payload.get("given_name") or (email.split("@")[0] if email else "User")
            # Generate random password as Clerk handles actual authentication
            user = User.objects.create_user(
                email=email or f"{clerk_id}@clerk.local",
                name=name,
                clerk_id=clerk_id,
            )
            # Set initial free credits
            user.credits = 2
            user.save(update_fields=["credits"])
            logger.info(f"[ClerkAuth] Auto-provisioned new user: {user.email}, credits=2")

        return (user, token)

