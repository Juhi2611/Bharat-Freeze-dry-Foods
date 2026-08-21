from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EnquiryViewSet, PrivateLabelEnquiryViewSet

router = DefaultRouter()
router.register('enquiries', EnquiryViewSet, basename='enquiry')
router.register('private-label-enquiries', PrivateLabelEnquiryViewSet, basename='private-label-enquiry')

urlpatterns = [
    path('', include(router.urls)),
]
