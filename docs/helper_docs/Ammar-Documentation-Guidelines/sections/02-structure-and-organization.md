# 2. Structure & Organization

Keep the structure predictable and the files easy to skim.

## Layout
- Intro file + numbered section files (`sections/NN-section-title.md`)
- Intro (or solution-architecture) file hosts: title, minimal metadata, Overview, Table of Contents, and Changelog
- Section files: one numbered heading with supporting content—no metadata, no changelog, no local TOCs
- Use relative links; add "Back to start" links when helpful
- Add "Previous" and "Next" navigation at the bottom of each section file to facilitate sequential browsing
- Archive retired content under `archive/` instead of deleting

**Exception:** For brief content, use a single file instead of multiple sections.

## Quick Reference
- Intro file: `ammar-documentation-guideline.md`
- Sections: `sections/NN-section-title.md`
- Update TOC when adding or removing sections
- Use a single file for brief content; multi-file layout for comprehensive docs

## File Naming & Locations

| Purpose        | Pattern                   | Folder            |
| -------------- | ------------------------- | ----------------- |
| Intro          | `name.md`                 | docs root         |
| Sections       | `NN-section-title.md`     | `sections/`       |
| ADRs           | `adr-NNNN-short-title.md` | `docs/decisions/` |
| Logs           | `daily-YYYY-MM-DD.md`     | `docs/logs/`      |
| Tutorials      | `topic-name.md`           | `tutorials/`      |
| Knowledge Base | `audit-YYYY-MM-DD.md`     | `knowledge-base/` |

- Lowercase with hyphens; ISO dates for time-bound files
- Zero-padded numbering (`01`, `02`) for natural sorting

## Artifact Types: Knowledge Base vs. Solution Architecture

Define a standard for "Current State" vs "Target Architecture":

- **Solution Architecture:** Canonical, versioned, target state. Represents the intended design and future goals.
- **Knowledge Base:** Audits, logs, tutorials, and point-in-time snapshots (e.g., AWS account exports, device discovery logs, resource inventories, or historical traces). Represents the "Current State" or specific moments in time. Often organized by provider or resource category (e.g., `knowledge-base/AWS/`, `knowledge-base/Azure/`, or `knowledge-base/devices/`).

Repo addendum (MantisIV DevOps):
- Canonical architecture lives in `mantis-iv-devops-docs/solution-architecture/`.
- Current-state cloud inventory lives in `mantis-iv-devops-docs/knowledge-base/AWS/`.
- Device onboarding runs and observed state live in `mantis-iv-devops-docs/knowledge-base/devices/<device>/`.

## Standard Header

Use this header only for:
- The main file of a doc set (e.g., `solution-architecture/solution-architecture.md`, `architect.md`)
- Any single-file doc (including per-resource docs like `AWS/<resource>/account.md` or `devices/<device>/device.md`)

Do not add this header to multi-file section pages under `sections/`.

```markdown
# Document Title

**Version:** 1.00.00  
**Created:** 2025-11-11  
**Last Updated:** 2025-11-11  
**Author:** Name  
**Status:** Active | Draft | Deprecated  
**Tags:** [Topic, Tech]
```

Update the header and changelog in the **main file** (or in the single-file doc).

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
    │   ├── context-YYYY-MM-DD.md
    │   └── context-YYYY-MM-DD.md
    ├── integration-guide/
    │   └── integration-guide.md
    └── reference-materials/
        ├── legacy-notes.md
        └── setup-guide.md
