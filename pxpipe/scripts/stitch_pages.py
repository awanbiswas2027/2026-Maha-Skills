"""
Stitch individual pxpipe page images vertically into a single merged image.
"""
import glob
import os
import re
from PIL import Image

def natural_sort_key(s):
    return [int(text) if text.isdigit() else text.lower() for text in re.split(r'(\d+)', s)]

def merge_pages(pxpipe_dir='pxpipe', output_filename='docs_merged_complete.png'):
    pages_dir = os.path.join(pxpipe_dir, 'pages')
    if os.path.exists(pages_dir) and glob.glob(os.path.join(pages_dir, 'page-*.png')):
        pattern = os.path.join(pages_dir, 'page-*.png')
    else:
        pattern = os.path.join(pxpipe_dir, 'page-*.png')
    page_files = sorted(glob.glob(pattern), key=natural_sort_key)
    
    if not page_files:
        raise FileNotFoundError(f"No page-*.png files found in {pxpipe_dir} or {pages_dir}")

    images = [Image.open(p) for p in page_files]
    max_width = max(img.width for img in images)
    total_height = sum(img.height for img in images)

    print(f"Merging {len(images)} pages:")
    for f, img in zip(page_files, images):
        print(f"  {os.path.basename(f)}: {img.width}x{img.height}")

    # Create merged canvas (RGBA mode matching pxpipe complete exports)
    merged_image = Image.new('RGBA', (max_width, total_height), color=(255, 255, 255, 255))
    
    current_y = 0
    for img in images:
        # Convert to RGBA for consistent pasting
        img_rgba = img.convert('RGBA')
        merged_image.paste(img_rgba, (0, current_y))
        current_y += img.height

    output_path = os.path.join(pxpipe_dir, output_filename)
    merged_image.save(output_path, 'PNG', optimize=True)
    print(f"\nSuccessfully generated {output_path}")
    
    # Also save as docs_copy_complete.png
    copy_path = os.path.join(pxpipe_dir, 'docs_copy_complete.png')
    merged_image.save(copy_path, 'PNG', optimize=True)
    print(f"Successfully generated {copy_path}")
    print(f"Final dimensions: {max_width}x{total_height} px")
    print(f"File size: {os.path.getsize(output_path):,} bytes")

if __name__ == '__main__':
    merge_pages()
