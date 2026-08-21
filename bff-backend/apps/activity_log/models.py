import uuid
from django.db import models
from django.conf import settings

class ActivityLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    user_name = models.CharField(max_length=150)
    action = models.CharField(max_length=255)
    target = models.CharField(max_length=255)
    activity_type = models.CharField(max_length=50)  # enquiry, upload, product, export
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user_name} - {self.action} ({self.target})"
