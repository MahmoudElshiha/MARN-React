import { useEffect, useState } from 'react'
import { normalizeError } from '@/services/httpErrors'
import type { ApiError } from '@/types/common'
import { dashboardOwnerService } from '../services/dashboardOwnerService'
import type { OwnerDashboardData } from '../types/dashboardOwner'

interface State {
  dashboard: OwnerDashboardData | null
  loading: boolean
  error: ApiError | null
}

export function useOwnerDashboard() {
  const [state, setState] = useState<State>({
    dashboard: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false

    dashboardOwnerService
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
