# 9. Data Fetching & Middleware

## Data Fetching

- Prefer RSC `fetch` with Next caching
- Use `revalidate` for ISR
- Mutations: Route Handlers or Server Actions (pick one per feature)

## Middleware (`src/middleware.ts`)

Runs before every request. Use for:
- Auth checks and redirects
- Maintenance mode
- Security headers
- Rate limiting

```typescript
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip static assets
  if (pathname.startsWith('/_next') || pathname.includes('.')) {
    return NextResponse.next();
  }
  
  // Protected routes
  if (pathname.startsWith('/admin')) {
    const session = await getSession();
    if (!session.isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  // Security headers
  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  return response;
}
```

## Route Protection (Defense in Depth)

1. **Middleware**: First line, redirects early
2. **Layout**: Server-side session check before rendering
3. **API Route**: `await requireAuth()` or `await requirePermission()`

```typescript
// Layout
export default async function ProtectedLayout({ children }) {
  const session = await getSession();
  if (!session.isAuthenticated) redirect('/login');
  return <DashboardShell>{children}</DashboardShell>;
}

// API  
export async function POST(request: Request) {
  await requirePermission(Permission.USER_CREATE);
  return UserController.create(request);
}
```

---
