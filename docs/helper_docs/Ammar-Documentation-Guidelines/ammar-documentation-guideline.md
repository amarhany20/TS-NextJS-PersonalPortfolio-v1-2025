# Ammar Documentation Guideline

**Version:** 6.01.00
**Created:** 2025-11-13
**Last Updated:** 2026-03-08
**Author:** Ammar Hany
**Status:** Active
**Tags:** [Documentation, Standards]

---

## Overview
Single source for the documentation standard. Our approach: **keep docs concise but comprehensive**—include all context needed, eliminate filler, and structure for fast scanning. Each link jumps to the numbered section so you edit only what you need.

### Documentation Split Rule (Multi-Repo Projects)

When a project spans multiple repositories, scope docs strictly by repo type:

| Repo Type                         | Documentation Scope                                                                                                                                                            |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **High-level docs repo**          | System goals, architecture decisions, data flows, domain boundaries, event taxonomy, notifications, privacy, compliance, integration contracts — **no implementation detail**  |
| **Implementation repo** (`docs/`) | Full technical depth: component design, API endpoints, request/response schemas, DB models, error handling, deployment, environment variables, testing strategy, configuration |

This split is mandatory. Do not reproduce high-level narrative in implementation docs; link to the
docs repo instead. Do not embed implementation detail in architecture docs.

### Helper Docs Duplication Convention

Each repo in a multi-repo project carries its own copy of these guidelines under `helper-docs/` or
`helper_docs/`. This is **intentional** — each repo is a self-contained Git repository.
The user manually syncs copies when the canonical version is updated.
Agents must follow the copy local to the repo they are currently operating in.

---

## Table of Contents
1. [Core Principles](./sections/01-core-principles.md)
2. [Structure & Organization](./sections/02-structure-and-organization.md)
3. [Markdown Formatting](./sections/03-markdown-formatting.md)
4. [Content Types](./sections/04-content-types.md)
5. [Version Control](./sections/05-version-control.md)
6. [Quality Checklist](./sections/06-quality-checklist.md)

---

## Changelog

| Version | Date       | Author     | Affected Files                                                                                                                                | Description                                                                                              |
| ------- | ---------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| 6.01.00 | 2026-03-08 | Ammar Hany | ammar-documentation-guideline.md                                                                                                              | Added documentation split rule and helper docs duplication convention for multi-repo projects.           |
| 6.00.01 | 2026-01-18 | Ammar Hany | ammar-documentation-guideline.md, sections/02-structure-and-organization.md, sections/04-content-types.md                                     | Added Knowledge Base artifact type (Current vs Target state); renamed Runbooks to Tutorials.             |
| 6.00.00 | 2026-01-18 | Ammar Hany | ammar-documentation-guideline.md                                                                                                              | Major version bump to 6.00.00 for updated documentation standards.                                       |
| 5.06.00 | 2026-01-18 | Ammar Hany | ammar-documentation-guideline.md, sections/02-structure-and-organization.md, sections/05-version-control.md, sections/06-quality-checklist.md | Stable filenames; Vault + folder-per-resource for AWS/ and devices/; metadata/changelog rules tightened. |
| 5.05.00 | 2026-01-16 | Ammar Hany | sections/01-core-principles.md                                                                                                                | Added requirement for Previous/Next navigation at the bottom of section files.                           |
| 5.04.00 | 2026-01-05 | Ammar Hany | sections/02-structure-and-organization.md                                                                                                     | Removed Project Description folders; focused High-Level Knowledge Base on solution-architecture.         |
| 5.03.00 | 2025-12-11 | Ammar Hany | sections/02-structure-and-organization.md                                                                                                     | Expanded project repo layout with testing/, other_docs/ nested structure, and multi-file organization.   |
| 5.02.00 | 2025-12-07 | Ammar Hany | sections/02-structure-and-organization.md                                                                                                     | Added implementation-checklist guidance to project repo layout.                                          |
| 5.01.00 | 2025-11-30 | Ammar Hany | sections/02-structure-and-organization.md                                                                                                     | Shifted metadata and repo guidance into Section 2; intro now only title, overview, TOC, and changelog.   |
| 5.00.00 | 2025-11-13 | Ammar Hany | All                                                                                                                                           | Major: Established concise-yet-comprehensive approach as core philosophy.                                |
| 4.01.00 | 2025-11-13 | Ammar Hany | All                                                                                                                                           | Consolidated into 6 focused sections, removed redundancy.                                                |
| 4.00.00 | 2025-11-11 | Ammar Hany | All                                                                                                                                           | Converted guideline into numbered multi-file layout with versioned intro filename.                       |
