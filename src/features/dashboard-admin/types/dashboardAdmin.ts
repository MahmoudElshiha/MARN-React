export type VerificationType = 'property' | 'contract'

export type VerificationStatus = 'pending' | 'approved' | 'rejected'

export type ManagedUserStatus = 'Active' | 'Suspended' | 'Banned'

export type UserActionType = 'ban' | 'suspend' | 'restore'

export interface AdminStat {
  key: 'users' | 'listings' | 'verifications' | 'contracts'
  label: string
  value: number
  change: string
  color: string
}

export interface RevenuePoint {
  month: string
  revenue: number
}

export interface PendingVerification {
  id: number
  userName: string
  propertyName: string
  date: string
  status: VerificationStatus
  type: VerificationType
}

export interface ManagedUser {
  id: number
  name: string
  email: string
  role: 'Tenant' | 'Owner'
  status: ManagedUserStatus
  joinDate: string
}

export interface ManagedAdmin {
  id: number
  username: string
  email: string
  joinDate: string
}

export interface RecentReport {
  id: number
  name: string
  date: string
  size: string
}

export interface AdminDashboardSummary {
  totalRevenue: number
  activeContracts: number
  newUsersThisMonth: number
}

export interface AdminDashboardData {
  stats: AdminStat[]
  revenueData: RevenuePoint[]
  summary: AdminDashboardSummary
  pendingVerifications: PendingVerification[]
  users: ManagedUser[]
  adminUsers: ManagedAdmin[]
  recentReports: RecentReport[]
}
