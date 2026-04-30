import { apiClient } from './apiClient'
import type { ApiResponse, PaginatedResponse } from '@/types/common'
import type { User } from '@/types/user'

export interface AdminStats {
  totalUsers: number
  totalListings: number
  pendingVerifications: number
  activeContracts: number
  revenueData: { month: string; revenue: number }[]
}

export interface PendingVerification {
  id: number
  userId?: string
  userName: string
  propertyId?: string
  propertyName: string
  date: string
  status: 'pending' | 'approved' | 'rejected'
  type: 'property' | 'identity'
}

export const adminService = {
  getStats: () => apiClient.get<ApiResponse<AdminStats>>('/Admin/stats'),

  getUsers: (page = 1, pageSize = 20) =>
    apiClient.get<PaginatedResponse<User>>(
      `/Admin/users?page=${page}&pageSize=${pageSize}`,
    ),

  getVerifications: () =>
    apiClient.get<PaginatedResponse<PendingVerification>>(
      '/Admin/verifications',
    ),

  approveVerification: (id: number) =>
    apiClient.post<ApiResponse<void>>(`/Admin/verifications/${id}/approve`),

  rejectVerification: (id: number) =>
    apiClient.post<ApiResponse<void>>(`/Admin/verifications/${id}/reject`),

  banUser: (userId: string) =>
    apiClient.post<ApiResponse<void>>(`/Admin/users/${userId}/ban`),

  suspendUser: (userId: string) =>
    apiClient.post<ApiResponse<void>>(`/Admin/users/${userId}/suspend`),

  restoreUser: (userId: string) =>
    apiClient.post<ApiResponse<void>>(`/Admin/users/${userId}/restore`),
}
