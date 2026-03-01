# SPEC.md — CareerConnect Full System Audit & Enhancement Plan

> **Status:** FINALIZED  
> **Date:** 2026-03-01  
> **Author:** GSD Principal Architect & Lead QA

---

## 1. Executive Summary

CareerConnect is a multi-role career networking platform (MERN stack) with 7 user roles, admin panel, opportunity posting, connection requests, notifications, testimonials, and announcements. This specification documents every flaw, bottleneck, and enhancement opportunity found during a comprehensive full-stack audit.

---

## 2. Bugs & Functional Issues

### 2.1 Backend — Critical

| ID | Severity | File | Issue |
|----|----------|------|-------|
| B-01 | **HIGH** | `connectionController.js` | **No Notification record created** when admin approves/rejects a connection. Emails fire but no in-app `Notification` document is inserted — the notification bell in the frontend will always be empty for connection events. |
| B-02 | **HIGH** | `connectionController.js` | `Promise.allSettled().catch()` is an anti-pattern — `allSettled` never rejects, so the `.catch()` is dead code. Should use `Promise.all().catch()` or remove the `.catch()`. |
| B-03 | **HIGH** | `server.js` | CORS origin hardcoded to `http://localhost:5173`. Will break in production or any non-default port. Must use `process.env.CLIENT_URL`. |
| B-04 | **MEDIUM** | `api.ts` | 401 interceptor uses `window.location.href = '/auth'` (full page reload) instead of React Router `navigate()`. Causes loss of SPA state and bypasses the flicker-free logout previously implemented in `AuthContext`. |
| B-05 | **MEDIUM** | `announcementController.js` | Only `getActiveAnnouncements` exists — no CRUD endpoints for admin. Admin cannot create, edit, or delete announcements via the API. |
| B-06 | **MEDIUM** | `testimonialController.js` | `isApproved: true` is hardcoded — testimonials auto-approve. No admin approval workflow exists despite the schema having `isApproved` field. |
| B-07 | **LOW** | `userController.js` | `bcrypt` is imported but only used if `password` is in `req.body` — import is fine, but the function allows users to change their password via profile update without requiring the current password (security risk). |

### 2.2 Backend — Missing Features

| ID | Feature | Impact |
|----|---------|--------|
| M-01 | No `updateOpportunity` endpoint | Facilitators cannot edit posted opportunities |
| M-02 | No admin CRUD for Announcements | Admin has no way to create/edit/delete announcements |
| M-03 | No admin approval workflow for Testimonials | Testimonials bypass moderation |
| M-04 | No `deleteNotification` or `clearAll` endpoint | Users cannot manage notifications |
| M-05 | No pagination on any GET endpoint | All queries return unbounded result sets — will degrade with scale |
| M-06 | No rate limiting middleware | All API endpoints vulnerable to abuse |
| M-07 | No input sanitization beyond Mongoose | XSS vectors possible in user-submitted text |

### 2.3 Frontend — Routing & Navigation

| ID | Severity | Issue |
|----|----------|-------|
| F-01 | **HIGH** | No catch-all `*` route in `AppRouting.tsx` — navigating to an unknown URL shows a blank page instead of a 404 |
| F-02 | **MEDIUM** | Admin panel has no "Manage Announcements" or "Manage Testimonials" page — these features exist in the backend schema but have no UI |
| F-03 | **LOW** | `FeaturedOpportunities` on landing page only visible to seekers — facilitators and guests see no opportunity preview |

### 2.4 Frontend — Code Quality

| ID | Issue | Files |
|----|-------|-------|
| C-01 | Console statements in production code | `AuthPage.tsx`, `ErrorBoundary.tsx` |
| C-02 | `test-avatar-persistence.mjs` in backend root | Should be in `tests/` directory |
| C-03 | No automated tests | `package.json` test script is `echo "Error"` placeholder |
| C-04 | Build artifact / debug files in frontend root | `build_errors.txt`, `tsc-errors.log` etc. |

---

## 3. UI/UX Elevation Plan

### 3.1 Current State Assessment

