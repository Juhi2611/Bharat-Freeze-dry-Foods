from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    WebsiteSectionViewSet, SiteSettingsView, FAQViewSet, RegionComplianceProfileViewSet,
    CertificationViewSet, CompanyTimelineEntryViewSet, FounderMessageView, QualityAssuranceStepViewSet
)

router = DefaultRouter()
router.register('sections', WebsiteSectionViewSet, basename='website-section')
router.register('faqs', FAQViewSet, basename='faq')
router.register('compliance-profiles', RegionComplianceProfileViewSet, basename='region-compliance')
router.register('certifications', CertificationViewSet, basename='certification')
router.register('timeline', CompanyTimelineEntryViewSet, basename='company-timeline')
router.register('qa-steps', QualityAssuranceStepViewSet, basename='qa-step')

urlpatterns = [
    path('settings', SiteSettingsView.as_view(), name='site-settings'),
    path('founder-message', FounderMessageView.as_view(), name='founder-message'),
    path('', include(router.urls)),
]
