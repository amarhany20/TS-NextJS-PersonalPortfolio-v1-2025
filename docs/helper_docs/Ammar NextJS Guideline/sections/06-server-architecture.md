# 6. Server Architecture

## Layers

```
Route Handler → Controller → Service → Repository → DB
```

**Route Handlers** (`app/api/**/route.ts`): HTTP only - parse request, delegate to controller
```typescript
export async function POST(request: Request) {
  await requireAuth();
  return UserController.create(request);
}
```

**Controllers** (`server/controllers/*`): Orchestrate - validate, call service, serialize, return response
```typescript
static async create(request: Request) {
  const validated = createUserSchema.parse(await request.json());
  const user = await UserService.createUser(validated);
  return successResponse(serializeUser(user), 201);
}
```

**Services** (`server/services/*`): Business logic - rules, invariants, coordinate repos
```typescript
static async createUser(data: CreateUserInput) {
  const exists = await UserRepository.findByEmail(data.email);
  if (exists) throw new ConflictError('Email taken');
  
  const hashed = await hashPassword(data.password);
  return UserRepository.create({ ...data, password: hashed });
}
```

**Repositories** (`server/repositories/*`): Data access - queries only, explicit selects
```typescript
static async findByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, name: true },
  });
}
```

## Helpers

- `server/http/*` - Response formatters, error mapping
- `server/security/*` - Auth, JWT, crypto, sessions
- `server/serializers/*` - DTOs for API responses  
- `server/integrations/*` - External SDK wrappers
- `server/cache/*` - Caching adapters
- `server/jobs/*` - Background jobs

## Prisma

- Singleton in `server/db/prisma.ts`
- Always explicit `select`, never return passwords
- Use `prisma migrate dev/deploy`

---
