# Server

**Purpose:** Server-side application layer containing all backend logic, security, data access, and API infrastructure.

**Key Rules:**
- Code in this folder is **server-only**. Never import these modules in client components.
- All files here can safely use Node.js APIs, environment variables, and server-only dependencies.
- Frontend types from `src/types/*` must never be imported here.

## Structure

- **`http/`** - HTTP helpers: error classes, response formatters, status code mapping
- **`services/`** - Business logic and use-cases. Orchestrate repositories and enforce rules.
- **`repositories/`** - Data access layer. All DB queries and external API calls.
- **`security/`** - Auth helpers: JWT, crypto, session management, CSRF protection
- **`serializers/`** - Response mappers and DTO interfaces for API responses
- **`server-validators/`** - Zod schemas for API inputs and environment variables
- **`server-utils/`** - Node-only cross-cutting utilities (FS, streams, date/tz)
- **`integrations/`** - Third-party API SDK wrappers
- **`cache/`** - Caching abstractions (Redis, in-memory)
- **`db/`** - Database client singletons (Prisma, etc.)
- **`jobs/`** - Background jobs and scheduled tasks
- **`events/`** - Domain events (pub/sub) if needed

## Principles

- Controllers (route handlers) call services, not repositories directly.
- Services contain business rules and never touch HTTP concerns.
- Repositories return plain objects, not ORM instances.
- All inputs are validated at the boundary with Zod.
- Serializers convert domain objects to DTOs before sending over the wire.
