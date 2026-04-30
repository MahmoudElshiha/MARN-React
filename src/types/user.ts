export type UserRole = 'tenant' | 'owner' | 'admin'

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: UserRole
  avatarUrl?: string
}
