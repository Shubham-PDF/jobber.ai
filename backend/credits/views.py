from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import CreditRequest
from .serializers import CreditRequestSerializer, CreditRequestResponseSerializer


class RequestCreditsView(APIView):
    """Submit a credit purchase request after QR code payment."""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CreditRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        credit_request = CreditRequest.objects.create(
            user=request.user,
            transaction_id=serializer.validated_data["transaction_id"],
        )

        return Response(
            {
                "message": "Payment request submitted. Credits will be added within 24 hours after verification.",
                "request": CreditRequestResponseSerializer(credit_request).data,
            },
            status=status.HTTP_201_CREATED,
        )


class CreditHistoryView(APIView):
    """Get user's credit purchase history."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        requests = CreditRequest.objects.filter(user=request.user)
        return Response(CreditRequestResponseSerializer(requests, many=True).data)
