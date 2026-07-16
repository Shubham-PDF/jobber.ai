from rest_framework import serializers
from .models import CreditRequest


class CreditRequestSerializer(serializers.Serializer):
    """Serializer for submitting a credit purchase request."""

    transaction_id = serializers.CharField(max_length=100)

    def validate_transaction_id(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Transaction ID is required.")
        if CreditRequest.objects.filter(transaction_id=value).exists():
            raise serializers.ValidationError(
                "This transaction ID has already been submitted."
            )
        return value


class CreditRequestResponseSerializer(serializers.ModelSerializer):
    """Serializer for displaying credit request status."""

    class Meta:
        model = CreditRequest
        fields = [
            "id",
            "transaction_id",
            "amount_inr",
            "credits_requested",
            "status",
            "created_at",
        ]
        read_only_fields = fields
