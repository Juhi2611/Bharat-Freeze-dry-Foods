from django.conf import settings

def normalize_media_url(url, request=None):
    """
    Normalizes media URLs so that local or relative media URLs (e.g. starting with
    http://localhost:8000/media/, http://127.0.0.1:8000/media/, or /media/)
    are converted to absolute URIs based on the current request domain (e.g. Railway production).
    External URLs (e.g. https://example.com/..., S3, Cloudinary) remain untouched.
    """
    if not url:
        return url or ""

    if "/media/" in url:
        media_path = url[url.find("/media/"):]
        if request:
            return request.build_absolute_uri(media_path)
        return media_path

    return url
