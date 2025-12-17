# Agent Operations Guideline v1.02.00

**Version:** 1.02.00  
**Created:** 2025-11-13  
**Last Updated:** 2025-12-11  
**Maintainer:** Ammar Hany  
**Status:** Active  
**Applies To:** All agent sessions working on Ammar-led projects  
**Tags:** [Agent, Development, Workflow, Git, Versioning]

---

## Overview

This document defines how every agent session behaves when generating code, updating files, or working inside any Ammar-led project. It exists to keep development consistent across parallel sessions and to keep documentation and code aligned at all times.

---

## Table of Contents

1. [Purpose](#purpose)
2. [Core Workflow](#core-workflow)
3. [Session Boundaries](#session-boundaries)
4. [Implementation Checklist](#implementation-checklist)
5. [Documentation Structure & Organization](#documentation-structure--organization)
6. [Commit Rules](#commit-rules)
7. [Documentation Alignment](#documentation-alignment)
8. [Summary](#summary)
9. [Changelog](#changelog)

---

## Purpose

This guideline ensures multi-session agentic development stays consistent, predictable, and traceable. Every agent follows the same rules for:

- Reading and applying project-specific standards
- Aligning code with architectural plans
- Maintaining documentation accuracy
- Managing version control and commits

Following this guideline guarantees that code always reflects the planned architecture, documentation stays updated, and every session ends with a clean commit and a version bump.

---

## Core Workflow

Agents always work inside a project that contains a `docs` folder. This folder stores:

- Project rules
- Authoring standards
- Naming conventions
- Architecture guidelines
- Development lifecycle requirements

**Before writing any code, agents must:**

1. **Locate the project documentation folder** (typically `docs/`)
2. **Read the architectural document** (may be named `architecture.md`, `solution-architecture.md`, or similar)
3. **Review relevant guidelines** stored in the documentation folder
4. **Confirm the requested change fits the plan**

Each project contains a top-level architectural document that describes:

- Project plan and structure
- Modules and components
- Data flows and interactions
- Constraints and limitations
- Design decisions and rationale

**Agents must align all code and design changes with this document.**

If a requested change falls outside the planned structure:

1. Update the architecture file first
2. Review the affected sections
3. Proceed with implementation only after documentation is updated

**Documentation must always stay in sync with implementation.**

---

## Session Boundaries

An agent session represents one development task. At the end of **every** session, the agent must:

### 1. Commit All Modified Files

- Use clear, descriptive commit messages
- Commit titles **must** include the bumped version
- Follow the commit format defined in [Commit Rules](#commit-rules)

### 2. Bump the Patch Version

Version bumping depends on the project type:

- **Django projects:** Update version in `settings.py`
- **JavaScript/TypeScript projects:** Bump `package.json`
- **Other projects:** Update the version file specified in project documentation

**Patch increments are always `+0.0.1`**

Example: `1.02.05` → `1.02.06`

### 3. Keep the Documentation Updated

If the session introduced any change in:

- Structure
- Behavior
- Naming conventions
- Data flows
- Design decisions

Then update:

- The relevant parts of the architecture document
- Any guideline files inside `docs/`
- Add changelog entries where applicable

---

## Implementation Checklist

During development or planning of any project, agents **must** create and maintain a single markdown file called `implementation-checklist.md` in the project's documentation folder (typically `docs/`).

### Purpose

The implementation checklist serves as:

- A **task list** tracking all work items across phases
- A **status tracker** reflecting current project state
- A **roadmap** for planned features, fixes, and improvements
- A **reference** for ongoing and completed work

### When to Create/Update

**Create** `implementation-checklist.md` when:

- Starting a new project
- Defining new features or phases
- Planning refactoring or major changes
- Onboarding new work items

**Update** after every session:

- Mark completed tasks as done
- Add newly identified work items
- Update phase progression
- Note blockers or dependencies
- Reflect current app status

### Structure

The checklist should organize tasks by:

- **Phase** (planning, development, testing, deployment, etc.)
- **Category** (features, bug fixes, documentation, refactoring, testing, etc.)
- **Status** (not-started, in-progress, completed, blocked)
- **Priority** (optional: high, medium, low)

### Example Format

```markdown
# Implementation Checklist

## Phase 1: Core Setup

- [ ] Initialize project structure
- [ ] Configure build tools
- [x] Set up version control
- [ ] Create documentation folder

## Phase 2: Authentication (In Progress)

- [x] Design auth schema
- [x] Implement JWT token generation
- [ ] Add refresh token rotation
- [ ] Create auth middleware

## Phase 3: API Development

- [ ] Design endpoint specifications
- [ ] Implement CRUD operations
- [ ] Add error handling
- [ ] Write API tests

## Bug Fixes & Improvements

- [x] Fix login timeout issue
- [ ] Optimize database queries
- [ ] Add input validation
```

### Best Practices

- Keep the checklist **in sync** with actual project state
- Update **immediately** after completing tasks
- Use **clear, actionable** task descriptions
- Reference **related documentation** or tickets when applicable
- Review checklist at **session start** to prioritize work
- Use it as a **progress dashboard** for stakeholders

---

## Documentation Structure & Organization

All documentation must follow the **Ammar Documentation Guideline**, which defines:

- **Multi-file layout:** Intro file + numbered section files (`sections/NN-section-title.md`) for comprehensive docs
- **Single-file layout:** Brief content in one file (no sections needed)
- **Standard header:** Version, created date, last updated, author, status, tags
- **Naming convention:** Intro files as `name-vX.YY.ZZ.md`; sections as `NN-section-title.md`
- **Archiving:** Retired content stored in `archive/` instead of deleted
- **Repo structure:** Project docs live in `docs/<project-slug>/` with `architect.md`, `sections/`, `implementation-checklist.md`, `testing/`, and `other_docs/`

### Key Requirements

- Always consult the **Ammar Documentation Guideline** (located in helper_docs) before creating or modifying documentation
- Keep intro files lean: title, Overview, TOC, Changelog only
- Use relative links; maintain "Back to start" navigation when helpful
- Update TOC whenever sections are added or removed
- Follow the standard header format with proper versioning
- Archive instead of delete to preserve project history

---

## Commit Rules

Each commit must follow this structure:

```
<scope>: <summary> [vX.YY.ZZ]

<body>
```

### Title Format

- **Scope:** The area of change (e.g., `api`, `auth`, `docs`, `frontend`)
- **Summary:** Brief description of what changed (imperative mood)
- **Version:** The new version number in brackets

Example:
```
auth: implement JWT refresh token rotation [v1.02.15]
```

### Body Requirements

- Short explanation of **what** changed
- Brief note on **why** it changed
- Mention **where** the changes occurred
- Reference the version bump explicitly

Example:
```
auth: implement JWT refresh token rotation [v1.02.15]

Added refresh token rotation to improve security. Tokens now
expire after 7 days and must be refreshed. Updated authentication
middleware and token validation logic in auth/middleware.py.

Bumped version from v1.02.14 to v1.02.15.
```

### Additional Rules

- Keep commits **atomic** (one logical change per commit)
- Keep commits **focused** (related changes only)
- Keep commits **readable** (clear intent and context)

**If multiple agents are working in parallel,** each session still commits separately and bumps patch versions independently. Merge conflicts should be resolved following project-specific git workflows.

---

## Documentation Alignment

Agents must treat documentation as the **authoritative source of truth.**

### Before Writing Code

1. **Read the architecture document**
   - Understand the overall structure
   - Review module responsibilities
   - Check naming conventions
   - Verify design patterns in use

2. **Confirm the requested change fits the plan**
   - Does it align with existing modules?
   - Does it follow established patterns?
   - Does it respect documented constraints?

3. **If it does not fit:**
   - Update the architecture document first
   - Explain the deviation and rationale
   - Add decision record if significant
   - Then proceed with implementation

### During Implementation

- Follow **naming conventions** defined in `docs/`
- Respect **folder structure** outlined in architecture
- Apply **design rules and patterns** consistently
- Keep code aligned with architecture's:
  - Module boundaries
  - Data flows
  - API contracts
  - Business logic constraints

### After Implementation

1. **Update affected documentation sections**
   - Architecture diagrams
   - Module descriptions
   - API specifications
   - Flow documentation

2. **Add changelog entries**
   - If guideline files were modified
   - If architecture changed significantly
   - If new patterns were introduced

3. **Verify alignment**
   - Code matches documented architecture
   - New features are documented
   - Breaking changes are noted
   - Migration paths are clear (if applicable)

---

## Summary

This guideline establishes a consistent workflow for all agent sessions working on Ammar-led projects:

✅ **Always read project documentation before coding**  
✅ **Keep code aligned with architectural plans**  
✅ **Maintain an implementation checklist in project documentation**  
✅ **Update checklist to reflect current status and completed work**  
✅ **Update documentation when structure or behavior changes**  
✅ **Commit with clear messages and version bumps**  
✅ **Treat documentation as source of truth**  
✅ **End every session with clean state: committed code, bumped version, updated docs and checklist**

By following these rules, multi-session agentic development remains consistent, predictable, and traceable across all projects.

---

## Changelog

| Version | Date       | Author      | Description                                                    |
|---------|------------|-------------|----------------------------------------------------------------|
| 1.02.00 | 2025-12-11 | Ammar Hany  | Added Documentation Structure & Organization guidelines        |
| 1.00.01 | 2025-12-07 | Ammar Hany  | Added Implementation Checklist guideline and best practices    |
| 1.00.00 | 2025-11-13 | Ammar Hany  | Initial release of Agent Operations Guideline                  |
