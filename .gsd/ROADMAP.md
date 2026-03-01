# ROADMAP.md — CareerConnect Enhancement Roadmap

> **Spec Reference:** `.gsd/SPEC.md` (FINALIZED)  
> **Created:** 2026-03-01  
> **Total Phases:** 5

---

## Phase 1: Bug Fixes & Critical Repairs

**Goal:** Fix all broken functionality identified in the audit before any new work begins.

**Deliverables:**
- Fix B-01: Create `Notification` documents on connection approval/rejection
- Fix B-02: Replace `Promise.allSettled().catch()` with `Promise.all().catch()` in `connectionController.js`
- Fix B-03: Use `process.env.CLIENT_URL` for CORS origin in `server.js`
- Fix B-04: Replace `window.location.href` with React Router navigation in `api.ts` 401 interceptor
- Fix F-01: Add catch-all `*` route with proper 404 page in `AppRouting.tsx`
- Fix C-01: Remove `console.log/error` from `AuthPage.tsx`
- Fix C-02: Move `test-avatar-persistence.mjs` to `tests/`
- Fix C-04: Remove debug files (`build_errors.txt`, `tsc-errors.log`) + add to `.gitignore`

**Status:** ✅ COMPLETE

---

## Phase 2: Backend Enhancement & Security Hardening

**Goal:** Apply DRY refactoring, add missing endpoints, and harden security.

**Deliverables:**
- Create `asyncHandler` wrapper to DRY up controller try/catch blocks
- Extract `FACILITATOR_ROLES` constant for route authorization
- Standardize API response envelope: `{ success, message, data? }`
- Add `updateOpportunity` endpoint (M-01)
- Add full Announcement CRUD endpoints for admin (M-02)
- Add Testimonial admin approval/rejection workflow (M-03)
- Add `deleteNotification` and `clearAllNotifications` endpoints (M-04)
- Add pagination query params to all list endpoints (M-05)
- Install & configure `express-rate-limit` (M-06)
- Install & configure `express-mongo-sanitize` (M-07)
- Require current password verification for profile password changes (B-07)
- Add corresponding `apiService.ts` functions for all new endpoints

**Status:** Not started

---

## Phase 3: Admin Panel Completion

**Goal:** Build missing admin UI pages and wire them to the new backend endpoints.

**Deliverables:**
- Create "Manage Announcements" admin page (CRUD: create, edit, toggle active, delete)
- Create "Manage Testimonials" admin page (approve/reject moderation queue)
- Add notification management in admin dashboard (total counts, system-wide broadcast)
- Update `AdminLayout.tsx` sidebar with new navigation items
- Update `AppRouting.tsx` with new admin subroutes

**Status:** Not started

---

## Phase 4: UI/UX Elevation

**Goal:** Transform the current functional design into a visually stunning, premium experience.

**Deliverables:**
- **Design System Overhaul:** Import Inter/Geist font, extend color palette with HSL gradients, add role-specific accent colors
- **Glassmorphism & 3D Effects:** Add `backdrop-blur` glass cards, frosted borders, 3D hover lifts, gradient accent borders
- **Navbar Polish:** Glass navbar with blur, scroll-based opacity, smooth transitions
- **Hero Section Redesign:** Animated gradient mesh, floating geometry, premium CTA buttons with shine sweep
- **Dashboard Tabs:** Animated underline slider, icon micro-animations
- **Form UX:** Floating labels, focus glow rings, smooth validation transitions
- **Loading States:** Skeleton shimmer screens replacing spinners
- **Modals & Drawers:** Spring physics animations, glassmorphism backdrop
- **Mobile Optimization:** Bottom nav bar for mobile, swipeable dashboard tabs, touch-optimized card/form sizing
- **Dark Mode:** Full dark theme with system preference detection + manual toggle
- **Testimonials Section:** 3D rotating card carousel with glass effect
- **Scroll Animations:** Intersection Observer-triggered `fade-in-up` for all landing page sections

**Status:** Not started

---

## Phase 5: Testing & Final Polish

**Goal:** Set up proper test infrastructure and perform final code cleanup.

**Deliverables:**
- Set up Vitest for frontend unit/integration tests
- Set up Jest for backend API tests
- Write core test suites: auth flow, opportunity CRUD, connection workflow
- Final `console.log` sweep
- Performance audit (Lighthouse scores)
- Responsive design audit across breakpoints (mobile/tablet/desktop)
- SEO meta tags on all public pages (Landing, Auth, Privacy, Terms, Contact)

**Status:** Not started

---

## Execution Order & Dependencies

```
Phase 1 (Bug Fixes)
    ↓
Phase 2 (Backend Enhancement)
    ↓
Phase 3 (Admin Panel)   ← depends on Phase 2 endpoints
    ↓
Phase 4 (UI/UX Elevation)   ← independent, can partially overlap with Phase 3
    ↓
Phase 5 (Testing & Polish)  ← final validation of all above
```

---

## Estimated Scope

| Phase | Estimated Plans | Complexity |
|-------|----------------|------------|
| 1 | 2-3 plans | Low-Medium |
| 2 | 3-4 plans | Medium-High |
| 3 | 2-3 plans | Medium |
| 4 | 4-5 plans | High |
| 5 | 2-3 plans | Medium |
| **Total** | **13-18 plans** | — |
