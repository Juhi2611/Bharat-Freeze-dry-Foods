from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import MediaFile
from .serializers import MediaFileSerializer
from apps.users.permissions import IsAdminRole

class MediaFileViewSet(viewsets.ModelViewSet):
    queryset = MediaFile.objects.select_related('uploaded_by').all()
    serializer_class = MediaFileSerializer
    permission_classes = [IsAdminRole]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category']
    search_fields = ['file_name', 'category']
    ordering_fields = ['uploaded_at', 'file_size_mb']

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)
