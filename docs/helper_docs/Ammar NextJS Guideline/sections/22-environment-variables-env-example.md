# 22. Environment Variables (`.env.example`)

```
# App
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/app

# Auth
JWT_SECRET=replace_me
SESSION_SECRET=replace_me
SESSION_COOKIE_NAME=app_session
SESSION_COOKIE_SECURE=true

# Third-party
SENTRY_DSN=
STRIPE_SECRET_KEY=

# Feature flags
FEATURE_X_ENABLED=false
```

> Keep `server/server-validators/env.ts` as the single parser of process env. Never import env directly in client code.

---
