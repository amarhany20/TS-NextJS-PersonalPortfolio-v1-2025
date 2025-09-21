Static Data Layer
=================

This directory now exposes plain synchronous static data objects/arrays that power the portfolio. The previous async "loader" abstraction has been fully removed.

Key points:

1. Single Source: Each domain (experience, education, skills, certificates, portfolio, metadata) owns its final shaped export. No secondary transformation layer.
2. Synchronous Access: Import directly (e.g. `import { experience } from '@/temp-data/experience'`). No hooks required unless a component wants a stable interface (`useStatic*` wrappers simply return the values).
3. Aggregation: `src/temp-data/index.ts` re-exports everything and provides `allStaticData` plus `getAllStatic()` for convenience.
4. Certificates: Now explicitly curated in `certificates.ts` (independent of legacy credentials data which has been deleted).
5. Languages: Derived only from `metadata.ts` (no separate language objects).
6. Skills: Author skills once via `skillGroups`; flattened helpers (`allSkills`, `coreSkills`) are exported from `skills.ts`.
7. Future Backend Migration: When moving to a database, replace the contents of these modules (or their imports) while keeping the consuming components unchanged.

Removed legacy directory: `temp-data/loaders/` (all async wrappers + aggregate loader).

If you need a single snapshot of everything for (e.g.) RSS generation or build-time serialization:

```
import { getAllStatic } from '@/temp-data';
const snapshot = getAllStatic();
```

That function is synchronous and returns plain JSON-serializable structures (aside from any Date instances you might choose to introduce manually).

Keep any enrichment logic colocated with the domain file (e.g., mapping raw arrays to shaped records inside `experience.ts`).
