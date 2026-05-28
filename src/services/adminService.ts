import { apiClient } from './apiClient'
import type { ApiResponse, SearchPaginatedResponse } from '@/types/common'

export interface AdminStatMetric {
  value: number
  trendPercentage: number
}

export interface AdminRevenueSummary {
  totalRevenue: number
  totalSales: number
  newUsersThisMonth: number
  activeContracts: number
  revenueTrendPercentage: number
}

export interface AdminContractSummary {
  all: number
  active: number
  pending: number
  expired: number
  cancelled: number
}

export interface AdminMonthlyRevenue {
  year: number
  month: number
  label: string
  revenue: number
  sales: number
}

export interface AdminStats {
  totalUsers: AdminStatMetric
  totalProperties: AdminStatMetric
  pendingVerifications: AdminStatMetric
  totalContracts: AdminStatMetric
  revenueSummary: AdminRevenueSummary
  contractSummary: AdminContractSummary
  monthlyRevenue: AdminMonthlyRevenue[]
}

export interface AdminUser {
  id: string
  name: string
  email: string
  role: string
  status: string
  joinDate: string
}

export interface AdminUserStatsItem {
  userId: string
  fullName: string
  email: string
  profileImage: string | null
  accountStatus: string
  accountStatusDisplayName: string
  isDeleted: boolean
  createdAt: string
  roles: string[]
  rolesDisplayNames: string[]
  ownedPropertiesCount: number
  activePropertiesCount: number
  renterContractsCount: number
  ownerContractsCount: number
  activeContractsCount: number
  cancelledContractsCount: number
  paymentsMadeCount: number
  paymentsReceivedCount: number
  totalPaidAmount: number
  totalReceivedAmount: number
  reportsSubmittedCount: number
  reportsAgainstUserCount: number
}

export interface AdminStatusBreakdown {
  status: string
  statusDisplayName: string
  count: number
}

export interface AdminRoleBreakdown {
  roleName: string
  roleNameDisplayName: string
  count: number
}

export interface AdminNewUsersOverTime {
  periodStartUtc: string
  label: string
  count: number
}

export interface AdminUserStats {
  appliedPeriod: {
    period: string
    fromUtc: string | null
    toUtc: string | null
    grouping: string
  }
  totalUsers: number
  deletedUsers: number
  statusBreakdown: AdminStatusBreakdown[]
  roleBreakdown: AdminRoleBreakdown[]
  newUsersOverTime: AdminNewUsersOverTime[]
  users: {
    items: AdminUserStatsItem[]
    pageNumber: number
    pageSize: number
    totalCount: number
    totalPages: number
  }
}

export interface PendingUserVerification {
  userId: string
  fullName: string
  email: string
  phoneNumber: string | null
  profileImage: string | null
  createdAt: string
  accountStatus: string
  accountStatusDisplayName: string
  frontIdPhoto: string | null
  backIdPhoto: string | null
  arabicFullName: string | null
  arabicAddress: string | null
  nationalIDNumber: string | null
}

export const adminService = {
  getStats: () =>
    apiClient.get<ApiResponse<AdminStats>>('/api/Admin/dashboard/overview'),

  getUsers: (page = 1, pageSize = 20) =>
    apiClient.get<ApiResponse<SearchPaginatedResponse<AdminUser>>>(
      `/api/Admin/users?pageNumber=${page}&pageSize=${pageSize}`,
    ),

  getUserStats: (page = 1, pageSize = 20) =>
    apiClient.get<ApiResponse<AdminUserStats>>(
      `/api/Admin/stats/users?pageNumber=${page}&pageSize=${pageSize}`,
    ),

  getVerifications: (page = 1, pageSize = 20) =>
    apiClient.get<ApiResponse<SearchPaginatedResponse<PendingUserVerification>>>(
      `/api/Admin/verifications/users/pending?pageNumber=${page}&pageSize=${pageSize}`,
    ),

  getUserVerification: (userId: string) =>
    apiClient.get<ApiResponse<PendingUserVerification>>(
      `/api/Admin/verifications/users/${userId}`,
    ),

  approveVerification: (userId: string) =>
    apiClient.patch<ApiResponse<boolean>>(`/api/Admin/verifications/users/${userId}/approve`),

  rejectVerification: (userId: string, reason: string) =>
    apiClient.patch<ApiResponse<boolean>>(`/api/Admin/verifications/users/${userId}/decline`, { reason }),

  banUser: (userId: string) =>
    apiClient.post<ApiResponse<void>>(`/api/Admin/users/${userId}/ban`),

  suspendUser: (userId: string) =>
    apiClient.post<ApiResponse<void>>(`/api/Admin/users/${userId}/suspend`),

  restoreUser: (userId: string) =>
    apiClient.post<ApiResponse<void>>(`/api/Admin/users/${userId}/restore`),
}