The current design uses Tailwind CSS v4 with a clean, functional aesthetic:
- **Color palette:** `#2563EB` (primary blue), `#0D9488` (teal secondary), `#F97316` (orange accent) — competent but generic
- **Cards:** Flat white with subtle shadows — functional but not premium
- **Animations:** Basic `fade-in-up` and `slideDown` — adequate but not engaging
- **Dark mode:** Not implemented (no dark variant tokens)
- **Glassmorphism:** Not present
- **Mobile responsiveness:** Partial — dashboards need work

### 3.2 Targeted Enhancements

| Area | Current | Planned Enhancement |
|------|---------|---------------------|
| **Color System** | 3 flat tokens | Rich gradient palette with HSL-paired light/dark shades, role-specific accent colors |
| **Card Components** | Flat white + shadow | Soft glassmorphism (`backdrop-blur`, frosted borders), subtle 3D lift on hover, gradient accent borders |
| **Hero Section** | Static gradient blur | Animated gradient mesh background, floating particle effects, 3D text shadow |
| **Navbar** | Solid white + shadow | Glass navbar with `backdrop-blur-xl`, smooth scroll-based opacity transitions |
| **Buttons** | Flat colored | Gradient fills with shine sweep animation, subtle press depth effect |
| **Dashboard Tabs** | Basic active-state highlight | Animated underline slider, icon micro-animations on selection |
| **Modals & Drawers** | Basic slide-in | Spring physics animations, frosted glass backdrop, scale-and-fade entrance |
| **Form Inputs** | Standard bordered | Floating labels, focus ring glow, smooth validation state transitions |
| **Loading States** | Spinner/text | Skeleton shimmer screens, pulsing gradient placeholders |
| **Scrollbar** | Styled (good) | Already customized — maintain |
| **Typography** | System/Tailwind default | Import premium Google Font (Inter or Geist) |
| **Mobile** | Basic responsive | Bottom navigation bar, swipeable tabs, touch-optimized card sizing |
| **Dark Mode** | Not present | Full dark theme with auto-detect preference |

### 3.3 Landing Page Specific

- Hero: Animated gradient mesh + floating geometry → premium first impression
- Testimonials carousel: Auto-rotating 3D card fan with glassmorphism
- CTA buttons: Gradient pill with animated arrow + shine sweep
- Stats counter: Animated number counting on scroll-into-view

---

## 4. Backend Refactoring Opportunities

### 4.1 DRY Violations

| Pattern | Files Affected | Solution |
|---------|---------------|----------|
| Repeated `try/catch + console.error + res.status(500)` in every controller function | All 7 controllers | Create `asyncHandler` wrapper utility |
| Duplicate role arrays in routes (`'organization', 'professor', 'professional', 'recruiter', 'others', 'admin'`) | `opportunityRoutes.js`, `userRoutes.js` | Extract `FACILITATOR_ROLES` constant |
| Inconsistent error response shape (`{ message }` vs `{ error }` vs `{ message, error }`) | Multiple controllers | Standardize on `{ success, message, data? }` response envelope |

### 4.2 Performance Opportunities

| Area | Issue | Solution |
|------|-------|----------|
| No pagination | All list endpoints return full dataset | Add `?page=&limit=` query params with Mongoose `skip/limit` |
| No query caching | Repeated identical queries hit DB | Add short-TTL in-memory cache for talent pool / opportunities |
| No indexes documented | Schema has no explicit index definitions | Add compound indexes on frequently queried fields |

### 4.3 Security Hardening

| Issue | Solution |
|-------|----------|
| No rate limiting | Add `express-rate-limit` middleware |
| No input sanitization | Add `express-mongo-sanitize` for NoSQL injection prevention |
| Password changeable without current password verification | Require `currentPassword` field in profile update |
| JWT secret not rotated | Implement token refresh mechanism |
| CORS hardcoded | Use `CLIENT_URL` from env |

---

## 5. Technical Debt Resolution

1. Remove `test-avatar-persistence.mjs` from backend root → `tests/`
2. Remove debug files from frontend root (`build_errors.txt`, `tsc-errors.log`)
3. Strip remaining `console.log/error` from frontend production code
4. Add proper `.gitignore` entries for build artifacts
5. Set up placeholder test infrastructure (Vitest for frontend, Jest for backend)
