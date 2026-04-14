# FSD Gap Analysis and Migration Plan for MARN-Figma

## 1. Purpose
This plan compares the current project structure to the provided Feature-Sliced Design (FSD) rules and defines an incremental migration path that also prepares the codebase for replacing static/mock data with API calls.

## 2. Current State vs Target FSD

### Current state (observed)
- Most code lives under `src/app/`:
  - `src/app/pages/*` contains route pages, mock/static data, UI composition, and business logic mixed together.
  - `src/app/components/ui/*` contains reusable UI primitives (good base).
  - `src/app/components/*` contains layout and domain-ish components together.
- Routing is centralized in `src/app/App.tsx`.
- API/domain layers are mostly missing:
  - No structured `services/` for feature APIs.
  - No feature-local `hooks/` for async state and orchestration.
  - No domain `types/` organization.
  - No entities/features separation.
- Many pages depend on static arrays and hardcoded fixtures (properties, users, messages, contracts, dashboard stats).
- Alias `@` is configured in Vite (good foundation).

### Required target (from your guidelines)
- Split responsibilities by layers and slices:
  - `components/ui` (pure presentational primitives)
  - `components/shared` (layout/shared composition)
  - `components/features/<slice>/{components,hooks,services}` (domain logic and UI)
  - `pages` as thin route-level composition only
  - shared cross-feature `services`, `hooks`, `types`, `utils`, `lib`, `store`, `contexts`
- Replace mock/static data with service functions and feature hooks.
- Enforce import boundaries and naming conventions.

## 3. Gap Summary (What must change)

1. Pages are too heavy
- Business logic and mock data should move out of `pages` into feature hooks/services.

2. Missing feature slices
- There is no clear domain slicing for auth, properties, chat, contracts, admin, etc.

3. No API access layer contract
- No shared API client, endpoint modules, DTO mapping, or error normalization.

4. Shared vs domain components are mixed
- Components like navigation/footer/layout and domain cards/modals are in the same area.

5. Type ownership is unclear
- Domain types should live in feature folders first; global types only when truly shared.

6. Route composition should be thin
- Router should compose feature modules, not directly wire large page modules with mixed concerns.

## 4. Proposed Target Structure (Incremental, practical)

```
src/
  app/
    providers/
    routes/
    App.tsx
  pages/
    landing/
      LandingPage.tsx
    search/
      SearchPage.tsx
    ...
  components/
    ui/
      button/
      input/
      ...
    shared/
      Header/
      Footer/
      Navigation/
      Sidebar/
  features/
    auth/
      components/
      hooks/
      services/
      types/
    properties/
      components/
      hooks/
      services/
      types/
    bookings/
      components/
      hooks/
      services/
      types/
    chat/
      components/
      hooks/
      services/
      types/
    dashboard-owner/
      components/
      hooks/
      services/
      types/
    dashboard-tenant/
      components/
      hooks/
      services/
      types/
    dashboard-admin/
      components/
      hooks/
      services/
      types/
    profile/
      components/
      hooks/
      services/
      types/
    contracts/
      components/
      hooks/
      services/
      types/
  services/
    apiClient.ts
    httpErrors.ts
  hooks/
    useDebounce.ts
  types/
    common.ts
  lib/
    queryClient.ts
  utils/
  assets/
  styles/
```

Notes:
- Keep existing `src/app/components/ui/*` as is initially to reduce risk.
- Migrate UI primitives to folder-per-component only when you decide to adopt CSS Modules pattern.

## 5. Slice Mapping (Current pages -> future features)

- Auth
  - LoginPage, SignUpPage, ForgotPasswordPage, OTPVerificationPage
  - API: login/register/request-reset/verify-otp

- Properties
  - SearchPage, PropertyDetailsPage, AddPropertyPage, EditPropertyPage, PropertyByOwnerPage
  - API: list/search/get-by-id/create/update/my-properties

- Dashboards
  - TenantDashboard, OwnerDashboard, AdminDashboardPage
  - API: tenant summary, owner summary, admin stats, verifications, users

- Messaging/Chat
  - MessagesPage, ChatWithRentalRequestPage, ChatbotPage
  - API: conversations/messages/send/realtime hooks

- Profile
  - ProfileSettingsPage, ViewUserProfilePage, ViewOwnerProfilePage
  - API: profile get/update, verification docs upload

- Contracts/Bookings
  - ContractPage
  - API: contracts list/get/sign/status

