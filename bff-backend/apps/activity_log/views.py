from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import ActivityLog
from .serializers import ActivityLogSerializer
from apps.users.permissions import IsCrmStaff

class ActivityLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ActivityLog.objects.select_related('user').all()
    serializer_class = ActivityLogSerializer
    permission_classes = [IsCrmStaff]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['activity_type']
    search_fields = ['user_name', 'action', 'target']
    ordering_fields = ['created_at']
