import { useState, useEffect } from 'react'
import type { PropertyDetail } from '../types/property'
import { propertyService } from '../services/propertyService'
import { normalizeError } from '@/services/httpErrors'
import type { ApiError } from '@/types/common'

interface State {
  property: PropertyDetail | null
  loading: boolean
  error: ApiError | null
}

export function useProperty(id: string) {
  const [state, setState] = useState<State>({
    property: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    if (!id) return
    let cancelled = false

    propertyService
      .getPropertyById(id)
      .then((property) => {
        if (!cancelled) setState({ property, loading: false, error: null })
      })
      .catch((err: unknown) => {
        if (!cancelled)
          setState({
            property: null,
            loading: false,
            error: normalizeError(err),
          })
      })

    return () => {
      cancelled = true
    }
  }, [id])

  return state
}