```

Key points:
- Main file: `architect.md` mirrors this guideline header, versioning, and changelog.
- Detail files: `sections/NN-topic-name.md` keep large projects modular.
- Task tracker: `implementation-checklist.md` logs all phases, features, testing, blockers.
- Testing: `testing/manual-testing.md` + numbered test folders; include `postman.json` or similar test payloads for APIs.
- Reference docs: `other_docs/` stores supportive, non-architectural material. Prefer stable filenames; when you need snapshots, use ISO dates (e.g., `context-2026-01-18.md`).
- Keep repo-relative links; never assume a global root.
- Apply the same pattern for frontend, backend, infra, or any sub-project.

### Master Logs & Vaults (AWS/ and devices/)

**New Standard:** The `AWS/` and `devices/` folders are **Master Logs & Vaults**.

**The "Vault" Principle:** These directories are authorized to store sensitive data required for experimentation and operations, including (when unavoidable): SSH connection details, IPs, API keys, secrets, and passwords.

### Folder Per Resource (AWS/ and devices/)

Replace the "Modular Section" requirements for `AWS/` and `devices/` with a **Folder per Resource** pattern.

- The AWS knowledge base captures **current-state configuration** and inventory, not activity logs.
- A resource folder (example: `AWS/account/`, `devices/laptop-ammar/`) should ideally contain **one comprehensive markdown file** for that resource.
- Only introduce `sections/` inside a resource folder if the content becomes extremely complex and navigation degrades.
- File names are lowercase with hyphens unless the identifier must be preserved (example: root email file names).

Recommended pattern:
```
AWS/
├── account/
│   └── ammar@cognitro.com.md
├── budgets/
│   └── mantis-dev-monthly-100usd.md
└── README.md

devices/
└── <device-name-or-hostname>/
    ├── device.md
    ├── drivers/
    └── logs/
```

Azure example (resource-per-folder):
```
Azure/
├── rg-replencore-dev
│   ├── acs-replencore-dev
│   │   └── acs-replencore-dev.md
│   ├── acs-replencore-dev-email
│   │   ├── acs-replencore-dev-email.md
│   │   └── azure-managed-domain.md
│   └── rg-replencore-dev.md
└── azure-resource-inventory.md
```


### High-Level Knowledge Base
- Use the `solution-architecture/` folder at the repo root, with a `sections/` subdirectory containing zero-padded markdown files that align to a numbered outline.
- Keep a stable intro file inside the folder (e.g., `solution-architecture.md`) so readers always start with the latest summary while details stay modular inside `sections/`.
- Store shared artifacts such as `jira.md`, history logs, or research notes alongside the folder to keep platform-wide references in one place.
- Capture cross-project insights: cloud provisioning, architectural decisions, integration diagrams, service ownership maps, experiment logs, and any runtime narrative that benefits multiple teams.
- Treat this repo as context storage only—project execution details should still live inside each project repo’s `docs/` tree.

### Project Knowledge Base (ProjectName Documentation)

For any project, treat documentation as a **single source of truth + operational logbook**.

Recommended root shape:
```
<project-name>-documentation/
├── solution-architecture/
│   ├── solution-architecture.md
│   └── sections/                   # Only if needed
├── aws/                             # Folder-per-resource (vault-authorized)
├── azure/                           # Folder-per-resource (custom per project)
├── gcp/
├── devices/                         # Folder-per-resource (vault-authorized)
└── laptops/
```

This structure is intentionally flexible: each entity folder can be structured "customly" per project needs, as long as the root stays predictable and each resource has an obvious home.

### Example: Azure Documentation Guideline (Replen)
This lightweight standard (v0.01.00, created 2025-11-11) lives in the high-level repo under something like `cloud/azure/azure-documentation-guideline.md`.

- **Purpose:** Single source of truth for every Azure resource used by the Replen platform; mirrors this guideline’s layout.
- **Folder pattern:** `Azure/<resource-name>/resource-name.md` plus optional `assets/` for diagrams or exports.
- **Mandatory tables:** `Configuration Summary`, `Operations Log`, `Changelog`; add `Client Secrets & Certificates`, `Connection Strings`, and `API Permissions` when relevant.
- **Logging discipline:** Every change (configuration tweak, secret rotation, permission grant, incident) is logged immediately with ISO 8601 timestamps, status icons (✅/⚠️/❌), details, and actor.
- **Linking:** Cross-reference upstream/downstream resources, resource groups, automation, and incident reports so troubleshooting starts from a single document.

Use this example as a template whenever you create cloud knowledge packs for other platforms or tenants—keep them concise, actionable, and maintained.

---
[« Previous](01-core-principles.md) | [Next »](03-markdown-formatting.md)
