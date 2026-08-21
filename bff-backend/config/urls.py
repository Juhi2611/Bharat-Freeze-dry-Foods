from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

urlpatterns = [
    path('django-admin/', admin.site.urls),
    
    # OpenAPI Schema & Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    # API v1 Router Endpoints
    path('api/v1/', include('apps.users.urls')),
    path('api/v1/', include('apps.catalog.urls')),
    path('api/v1/', include('apps.enquiries.urls')),
    path('api/v1/cms/', include('apps.cms.urls')),
    path('api/v1/crm/', include('apps.crm.urls')),
    path('api/v1/newsletter/', include('apps.newsletter.urls')),
    path('api/v1/media/', include('apps.media_library.urls')),
    path('api/v1/activity/', include('apps.activity_log.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
