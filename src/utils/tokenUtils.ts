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
  const payloadB64 = token.split('.')[1]
  const payload = JSON.parse(atob(payloadB64)) as Record<
    string,
    string | string[]
  >

  return {
    id: (payload[CLAIM_ID] as string) ?? (payload['sub'] as string) ?? '',
    email: (payload[CLAIM_EMAIL] as string) ?? '',
    role: pickRole(payload[CLAIM_ROLE]),
    firstName: '',
    lastName: '',
  }
}
