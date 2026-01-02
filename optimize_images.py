#!/usr/bin/env python3
"""
Image optimization script for church website.
Generates WebP versions and responsive sizes for all images.

Usage:
    pip install Pillow
    python optimize_images.py
"""

from pathlib import Path
from PIL import Image, ImageOps
import os

# Configuration
SOURCE_IMAGES = ['church.jpeg', 'inside.jpeg', 'image1.jpeg', 'image2.jpeg', 'wood.jpeg']
OUTPUT_DIR = Path('images')
RESPONSIVE_WIDTHS = [480, 768, 1200]
JPEG_QUALITY = 85
WEBP_QUALITY = 80


def optimize_image(source_path: Path, output_dir: Path):
    """Process a single image: create WebP and responsive versions."""
    if not source_path.exists():
        print(f"  Skipping {source_path} (not found)")
        return

    name = source_path.stem

    with Image.open(source_path) as img:
        # Apply EXIF orientation (fixes upside-down/rotated images)
        img = ImageOps.exif_transpose(img)

        # Convert to RGB if necessary (for RGBA images)
        if img.mode in ('RGBA', 'P'):
            img = img.convert('RGB')

        original_width, original_height = img.size
        aspect_ratio = original_height / original_width

        print(f"  Processing {source_path.name} ({original_width}x{original_height})")

        # Generate responsive sizes (always use standard naming for consistency)
        for width in RESPONSIVE_WIDTHS:
            if width >= original_width:
                # Use original size if target is larger (don't upscale)
                resized = img
            else:
                height = int(width * aspect_ratio)
                resized = img.resize((width, height), Image.LANCZOS)

            # Always use the target width in filename for consistent srcset references
            webp_path = output_dir / f"{name}-{width}.webp"
            resized.save(webp_path, 'WEBP', quality=WEBP_QUALITY)
            webp_size = webp_path.stat().st_size / 1024
            print(f"    Created {webp_path.name} ({webp_size:.1f} KB)")

            jpeg_path = output_dir / f"{name}-{width}.jpeg"
            resized.save(jpeg_path, 'JPEG', quality=JPEG_QUALITY, optimize=True)
            jpeg_size = jpeg_path.stat().st_size / 1024
            print(f"    Created {jpeg_path.name} ({jpeg_size:.1f} KB)")

        # Save full-size optimized versions (for fallback/default)
        webp_full = output_dir / f"{name}.webp"
        img.save(webp_full, 'WEBP', quality=WEBP_QUALITY)
        print(f"    Created {webp_full.name} ({webp_full.stat().st_size / 1024:.1f} KB)")

        jpeg_full = output_dir / f"{name}.jpeg"
        img.save(jpeg_full, 'JPEG', quality=JPEG_QUALITY, optimize=True)
        print(f"    Created {jpeg_full.name} ({jpeg_full.stat().st_size / 1024:.1f} KB)")


def main():
    print("Image Optimization Script")
    print("=" * 40)

    # Create output directory
    OUTPUT_DIR.mkdir(exist_ok=True)
    print(f"Output directory: {OUTPUT_DIR.absolute()}")
    print()

    # Calculate original total size
    original_total = 0
    for img_name in SOURCE_IMAGES:
        path = Path(img_name)
        if path.exists():
            original_total += path.stat().st_size

    print(f"Original images total: {original_total / 1024:.1f} KB")
    print()

    # Process each image
    for img_name in SOURCE_IMAGES:
        optimize_image(Path(img_name), OUTPUT_DIR)
        print()

    # Calculate new total size (just the main optimized versions)
    new_total = 0
    for img_name in SOURCE_IMAGES:
        name = Path(img_name).stem
        webp_path = OUTPUT_DIR / f"{name}.webp"
        if webp_path.exists():
            new_total += webp_path.stat().st_size

    print("=" * 40)
    print(f"Original total (JPEG): {original_total / 1024:.1f} KB")
    print(f"Optimized total (WebP): {new_total / 1024:.1f} KB")
    print(f"Savings: {(1 - new_total / original_total) * 100:.1f}%")
    print()
    print("Next steps:")
    print("1. Update index.html to use images from 'images/' directory")
    print("2. Update styles.css background-image URLs")
    print("3. Deploy to GitHub Pages")


if __name__ == '__main__':
    main()
