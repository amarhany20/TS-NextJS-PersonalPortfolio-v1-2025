# 11. Security

## Authentication

**Session-based (iron-session)**
```typescript
export async function getSession() {
  return getIronSession<SessionData>(await cookies(), {
    password: process.env.SESSION_SECRET!,
    cookieName: 'app_session',
    cookieOptions: { secure: true, httpOnly: true, sameSite: 'lax', maxAge: 604800 },
  });
}
```

**JWT-based**
```typescript
export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '7d' });
}
```

## Authorization (RBAC)

```typescript
// Define roles & permissions
export enum Role { SUPER_ADMIN = 'SUPER_ADMIN', ADMIN = 'ADMIN', EDITOR = 'EDITOR', USER = 'USER' }
export enum Permission { USER_CREATE = 'user:create', CONTENT_PUBLISH = 'content:publish', ... }

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.SUPER_ADMIN]: Object.values(Permission),
  [Role.ADMIN]: [Permission.USER_READ, Permission.CONTENT_PUBLISH, ...],
  ...
};

// Enforce
export async function requireAuth() {
  const session = await getSession();
  if (!session.isAuthenticated) throw new AuthenticationError();
  return session;
}

export async function requirePermission(permission: Permission) {
  const session = await requireAuth();
  if (!session.permissions.includes(permission)) throw new AuthorizationError();
  return session;
}
```

## Password Security

```typescript
const SALT_ROUNDS = 12;
export async function hashPassword(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS);
}
export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
```

## Security Checklist

- [ ] Passwords hashed with bcrypt (12+ rounds)
- [ ] Sessions use HttpOnly, Secure, SameSite cookies
- [ ] All inputs validated with Zod at API boundary
- [ ] CSRF tokens on state-changing operations
- [ ] Rate limiting on auth (5 attempts/15min) and API (100req/min)
- [ ] Security headers (CSP, X-Frame-Options, etc.)
- [ ] SQL injection prevented (Prisma parameterized queries)
- [ ] XSS prevented (sanitize HTML, escape output)
- [ ] Secrets never exposed to client
- [ ] Environment variables validated at startup
- [ ] HTTPS enforced in production

---
