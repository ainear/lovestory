# Quick Image Replace Bar + SEO Preview Card

**Goal:** Add 2 missing CineLove features to reach ~95% editor parity.

## Feature 1: QuickImageBar

- Bottom of canvas area, collapsible toggle "Thay ảnh nhanh"
- Scans elements for type=image, shows thumbnails in horizontal scroll
- Click thumbnail → file picker → replace that element's src
- Arrow buttons for scroll navigation

## Feature 2: SEOPreviewCard

- Right panel, after project settings, before premium features
- Auto-capture thumbnail from canvas (reuse html2canvas)
- Facebook-style card preview: thumbnail + title + description
- "Chỉnh sửa" button for inline title/description editing
- Saves to canvas_json.meta.ogTitle/ogDescription
