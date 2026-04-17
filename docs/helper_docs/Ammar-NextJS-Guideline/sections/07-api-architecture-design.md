# 7. API Design

## REST Principles

- Resource-based URLs: `/api/v1/users`, `/api/v1/posts/123`
- Proper HTTP methods: GET (read), POST (create), PUT (replace), PATCH (update), DELETE (remove)
- Version with `/v1/`, `/v2/` for breaking changes

## Response Envelope

```typescript
// Success
{ success: true, data: {...}, meta?: { page, total, hasMore } }

// Error
{ success: false, error: { code: string, message: string, details?: unknown } }
```

## HTTP Errors

```typescript
class ValidationError extends AppError { constructor(msg, details) { super(msg, 400, 'VALIDATION_ERROR', details); }}
class AuthenticationError extends AppError { constructor() { super('Auth required', 401, 'AUTH_ERROR'); }}
class AuthorizationError extends AppError { constructor() { super('Forbidden', 403, 'FORBIDDEN'); }}
class NotFoundError extends AppError { constructor(resource) { super(`${resource} not found`, 404, 'NOT_FOUND'); }}
class ConflictError extends AppError { constructor(msg) { super(msg, 409, 'CONFLICT'); }}
```

## Pagination

```typescript
const page = parseInt(searchParams.get('page') || '1');
const perPage = Math.min(parseInt(searchParams.get('perPage') || '20'), 100);
```

## Flow

```
1. Route handler validates auth
2. Controller: parse → validate (Zod) → call service
3. Service: business logic → call repo
4. Repo: query DB
5. Controller: serialize → return response
```

---
