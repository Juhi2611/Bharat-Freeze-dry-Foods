import uuid
from django.db import models
from django.conf import settings

class MediaFile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    file_name = models.CharField(max_length=255)
    file_url = models.URLField()
    transparent_file_url = models.URLField(blank=True, default='')
    file_size_mb = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    dimensions = models.CharField(max_length=50, blank=True)
    category = models.CharField(max_length=50, default='Products')  # Products, Superfoods, B2B Export
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file_name
