"""
product_bg_processor.py

Reusable background-removal + theme-compositing pipeline for product photos.
Isolates the product from its photographed background (true alpha-channel
cutout, using rembg / fallback) -- no CSS filters, no color transforms.
Composites cutout onto clean light-theme backdrop (#F7F7F4) with soft drop shadow
and optional subtle snow/frost particle overlay.
"""

import os
import random
import argparse
import io
import logging
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageOps
import numpy as np

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Config -- design system tokens
# ---------------------------------------------------------------------------

LIGHT_BACKDROP_COLOR = (247, 247, 244, 255)   # #F7F7F4 -- Tailwind / design token
SHADOW_COLOR = (20, 20, 25)                   # soft dark shadow, low opacity
SHADOW_OPACITY = 70                           # 0-255
SHADOW_BLUR_RADIUS = 18
SHADOW_Y_OFFSET_RATIO = 0.015                 # relative to image height
SHADOW_SCALE_X = 0.62                         # shadow ellipse width relative to product width
SHADOW_SCALE_Y = 0.05                         # shadow ellipse height relative to product height

SNOW_PARTICLE_COUNT = 140
SNOW_COLOR = (210, 225, 235)
SNOW_MIN_R, SNOW_MAX_R = 1, 3.5
SNOW_MIN_ALPHA, SNOW_MAX_ALPHA = 40, 110

MODEL_NAME = "isnet-general-use"

_session = None

def _get_session():
    global _session
    if _session is None:
        try:
            from rembg import new_session
            _session = new_session(MODEL_NAME)
        except Exception as e:
            logger.warning(f"Could not initialize rembg session ({e}). Fallback matting will be used.")
            _session = False
    return _session


# ---------------------------------------------------------------------------
# Core steps
# ---------------------------------------------------------------------------

def remove_background(input_path: str) -> Image.Image:
    """Returns an RGBA PIL Image with the background removed (alpha cutout)."""
    img = Image.open(input_path).convert("RGB")

    # 1. Try rembg AI model
    session = _get_session()
    if session:
        try:
            from rembg import remove
            cutout = remove(img, session=session)
            return cutout.convert("RGBA")
        except Exception as e:
            logger.warning(f"rembg removal failed ({e}), using precision fallback.")

    # 2. Precision thresholding fallback for dark studio backgrounds
    img_rgba = img.convert("RGBA")
    arr = np.array(img_rgba, dtype=np.float32)

    r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
    brightness = (r + g + b) / 3.0

    # Alpha mask calculation for dark background isolation
    alpha_mask = np.clip((brightness - 22.0) / 33.0, 0.0, 1.0) * 255.0
    arr[:, :, 3] = alpha_mask

    return Image.fromarray(arr.astype(np.uint8), "RGBA")


def _product_bbox(cutout: Image.Image, alpha_threshold: int = 10):
    """Bounding box of non-transparent pixels, used to place the shadow correctly."""
    alpha = cutout.split()[-1]
    mask = alpha.point(lambda p: 255 if p > alpha_threshold else 0)
    bbox = mask.getbbox()
    return bbox or (0, 0, cutout.width, cutout.height)


def _make_shadow_layer(size, bbox) -> Image.Image:
    """A soft blurred ellipse under the product, for a grounded, non-pasted look."""
    W, H = size
    x0, y0, x1, y1 = bbox
    cx = (x0 + x1) / 2
    prod_w = x1 - x0
    prod_h = y1 - y0

    shadow = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(shadow)

    ell_w = prod_w * SHADOW_SCALE_X
    ell_h = max(prod_h * SHADOW_SCALE_Y, 10)
    ell_cy = y1 - prod_h * 0.01 + H * SHADOW_Y_OFFSET_RATIO

    draw.ellipse(
        [cx - ell_w / 2, ell_cy - ell_h / 2, cx + ell_w / 2, ell_cy + ell_h / 2],
        fill=(*SHADOW_COLOR, SHADOW_OPACITY),
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(SHADOW_BLUR_RADIUS))
    return shadow


