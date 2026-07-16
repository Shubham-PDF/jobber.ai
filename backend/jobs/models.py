import uuid
from django.db import models
from django.conf import settings


class SearchHistory(models.Model):
    """Records each job search performed by a user."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="searches",
    )
    resume_filename = models.CharField(max_length=255)
    extracted_profile = models.JSONField(
        default=dict,
        help_text="Structured profile extracted from resume (skills, experience, etc.)",
    )
    platforms_used = models.JSONField(
        default=list,
        help_text='List of platforms searched, e.g. ["simplyhired", "indeed"]',
    )
    credits_used = models.IntegerField(default=0)
    jobs_found = models.IntegerField(default=0)
    matched_jobs = models.JSONField(
        default=list,
        help_text="Array of matched job objects with scores",
    )
    csv_filename = models.CharField(max_length=255, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "search_history"
        ordering = ["-created_at"]

    def __str__(self):
        platforms = ", ".join(self.platforms_used) if self.platforms_used else "none"
        return f"{self.user.name} — {platforms} — {self.jobs_found} jobs"
