from django.contrib import admin
from .models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ["name", "email", "credits", "is_active", "created_at"]
    list_filter = ["is_active", "is_staff"]
    search_fields = ["name", "email"]
    readonly_fields = ["id", "created_at"]
    ordering = ["-created_at"]
