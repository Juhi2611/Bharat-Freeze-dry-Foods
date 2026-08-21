from rest_framework import serializers
from .models import Enquiry, PrivateLabelEnquiry

class EnquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = Enquiry
        fields = '__all__'
        read_only_fields = ['enquiry_code', 'created_at', 'updated_at']

class PrivateLabelEnquirySerializer(serializers.ModelSerializer):
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
