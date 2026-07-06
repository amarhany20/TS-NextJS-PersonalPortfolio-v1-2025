# Ammar Workspace Logging Standard

**Version:** 1.01.00
**Created:** 2026-05-04
**Last Updated:** 2026-05-04
**Author:** Ammar Hany
**Status:** Active
**Tags:** [Workspace, Logging, Knowledge Base, Standards]

---

## Purpose

This document defines the standard for story-based workspace logs across EGY3D and similar workspaces.

The main use is as context for Jira tasks and AI sessions: what the user asked for, what the AI did, what changed, and why. Each entry captures the full working story so future readers can understand decisions and outcomes without reopening chat history or diffs.

Each entry should explain: what triggered the work, what the user wanted, how it was handled, what changed, how it was verified, and what state exists now.

Core principle:

> Whoever reads the logs should understand the full story, not just what changed, but why it was requested, how it was handled, what was achieved, and why it mattered.

---

## Scope

- Cross-repo helper standard, not an implementation log.
- EGY3D can use it as the format for `knowledge-base/logs.md`.
- Other workspaces may reference it or derive a local variant if they need extra fields.
- This file defines the format; the live log remains the working record.

---

## Required Entry Structure

Each dated entry must tell one complete story. The eight sections below are examples and guidelines, not strict requirements. Include all sections that fit the work; add other sections or details if they matter to the story. Anything that helps future readers understand what happened, why, and what changed should be included.

### 1. Trigger / Background

- What was happening before the request.
- What problem, idea, or friction triggered it.
- What the relevant system or document state was.
- Any prior context that explains why this work exists.

### 2. The Request (Why)

- What the user asked for.
- The user's goal, concern, or urgency.
- Whether it was a bug fix, feature, refactor, exploration, migration, or docs update.
- Why it mattered now.

### 3. The Approach (How)

- What was read first.
- What plan or strategy was chosen.
- Any rejected alternatives worth preserving.
- Why the chosen approach fit the request.

### 4. The Work (What)

- What files or systems changed.
- What was created, updated, removed, or reorganized.
- Any migrations, dependencies, or infrastructure changes.
- What those changes accomplished.

### 5. Validation & Verification

- What commands or checks were run.
- What passed or failed.
- Any fixes made after failed validation.
- Any manual verification and its outcome.

### 6. The Achievement (What Happened)

- What outcome now exists.
- What problem was solved.
- What now works that did not before.
- What the current state is.

### 7. Documentation Sync

- Which docs, KB records, or checklists were updated.
- What was synced and why.
- Any recorded TODOs or open gaps.

### 8. Decisions & Notes

- Key decisions made during the work.
- Trade-offs or intentional simplifications.
- Caveats, warnings, or future considerations.

---

## Markdown Template

Use this entry shape in live logs:

```markdown
## YYYY-MM-DD — Short Title / Theme

### Background
[What was happening before the request. Set the scene.]

### Request
[What the user asked for and why. Quote or summarize intent when useful.]

### Approach
[What was read, planned, and decided before implementation.]

### Work Done
- [Specific change 1 and what it accomplished]
- [Specific change 2, including migrations, dependencies, infra, or UI if relevant]
- [Specific change 3, including docs or cleanup if relevant]

### Validation
- [Command run and result]
- [Test or verification outcome]
- [Manual check performed and observed result]

### Achievement
[What now works, what was solved, and the current state after the work.]

### Documentation Sync
- [Doc updated and why]
- [Checklist, KB, or canonical record updated]
- [Follow-up note or recorded gap]

### Decisions & Follow-ups
- [Key decision or trade-off]
- [Important note, caveat, or future work]
```

---

## Rules

1. Write at least one dated section per active work day.
2. **Monthly log files:** When a log file grows too long, archive it by month using the format `YYYY-MM` (e.g., `2026-04`, `2026-05`, `2026-06`). Start a new file for the current month. This keeps logs readable and searchable.
3. If the same day contains unrelated work, keep one date heading and split the day into clearly named sub-sections.
4. Keep entries in chronological order with oldest at the top and newest at the bottom.
5. Never only list files changed; explain what changed and why it mattered.
6. Always capture the user's why, especially when they explicitly describe pain, confusion, urgency, or a desired outcome.
7. Reference related prior entries when today depends on earlier work.
8. Keep the tone factual and narrative. No fluff or speculation.
9. Preserve failed or rejected attempts when they are instructive enough to prevent repeated mistakes.
10. End every entry with a clear current-state understanding so the next reader knows what now works.
11. Prefer concrete outcomes over generic summaries.

