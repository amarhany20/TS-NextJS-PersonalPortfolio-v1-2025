# 3. Pages, Sections, Components

- **Pages** compose **sections** only. They do not import content or run effects.
- **Sections** may read static content and compose components. Keep effects minimal.
- **Components** are reusable. No page-specific copy or assumptions.

Content lives in `static-content/*`. Refer to images in `public/` via `/images/...`.

---
