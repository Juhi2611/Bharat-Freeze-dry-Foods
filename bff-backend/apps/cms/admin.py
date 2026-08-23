from django.contrib import admin
from .models import (
	WebsiteSection,
	SiteSettings,
	FAQ,
	RegionComplianceProfile,
	Certification,
	CompanyTimelineEntry,
	FounderMessage,
	QualityAssuranceStep,
)

@admin.register(WebsiteSection)
class WebsiteSectionAdmin(admin.ModelAdmin):
	list_display = ('id', 'title', 'route_url', 'status', 'last_updated')
	search_fields = ('id', 'title', 'route_url', 'subtitle')
	list_filter = ('status', 'last_updated')
	readonly_fields = ('last_updated',)

@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
	list_display = ('company_name', 'support_email', 'default_currency', 'updated_at')
	search_fields = ('company_name', 'support_email', 'support_phone')
	readonly_fields = ('updated_at',)

@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
	list_display = ('question', 'category', 'is_published', 'display_order', 'updated_at')
	search_fields = ('question', 'answer')
	list_filter = ('category', 'is_published')

@admin.register(RegionComplianceProfile)
class RegionComplianceProfileAdmin(admin.ModelAdmin):
	list_display = ('region_code', 'region_name')
	search_fields = ('region_code', 'region_name', 'notes')

@admin.register(Certification)
class CertificationAdmin(admin.ModelAdmin):
	list_display = ('name', 'status', 'target_date', 'display_order')
	search_fields = ('name', 'notes')
	list_filter = ('status',)

@admin.register(CompanyTimelineEntry)
class CompanyTimelineEntryAdmin(admin.ModelAdmin):
	list_display = ('period_label', 'title', 'display_order')
	search_fields = ('period_label', 'title', 'description')

@admin.register(FounderMessage)
class FounderMessageAdmin(admin.ModelAdmin):
	list_display = ('founder_name', 'title', 'updated_at')
	search_fields = ('founder_name', 'title', 'message')
	readonly_fields = ('updated_at',)

@admin.register(QualityAssuranceStep)
class QualityAssuranceStepAdmin(admin.ModelAdmin):
	list_display = ('stage_name', 'icon_name', 'display_order')
	search_fields = ('stage_name', 'description')
