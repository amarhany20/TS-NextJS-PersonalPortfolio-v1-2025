# 23. Glossary

### Architecture Terms

- **Route Handler:** Next.js API route file (`app/api/**/route.ts`) that exports HTTP method functions. Handles HTTP concerns only (parsing, headers, status codes).
- **Controller:** Request orchestration layer in `server/controllers/*`. Extracts data, validates, calls services, serializes results, returns responses. No business logic.
- **Service:** Business logic layer in `server/services/*`. Enforces business rules and invariants. Orchestrates use cases. Framework-agnostic.
- **Repository:** Data access layer in `server/repositories/*`. Contains all database queries and external API calls. Returns plain objects.
- **Serializer:** Pure function in `server/serializers/*` that converts domain/service output to transport DTOs. Defines API response shapes.
- **DTO (Data Transfer Object):** Interface that defines the shape of data sent over the API. Lives in `server/serializers/*`.
- **Middleware:** Code that runs before requests in `middleware.ts`. Used for auth checks, redirects, security headers, rate limiting.

### Security Terms

- **RBAC (Role-Based Access Control):** Authorization pattern where permissions are assigned to roles, and users are assigned roles.
- **Permission:** Granular access right (e.g., `user:create`, `content:publish`).
- **Role:** Collection of permissions (e.g., `ADMIN`, `EDITOR`, `USER`).
- **Session:** Server-side authentication state stored in encrypted cookies (iron-session).
- **JWT (JSON Web Token):** Stateless authentication token containing claims.
- **CSRF (Cross-Site Request Forgery):** Attack where unauthorized commands are sent from authenticated user. Prevented with tokens and SameSite cookies.

### Validation Terms

- **Boundary Validation:** Input validation at API entry points using Zod schemas. First line of defense.
- **Business Validation:** Domain-specific rules enforced in services (e.g., "email must be unique").
- **Client Validation:** UX-only validation in forms. Not trusted by server.
- **Zod:** TypeScript-first schema validation library used for runtime type checking.

### Database Terms

- **Prisma:** TypeScript ORM (Object-Relational Mapping) for type-safe database access.
- **Migration:** Database schema change tracked in version control.
- **Seeding:** Populating database with initial/test data.
- **Index:** Database optimization for faster queries on specific columns.
- **Soft Delete:** Marking records as deleted (`deletedAt`) instead of removing them.

### Utility Terms

- **Server utils:** Node-only helpers in `server/server-utils/*` for cross-cutting concerns (FS, streams, dates).
- **Isomorphic:** Code that can run on both client and server (e.g., pure functions in `utils/`).
- **RSC (React Server Component):** React component that runs only on server, can directly access backend.

---
