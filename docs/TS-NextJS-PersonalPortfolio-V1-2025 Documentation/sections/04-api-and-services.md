# 4. API & Services

## 4.1 Surface Area
All APIs live under `/app/api/v1/*` and follow REST conventions with JSON bodies:
- `auth`: `POST /auth/login`, `POST /auth/logout`
- `portfolio`, `blog`, `experience`, `education`, `skills`, `services`, `certificates`,
  `recommendations`: full CRUD + `/reorder`
- `media`: `POST /media/upload`, `DELETE /media/{id}`
- `contact`: `POST /contact` (public, rate-limited)
- `settings`: `GET/PUT /settings`, `PUT /settings/theme`, `PUT /settings/maintenance`
- `setup`: `POST /setup/database`, `POST /setup/admin`, `POST /setup/settings`

## 4.2 Handler Pattern (per MIGRATION_SUMMARY)
1. **Validate input with Zod** (client + server schemas share types via `@/types`).
2. **Call service layer** (business logic, transactions, slug rules, ordering).
3. **Serialize output** using DTO helpers in `src/server/serializers/*`.
4. **Return via response helper** (`successResponse`, `createdResponse`, etc.).
5. **Handle errors centrally** by mapping custom error classes to HTTP status codes in
   `src/server/http/errors.ts` and `responses.ts`.

## 4.3 Validation & Error Handling
- **Client validators:** `src/client-validators` ensures immediate feedback in forms.
- **Server validators:** `src/server/server-validators` enforce contract regardless of client state
  (e.g., `env.ts` protects configuration, `api` schemas guard endpoints).
- **Error taxonomy:** `ValidationError`, `NotFoundError`, `UnauthorizedError`, `ConflictError`, and
  `AppError` share consistent structure for logging and response payloads.
- **Rate limits:** Auth login (5 attempts per 15 minutes), contact form (3 per hour), API default
  (100 req/min) applied via middleware wrappers.

## 4.4 Response Format
```json
// Success
{
  "success": true,
  "data": { "id": "clt...", "title": "Project" },
  "meta": { "timestamp": "2025-12-02T10:00:00Z" }
}

// Error
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Title is required",
    "details": { "title": "Required" }
  }
}
```
`meta` is optional but used for pagination and diagnostics. Errors always include machine-readable
`code` for admin UI mapping.

## 4.5 Service Guarantees
- Services never leak Prisma models; they either return DTOs or primitives.
- Each service is idempotent where possible (e.g., SetupService aborts when `.setup-complete`
  exists, reorder operations ignore unchanged sequences).
- Media uploads guarantee filesystem writes alongside metadata persistence; partial failures roll back
  via try/catch cleanup helpers.