- Shared content pages (can remain mostly page-level static for now)
  - AboutPage, FAQPage, TermsPage, PrivacyPage, ContactPage, HowItWorksPage

## 6. API Migration Strategy (Mock -> Real)

### Step A: Build a stable API foundation first
1. Create `src/services/apiClient.ts` with:
- base URL from env
- request/response interceptors (or equivalent wrapper)
- normalized error object
- timeout and auth token handling

2. Create per-feature service modules:
- `features/<slice>/services/*.ts`
- Services return typed DTOs and never manage React state.

3. Add type contracts:
- `features/<slice>/types/*.ts` for request/response and view-model mapping.

### Step B: Introduce feature hooks
- `useXxxQuery`, `useXxxMutation` (or plain async hooks if you avoid query libs).
- Hooks own loading/error/retry/cache behavior, pages/components only consume hook outputs.

### Step C: Replace static data slice by slice
For each slice:
1. Keep existing static data behind a temporary adapter (`mockService.ts`).
2. Switch feature hook from mock adapter to real API service.
3. Keep component API unchanged where possible.
4. Add fallback UI states: loading, empty, error, retry.

### Step D: Remove mock arrays from pages
- Delete static constants after each endpoint is integrated.
- Prevent reintroduction by lint rule or code review checklist.

## 7. Execution Plan (Phased)

This plan is intentionally split into **non-intersecting phases**. Each phase has a strict path scope and a no-touch list.

### Phase 0 - Baseline and Guardrails (1 day)
Scope:
- Architecture docs and migration guardrails only.

Allowed paths:
- `guidelines/**`
- `README.md`

No-touch paths:
- `src/**`

Deliverables:
- Finalized migration policy and boundary rules.
- Phase checklist template for PRs.

Exit criteria:
- Team agrees on phase boundaries and review checklist.

### Phase 1 - App Shell and Route Segmentation (1-2 days)
Scope:
- Routing structure only, no feature logic moves yet.

Allowed paths:
- `src/app/App.tsx`
- `src/app/routes/**`
- `src/pages/**` (wrapper pages only)

No-touch paths:
- `src/features/**`
- `src/services/**`
- `src/app/components/**`

Deliverables:
- Route config extracted into `src/app/routes`.
- Thin page wrappers created (delegating to existing page components).

Exit criteria:
- Same routes and behavior as before.
- Build/lint unchanged.

### Phase 2 - Shared API Infrastructure (1-2 days)
Scope:
- HTTP and shared API contracts only.

Allowed paths:
- `src/services/**`
- `src/lib/**`
- `src/types/**`
- `src/hooks/**` (shared, infra-only)

No-touch paths:
- `src/features/**`
- `src/pages/**`
- `src/app/components/**`

Deliverables:
- `apiClient.ts`, error normalization, auth header strategy, timeout strategy.
- Shared response/error types.

Exit criteria:
- Infra compiles and is unused-safe (no behavioral changes yet).

### Phase 3 - Properties Slice Migration (2-4 days)
Scope:
- Properties domain only.

Allowed paths:
- `src/features/properties/**`
- `src/pages/search/**`
- `src/pages/property-details/**`
- `src/pages/add-property/**`
- `src/pages/edit-property/**`
- `src/pages/property-by-owner/**`

No-touch paths:
- `src/features/auth/**`
- `src/features/dashboard-*/**`
- `src/features/chat/**`
- `src/features/profile/**`
- `src/features/contracts/**`

Deliverables:
- Property services, hooks, and feature components.
- Replacement of static property arrays with service-backed hooks.

Exit criteria:
- Search/details/add/edit/property-owner screens use feature hooks/services.
- No property mock arrays left in corresponding page wrappers.

### Phase 4 - Auth Slice Migration (1-2 days)
Scope:
- Auth and account-entry flows only.

Allowed paths:
- `src/features/auth/**`
- `src/pages/login/**`
- `src/pages/signup/**`
- `src/pages/forgot-password/**`
- `src/pages/otp-verification/**`

No-touch paths:
- `src/features/properties/**`
- Dashboards/chat/profile/contracts feature paths.

Deliverables:
- Auth services and hooks wired to pages.
- Mock auth behavior removed.

Exit criteria:
- Login/signup/forgot/otp all consume `features/auth` only.

### Phase 5 - Dashboard Slice Migration (2-4 days)
Scope:
- Tenant and owner dashboards only.

