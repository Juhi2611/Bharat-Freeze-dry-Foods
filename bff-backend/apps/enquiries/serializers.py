from rest_framework import serializers
from .models import Enquiry, PrivateLabelEnquiry


class EnquirySerializer(serializers.ModelSerializer):
    """Full serializer for admin retrieve/update."""

    class Meta:
        model = Enquiry
        fields = '__all__'
        read_only_fields = ['enquiry_code', 'created_at', 'updated_at']


class EnquiryCreateSerializer(serializers.ModelSerializer):
    """Public create — excludes staff-only fields (status, internal_notes)."""

    class Meta:
        model = Enquiry
        fields = [
            'id',
            'enquiry_code',
            'company_name',
            'contact_person',
            'email',
            'phone',
            'country',
            'buyer_type',
            'interested_products',
            'quantity_requirement',
            'private_label_required',
            'packaging_preference',
            'target_market',
            'additional_requirements',
            'shipping_method',
            'delivery_timeline',
            'incoterm',
            'payment_terms',
            'packaging_reference_file',
            'brand_guidelines_file',
            'po_file',
            'message',
        ]
        read_only_fields = ['id', 'enquiry_code']


class PrivateLabelEnquirySerializer(serializers.ModelSerializer):
    """Full serializer for admin retrieve/update."""

    class Meta:
        model = PrivateLabelEnquiry
        fields = '__all__'
        read_only_fields = ['enquiry_code', 'created_at', 'updated_at']

    def update(self, instance, validated_data):
        # Update step_completed if new step is higher
        step = validated_data.get('step_completed', instance.step_completed)
        if step > instance.step_completed:
            instance.step_completed = step
        return super().update(instance, validated_data)


class PrivateLabelEnquiryCreateSerializer(serializers.ModelSerializer):
    """Public create — excludes staff-only fields (status, internal_notes)."""

    class Meta:
        model = PrivateLabelEnquiry
        fields = [
            'id',
            'enquiry_code',
            'step_completed',
            'company_name',
            'contact_person',
            'email',
            'phone',
            'country',
            'website',
            'buyer_type',
            'brand_name',
            'brand_status',
            'brand_website_social',
            'target_market',
            'product_category',
            'product',
            'desired_specification',
            'cut_size_form',
            'flavour_recipe',
            'packaging_format',
            'quantity_range',
            'has_existing_artwork',
            'needs_design_support',
            'logo_file',
            'brand_guidelines_file',
            'packaging_reference_file',
            'custom_label_requirements',
            'target_country',
            'intended_application',
            'required_certifications',
            'import_requirements',
            'existing_regulatory_specs',
            'target_launch_date',
            'target_price_range',
            'desired_incoterm',
            'preferred_payment_terms',
            'shipping_destination',
        ]
        read_only_fields = ['id', 'enquiry_code']
