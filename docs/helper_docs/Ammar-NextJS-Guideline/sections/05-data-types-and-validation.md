# 5. Data & Validation

## Types

- **Client types (`types/*`)**: UI models, props. Never import in server code.
- **Server types**: Prisma types in services/repos, DTOs in `server/serializers/*`
- **Shared (`types/shared.ts`)**: Enums/constants only (use sparingly)

## Validation (3 Layers)

**1. Client (UX only)**
```typescript
// client-validators/forms/user.ts
const clientUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
```

**2. API Boundary (Required)**
```typescript
// server/server-validators/api/user.ts
const createUserSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(8).max(100),
  name: z.string().min(1).max(100).trim(),
});

// In route handler
const validated = createUserSchema.parse(body);
```

**3. Business Rules (Services)**
```typescript
// Check uniqueness, enforce domain rules
const exists = await UserRepository.findByEmail(data.email);
if (exists) throw new ConflictError('Email taken');
```

## Zod Patterns

```typescript
// Reusable
const emailSchema = z.string().email().toLowerCase().trim();

// Composition  
const updateSchema = createSchema.partial();

// Transform
const nameSchema = z.string().trim().transform(capitalize);

// Refinements
.refine((d) => d.published ? !!d.publishedAt : true, {
  message: 'Published needs date',
  path: ['publishedAt'],
});
```

## Environment Validation

```typescript
// server/server-validators/env.ts
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
});

export const env = envSchema.parse(process.env);
```

---