Allowed paths:
- `src/features/dashboard-tenant/**`
- `src/features/dashboard-owner/**`
- `src/pages/tenant-dashboard/**`
- `src/pages/owner-dashboard/**`

No-touch paths:
- `src/features/dashboard-admin/**`
- `src/features/chat/**`
- `src/features/profile/**`
- `src/features/contracts/**`

Deliverables:
- Dashboard services/hooks with API-backed stats/cards/lists.

Exit criteria:
- Tenant/owner dashboard pages are composition-only.

### Phase 6 - Admin and Contracts Migration (2-3 days)
Scope:
- Admin dashboard and contracts only.

Allowed paths:
- `src/features/dashboard-admin/**`
- `src/features/contracts/**`
- `src/pages/admin-dashboard/**`
- `src/pages/contract/**`

No-touch paths:
- `src/features/chat/**`
- `src/features/profile/**`

Deliverables:
- Admin metrics/user-management services/hooks.
- Contracts service and UI orchestration via hooks.

Exit criteria:
- Admin/contracts pages use only their feature modules.

### Phase 7 - Chat and Profile Migration (2-3 days)
Scope:
- Messaging/chatbot/profile/owner-user profile views only.

Allowed paths:
- `src/features/chat/**`
- `src/features/profile/**`
- `src/pages/messages/**`
- `src/pages/chat-with-rental-request/**`
- `src/pages/chatbot/**`
- `src/pages/profile-settings/**`
- `src/pages/view-user-profile/**`
- `src/pages/view-owner-profile/**`

No-touch paths:
- `src/features/dashboard-*/**`
- `src/features/contracts/**`

Deliverables:
- Chat and profile services/hooks, including upload endpoints for docs/avatar where needed.

Exit criteria:
- Chat/profile pages no longer keep domain mock arrays inline.

### Phase 8 - Shared/Layout and Rule Enforcement (1-2 days)
Scope:
- Final cross-cutting cleanup only.

Allowed paths:
- `src/components/shared/**`
- `src/components/ui/**` (only if needed)
- `eslint.config.js`
- `tsconfig*.json` (if alias/boundary config needed)

No-touch paths:
- `src/features/**` (except import-path adjustments)
- `src/pages/**` (except import-path adjustments)

Deliverables:
- Shared layout consolidation (`Header`, `Footer`, `Navigation`, `Sidebar`).
- Import boundary lint rules enforced.

Exit criteria:
- CI fails on boundary violations.
- Architecture constraints are machine-enforced.

### Phase Handoff Rule (applies to every phase)
- A phase can start only after previous phase exit criteria are met.
- If a task requires paths outside the current phase scope, defer it to that owning phase.
- Each phase must end with: `npm run lint`, `npm run build`, and a short migration note.

## 8. Import Boundary Rules to Enforce

- `pages` may import from `features` and `components/shared` only.
- `features` may import from `components/ui`, `hooks`, `services`, `types`, `utils`.
- `components/ui` may not import from `features`, `pages`, or feature services.
- Feature-to-feature direct imports are disallowed unless moved to shared layer.

## 9. Risks and Mitigations

1. Big-bang refactor risk
- Mitigation: migrate one feature slice at a time with adapters.

2. API not ready yet
- Mitigation: service interfaces first + mock adapters with same signatures.

3. Routing breakage during moves
- Mitigation: keep page entry files stable; refactor internals first.

4. Type drift between backend and UI
- Mitigation: strict DTO types and mapping functions in feature services.

## 10. Definition of Done for migration

- No major page stores domain mock arrays directly.
- Every API-backed flow uses `feature services -> feature hooks -> feature components -> page composition`.
- Shared UI primitives remain domain-agnostic.
- Import boundaries enforced by lint and respected in PR review.
- Build and lint pass; critical route smoke tests pass.

## 11. Immediate next actions (recommended this week)

1. Execute Phase 1 only: extract route config into `src/app/routes` and create thin page wrappers without touching feature logic.
2. Execute Phase 2 only: add `src/services/apiClient.ts`, shared API error model, and shared type contracts.
3. Execute Phase 3 only: migrate properties slice end-to-end (services, hooks, feature components, page wrappers).
4. Do not start auth/dashboard/chat/profile/contracts until their dedicated phases begin.
5. Close each phase with lint/build and a migration note before moving to the next phase.
