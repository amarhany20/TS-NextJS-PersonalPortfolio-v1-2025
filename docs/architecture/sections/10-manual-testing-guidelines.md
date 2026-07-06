# 10. Manual Testing Guidelines

## 10.1 Goal
Use this section for a full manual verification pass of the public site and admin CMS.

The aim is to test the real user flow step by step, not just isolated screens.

## 10.2 Prerequisites
1. Run `npm install`.
2. Run `npm run prisma:migrate`.
3. Run `npm run db:seed`.
4. Run `npm run dev`.
5. Open a clean browser session or private window.
6. Use test data prefixes such as `MANUAL-PORTFOLIO-01`, `MANUAL-BLOG-01`, and `MANUAL-SVC-01`.

## 10.3 Admin Login Reference
1. Open `/login`.
2. Use admin username `admin`.
3. Read the password from your local `.env` using `ADMIN_PASSWORD` or `E2E_ADMIN_PASSWORD`.
4. Do not treat README defaults as stronger than `.env`; your local environment is the truth.

## 10.4 Full Start-To-Finish Smoke Flow
1. Open `/`.
2. Confirm the app redirects to `/home`.
3. Review the home page quickly for layout breaks, missing content, or visible errors.
4. Open `/portfolio`, `/services`, and `/blogs` in the same browser session.
5. Return to `/login`.
6. Enter an invalid password once and confirm login fails with a clear error.
7. Enter the correct credentials and sign in.
8. Confirm you land in the admin area.
9. Open `/admin` and confirm dashboard cards and navigation render without errors.
10. Continue through the feature-specific sections below.

## 10.5 Public Site Checks

### 10.5.1 Home
1. Open `/home`.
2. Confirm the hero renders.
3. Confirm summary, experience, education, skills, certificates, recommendations, and contact sections render.
4. Click each major CTA and confirm it goes to the intended route or anchor.
5. Confirm the contact CTA lands on `/home#contact`.

### 10.5.2 Navigation
1. Use the main navigation to visit `/home`, `/portfolio`, `/blogs`, and `/services`.
2. Resize to a mobile viewport.
3. Confirm mobile navigation still exposes the same destinations.
4. Confirm there are no broken links, 404s, or layout collisions.

### 10.5.3 Portfolio
1. Open `/portfolio`.
2. Confirm only intended published projects appear.
3. Open at least one project detail page.
4. Confirm title, tagline, summary, stack, badges, and gallery content render correctly.
5. Confirm there are no links pointing to retired `/projects` routes.

### 10.5.4 Services
1. Open `/services`.
2. Confirm active services render correctly.
3. If the page is empty, confirm the empty state is intentional and readable.
4. Confirm there is no placeholder or demo copy leaking into the public page.

### 10.5.5 Blog
1. Open `/blogs`.
2. Confirm only published posts appear publicly.
3. Open a published blog post.
4. Confirm metadata, title, content, and supporting labels render correctly.
5. Confirm draft-only content is not visible publicly.

### 10.5.6 Contact
1. Go to the contact section on `/home#contact`.
2. Confirm no fallback template email such as `you@example.com` is visible.
3. Confirm configured email, phone, WhatsApp, location, and social links render only when present.
4. Confirm external social links open safely in a new tab.
5. Test contact submissions through the API or any explicit form UI if one is reintroduced later.

## 10.6 Auth And Access Control
1. Sign out if needed.
2. Open `/admin` directly while signed out.
3. Confirm the app redirects to `/login` or blocks access correctly.
4. Sign in again using the valid admin credentials.
5. Confirm the admin sidebar shows the expected destinations.
6. Refresh `/admin` and confirm the session remains valid.

## 10.7 Admin Dashboard
1. Open `/admin`.
2. Confirm dashboard stats load.
3. Confirm quick links and sidebar navigation work.
4. Confirm there are no visible client or server error states.

## 10.8 Admin Content Managers

### 10.8.1 Portfolio
1. Open `/admin/portfolio`.
2. Confirm the list page loads and search works.
3. Create a project using a `MANUAL-PORTFOLIO-*` title and slug.
4. Confirm save redirects back to the list.
5. Edit the same project and confirm the changes persist.
6. Publish the project if the workflow is exposed.
7. Unpublish it if that control exists.
8. Reorder projects if the reorder UI is available.
9. Delete the test project.
10. Confirm the public `/portfolio` page reflects published state correctly.

