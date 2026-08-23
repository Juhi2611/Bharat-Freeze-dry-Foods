from django.contrib import admin
from .models import Subscriber

@admin.register(Subscriber)
class SubscriberAdmin(admin.ModelAdmin):
	list_display = ('email', 'is_active', 'source', 'subscribed_at', 'unsubscribed_at')
	search_fields = ('email', 'source')
	list_filter = ('is_active', 'source', 'subscribed_at')
	readonly_fields = ('subscribed_at',)
