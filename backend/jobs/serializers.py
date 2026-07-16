from rest_framework import serializers
from .models import SearchHistory

class JobSearchSerializer(serializers.Serializer):
    resume = serializers.FileField()
    platforms = serializers.ListField(
        child=serializers.CharField(),
        min_length=1,
        help_text="List of platforms to search: 'simplyhired', 'indeed', 'dailyremote'"
    )

    def validate_platforms(self, value):
        allowed = {"simplyhired", "indeed", "dailyremote"}
        invalid = set(value) - allowed
        if invalid:
            raise serializers.ValidationError(
                f"Invalid platform(s): {', '.join(invalid)}. Allowed: {', '.join(allowed)}"
            )
        return value

class SearchHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SearchHistory
        fields = [
            "id",
            "resume_filename",
            "extracted_profile",
            "platforms_used",
            "credits_used",
            "jobs_found",
            "matched_jobs",
            "csv_filename",
            "created_at",
        ]
        read_only_fields = fields
