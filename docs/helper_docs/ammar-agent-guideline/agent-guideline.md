# Agent Guideline

**Version:** 2.10.02
**Created:** 2026-02-11
**Last Updated:** 2026-04-29
**Author:** Ammar Hany
**Status:** Active
**Tags:** [Agent, Guidelines, GitHub Copilot, OpenCode, Codex, Claude]

---

## 1. Overview

Single source for how AI agents operate across repos. Compatible with GitHub Copilot, OpenAI Codex, OpenCode, Claude, and major model APIs.

Owns: generic cross-repo workflow, startup order, repo-boundary behavior, documentation-sync expectations.
Does not own: repo-specific safety/approvals/product rules (→ local `AGENTS.md`), documentation format/structure/writing rules (→ local documentation guideline).

Forms the shared helper-doc core with the local documentation guideline; both are expected to be copied into downstream repos.

### Rule Ownership Model

Use the rule sources with this boundary so they do not drift into each other's jobs:

| File                          | Owns                                                                                                                                                               | Does Not Own                                                                              |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| Local `AGENTS.md`             | Repo-specific safety rules, approvals, tool policy, secrets policy, local documentation boundaries, tracking or release-handoff policy, and product-specific rules | Generic multi-repo workflow or documentation formatting rules                             |
| Shared `agent-guideline.md`   | Cross-repo workflow, startup order, repo-boundary behavior, central-docs-plus-subrepos model, and shared documentation-sync expectations                           | Repo-specific infrastructure, product policy, approval details, or formatting rules       |
| Local documentation guideline | Documentation structure, formatting, metadata, naming, anti-duplication writing rules, versioning, archive rules, and document-type rules                          | Workflow, tool policy, repo-specific safety, approval policy, or execution approval rules |

On overlap: local `AGENTS.md` controls repo-specific rules, local documentation guideline controls doc form, this file controls shared workflow.

---

## 2. Startup Protocol

At session start, load context in order:
1. Local `AGENTS.md`
2. `.github/copilot-instructions.md` if present
3. This file (`agent-guideline.md`)
4. Local documentation guideline if task touches docs
5. Canonical architecture or governing docs for touched area
6. Local implementation docs if task touches subrepo
7. Task-specific or framework-specific standard

Rules:
- Identify active repo type (central docs vs implementation) before acting.
- Do not implement against unread files or workflows.
- Prefer canonical docs, then repo-local detail.
- On conflict with documented plan, update docs first or record gap explicitly.
- Clarify ambiguous scope before acting.

---

## 3. Multi-Repo Workspace Model

### Central Documentation Repo + Subrepos

Some projects use one main documentation and operations repository with a `subrepos/` or `sub-repos/` folder containing independent implementation repositories. This is a workspace model, not a monorepo.

- Central repo owns: shared system context, cross-repo architecture, shared decisions, knowledge-base, operations/tracking.
- Each subrepo owns: code, tests, releases, repo-local setup, repo-local implementation docs. Keeps independent Git ownership, history, lifecycle.
- Colocation for workspace convenience only; does not create Git relationship. Visibility across workspace does not change ownership or authorize cross-repo Git actions.

### Ownership Boundary

| Layer                      | Owns                                                                                                                    | Does Not Own                                                                                                       |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Central documentation repo | Shared context, cross-repo architecture, knowledge base, operations records, tracking material, shared decisions        | Repo-local code, repo-local build or release assets, detailed implementation docs that only matter to one codebase |
| Implementation subrepo     | Code, tests, code-local design, setup/build/run details, releases, repo-local implementation docs, repo-local contracts | The shared system source of truth, cross-repo operations records, or company-level context                         |

### Repo Type Detection

| Signal                                                                                | Repo           |
| ------------------------------------------------------------------------------------- | -------------- |
| `subrepos/`, `sub-repos/`, `knowledge-base/`, `operations/`, `solution-architecture/` | Central docs   |
| `src/`, `AI/`, `package.json`, `pyproject.toml`                                       | Implementation |
| `AGENTS.md` → shared ops hub                                                          | Central docs   |
| `AGENTS.md` → describes tech stack                                                    | Implementation |

When uncertain, read `AGENTS.md` first.

### Working Rules

- Start with central docs for shared behavior, cross-repo context, system-level concerns.
- Switch to subrepo before changing code or repo-local implementation docs.
- Shared docs → central repo; code-local design/build/test/deploy/release docs → owning subrepo.
- Update both layers in same task when change affects shared behavior and local implementation.
- Define once at correct layer, link elsewhere; no duplicate canonical docs across layers.
- Local `AGENTS.md` is authoritative for repo-specific rules.
- Workspace visibility is context only; does not authorize cross-repo Git or blur ownership.

### Helper Docs Distribution

Each repo may carry its own copy (under `helper_docs/` or `docs/helper-docs/`). This is intentional for self-containment.
User manually syncs when canonical version changes. Always follow the local copy.

When adding specialized helper docs beside this core, keep them framework- or surface-specific only.
Do not repeat generic workflow or documentation rules unless a real exception must be stated.

---

## 4. Core Workflow

Standard agent operating model:
- Read all relevant docs before implementing.
- Confirm changes match documented plan; update docs first if they don't.
- When implementation changes affect documented behavior, update repo-local docs and checklists in same task.
- When change affects shared system behavior, update central docs repo and implementation repo docs in same cycle.
- Do not update only one layer and leave others to drift.
- If immediate full sync is impossible, record gap explicitly with `TODO(verify):` instead of silent divergence.
- Documentation sync is not optional cleanup; work is incomplete while code, docs, checklists materially disagree.

---

## 5. Documentation Handling

Follow local documentation guideline for all doc changes. Treat it as authority for structure, formatting, metadata, naming, versioning, and archive rules.

---

## 6. Policy Doc Hygiene

- Keep long-lived policy files concise, durable, and high-signal.
- Put transient status, scratch notes, and session memory in task-specific working files, not in policy docs.

---

## 7. Planning & Delegation

- Use a task list for complex or multi-step work.
- Delegate exploration or implementation to sub-agents when parallel work is beneficial.
- Track tasks from in-progress to completed as work finishes.

---

## 8. Safety & Boundaries

- Do not access external systems, devices, or accounts unless explicitly instructed.
- Default to not writing secrets/credentials to tracked files unless local repo explicitly authorizes it.
- Avoid destructive actions; explain impact and wait for approval.
- Do not run `git` commands unless asked.

---

## 9. Commands & Outputs

- Explain the purpose before listing commands.
- Use clean, copy-pasteable blocks for command sequences.
- For large payloads (JSON, schemas, templates), write to a repo file and reference the path.
- Document build/test commands in `AGENTS.md` when a new toolchain is configured.

---

## 10. Versioning & History

Update version and last-updated metadata when standards change. Follow local `AGENTS.md` for repo-specific history policy.

---

## 11. Commits

- Commit only when explicitly requested by the user.
- Keep commits atomic and focused; follow the local repo's documented commit format.
- Never amend or force-push unless explicitly requested.

---

## 12. After Changes

Update affected docs and checklists. Verify code, repo-local docs, and shared docs still align. Record gaps explicitly with `TODO(verify):` instead of silent drift. Validate links and formatting. Run repo checks when available.

---

