# MahaSkills — PxPipe Visual Documentation Package

This folder contains the complete visual documentation export generated using **PxPipe** across all 51 markdown specification documents in `docs - Copy/`.

---

## 📁 Folder Contents

| File / Folder | Description | Format / Size |
| :--- | :--- | :--- |
| [`docs_copy_complete.png`](./docs_copy_complete.png) / [`docs_merged_complete.png`](./docs_merged_complete.png) | **Complete Stitched Visual Infographic** vertically combining all 10 rendered pages of `docs - Copy` into a single continuous high-resolution image (1568 &times; 6800 px). | PNG (~1.35 MB) |
| [`docs_merged.md`](./docs_merged.md) | The single unified Markdown file containing all 51 documentation files merged in canonical order. | Markdown (~287 KB) |
| [`manifest.json`](./manifest.json) | Metadata manifest documenting token compression ratio (80.6% compression), aspect ratios, and dimensions. | JSON (~4 KB) |
| [`factsheet.txt`](./factsheet.txt) | Quantitative project factsheet and domain summary (96 precision tokens). | Plain text (~3 KB) |
| [`prompt.txt`](./prompt.txt) | Vision LLM prompt template for analyzing the visual documentation. | Plain text (~5 KB) |
| [`pages/`](./pages/) | Directory containing the 10 individual page slices (`page-001.png` to `page-010.png`). | 10 PNG images (~958 KB) |
| [`scripts/`](./scripts/) | Automation scripts: `export_docs_copy.py` (complete pipeline), `merge_docs.py`, and `stitch_pages.py`. | Python scripts |

---

## 🚀 How to Re-Export

To re-convert and stitch `docs - Copy` into images at any time:

```powershell
python pxpipe/scripts/export_docs_copy.py
```