---

## Placement And Relationship To Live Logs

- File location for this standard: `helper-docs/ammar-workspace-logging-standard.md`
- Intended live instance for EGY3D: `knowledge-base/logs.md`
- Relationship: this file defines the format standard, while the live log file is the continuously updated project record.
- Implementation repos may link to this file or create a local variant only when extra fields are genuinely needed.

When a workspace adopts this standard, the live log should move from terse bullet history to a readable session record with background, intent, execution, verification, and resulting state.

---

## Example Entry

## 2026-05-02 — Staff Notification System & Product Image Manager

### Background

The staff portal had grown from a read-only dashboard into an operational surface for catalog, orders, delivery, and inquiries, but staff still had to manually check for new events. The user explicitly said staff should get notified when something happens.

Separately, the catalog still supported only one product image, which was becoming a bottleneck as real products were being prepared.

### Request

1. Build a staff notification system that emails relevant staff when business events occur, including new order, payment submitted, custom request, B2B inquiry, and contact form.
2. Allow staff to toggle which notifications they receive per event type.
3. Expand the product image manager to support multiple images, drag-to-sort, per-image naming, and inline edit and delete.

The user cared now because staff operations were becoming real and manual checking was no longer acceptable.

### Approach

Read the existing `accounts/models.py`, `core/emailing.py`, and staff portal templates to understand the current auth and email flow. Rejected a generic notification framework because the request mapped cleanly to a small set of business events. Chose a focused `StaffNotificationPreference` model with explicit types, wired through `core/notifications.py`.

For images, extended the existing product image model and catalog detail workflow instead of creating a separate subsystem, because the staff portal already owned product editing.

### Work Done

- Added `StaffNotificationPreference` in `accounts/models.py` with explicit notification categories tied to actual business events.
- Created `core/notifications.py` to dispatch staff emails and tag non-production messages with environment context.
- Wired notification dispatch into order, payment, custom request, and B2B service flows so staff emails are triggered by real events.
- Built notification preference controls in the staff portal account detail page so each staff user can manage what they receive.
- Extended `ProductImage` with a `name` field and added migration `catalog.0005`.
- Built multi-image upload, drag-to-sort, per-image metadata editing, and inline delete on the existing catalog detail page.
- Added `Pillow` to `requirements/production.txt` after validation exposed a missing dependency.

### Validation

- Ran `manage.py check` and it passed.
- Ran focused `pytest` coverage for staff portal, accounts, and catalog flows and the targeted suite passed.
- Performed a manual local order creation and confirmed staff email delivery with the expected subject and body.
- Performed manual image upload, sorting, rename, and delete checks and verified that changes persisted to R2.

### Achievement

Staff now receive targeted email alerts with per-user toggle control. The catalog supports multi-image product management with ordering and inline edits. The operational tooling is closer to production-ready use.

### Documentation Sync

- Updated `backend/IMPLEMENTATION_CHECKLIST.md` to mark staff notifications and image manager work complete.
- Updated `backend/sections/06.02-storage-email-and-integrations.md` to record the notification flow and shared account notes.
- Updated `website-high-level-docs/sections/06.09-staff-portal.md` to reflect the expanded staff operational surface.
- Added a concise entry to `knowledge-base/logs.md`, with this richer story-based format becoming the target standard.

### Decisions & Follow-ups

- Decision: use ZeptoMail REST API instead of SMTP because the deployment environment blocks standard SMTP ports.
- Decision: keep dev and prod in the same Cloudflare account with separate R2 buckets.
- Follow-up: add real products through the staff portal with AI-assisted research workflow.
- Follow-up: complete a pre-launch audit covering SSL monitoring, R2 upload verification, and SEO metadata.

---

## Version Note

Condensed wording update at `1.00.01` on `2026-05-04`.

Per repo policy, durable history is tracked through header metadata rather than an inline changelog section.