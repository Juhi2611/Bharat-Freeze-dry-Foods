import os
import logging
from .product_bg_processor import process_product_image

logger = logging.getLogger(__name__)

def process_media_file_transparent(file_path: str) -> str:
    """
    Background removal processing has been disabled. Returns empty string.
    """
    return ""
