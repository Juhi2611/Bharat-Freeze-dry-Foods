from rest_framework import serializers
from .models import MediaFile
from config.utils import normalize_media_url

class MediaFileSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.ReadOnlyField(source='uploaded_by.full_name')
    file_url = serializers.SerializerMethodField()
    transparent_file_url = serializers.SerializerMethodField()

    class Meta:
        model = MediaFile
        fields = '__all__'
        read_only_fields = ['uploaded_at']

    def get_file_url(self, obj):
        request = self.context.get('request')
        return normalize_media_url(obj.file_url, request)

    def get_transparent_file_url(self, obj):
        request = self.context.get('request')
        return normalize_media_url(obj.transparent_file_url, request)
