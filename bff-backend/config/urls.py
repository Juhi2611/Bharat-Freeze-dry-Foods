from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView
from rest_framework.permissions import IsAuthenticated

from apps.crm.views import (
    OrderCheckoutView,
    OrderCreatePaymentView,
    MyOrderDetailView,
    MyOrderListView,
    OrderVerifyPaymentView,
    RazorpayWebhookView,
    CustomerOrderHistoryView,
)
from apps.users.permissions import IsAdminRole

# B11: OpenAPI schema/docs require staff authentication (not anonymously browsable).
_schema_kwargs = {
    'permission_classes': [IsAuthenticated, IsAdminRole],
}

urlpatterns = [
    path('django-admin/', admin.site.urls),

    # OpenAPI Schema & Documentation (staff-only)
    path('api/schema/', SpectacularAPIView.as_view(**_schema_kwargs), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema', **_schema_kwargs), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema', **_schema_kwargs), name='redoc'),

    # API v1 Router Endpoints
    path('api/v1/', include('apps.users.urls')),
    path('api/v1/', include('apps.catalog.urls')),
    path('api/v1/', include('apps.enquiries.urls')),
    path('api/v1/orders/checkout/', OrderCheckoutView.as_view(), name='order-checkout'),
    path('api/v1/orders/mine/', MyOrderListView.as_view(), name='my-order-list'),
    path('api/v1/orders/mine/<uuid:order_id>/', MyOrderDetailView.as_view(), name='my-order-detail'),
    path('api/v1/orders/<uuid:order_id>/create-payment/', OrderCreatePaymentView.as_view(), name='order-create-payment'),
    path('api/v1/orders/<uuid:order_id>/verify-payment/', OrderVerifyPaymentView.as_view(), name='order-verify-payment'),
    path('api/v1/webhooks/razorpay/', RazorpayWebhookView.as_view(), name='razorpay-webhook'),
    path('api/v1/orders/', include('apps.crm.admin_urls')),
    path('api/v1/customers/<uuid:customer_id>/orders/', CustomerOrderHistoryView.as_view(), name='customer-order-history'),
    path('api/v1/customers/', include('apps.crm.customer_admin_urls')),
    path('api/v1/cms/', include('apps.cms.urls')),
    path('api/v1/crm/', include('apps.crm.urls')),
    path('api/v1/newsletter/', include('apps.newsletter.urls')),
    path('api/v1/media/', include('apps.media_library.urls')),
    path('api/v1/activity/', include('apps.activity_log.urls')),
]

from django.urls import re_path
from django.views.static import serve

urlpatterns += [
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
]

