import type { TenantDashboardData } from '../types/dashboardTenant'
import { mockDashboardTenantService } from './mockDashboardTenantService'

/**
 * Tenant dashboard service - real API implementation.
 * Currently delegates to the mock adapter; replace with apiClient
 * calls once backend endpoints are available.
 */
export const dashboardTenantService = {
    getDashboard(): Promise<TenantDashboardData> {
        return mockDashboardTenantService.getDashboard()
    },
}
