# 19. Decision Guides

## Where does code go?

**Client:**
- React hooks/lifecycle → `hooks/`
- Pure logic (no framework/Node deps) → `utils/`
- Framework/RSC-safe helpers → `lib/`
- Frontend view types → `types/`

**Server:**
- HTTP parsing/headers → Route handlers (`app/api/**/route.ts`)
- Request orchestration → `server/controllers/`
- Business logic → `server/services/`
- DB queries/external APIs → `server/repositories/`
- Auth, JWT, crypto → `server/security/`
- Response formatting → `server/http/`
- DTOs → `server/serializers/`
- External SDKs → `server/integrations/`
- Caching → `server/cache/`
- Background jobs → `server/jobs/`

## Server Actions vs Route Handlers?

- **Route Handlers**: External consumers, clear API boundary, RESTful, versioning
- **Server Actions**: Internal UI only, fewer hops, forms, progressive enhancement

**Recommendation**: Route Handlers for consistency and explicit contracts

## Session vs JWT Auth?

- **Session (iron-session)**: Server-rendered apps, single-origin, simpler, more secure by default
- **JWT**: API-first, mobile apps, microservices, stateless

**Recommendation**: Session for most Next.js apps

## SQLite vs PostgreSQL?

- **SQLite**: Development, prototyping, small-scale, single-user
- **PostgreSQL**: Production, scalability, advanced features, team collaboration

**Recommendation**: SQLite for dev, PostgreSQL for prod

## Middleware vs Layout Protection?

- **Middleware**: Global (auth redirects, maintenance, rate limiting, security headers)
- **Layout**: Section-specific, render user data, defense in depth

**Recommendation**: Both for defense in depth

---
