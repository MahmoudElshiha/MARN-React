import { useState, useEffect } from 'react'
import type { OwnerPropertyView } from '../types/property'
import { propertyService } from '../services/propertyService'
import { normalizeError } from '@/services/httpErrors'
import type { ApiError } from '@/types/common'

interface State {
  data: OwnerPropertyView | null
  loading: boolean
  error: ApiError | null
}

export function useOwnerProperty() {
  const [state, setState] = useState<State>({
    data: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false

    propertyService
      .getOwnerProperty()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null })
      })
      .catch((err: unknown) => {
        if (!cancelled)
          setState({ data: null, loading: false, error: normalizeError(err) })
      })

    return () => {
      cancelled = true
    }
  }, [])

  return {
    property: state.data?.property ?? null,
    rentalRequests: state.data?.rentalRequests ?? [],
    loading: state.loading,
    error: state.error,
  }
}
