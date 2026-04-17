# Agent Guideline

**Version:** 2.02.00
**Created:** 2026-02-11
**Last Updated:** 2026-03-08
**Author:** Ammar Hany
**Status:** Active
**Tags:** [Agent, Guidelines, GitHub Copilot, OpenCode, Codex, Claude]

---

## 1. Overview

Single source of truth for how AI agents operate across all projects and repos.
Compatible with: **GitHub Copilot**, **OpenAI Codex**, **OpenCode**, **Claude**, and all major model APIs.
Prioritize clarity, safety, and alignment with the documented architecture.

---

## 2. New Session Startup

At the start of every new session, before taking any action:

1. **Identify the repo** — determine which repo you are in: docs repo (high-level architecture) or
   implementation repo (code + full technical docs).
2. **Read rule sources in order:**
   - `AGENTS.md` at the repo root
   - `.github/copilot-instructions.md` (if present)
   - This file (`agent-guideline.md`)
   - `Ammar-Documentation-Guidelines/ammar-documentation-guideline.md` and its `sections/`
3. **Scan relevant docs** — read `docs/` or `solution-architecture/` for the area you will work in.
   Do not act on a file you have not read.
4. **Confirm scope** — verify the requested change matches the documented plan.
   If it does not, update docs first, then implement.
5. **Check current state** — look for implementation checklists, open TODOs, or recent changelog
   entries to understand what is in progress.
6. **Ask if still unclear** — if the task scope is ambiguous after reading, ask before acting.

---

## 3. Multi-Repo Structure

### What "sub-repos" means

A project may span multiple Git repositories. The docs repo contains a `sub-repos/` folder that
holds one or more implementation repos as a **filesystem sync point only**. This is **not** a
monorepo and **not** Git submodules. Key facts every agent must know:

- Each repo under `sub-repos/` is a fully independent Git repository with its own `.git/`, its own
  commit history, its own branches, and its own remotes.
- The presence of one repo's folder inside another repo's directory tree is a convenience for local
  development only. The two repos have no Git relationship.
- The user manages all Git operations in all repos. Agents must **never** run `git` commands in any
  repo unless explicitly instructed, and must **never** commit, push, branch, or rebase across repo
  boundaries.
- Changes made inside `sub-repos/<repo-name>/` belong to that sub-repo's Git history, not to the
  docs repo. Do not stage or commit those files from the docs repo root.

### How to identify which repo you are in

| Signal                                                           | Repo                 |
| ---------------------------------------------------------------- | -------------------- |
| Root contains `solution-architecture/`                           | High-level docs repo |
| Root contains `src/`, `AI/`, `package.json`, or `pyproject.toml` | Implementation repo  |
| `AGENTS.md` says "high-level documentation only"                 | High-level docs repo |
| `AGENTS.md` describes a tech stack (Next.js, Python, etc.)       | Implementation repo  |

When in doubt, read `AGENTS.md` at the root before acting.

### Documentation scope per repo type

| Repo Type                     | Documentation Scope                                                                                                                     |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| High-level docs repo          | System goals, architecture decisions, data flows, domain boundaries, event taxonomy, privacy, compliance — **no implementation detail** |
| Implementation repo (`docs/`) | Full technical depth: component design, API endpoints, schemas, DB models, error handling, deployment, environment variables, testing   |

### Helper docs duplication

Each repo carries its own copy of these guidelines (under `helper_docs/` or `docs/helper-docs/`).
This is intentional — each repo is self-contained. The user manually syncs copies when the
canonical version changes. Always follow the copy local to the repo you are in.

---

## 4. Core Workflow

1. Read project docs (`docs/`), architecture, and repo-specific rules before acting.
2. Confirm the requested change matches the documented plan.
3. If it does not match, update docs first, then implement.
4. Keep documentation in sync with implementation at all times.

---

## 5. Documentation Standards

- Follow **Ammar Documentation Guideline** (local `helper-docs/Ammar-Documentation-Guidelines/`).
- One H1 per file; numbered H2s; concise paragraphs; 120-char line width.
- Use single-file docs for small scopes; multi-file `sections/` for large scopes.
- Keep filenames stable; version and changelog live in the main file.
- Archive instead of delete when retiring content.

---

## 6. Planning & Delegation

- Use a task list for complex or multi-step work.
- Delegate exploration or implementation to sub-agents when parallel work is beneficial.
- Track tasks from in-progress to completed as work finishes.

---

## 7. Safety & Boundaries

- Do not access external systems, devices, or accounts unless explicitly instructed.
- Never expose secrets or credentials; use environment variables.
- Avoid destructive actions; explain impact and wait for explicit approval.
- Do not run `git` commands unless asked.

---

## 8. Commands & Outputs

- Explain the purpose before listing commands.
- Use clean, copy-pasteable blocks for command sequences.
- For large payloads (JSON, schemas, templates), write to a repo file and reference the path.
- Document build/test commands in `AGENTS.md` when a new toolchain is configured.

---

## 9. Versioning & Changelog

- Update version and changelog in the main file when standards change.
- Follow the commit format: `docs(scope): summary [vX.YY.ZZ]`

---

## 10. Commits

- Commit only when explicitly requested by the user.
- Keep commits atomic and focused; follow repo-defined formats.
- Never amend or force-push unless explicitly requested.

---

## 11. After Changes

- Update affected docs and checklists.
- Validate links and formatting for touched documentation.
- Run repo checks (lint/typecheck/tests) when relevant and available.

---

## Changelog

| Version | Date | Author | Description |
| ------- | ---- | ------ | ----------- || 2.02.00 | 2026-03-08 | Ammar Hany | Expanded §3 Multi-Repo Structure: sub-repos explanation, repo identification table, helper docs rule  || 2.01.00 | 2026-03-08 | Ammar Hany | Added §2 New Session Startup; renumbered all subsequent sections                                    |
| 2.00.00 | 2026-03-08 | Ammar Hany | Major rewrite: generalized for all agents/repos, added multi-repo structure, removed Mantis IV refs |
| 1.00.01 | 2026-02-11 | Ammar Hany | Added section on Junction Links for Windows                                                         |
| 1.00.00 | 2026-02-11 | Ammar Hany | Initial OpenCode agent guideline                                                                    |
