import { useState, useEffect } from 'react'
import type { Property } from '../types/property'
import { propertyService } from '../services/propertyService'
import { normalizeError } from '@/services/httpErrors'
import type { ApiError } from '@/types/common'

interface State {
  properties: Property[]
  loading: boolean
  error: ApiError | null
}

export function useProperties() {
  const [state, setState] = useState<State>({
    properties: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false

    propertyService
      .getProperties()
      .then((properties) => {
        if (!cancelled) setState({ properties, loading: false, error: null })
      })
      .catch((err: unknown) => {
        if (!cancelled)
          setState({
            properties: [],
            loading: false,
            error: normalizeError(err),
          })
      })

    return () => {
      cancelled = true
    }
  }, [])

  return state
}
