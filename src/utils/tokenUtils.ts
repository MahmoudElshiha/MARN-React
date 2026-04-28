import type { User, UserRole } from '@/types/user'

const CLAIM_ID =
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
const CLAIM_EMAIL =
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
const CLAIM_ROLE =
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'

function mapRole(serverRole: string): UserRole {
  switch (serverRole.toLowerCase()) {
    case 'renter':
      return 'tenant'
    case 'owner':
      return 'owner'
    case 'admin':
      return 'admin'
    default:
      return 'tenant'
  }
}

export function decodeUserFromToken(token: string): User {
  const payloadB64 = token.split('.')[1]
  const payload = JSON.parse(atob(payloadB64)) as Record<string, string>

  return {
    id: payload[CLAIM_ID] ?? payload['sub'] ?? '',
    email: payload[CLAIM_EMAIL] ?? '',
    role: mapRole(payload[CLAIM_ROLE] ?? ''),
    firstName: '',
    lastName: '',
  }
}
