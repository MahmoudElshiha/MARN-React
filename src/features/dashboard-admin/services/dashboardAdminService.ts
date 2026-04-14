import type {
  AdminDashboardData,
  ManagedUserStatus,
  UserActionType,
} from '../types/dashboardAdmin'
import { mockDashboardAdminService } from './mockDashboardAdminService'

/**
 * Admin dashboard service - real API implementation.
 * Currently delegates to the mock adapter; replace with apiClient
 * calls once backend endpoints are available.
 */
export const dashboardAdminService = {
  getDashboard(): Promise<AdminDashboardData> {
    return mockDashboardAdminService.getDashboard()
  },

  approveVerification(id: number): Promise<{ id: number }> {
    return mockDashboardAdminService.approveVerification(id)
  },

  rejectVerification(id: number): Promise<{ id: number }> {
    return mockDashboardAdminService.rejectVerification(id)
  },

  downgradeAdmin(id: number): Promise<{ id: number }> {
    return mockDashboardAdminService.downgradeAdmin(id)
  },

  updateUserStatus(
    id: number,
    action: UserActionType,
  ): Promise<{ id: number; status: ManagedUserStatus }> {
    return mockDashboardAdminService.updateUserStatus(id, action)
  },
}
