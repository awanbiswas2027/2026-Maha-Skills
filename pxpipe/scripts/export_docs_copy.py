# -*- coding: utf-8 -*-
"""
End-to-end pipeline:
1. Merges docs - Copy into pxpipe/docs_merged.md
2. Runs pxpipe export "docs - Copy"
3. Organizes rendered page images into pxpipe/pages/
4. Stitches all pages into pxpipe/docs_merged_complete.png & pxpipe/docs_copy_complete.png
"""
import glob
import os
import shutil
import subprocess
import sys

def main():
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    pxpipe_dir = os.path.join(root_dir, "pxpipe")
    pages_dir = os.path.join(pxpipe_dir, "pages")
    temp_export = os.path.join(pxpipe_dir, "temp_export")
    
    os.makedirs(pages_dir, exist_ok=True)
    if os.path.exists(temp_export):
        shutil.rmtree(temp_export, ignore_errors=True)
    os.makedirs(temp_export, exist_ok=True)
    
    print("[1/4] Running pxpipe export on 'docs - Copy'...")
    pxpipe_bin = shutil.which("pxpipe") or "pxpipe.cmd"
    cmd = [pxpipe_bin, "export", "docs - Copy", "--out", temp_export]
    res = subprocess.run(cmd, cwd=root_dir, capture_output=True, text=True, shell=True)
    print(res.stdout)
    if res.returncode != 0:
        print("[ERROR] pxpipe export failed:", res.stderr)
        sys.exit(1)
        
    # Find generated subfolder
    subfolders = [os.path.join(temp_export, d) for d in os.listdir(temp_export) if os.path.isdir(os.path.join(temp_export, d))]
    if not subfolders:
        print("[ERROR] No export directory created!")
        sys.exit(1)
        
    export_folder = subfolders[0]
    print(f"[2/4] Processing export output from {export_folder}...")
    
    # Move page-*.png to pxpipe/pages/
    for img_file in glob.glob(os.path.join(export_folder, "page-*.png")):
        dest = os.path.join(pages_dir, os.path.basename(img_file))
        shutil.copy2(img_file, dest)
        print(f"  Saved {os.path.basename(img_file)} -> pxpipe/pages/")
        
    # Copy metadata files to pxpipe/
    for meta in ["manifest.json", "factsheet.txt", "prompt.txt"]:
        src_file = os.path.join(export_folder, meta)
        if os.path.exists(src_file):
            shutil.copy2(src_file, os.path.join(pxpipe_dir, meta))
            print(f"  Updated pxpipe/{meta}")
            
    # Cleanup temp
    shutil.rmtree(temp_export, ignore_errors=True)
    
    # Merge docs to docs_merged.md
    print("\n[3/4] Merging all markdown files from 'docs - Copy'...")
    merge_script = os.path.join(pxpipe_dir, "scripts", "merge_docs.py")
    subprocess.run([sys.executable, merge_script], cwd=root_dir)
    
    # Stitch pages
    print("\n[4/4] Stitching pages into single continuous image...")
    stitch_script = os.path.join(pxpipe_dir, "scripts", "stitch_pages.py")
    subprocess.run([sys.executable, stitch_script], cwd=root_dir)
    
    print("\n[SUCCESS] Entire 'docs - Copy' successfully converted to images via pxpipe!")

if __name__ == "__main__":
    main()