### 10.8.2 Experience
1. Open `/admin/experience`.
2. Create a new experience item.
3. Confirm save returns to the list page.
4. Publish the item.
5. Edit the item.
6. Delete the item.
7. Confirm any published item would appear correctly on the public home page if left published.

### 10.8.3 Education
1. Open `/admin/education`.
2. Create a new education record.
3. Edit the same record.
4. Delete the record.
5. Confirm the public education section stays correct.

### 10.8.4 Services
1. Open `/admin/services`.
2. Create a new service.
3. Edit the service.
4. Toggle the active or visible state if exposed.
5. Use the reorder board if it is present.
6. Delete the service.
7. Confirm `/services` reflects active items only.

### 10.8.5 Blog
1. Open `/admin/blogs`.
2. Create a draft post using a `MANUAL-BLOG-*` title.
3. Confirm the editor loads and accepts content.
4. Save the post.
5. Edit the saved post.
6. Schedule or set publish timing if that workflow is exposed.
7. Publish the post.
8. Confirm it appears on `/blogs` only after publish.
9. Delete the post when finished.

### 10.8.6 Media
1. Open `/admin/media`.
2. Upload one image.
3. Upload one allowed non-image file such as a PDF or text file.
4. Confirm both assets appear in the library.
5. Preview the image.
6. Copy the asset link.
7. Delete both uploaded test assets.

### 10.8.7 Contact Inbox
1. Open `/admin/contact`.
2. Confirm the test submission from the public contact flow appears.
3. Open the message detail dialog.
4. Confirm the dialog content is correct.
5. Update the submission status if that control exists.
6. Delete the test submission if deletion is supported and appropriate.

### 10.8.8 Certificates
1. Open `/admin/certificates`.
2. Create a certificate.
3. Edit the certificate.
4. Delete the certificate.
5. Confirm any public certificate links or attachments still work.

### 10.8.9 Recommendations
1. Open `/admin/recommendations`.
2. Create a recommendation.
3. Publish it.
4. Edit it.
5. Delete it.
6. Confirm published recommendations appear correctly on the public site if you leave one published.

### 10.8.10 Skills
1. Open `/admin/skills`.
2. Create a skill group.
3. Add or edit skills if the UI exposes that workflow.
4. Edit the group.
5. Delete the test group.
6. Confirm public skill displays remain correct.

### 10.8.11 Site Profile
1. Open `/admin/settings/profile`.
2. Update your full name, professional title, hero copy, primary email, and location.
3. Save the changes.
4. Refresh `/home` and confirm the public sidebar/profile, hero, and contact sections reflect the new values.
5. Refresh the admin page and confirm the changes persist.

### 10.8.12 Theme
1. Open `/admin/settings/theme`.
2. Preview at least two themes.
3. Apply a theme.
4. Refresh the page.
5. Confirm the selected theme persists.
6. Open a few public routes and confirm the theme renders correctly outside admin.

### 10.8.13 Visibility
1. Open `/admin/settings/visibility`.
2. Disable `Blogs page` and confirm the public navigation no longer shows `Blog`.
3. Visit `/blogs` and a known `/blogs/[slug]` URL directly and confirm both return 404.
4. Re-enable `Blogs page` and confirm navigation plus direct routes recover.
5. Disable one home section such as `Recommendations` and confirm `/home` hides it without deleting the underlying data.
6. Refresh the admin page and confirm the saved toggle states persist.

### 10.8.14 Setup Diagnostics
1. Open `/admin/settings/setup`.
2. Confirm setup metadata loads.
3. Confirm bootstrap details match the current seeded environment.
4. Confirm there is no stale setup-wizard wording.

## 10.9 Cross-Cutting Checks
1. Confirm success and error toasts appear when expected.
2. Confirm delete flows require explicit user intent.
3. Confirm created data remains after refresh.
4. Confirm deleted data disappears after refresh.
5. Confirm browser back/forward navigation does not break forms or lists.
6. Check the browser console for client-side errors.
7. Check the dev server output for unexpected runtime errors.

## 10.10 Exit Criteria
Mark the manual pass complete only when all of the following are true:

1. Admin login works.
2. Public critical paths render correctly.
3. Each admin content domain has been exercised at least once.
4. Publish and visibility states match the public site behavior.
5. Media upload, preview, copy-link, and delete flows work.
6. Contact details render correctly, and the contact submission API/admin inbox review work if that flow is in launch scope.
7. No unreviewed placeholder or demo content remains in launch-facing areas.

---
[« Previous](09-implementation-checklist.md) | [Next » (Back to Start)](../architect.md)
