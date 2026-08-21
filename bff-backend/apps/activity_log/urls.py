from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ActivityLogViewSet

router = DefaultRouter()
router.register('logs', ActivityLogViewSet, basename='activity-log')

urlpatterns = [
    path('', include(router.urls)),
]
