# Documentation Guideline

**Version:** 1.00.01
**Last Updated:** 2025-10-19
**Maintainer:** Ammar Hany
**Applies To:** All `.md` files in this repository (docs, logs, READMEs, changelogs, ADRs, etc.)

---

## 1. Purpose

This guideline defines the structure, conventions, and versioning standards for Markdown documentation within this repository. It ensures consistency, readability, traceability, and compatibility with GitHub Copilot and other AI tools.

---

## 2. General Rules

1. All documentation must be written in **Markdown (`.md`)** format.
2. Use **UTF-8** encoding and **LF line endings**.
3. Keep line width under **120 characters** per line.
4. Always include a **title**, **version**, **date**, and **author** at the top.
5. Write in **clear, professional English**. Avoid AI-sounding phrases.
6. Use **active voice**, concise sentences, and consistent tense.
7. Follow **semantic versioning** for document revisions:
* `1.00.00` = First stable release
* `1.00.01` = Minor textual fixes
* `1.01.00` = Added new sections
* `2.00.00` = Major structural changes
8. Include a **Table of Contents (TOC)** for longer documents:
  - Use a TOC for any document with more than three top-level headings or when navigation would improve readability.
  - Place the TOC immediately after the standard file header (front section) and before the first content section.
  - Recommended format:
    - Manual: a bullet list of links to headings using anchor links (compatible with GitHub):
     - Example:
      - [## Purpose](#1-purpose)
      - [## General Rules](#2-general-rules)
    - Automated: add TOC markers for tooling (e.g., markdown-toc or other generators):
     - Example markers:
      <!-- TOC -->
      <!-- /TOC -->
  - When generating, include headings up to H3 by default. Maintain line width and link readability.
  - Update the TOC when headings change; prefer automated tools but verify anchors after edits.

---

## 3. File Naming Convention

Use lowercase words separated by hyphens:
| Type            | Example                          |
| --------------- | -------------------------------- |
| Log             | `log.md`                         |
| Decision record | `adr-0001-model-architecture.md` |
| Weekly summary  | `weekly-2025-10-13.md`           |
| Guide           | `documentation-guideline.md`     |
| Project README  | `readme.md`                      |

> Each file must contain a date in ISO format (`YYYY-MM-DD`) if it represents a log, report, or summary.

---

## 4. Standard File Header

Each `.md` file should start with this front section:

```markdown
# Document Title
**Version:** 1.00.00  
**Created:** 2025-10-13  
**Updated:** 2025-10-13  
**Author:** Ammar Hany  
**Status:** Draft | Active | Deprecated | Archived  
**Tags:** [AI, Documentation, Log, Backend]
```

---

## 5. Recommended Folder Structure

```
/docs
  /main/
   documentation-guideline.md
   contribution-guideline.md
  /logs/
   log.md
  /summaries/
   weekly-2025-10-13.md
  /decisions/
   adr-0001-model-choice.md
   adr-0002-database-architecture.md
  /references/
   api-integrations.md
   dataset-overview.md
```

---

## 6. Markdown Formatting Rules

### 6.1 Headings

Use ATX-style (`#`) headings, with no skipped levels:

```
# H1
## H2
### H3
```

### 6.2 Paragraphs

* Leave **one blank line** between paragraphs.
* Avoid trailing spaces.

### 6.3 Lists

* Use `-` for unordered lists and `1.` for ordered lists.
* Keep indentation consistent.

### 6.4 Tables

* Always include a header row.
* Use `|` aligned columns.
* Example:

  ```markdown
  | Key | Description |
  |------|-------------|
  | Purpose | Explains why this document exists |
  | Version | Follows semantic versioning |
  ```

### 6.5 Code Blocks

Use fenced code blocks with language tags:

````markdown
```bash
sudo systemctl restart docker
````

````

### 6.6 Inline Notes
Use blockquotes for emphasis:
```markdown
> ⚠️ Important: Restart the server only after saving your work.
````

---

## 7. Metadata and Tags

* Add relevant **tags** at the top for AI indexing and internal search.
* Examples: `[AI, Backend, Deployment, Docs, Log, Training]`

---

## 8. Change Tracking

Each document must have a **Change Log** section:

```markdown
## Changelog
| Version | Date | Author | Description |
|----------|------|---------|-------------|
| 1.00.00 | 2025-10-13 | Ammar Hany | Initial draft |
| 1.00.01 | 2025-10-15 | Ammar Hany | Added folder structure section |
```

---

## 9. Log and Journal Entries

Use the following format for daily or project logs:

```markdown
## 2025-10-13
### Context
Set up Jupyter Lab and root directory for project `the-market-local`.

### What I Did
- Updated `jupyter_lab_config.py` for three users.
- Verified `PermitRootLogin no`.
- Configured shared project permissions.

### Why
To ensure consistent and secure Jupyter setup for all developers.

### Next
- Test notebook access per user.
- Configure systemd service to auto-start Jupyter.
```

> Copilot and ChatGPT can append new logs if you define `<!-- LOG:START -->` and `<!-- LOG:END -->` markers in the file.

---

## 10. File Versioning Workflow

1. Each commit message must reference the document and version.
  Example:

  ```
  docs(guideline): update folder structure [v1.00.01]
  ```
2. Update the version and `Updated` date in the header after each approved change.
3. If the structure or schema changes, bump the **minor** or **major** version.
4. Archive outdated documents under `/archive/` instead of deleting them.

---

## 11. Git & Copilot Best Practices

* Keep each `.md` focused on a single topic.
* Use **Copilot Edit Mode** to append logs automatically.
* Use consistent prompt markers:

  ```markdown
  <!-- AI:APPEND_DAILY -->
  <!-- AI:SUMMARIZE_WEEKLY -->
  ```
* Review every AI edit before committing (never auto-merge documentation).

---

## 12. References & Resources

* [CommonMark Spec](https://spec.commonmark.org/)
* [GitHub Markdown Guide](https://guides.github.com/features/mastering-markdown/)
* [Semantic Versioning](https://semver.org/)
* [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)

---

## 13. Example Complete File

```markdown
# AI Daily Log – October 2025
**Version:** 1.00.02  
**Created:** 2025-10-01  
**Updated:** 2025-10-13  
**Author:** Ammar Hany  
**Status:** Active  
**Tags:** [AI, Log, Cognitro, Azure]

---

## 2025-10-13
### Context
Preparing the Market Local VM environment on Azure.

### What I Did
- Updated shared project path to `/srv/disk01/projects/the-market-local/project-codes`.
- Adjusted Jupyter Lab working directory for all users.
- Disabled root login.

### Why
To standardize environment setup and enhance security.

### Next
- Test notebook token retrieval.
- Document SSH key exchange procedures.

---

## Changelog
| Version | Date | Author | Description |
|----------|------|---------|-------------|
| 1.00.00 | 2025-10-01 | Ammar Hany | Initial setup |
| 1.00.01 | 2025-10-10 | Ammar Hany | Added context section |
| 1.00.02 | 2025-10-13 | Ammar Hany | Updated with current day logs |
```

---

## 14. Final Notes

* Every `.md` file is treated as a **living document**.
* Clarity and versioning are more important than design.
* Avoid duplicating information across multiple files — link instead.
* Prefer tables and code blocks over screenshots or inline images.
* The goal is maintainability, traceability, and AI-readability.

---

**End of Document**
