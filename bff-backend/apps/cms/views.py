from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import (
    WebsiteSection, SiteSettings, FAQ, RegionComplianceProfile,
    Certification, CompanyTimelineEntry, FounderMessage, QualityAssuranceStep
)
from .serializers import (
    WebsiteSectionSerializer, SiteSettingsSerializer, PublicContactSerializer, FAQSerializer,
    RegionComplianceProfileSerializer, CertificationSerializer,
    CompanyTimelineEntrySerializer, FounderMessageSerializer, QualityAssuranceStepSerializer
)
from apps.users.permissions import IsContentStaff

class WebsiteSectionViewSet(viewsets.ModelViewSet):
    queryset = WebsiteSection.objects.all()
    serializer_class = WebsiteSectionSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [IsContentStaff()]

class SiteSettingsView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsContentStaff()]
        return [IsContentStaff()]

    def get(self, request):
        settings, _ = SiteSettings.objects.get_or_create(pk=1)
        serializer = SiteSettingsSerializer(settings)
        return Response(serializer.data)

    def put(self, request):
        settings, _ = SiteSettings.objects.get_or_create(pk=1)
        serializer = SiteSettingsSerializer(settings, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PublicContactView(APIView):
    """Read-only storefront contact info — no auth, narrow field set."""

    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def get(self, request):
        settings, _ = SiteSettings.objects.get_or_create(pk=1)
        serializer = PublicContactSerializer(settings)
        return Response(serializer.data)

class FAQViewSet(viewsets.ModelViewSet):
    queryset = FAQ.objects.filter(is_published=True)
    serializer_class = FAQSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category']
    search_fields = ['question', 'answer']
    ordering_fields = ['display_order', 'category']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [IsContentStaff()]

class RegionComplianceProfileViewSet(viewsets.ModelViewSet):
    queryset = RegionComplianceProfile.objects.all()
    serializer_class = RegionComplianceProfileSerializer
    lookup_field = 'region_code'

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [IsContentStaff()]

class CertificationViewSet(viewsets.ModelViewSet):
    queryset = Certification.objects.all()
    serializer_class = CertificationSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['status']
    ordering_fields = ['display_order', 'name']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [IsContentStaff()]

class CompanyTimelineEntryViewSet(viewsets.ModelViewSet):
    queryset = CompanyTimelineEntry.objects.all()
    serializer_class = CompanyTimelineEntrySerializer
    ordering_fields = ['display_order']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [IsContentStaff()]

class FounderMessageView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [IsContentStaff()]

    def get(self, request):
        msg, _ = FounderMessage.objects.get_or_create(pk=1)
        serializer = FounderMessageSerializer(msg)
        return Response(serializer.data)

    def put(self, request):
        msg, _ = FounderMessage.objects.get_or_create(pk=1)
        serializer = FounderMessageSerializer(msg, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class QualityAssuranceStepViewSet(viewsets.ModelViewSet):
    queryset = QualityAssuranceStep.objects.all()
    serializer_class = QualityAssuranceStepSerializer
    ordering_fields = ['display_order']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [IsContentStaff()]
