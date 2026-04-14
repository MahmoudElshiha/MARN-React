import { useEffect, useState } from 'react'
import { normalizeError } from '@/services/httpErrors'
import type { ApiError } from '@/types/common'
import { profileService } from '../services/profileService'
import type { PublicOwnerProfile } from '../types/profile'

interface State {
    profile: PublicOwnerProfile | null
    loading: boolean
    error: ApiError | null
}

export function useOwnerProfile() {
    const [state, setState] = useState<State>({
        profile: null,
        loading: true,
        error: null,
    })

    useEffect(() => {
        let cancelled = false

        profileService
            .getOwnerProfile()
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
