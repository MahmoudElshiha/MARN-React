# Refactoring Plan — MARN React

## Current State (Done)

| Area | File | Status |
|------|------|--------|
| HTTP client | `src/services/apiClient.ts` | ✅ Done |
| Error classes | `src/services/httpErrors.ts` | ✅ Done |
| Base types | `src/types/common.ts` | ✅ Done |
| User type | `src/types/user.ts` | ✅ Done |
| Auth context | `src/context/authContext.ts` + `AuthProvider.tsx` | ✅ Done |
| Auth hook | `src/hooks/useAuth.ts` | ✅ Done |
| Debounce hook | `src/hooks/useDebounce.ts` | ✅ Done |
| Enum hook | `src/hooks/useEnumOptions.ts` | ✅ Done |
| Providers setup | `src/main.tsx` | ✅ Done — QueryClient + AuthProvider |

---

## What to Build Next

### 1. Domain Types — `src/types/` ✅ Done

```
property.ts     → Property, PropertyStatus, PropertyFilters, Amenity   ✅
rental.ts       → Rental, RentalStatus, BookingRequest, Contract        ✅
message.ts      → Conversation, Message                                 ✅
```

### 2. Service Layer — `src/services/` ✅ Done

Each service calls `apiClient` and returns typed data. No logic, no state.

```
authService.ts        → login(), register(), forgotPassword(), resetPassword(), verifyOtp()   ✅
propertyService.ts    → getProperties(filters), getPropertyById(id), createProperty(), updateProperty(), deleteProperty()   ✅
userService.ts        → getProfile(), updateProfile(), uploadAvatar()   ✅
rentalService.ts      → getBookingRequests(), acceptRequest(), rejectRequest(), getContracts()   ✅
adminService.ts       → getStats(), getUsers(), getVerifications(), banUser(), suspendUser()   ✅
messageService.ts     → getConversations(), getMessages(conversationId), sendMessage()   ✅
```

### 3. Feature Hooks — `src/hooks/` ✅ Done

One hook file per domain. Each wraps a service call in `useQuery` or `useMutation`.

```
useAuth.ts            → ✅ Done (context consumer)
useLogin.ts           → useMutation → authService.login()               ✅
useRegister.ts        → useMutation → authService.register()            ✅
useProperties.ts      → useQuery → propertyService.getProperties(filters)   ✅
useProperty.ts        → useQuery → propertyService.getPropertyById(id)  ✅
useProfile.ts         → useQuery + useMutation → userService.*          ✅
useBookingRequests.ts → useQuery → rentalService.getBookingRequests()   ✅
useConversations.ts   → useQuery → messageService.getConversations()    ✅ (also useMessages, useSendMessage)
useAdminStats.ts      → useQuery → adminService.getStats()              ✅ (also useAdminUsers, useAdminVerifications)
```

---

## Page-by-Page: Static Data to Replace with API

### High priority (core user flows)

| Page | Static data to replace | Hook to use | Status |
|------|------------------------|-------------|--------|
| `SearchPage` | `PROPERTIES` array | `useProperties(filters)` | ✅ Done |
| `PropertyDetailsPage` | `PROPERTY_IMAGES`, all property fields | `useProperty(id)` | ✅ Done |
| `LandingPage` | `FEATURED_PROPERTIES`, `TESTIMONIALS` | `useProperties({ featured: true })` | ⬜ |
| `OwnerDashboard` | `BOOKING_REQUESTS`, `MY_PROPERTIES`, `CONTRACTS_HISTORY` | `useBookingRequests()`, `useContracts()`, `useProperties()` | ✅ Done (earnings chart still static) |
| `TenantDashboard` | Current rental, saved properties, notifications | `useProfile()`, `useProperties()` | ⬜ |
| `ProfileSettingsPage` | Initial form values | `useProfile()` | ⬜ |
| `AdminDashboardPage` | `stats`, `revenueData`, `pendingVerifications`, `users` | `useAdminStats()` | ⬜ |

### Medium priority

| Page | Static data to replace | Hook to use |
|------|------------------------|-------------|
| `PropertyByOwnerPage` | `RENTAL_REQUESTS` | `useBookingRequests()` |
| `MessagesPage` | `CONVERSATIONS`, `MESSAGES` | `useConversations()` |
| `ChatWithRentalRequestPage` | `MESSAGES` | `useMessages(conversationId)` |
| `ContractPage` | All contract fields | `useContract(id)` |

### Low priority (mostly UI/content — may stay static)

| Page | Note |
|------|------|
| `AboutPage` | `values`, `team` — CMS or keep static |
| `FAQPage` | `categories` — CMS or keep static |
| `HowItWorksPage` | `tenantSteps`, `ownerSteps` — keep static |
| `ContactPage` | `contactMethods` — keep static |

---

## Things to Keep in Mind

### Route params are not wired up
No page currently uses `useParams()`. Routes like `/property/:id` exist in `App.tsx` but
`PropertyDetailsPage` ignores the `:id`. When replacing static data, every detail page
needs `const { id } = useParams()` to know what to fetch.

### Login always navigates to `/tenant-dashboard` ✅ Done
`LoginPage` now uses `useLogin` and navigates based on `user.role`. OTPVerificationPage
still has a hardcoded `/tenant-dashboard` redirect — needs updating when OTP flow is wired.

### No route protection exists ✅ Done
`ProtectedRoute` created at `src/app/components/ProtectedRoute.tsx`.
Supports both unauthenticated blocking and role-based blocking via `roles` prop:
```tsx
// blocks unauthenticated users
<ProtectedRoute><TenantDashboard /></ProtectedRoute>

// blocks wrong roles
<ProtectedRoute roles={['admin']}><AdminDashboardPage /></ProtectedRoute>
```
Still needs to be wired into `App.tsx` routes.

### STEPS and AMENITIES are duplicated ✅ Done
Extracted to `src/constants/property.ts` as `PROPERTY_STEPS` and `PROPERTY_AMENITIES`.
Both `AddPropertyPage` and `EditPropertyPage` now import from there.

### ProfileSettingsPage has a hardcoded countries list ✅ Done
Moved to `src/constants/options.ts` as `COUNTRIES` and `FIELD_OF_STUDY_OPTIONS`.
`ProfileSettingsPage` now imports from there.

### setTimeout in ForgotPasswordPage and ChatbotPage
`ForgotPasswordPage` simulates an API call with `setTimeout`. Replace with a real
`useMutation` call to `authService.forgotPassword()`.
`ChatbotPage` simulates a bot reply with `setTimeout`. Replace when the chatbot endpoint exists.

### useEnumOptions uses a manual Map cache
It works, but it's inconsistent with the React Query setup. When time allows, migrate to:
```ts
useQuery({
  queryKey: ['enum', endpoint],
  queryFn: () => apiClient.get<ApiResponse<EnumOption[]>>(`/Enum/${endpoint}`),
  staleTime: Infinity,
})
```

### Token storage strategy
The `AuthProvider` stores either in `localStorage` (remember me) or `sessionStorage`.
The `apiClient` interceptor reads from both. This is intentional — don't change the
interceptor to read from only one.

### React Query staleTime
Default is set to 5 minutes in `main.tsx`. Override per-hook for data that changes
frequently (messages, notifications → lower) or rarely (enums, property details → higher/Infinity).
