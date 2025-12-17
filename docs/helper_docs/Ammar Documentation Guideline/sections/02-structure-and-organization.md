# 2. Structure & Organization

Keep all document-level metadata inside this section so the intro file stays lean.

## Layout
- Intro file + numbered section files (`sections/NN-section-title.md`)
- Intro hosts only the title, Overview, Table of Contents, and Changelog—everything else lives in sections
- Section files: one numbered heading with supporting content—no duplicate headers or local TOCs
- Use relative links; add "Back to start" links when helpful
- Archive retired content under `archive/` instead of deleting

**Exception:** For brief content, use a single file instead of multiple sections.

## Quick Reference
- Intro file: `ammar-documentation-guideline-vX.YY.ZZ.md`
- Sections: `sections/NN-section-title.md`
- Update TOC when adding or removing sections
- Use a single file for brief content; multi-file layout for comprehensive docs

## File Naming & Locations

| Purpose | Pattern | Folder |
|---------|---------|--------|
| Intro | `name-vX.YY.ZZ.md` | docs root |
| Sections | `NN-section-title.md` | `sections/` |
| ADRs | `adr-NNNN-short-title.md` | `docs/decisions/` |
| Logs | `daily-YYYY-MM-DD.md` | `docs/logs/` |
| Guides | `topic-name.md` | `docs/guides/` |

- Lowercase with hyphens; ISO dates for time-bound files
- Zero-padded numbering (`01`, `02`) for natural sorting

## Standard Header

```markdown
# Document Title

**Version:** 1.00.00  
**Created:** 2025-11-11  
**Last Updated:** 2025-11-11  
**Author:** Name  
**Status:** Active | Draft | Deprecated  
**Tags:** [Topic, Tech]
```

Update header and changelog when editing content.

## Documentation Locations & Repo Model

### Repo Types
- **High-level docs repo:** Platform-wide knowledge base covering history, experiments, cloud notes, and anything that spans multiple projects. Use it for evergreen references (Azure resource inventory, service history, postmortems, etc.).
- **Project repos:** Every project or component (e.g., `cognitro-replen-clientportal-v1-2025`, `cognitro-replen-coreapi-v1-2025`) owns its implementation code and the documentation that guides that codebase.

### Project Repo Layout
Store all project documentation under `docs/<project-slug>/` with the following structure:

```
docs/<project-slug>/
├── architect.md                    # Main architecture doc (title, overview, TOC, changelog)
├── sections/                       # Architecture detail pages
│   ├── 01-topic-name.md
│   └── 02-topic-name.md
├── implementation-checklist.md     # Task tracker for phases, features, testing, blockers
├── testing/
│   ├── manual-testing.md           # Test overview and execution guide
│   ├── test-1/
│   │   ├── test-case.md           # Test steps and expected results
│   │   └── postman.json           # API payload (if applicable)
│   ├── test-2/
│   └── test-3/
└── other_docs/
    ├── context/
    │   ├── context-v1.00.00.md
    │   └── context-v0.99.00.md
    ├── integration-guide/
    │   └── integration-guide-v1.00.00.md
    └── reference-materials/
        ├── legacy-notes-v0.99.00.md
        └── setup-guide-v1.00.00.md
```

Key points:
- Main file: `architect.md` mirrors this guideline header, versioning, and changelog.
- Detail files: `sections/NN-topic-name.md` keep large projects modular.
- Task tracker: `implementation-checklist.md` logs all phases, features, testing, blockers.
- Testing: `testing/manual-testing.md` + numbered test folders; include `postman.json` or similar test payloads for APIs.
- Reference docs: `other_docs/` stores agent-writing context docs versioned by app version (e.g., `context-v1.00.00.md`) so old vs. new is clear when sorting alphabetically.
- Keep repo-relative links; never assume a global root.
- Apply the same pattern for frontend, backend, infra, or any sub-project.

### High-Level Knowledge Base
- Use domain-focused folders at the repo root (`project-description/`, `solution-architecture/`, etc.), each with a `sections/` subdirectory containing zero-padded markdown files that align to a numbered outline.
- Keep a versioned intro file inside every domain folder (e.g., `project-description-v0.03.00.md`) so readers always start with the latest summary while details stay modular inside `sections/`.
- Store shared artifacts such as `jira.md`, history logs, or research notes alongside those folders to keep platform-wide references in one place.
- Capture cross-project insights: cloud provisioning, architectural decisions, integration diagrams, service ownership maps, experiment logs, and any runtime narrative that benefits multiple teams.
- Treat this repo as context storage only—project execution details should still live inside each project repo’s `docs/` tree.

### Example: Azure Documentation Guideline (Replen)
This lightweight standard (v0.01.00, created 2025-11-11) lives in the high-level repo under something like `cloud/azure/azure-documentation-guideline.md`.

- **Purpose:** Single source of truth for every Azure resource used by the Replen platform; mirrors this guideline’s layout.
- **Folder pattern:** `Azure/<resource-name>/resource-name.md` plus optional `assets/` for diagrams or exports.
- **Mandatory tables:** `Configuration Summary`, `Operations Log`, `Changelog`; add `Client Secrets & Certificates`, `Connection Strings`, and `API Permissions` when relevant.
- **Logging discipline:** Every change (configuration tweak, secret rotation, permission grant, incident) is logged immediately with ISO 8601 timestamps, status icons (✅/⚠️/❌), details, and actor.
- **Linking:** Cross-reference upstream/downstream resources, resource groups, automation, and incident reports so troubleshooting starts from a single document.

Use this example as a template whenever you create cloud knowledge packs for other platforms or tenants—keep them concise, versioned, and actionable.
