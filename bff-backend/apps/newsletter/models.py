import uuid
from django.db import models

class Subscriber(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True, db_index=True)
    is_active = models.BooleanField(default=True)
    source = models.CharField(max_length=50, default='footer')
    subscribed_at = models.DateTimeField(auto_now_add=True)
    unsubscribed_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return self.email
