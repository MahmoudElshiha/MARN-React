import { useState } from 'react'
import { normalizeError } from '@/services/httpErrors'
import type { ApiError } from '@/types/common'
import { profileService } from '../services/profileService'
import type { ReportPayload } from '../types/profile'

export function useProfileReports() {
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<ApiError | null>(null)

    async function submitReport(payload: ReportPayload): Promise<boolean> {
        setSubmitting(true)
        setError(null)

        try {
            await profileService.submitReport(payload)
            setSubmitting(false)
            return true
        } catch (err) {
            setSubmitting(false)
            setError(normalizeError(err))
            return false
        }
    }

    return { submitting, error, submitReport }
}
