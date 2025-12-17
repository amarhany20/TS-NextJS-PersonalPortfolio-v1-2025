# 8. Client vs Server Components

- Default to Server Components. Add `"use client"` only when state, effects, refs, or browser APIs are required.
- Heavy fetches and transformations run on the server. Pass serialized props down.

---
