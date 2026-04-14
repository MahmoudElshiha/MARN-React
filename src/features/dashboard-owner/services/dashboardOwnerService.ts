import type { OwnerDashboardData } from '../types/dashboardOwner'
import { mockDashboardOwnerService } from './mockDashboardOwnerService'

/**
 * Owner dashboard service - real API implementation.
 * Currently delegates to the mock adapter; replace with apiClient
 * calls once backend endpoints are available.
 */
export const dashboardOwnerService = {
  getDashboard(): Promise<OwnerDashboardData> {
    return mockDashboardOwnerService.getDashboard()
  },
}
