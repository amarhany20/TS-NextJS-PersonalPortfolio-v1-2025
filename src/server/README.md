# `src/server`

Purpose: server-only application logic, including services, repositories, serializers, security helpers, and validators.

Rules:
- Follow the active repo flow: route/page -> service -> repository -> serializer/response.
- Keep repositories query-focused and keep business rules in services.
- Validate API input with Zod at the server boundary and use typed env access from `server-validators/env`.
