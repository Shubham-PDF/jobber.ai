import uuid
from django.db import models
from django.conf import settings


class CreditRequest(models.Model):
    """
    Tracks QR-code payment requests for credit purchases.
    Admin approves pending requests via Django admin panel,
    which auto-adds credits to the user's account.
    """

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="credit_requests",
    )
    transaction_id = models.CharField(
        max_length=100,
        help_text="UPI transaction ID provided by the user after scanning QR code",
    )
    amount_inr = models.IntegerField(default=100)
    credits_requested = models.IntegerField(default=10)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="pending")
    admin_note = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "credit_requests"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.name} — ₹{self.amount_inr} — {self.status}"
