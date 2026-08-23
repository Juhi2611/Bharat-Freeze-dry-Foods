from django.contrib import admin
from .models import Enquiry, PrivateLabelEnquiry

@admin.register(Enquiry)
class EnquiryAdmin(admin.ModelAdmin):
	list_display = ('enquiry_code', 'company_name', 'contact_person', 'country', 'status', 'created_at')
	search_fields = ('enquiry_code', 'company_name', 'contact_person', 'email', 'country')
	list_filter = ('status', 'buyer_type', 'shipping_method', 'incoterm', 'payment_terms', 'private_label_required')
	readonly_fields = ('enquiry_code', 'created_at', 'updated_at')

@admin.register(PrivateLabelEnquiry)
class PrivateLabelEnquiryAdmin(admin.ModelAdmin):
	list_display = ('enquiry_code', 'company_name', 'brand_name', 'country', 'status', 'step_completed', 'created_at')
	search_fields = ('enquiry_code', 'company_name', 'brand_name', 'contact_person', 'email', 'country')
	list_filter = ('status', 'brand_status', 'packaging_format', 'quantity_range', 'step_completed')
	readonly_fields = ('enquiry_code', 'created_at', 'updated_at')
