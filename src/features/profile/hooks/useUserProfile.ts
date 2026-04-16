import { useEffect, useState } from 'react'
import { normalizeError } from '@/services/httpErrors'
import type { ApiError } from '@/types/common'
import { profileService } from '../services/profileService'
import type { PublicUserProfile } from '../types/profile'

interface State {
  profile: PublicUserProfile | null
  loading: boolean
  error: ApiError | null
}

export function useUserProfile() {
  const [state, setState] = useState<State>({
    profile: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false

    profileService
      .getUserProfile()
      .then((profile) => {
        if (!cancelled) {
          setState({ profile, loading: false, error: null })
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({
            profile: null,
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
