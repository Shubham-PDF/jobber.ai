from django.contrib import admin
from .models import CreditRequest


@admin.register(CreditRequest)
class CreditRequestAdmin(admin.ModelAdmin):
    """
    Admin panel for reviewing and approving credit purchase requests.
    Select pending requests → Actions → 'Approve and add credits'.
    """

    list_display = [
        "user",
        "transaction_id",
        "amount_inr",
        "credits_requested",
        "status",
        "created_at",
    ]
    list_filter = ["status", "created_at"]
    search_fields = ["user__name", "user__email", "transaction_id"]
    readonly_fields = ["id", "created_at", "updated_at"]
    ordering = ["-created_at"]
    actions = ["approve_requests", "reject_requests"]

    @admin.action(description="✅ Approve selected requests and add credits")
    def approve_requests(self, request, queryset):
        approved_count = 0
        for cr in queryset.filter(status="pending"):
            cr.status = "approved"
            cr.save()
            cr.user.add_credits(cr.credits_requested)
            approved_count += 1
        self.message_user(
            request,
            f"Approved {approved_count} request(s). Credits added to users.",
        )

    @admin.action(description="❌ Reject selected requests")
    def reject_requests(self, request, queryset):
        updated = queryset.filter(status="pending").update(status="rejected")
        self.message_user(request, f"Rejected {updated} request(s).")
