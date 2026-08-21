from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Enquiry, PrivateLabelEnquiry
from .serializers import EnquirySerializer, PrivateLabelEnquirySerializer
from apps.users.permissions import IsAdminRole

class EnquiryViewSet(viewsets.ModelViewSet):
    queryset = Enquiry.objects.all()
    serializer_class = EnquirySerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'buyer_type', 'country', 'private_label_required', 'shipping_method', 'incoterm']
    search_fields = ['company_name', 'contact_person', 'email', 'enquiry_code', 'country']
    ordering_fields = ['created_at', 'status']

    def get_permissions(self):
        if self.action in ['create']:
            return [permissions.AllowAny()]
        return [IsAdminRole()]

class PrivateLabelEnquiryViewSet(viewsets.ModelViewSet):
    queryset = PrivateLabelEnquiry.objects.select_related('product_category', 'product').all()
    serializer_class = PrivateLabelEnquirySerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'buyer_type', 'brand_status', 'packaging_format', 'quantity_range']
    search_fields = ['company_name', 'brand_name', 'contact_person', 'email', 'enquiry_code']
    ordering_fields = ['created_at', 'step_completed', 'status']

    def get_permissions(self):
        # Step-wise creation and PATCH allowed for public user during configurator flow
        if self.action in ['create', 'partial_update', 'retrieve']:
            return [permissions.AllowAny()]
        return [IsAdminRole()]
