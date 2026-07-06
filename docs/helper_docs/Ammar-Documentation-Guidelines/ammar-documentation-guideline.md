# Ammar Documentation Guideline

**Version:** 7.04.00
**Created:** 2025-11-13
**Last Updated:** 2026-05-01
**Author:** Ammar Hany
**Status:** Active
**Tags:** [Documentation, Standards]

---

## Overview

Single source for generic documentation rules. Keep docs concise, decision-complete, and easy to scan.

This file owns: generic writing rules, doc structure, markdown formatting, metadata, versioning, archive rules, document-type boundaries.
Does not own: repo-specific workflow, tool policy, approvals, security rules (→ local `AGENTS.md` and shared `agent-guideline.md`).

**Canonical Replacement Rule:** Remove all superseded duplicates in same task unless user explicitly requests archive/redirect stubs. Never leave silent diverging copies.
**Policy File Scope:** Keep long-lived guideline files concise. No workspace dumps, operational notes, or temporary command blobs.

---

## 1. Writing Rules

- Keep docs concise but complete. Every sentence earns its place.
- Lead with why before how when context affects decisions.
- Define once in canonical home and reference elsewhere.
- Prefer short paragraphs, grouped bullets, and tables for structured comparison.
- Keep one active canonical path per topic. Remove superseded duplicates unless intentional archive still needed.
- Keep shared system narrative in shared docs and code-adjacent detail in owning repo.
- **Step-based sections:** Include literal steps with exact commands, paths, procedures for direct human follow-through.
- **Startup/intro files:** Write concise, token-efficient guidance. One clear statement per rule. Remove verbose explanations. Target 35-50% fewer words than reference docs without losing operational info.

---

## 2. Structure And Placement

### Default Shape

- Prefer one stable main file per guideline set.
- Use a single file by default when it stays readable.
- Use extra files only when one file can no longer stay clear and compact.
- Keep intro files short and keep detailed content in the same canonical file unless a split is justified.

### Multi-File Documentation Spine

When documentation is split across multiple files, use one canonical spine:
- Keep `architect.md` as canonical entry for that doc set.
- `architect.md` must include scope, structure intent, and navigation guidance (not just TOC).
- Keep section files focused on their assigned scope. No generic scratchpads.
- Keep ordering aligned with `architect.md` table of contents.

Navigation rules:
- Include TOC near top of `architect.md`.
- Prefer reference-style links in TOC for maintainability.
- Each section file: add footer with previous/next links.
- First/last sections: include only available direction.

For single-file docs: keep one canonical file. TOC optional.

### File Naming

| Purpose        | Pattern                   | Folder            |
| -------------- | ------------------------- | ----------------- |
| Main doc       | `name.md`                 | docs root         |
| ADR            | `adr-NNNN-short-title.md` | `docs/decisions/` |
| Log            | `daily-YYYY-MM-DD.md`     | `docs/logs/`      |
| Tutorial       | `topic-name.md`           | `tutorials/`      |
| Knowledge base | `audit-YYYY-MM-DD.md`     | `knowledge-base/` |

- Use lowercase with hyphens.
- Use ISO dates for time-bound files.
- Keep filenames stable when versions change.

### Multi-Repo Boundary

| Repo Type                  | Owns                                                                                       |
| -------------------------- | ------------------------------------------------------------------------------------------ |
| Central documentation repo | Shared context, cross-repo architecture, knowledge base, operations, tracking              |
| Implementation repo        | Code-local design, setup, build, test, deploy, release, and repo-local implementation docs |

- `subrepos/` or `sub-repos/` is a workspace model, not a monorepo.
- Each subrepo remains its own Git boundary.
- Do not duplicate canonical docs across root and subrepo when one layer clearly owns the topic.
- If a change crosses boundaries, update both layers in the same task.
- Local `AGENTS.md` files are policy files, not architecture sections or workspace maps.

### Content Types

- **Solution Architecture:** canonical target design.
- **Knowledge Base:** current-state evidence, audits, point-in-time facts, operational records.
- **Operations Cheatsheets:** operator execution docs, not architecture narrative.
- **AI Helper Notes:** planning context, separate from operator-facing docs.
- **Temporary Notes:** scratch or historical runs; promote durable facts into canonical docs, then remove or clearly demote the duplicate.
- **ADRs:** Context -> Decision -> Rationale -> Consequences -> Alternatives -> Implementation -> References.
- **Tutorials:** repeatable step-by-step procedures with prerequisites and expected outcomes.
- **Secret-Synced Tables:** used in personal-database repos whose markdown is synced to a password-protected Excel sheet. See rule below.

### Secret-Synced Tables (Excel-Paired Repos)

Apply this pattern to every table that contains secret values in any repo synced to a password-protected Excel sheet:

- **Table 1 — Main table:** all non-secret fields (name, URL, email, username, metadata). First column is a stable manual ID in the format `TYPE-NNN` (e.g., `ACC-001`).
- **Table 2 — Secrets table:** one row per record, same order as Table 1. First column is the primary identifier from Table 1 (username or email). All secret values are written as typed placeholders only (e.g., `[password]`, `[api_key]`, `[token]`). Never write actual secret values in the markdown.
- Keep both tables in strict matching order so rows align by ID.
- AI always maintains placeholder structure. Never fill, suggest, or infer actual secret values.
- When a repo uses this pattern, apply it consistently to all secret-bearing tables in that repo.

### Implementation Checklists

- Use one implementation checklist as operational source of truth for scope, blockers, readiness, verification.
- Keep a dedicated manual checklist section for verification Ammar must perform personally.
- Manual entries stay until behavior is removed or verification path is genuinely replaced; do not drop just because pending.
- Each manual entry should include exact operator steps, required commands, and expected proof (screenshots, terminal output, logs).
- When Ammar returns evidence, update entry and mark done instead of replacing with freeform prose.
- Prefer: `required`, `tested`, `tested_by`, `tested_on`, `tested_version`, `evidence`.
- Use `tested: true` only after Ammar completes manual verification and returns supporting evidence.

---

## 3. Markdown Rules

- Use one H1 per file.
- Keep headings short and descriptive.
- Use one blank line between paragraphs.
- Keep paragraphs short.
- Use `-` for unordered lists and `1.` for ordered lists.
- Use descriptive relative links, not bare URLs.
- Use `---` for major transitions.
- Always add a language to fenced code blocks.
- Use realistic examples and meaningful names.

---

## 4. Header And Versioning

Use the standard header on main docs and single-file docs only:

```markdown
# Document Title

**Version:** X.YY.ZZ
**Created:** YYYY-MM-DD
**Last Updated:** YYYY-MM-DD
**Author:** Name
**Status:** Active | Draft | Deprecated
**Tags:** [Topic, Tech]
```

### Versioning

- **Major:** structural change.
- **Minor:** substantial new guidance.
- **Patch:** clarifications and fixes.

### Update Process

1. Keep the filename stable.
2. Update the header version and last-updated date.
3. Follow the local `AGENTS.md` for any repo-specific durable-history policy.
4. Validate links, examples, and diagrams.
5. Archive point-in-time snapshots under `archive/` if needed.

---

## 5. Quality Checklist

- [ ] Main file is the single active canonical path.
- [ ] Metadata and dates are current.
- [ ] No duplicate rule copies exist elsewhere.
- [ ] Links and examples resolve.
- [ ] Code blocks declare a language.
- [ ] Archived material is clearly marked historical.
- [ ] Formatting is consistent and free of noise.
