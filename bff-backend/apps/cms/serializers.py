from rest_framework import serializers
from .models import (
    WebsiteSection, SiteSettings, FAQ, RegionComplianceProfile,
    Certification, CompanyTimelineEntry, FounderMessage, QualityAssuranceStep
)

class WebsiteSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = WebsiteSection
        fields = '__all__'

class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = '__all__'


class PublicContactSerializer(serializers.ModelSerializer):
    """Storefront-safe contact fields only — no admin/social payload."""

    class Meta:
        model = SiteSettings
        fields = ('whatsapp_number', 'support_phone', 'support_email')

class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = '__all__'

class RegionComplianceProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegionComplianceProfile
        fields = '__all__'

class CertificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certification
        fields = '__all__'

class CompanyTimelineEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyTimelineEntry
        fields = '__all__'

class FounderMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = FounderMessage
        fields = '__all__'

class QualityAssuranceStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = QualityAssuranceStep
        fields = '__all__'