def _make_snow_layer(size, seed=None) -> Image.Image:
    W, H = size
    layer = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    rnd = random.Random(seed)
    for _ in range(SNOW_PARTICLE_COUNT):
        x = rnd.randint(0, W)
        y = rnd.randint(0, H)
        r = rnd.uniform(SNOW_MIN_R, SNOW_MAX_R)
        alpha = rnd.randint(SNOW_MIN_ALPHA, SNOW_MAX_ALPHA)
        draw.ellipse([x - r, y - r, x + r, y + r], fill=(*SNOW_COLOR, alpha))
    return layer.filter(ImageFilter.GaussianBlur(0.3))


def composite_on_light_backdrop(
    cutout: Image.Image,
    add_shadow: bool = True,
    add_snow: bool = False,
    seed=None,
) -> Image.Image:
    """
    Places the untouched product cutout onto a flat light backdrop.
    Product pixels are copied as-is -- nothing about them is transformed.
    """
    size = cutout.size
    base = Image.new("RGBA", size, LIGHT_BACKDROP_COLOR)

    if add_snow:
        base.alpha_composite(_make_snow_layer(size, seed=seed))

    if add_shadow:
        bbox = _product_bbox(cutout)
        base.alpha_composite(_make_shadow_layer(size, bbox))

    base.alpha_composite(cutout)   # product goes on top, untouched
    return base


# ---------------------------------------------------------------------------
# Public entry point
# ---------------------------------------------------------------------------

def process_product_image(
    input_path: str,
    output_dir: str,
    make_snow_variant: bool = True,
    add_shadow: bool = True,
    manual_mask_path: str | None = None,
) -> dict:
    """
    Full pipeline for one product image. Returns a dict of output file paths.
    """
    os.makedirs(output_dir, exist_ok=True)
    stem = Path(input_path).stem

    if manual_mask_path and os.path.exists(manual_mask_path):
        cutout = Image.open(manual_mask_path).convert("RGBA")
    else:
        cutout = remove_background(input_path)

    cutout_path = os.path.join(output_dir, f"{stem}_cutout.png")
    cutout.save(cutout_path)

    light_plain = composite_on_light_backdrop(cutout, add_shadow=add_shadow, add_snow=False)
    light_plain_path = os.path.join(output_dir, f"{stem}_light_plain.png")
    light_plain.convert("RGB").save(light_plain_path, quality=95)

    result = {
        "cutout": cutout_path,
        "light_plain": light_plain_path,
        "original": input_path,
    }

    if make_snow_variant:
        light_snow = composite_on_light_backdrop(
            cutout, add_shadow=add_shadow, add_snow=True, seed=hash(stem) % (2**32)
        )
        light_snow_path = os.path.join(output_dir, f"{stem}_light_snow.png")
        light_snow.convert("RGB").save(light_snow_path, quality=95)
        result["light_snow"] = light_snow_path

    return result


def process_folder(input_dir: str, output_dir: str, make_snow_variant: bool = True):
    """Batch-process every image in a folder. For backfilling an existing catalog."""
    exts = {".jpg", ".jpeg", ".png", ".webp"}
    results = []
    for fname in sorted(os.listdir(input_dir)):
        if Path(fname).suffix.lower() not in exts:
            continue
        in_path = os.path.join(input_dir, fname)
        out_subdir = os.path.join(output_dir, Path(fname).stem)
        print(f"Processing {fname} ...")
        try:
            r = process_product_image(in_path, out_subdir, make_snow_variant=make_snow_variant)
            results.append(r)
            print(f"  done -> {out_subdir}")
        except Exception as e:
            print(f"  FAILED: {fname}: {e}")
    return results


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Product background removal + light-theme compositing")
    parser.add_argument("--input", help="Single image path")
    parser.add_argument("--input-dir", help="Folder of images to batch process")
    parser.add_argument("--output-dir", required=True, help="Where to write outputs")
    parser.add_argument("--no-snow", action="store_true", help="Skip the snow variant")
    args = parser.parse_args()

    if args.input_dir:
        process_folder(args.input_dir, args.output_dir, make_snow_variant=not args.no_snow)
    elif args.input:
        r = process_product_image(args.input, args.output_dir, make_snow_variant=not args.no_snow)
        print(r)
    else:
        parser.error("Provide either --input or --input-dir")
