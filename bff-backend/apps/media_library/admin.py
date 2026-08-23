from django.contrib import admin
from .models import MediaFile

@admin.register(MediaFile)
class MediaFileAdmin(admin.ModelAdmin):
	list_display = ('file_name', 'category', 'file_size_mb', 'dimensions', 'uploaded_by', 'uploaded_at')
	search_fields = ('file_name', 'file_url', 'category', 'uploaded_by__email')
	list_filter = ('category', 'uploaded_at')
	list_select_related = ('uploaded_by',)
	readonly_fields = ('uploaded_at',)
