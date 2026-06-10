import type { User, UserRole } from '@/types/user'

const CLAIM_ID =
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
const CLAIM_EMAIL =
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
const CLAIM_ROLE =
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'

// ASP.NET Identity returns role as a plain string when there is one role, or
// as a string[] when the user has multiple roles. Handle both shapes.
function pickRole(raw: string | string[] | undefined): UserRole {
  const roles = Array.isArray(raw)
    ? raw.map((r) => r.toLowerCase())
    : typeof raw === 'string'
      ? [raw.toLowerCase()]
      : []

  // Priority: admin > owner > tenant (server calls it "renter")
  if (roles.includes('admin')) return 'admin'
  if (roles.includes('owner')) return 'owner'
  return 'tenant'
}

export function decodeUserFromToken(token: string): User {
  const payloadB64Url = token.split('.')[1]
  // Convert base64url to standard base64
  const base64 = payloadB64Url.replace(/-/g, '+').replace(/_/g, '/')

  // Safely decode base64 that might contain non-ASCII characters
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join(''),
  )

  const payload = JSON.parse(jsonPayload) as Record<
    string,
    string | string[] | undefined
  >

  const rawRole =
    payload[CLAIM_ROLE] ??
    payload['role'] ??
    payload['roles'] ??
    payload['Role']
  const rawId =
    payload[CLAIM_ID] ??
    payload['sub'] ??
    payload['nameid'] ??
    payload['id'] ??
    payload['Id']
  const rawEmail = payload[CLAIM_EMAIL] ?? payload['email'] ?? payload['Email']

  return {
    id: (rawId as string) ?? '',
    email: (rawEmail as string) ?? '',
    role: pickRole(rawRole),
    firstName: '',
    lastName: '',
  }
}
