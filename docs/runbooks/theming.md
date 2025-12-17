# Runbook — Theming

**Version:** 1.00.00  
**Created:** 2025-12-17  
**Last Updated:** 2025-12-17  
**Owner:** Ammar Hany  
**Contributors:** GitHub Copilot (docs)  
**Status:** Active  
**Tags:** [Runbook, Theming]

---

## Purpose
Guide for selecting, customizing, and registering themes for the public site and admin.

---

## Built-in Themes
Out-of-the-box themes include:
- Professional Dark (default)
- Modern Gradient
- Minimal Light
- Ocean Blue

Refer to the registry: [docs/themes/theme-registry.md](../themes/theme-registry.md).

---

## Switch Theme (Admin)
1. Go to Admin → Settings → Theme
2. Choose a theme from the list
3. Save and refresh the public site

If the theme requires additional assets or content, ensure those are published.

---

## Add a New Theme (High-level)
1. Create a new entry in the theme registry with an ID, title, and metadata
2. Provide theme-specific styles/components under `src/themes/` if applicable
3. Wire the theme selection to render correct layouts/variants in public pages
4. Add a brief theme QA entry in [docs/themes/qa-checklist.md](../themes/qa-checklist.md)

---

## Tips
- Keep theme logic isolated and avoid hard-coding theme IDs in unrelated modules.
- Use feature flags or preview toggles when experimenting with new themes.
