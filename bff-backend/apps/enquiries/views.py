from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Enquiry, PrivateLabelEnquiry
from .serializers import (
    EnquirySerializer,
    EnquiryCreateSerializer,
    PrivateLabelEnquirySerializer,
    PrivateLabelEnquiryCreateSerializer,
)
from apps.users.permissions import IsCrmStaff


class EnquiryViewSet(viewsets.ModelViewSet):
    queryset = Enquiry.objects.all()
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'buyer_type', 'country', 'private_label_required', 'shipping_method', 'incoterm']
    search_fields = ['company_name', 'contact_person', 'email', 'enquiry_code', 'country']
    ordering_fields = ['created_at', 'status']

    def get_permissions(self):
        if self.action in ['create']:
            return [permissions.AllowAny()]
        return [IsCrmStaff()]

    def get_serializer_class(self):
        if self.action == 'create':
            return EnquiryCreateSerializer
        return EnquirySerializer


class PrivateLabelEnquiryViewSet(viewsets.ModelViewSet):
    queryset = PrivateLabelEnquiry.objects.select_related('product_category', 'product').all()
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'buyer_type', 'brand_status', 'packaging_format', 'quantity_range']
    search_fields = ['company_name', 'brand_name', 'contact_person', 'email', 'enquiry_code']
    ordering_fields = ['created_at', 'step_completed', 'status']

    def get_permissions(self):
        # Public form submit only. Retrieve/update require admin — no anonymous
        # status-check or stepwise PATCH is used by the current frontend.
        if self.action in ['create']:
            return [permissions.AllowAny()]
        return [IsCrmStaff()]

    def get_serializer_class(self):
        if self.action == 'create':
            return PrivateLabelEnquiryCreateSerializer
        return PrivateLabelEnquirySerializer
