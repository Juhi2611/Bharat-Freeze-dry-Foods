from decimal import Decimal
from pathlib import Path
import uuid

from django.conf import settings
from django.core.files.storage import default_storage
from rest_framework import serializers, status, viewsets
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import MediaFile
from .serializers import MediaFileSerializer
from apps.users.permissions import IsContentStaff

ALLOWED_MEDIA_TYPES = {
	'image/jpeg': '.jpg',
	'image/png': '.png',
	'image/webp': '.webp',
	'image/gif': '.gif',
	'video/mp4': '.mp4',
	'video/webm': '.webm',
	'video/ogg': '.ogv',
	'video/quicktime': '.mov',
}


class MediaFileViewSet(viewsets.ModelViewSet):
	queryset = MediaFile.objects.select_related('uploaded_by').all()
	serializer_class = MediaFileSerializer
	permission_classes = [IsContentStaff]
	parser_classes = [MultiPartParser, FormParser, JSONParser]
	filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
	filterset_fields = ['category']
	search_fields = ['file_name', 'category']
	ordering_fields = ['uploaded_at', 'file_size_mb']

	def create(self, request, *args, **kwargs):
		upload = request.FILES.get('file')
		if upload:
			return self._create_from_upload(request, upload)
		return super().create(request, *args, **kwargs)

	def _create_from_upload(self, request, upload):
		content_type = (upload.content_type or '').lower()
		ext = ALLOWED_MEDIA_TYPES.get(content_type)
		if not ext:
			raise serializers.ValidationError({
				'file': 'Only JPEG, PNG, WEBP, GIF images or MP4, WEBM, OGV, MOV videos are allowed.',
			})

		is_video = content_type.startswith('video/')
		max_bytes = 50 * 1024 * 1024 if is_video else 10 * 1024 * 1024
		if upload.size > max_bytes:
			max_label = '50MB' if is_video else '10MB'
			raise serializers.ValidationError({
				'file': f'File must be {max_label} or smaller.',
			})

		safe_stem = Path(upload.name or 'upload').stem[:80] or 'upload'
		stored_name = f'library/{uuid.uuid4().hex}_{safe_stem}{ext}'
		saved_path = default_storage.save(stored_name, upload)
		relative_url = f'{settings.MEDIA_URL.rstrip("/")}/{saved_path}'.replace('\\', '/')
		try:
			absolute_url = request.build_absolute_uri(relative_url)
		except Exception:
			# Fallback for odd hosts (tests / misconfigured Host header).
			absolute_url = relative_url

		size_mb = Decimal(upload.size) / Decimal(1024 * 1024)
		transparent_url = ""

		media = MediaFile.objects.create(
			file_name=upload.name or Path(saved_path).name,
			file_url=absolute_url,
			transparent_file_url=transparent_url,
			file_size_mb=size_mb.quantize(Decimal('0.01')),
			dimensions=request.data.get('dimensions', '') or '',
			category=request.data.get('category', 'Categories') or 'Categories',
			uploaded_by=request.user if request.user.is_authenticated else None,
		)
		serializer = self.get_serializer(media)
		headers = self.get_success_headers(serializer.data)
		return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

	def perform_create(self, serializer):
		serializer.save(uploaded_by=self.request.user)
