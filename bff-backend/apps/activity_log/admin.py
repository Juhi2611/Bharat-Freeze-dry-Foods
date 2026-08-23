from django.contrib import admin
from .models import ActivityLog

@admin.register(ActivityLog)
class ActivityLogAdmin(admin.ModelAdmin):
	list_display = ('created_at', 'user_name', 'action', 'target', 'activity_type')
	search_fields = ('user_name', 'action', 'target', 'user__email')
	list_filter = ('activity_type', 'created_at')
	list_select_related = ('user',)
	readonly_fields = ('created_at',)
