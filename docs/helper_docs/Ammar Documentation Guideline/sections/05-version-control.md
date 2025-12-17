# 5. Version Control

## Semantic Versioning
- **Major** (`X+1.00.00`): Structural changes
- **Minor** (`X.YY+1.00`): New sections
- **Patch** (`X.YY.ZZ+1`): Fixes and clarifications

## Process
1. Rename intro file when version changes (`name-v4.01.00.md`)
2. Update all TOC links
3. Update "Last Updated" date in header
4. Add changelog entry in affected files
5. Commit: `docs(scope): summary [vX.YY.ZZ]`
6. Validate links, lint, diagrams before merging
7. Archive superseded versions under `archive/`

## Changelog Format
```markdown
| Version | Date | Author | Description |
|---------|------|--------|-------------|
| X.YY.ZZ | YYYY-MM-DD | Name | Brief summary |
```
