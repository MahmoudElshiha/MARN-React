import { useEffect, useState } from 'react'
import { normalizeError } from '@/services/httpErrors'
import type { ApiError } from '@/types/common'
import { dashboardTenantService } from '../services/dashboardTenantService'
import type { TenantDashboardData } from '../types/dashboardTenant'

interface State {
    dashboard: TenantDashboardData | null
    loading: boolean
    error: ApiError | null
}

export function useTenantDashboard() {
    const [state, setState] = useState<State>({
        dashboard: null,
        loading: true,
        error: null,
    })

    useEffect(() => {
        let cancelled = false

        dashboardTenantService
            .getDashboard()
            .then((dashboard) => {
                if (!cancelled) {
                    setState({ dashboard, loading: false, error: null })
                }
            })
            .catch((err: unknown) => {
                if (!cancelled) {
                    setState({
                        dashboard: null,
                        loading: false,
                        error: normalizeError(err),
                    })
                }
            })

        return () => {
            cancelled = true
        }
    }, [])

    return state
}
