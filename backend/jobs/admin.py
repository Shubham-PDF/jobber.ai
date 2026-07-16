from django.contrib import admin
from .models import SearchHistory

@admin.register(SearchHistory)
class SearchHistoryAdmin(admin.ModelAdmin):
    list_display = ["user", "resume_filename", "jobs_found", "credits_used", "created_at"]
    list_filter = ["created_at"]
    search_fields = ["user__name", "user__email", "resume_filename"]
    readonly_fields = ["id", "created_at"]
    ordering = ["-created_at"]
