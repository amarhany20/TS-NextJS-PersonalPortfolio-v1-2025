# 5. Version Control

## Semantic Versioning
- **Major** (`X+1.00.00`): Structural changes
- **Minor** (`X.YY+1.00`): New sections
- **Patch** (`X.YY.ZZ+1`): Fixes and clarifications

## Process
1. Keep filenames stable (do **not** rename files when versions change)
2. Update the document version in the header (when present)
3. Add a changelog entry in the **main file** (or in the single-file doc)
4. Update "Last Updated" date in the header (when present)
5. Validate links, lint, diagrams before merging
6. If you need to preserve a point-in-time snapshot, store it under `archive/` (a versioned filename is acceptable there)

## Changelog Format
```markdown
| Version | Date       | Author | Affected Files  | Description   |
| ------- | ---------- | ------ | --------------- | ------------- |
| X.YY.ZZ | YYYY-MM-DD | Name   | path/to/file.md | Brief summary |
```

---
[« Previous](04-content-types.md) | [Next »](06-quality-checklist.md)
