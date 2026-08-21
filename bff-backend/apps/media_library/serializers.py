from rest_framework import serializers
from .models import MediaFile

class MediaFileSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.ReadOnlyField(source='uploaded_by.full_name')

    class Meta:
        model = MediaFile
        fields = '__all__'
        read_only_fields = ['uploaded_at']
