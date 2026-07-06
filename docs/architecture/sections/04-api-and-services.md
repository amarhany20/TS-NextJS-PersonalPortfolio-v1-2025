# 4. API & Services

## 4.1 API Surface

All active APIs live under `/app/api/v1/*` and return JSON response envelopes.

| Area            | Active Routes                                                                          | Notes                                               |
| --------------- | -------------------------------------------------------------------------------------- | --------------------------------------------------- |
| Auth            | `POST /auth/login`, `POST /auth/logout`                                                | Session-based admin authentication.                 |
| Portfolio       | `GET/POST /portfolio`, `GET/PATCH/DELETE /portfolio/[slug]`, `POST /portfolio/reorder` | Admin CRUD plus reorder.                            |
| Blogs           | `GET/POST /blogs`, `GET/PATCH/DELETE /blogs/[slug]`                                    | Admin and public-facing blog content flows.         |
| Experience      | `GET/POST /experience`, `GET/PATCH/DELETE /experience/[id]`                            | Timeline management.                                |
| Education       | `GET/POST /education`, `GET/PATCH/DELETE /education/[id]`                              | Timeline management.                                |
| Services        | `GET/POST /services`, `GET/PATCH/DELETE /services/[slug]`, `POST /services/reorder`    | Active-service management and reorder.              |
| Skills          | `GET/POST /skills`, `GET/PATCH/DELETE /skills/[slug]`                                  | Skill-group management.                             |
| Certificates    | `GET/POST /certificates`, `GET/PATCH/DELETE /certificates/[id]`                        | Credential management.                              |
| Recommendations | `GET/POST /recommendations`, `GET/PATCH/DELETE /recommendations/[id]`                  | Testimonial management.                             |
| Media           | `GET/POST /media`, `DELETE /media/[id]`                                                | Upload, list, delete.                               |
| Contact         | `POST /contact`, `GET /contact`, `PATCH/DELETE /contact/[id]`                          | Public submissions plus admin inbox actions.        |
| Themes          | `GET /themes`, `POST /themes/apply`                                                    | Theme registry and apply flow.                      |
| Settings        | `PATCH /settings/profile`, `PATCH /settings/visibility`                                | Authenticated site-profile and visibility editing.  |
| Diagnostics     | `GET/POST /example`                                                                    | Lightweight example and Playwright readiness probe. |

## 4.2 Service Layer Inventory

Key services in the active solution:

- `SettingsService`: site content assembly, setup summary, site-profile editing, and public visibility control.
- `EnvBootstrapService`: first-run bootstrap of settings and admin user.
- `ThemeService`: theme registry listing and apply flow.
- `DashboardService`: admin dashboard metrics and quick links.
- Domain services for portfolio, blog, experience, education, services, skills, certificates, recommendations, media, and contact.
- `AuthService`: username/password authentication.

## 4.3 Route Handler Pattern

The route-handler pattern in this repo is:

1. Parse request data.
2. Validate input with Zod.
3. Enforce auth when required.
4. Delegate business logic to a service.
5. Return the canonical success or error envelope.
6. Revalidate affected paths where UI-facing cached content depends on the mutation.

## 4.4 Validation And Error Handling

- Client validators in `src/client-validators/**` are UX helpers only.
- Server validators in `src/server/server-validators/**` are the authoritative contract enforcement layer.
- Errors are normalized through `src/server/http/errors.ts` and `responses.ts`.
- Rate limiting is applied near auth and public-input surfaces such as login and contact submission.

## 4.5 Response Contract

```json
{
  "success": true,
  "data": {},
  "meta": {}
}
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request body",
    "details": {}
  }
}
```

Rules:
- `success` is always present.
- `data` exists on successful responses.
- `error` exists on unsuccessful responses.
- `meta` is optional and used for pagination or diagnostics.

## 4.6 Service Rules

- Services own business rules and domain invariants.
- Repositories own query shape and persistence.
- Serializers own DTO normalization.
- Route handlers should not return raw Prisma records.
- Services should re-use shared repositories or helpers instead of duplicating query logic across routes.

## 4.7 Current Architecture Notes

- The settings API is now an active part of the solution through `PATCH /api/v1/settings/profile` and `PATCH /api/v1/settings/visibility`.
- Theme changes, site-profile changes, and page/section visibility changes all feed the same settings singleton row.
- Public content is read through services even when it originated from seeded fallback modules.

---
[« Previous](03-data-and-persistence.md) | [Next »](05-admin-and-public-experience.md)
