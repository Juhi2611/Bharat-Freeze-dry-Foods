from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from .models import Subscriber
from .serializers import SubscriberSerializer
from apps.users.permissions import IsContentStaff

class SubscriberViewSet(viewsets.ModelViewSet):
    queryset = Subscriber.objects.all()
    serializer_class = SubscriberSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['is_active', 'source']
    search_fields = ['email']

    def get_permissions(self):
        if self.action in ['create', 'unsubscribe']:
            return [permissions.AllowAny()]
        return [IsContentStaff()]

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny()])
    def unsubscribe(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            subscriber = Subscriber.objects.get(email=email)
            subscriber.is_active = False
            subscriber.save()
            return Response({'message': 'Successfully unsubscribed'})
        except Subscriber.DoesNotExist:
            return Response({'error': 'Subscriber not found'}, status=status.HTTP_404_NOT_FOUND)
