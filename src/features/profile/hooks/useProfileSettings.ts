import { useEffect, useState } from 'react'
import { normalizeError } from '@/services/httpErrors'
import type { ApiError } from '@/types/common'
import { profileService } from '../services/profileService'
import type {
    IdentityVerificationFiles,
    ProfileSettings,
    ReportPayload,
} from '../types/profile'

interface State {
    settings: ProfileSettings | null
    files: IdentityVerificationFiles
    saving: boolean
    loading: boolean
    error: ApiError | null
}

const EMPTY_FILES: IdentityVerificationFiles = {
    frontIdCard: null,
    backIdCard: null,
    avatar: null,
}

export function useProfileSettings() {
    const [state, setState] = useState<State>({
        settings: null,
        files: EMPTY_FILES,
        saving: false,
        loading: true,
        error: null,
    })

    useEffect(() => {
        let cancelled = false

        profileService
            .getProfileSettings()
            .then((settings) => {
                if (!cancelled) {
                    setState({
                        settings,
                        files: EMPTY_FILES,
                        saving: false,
                        loading: false,
                        error: null,
                    })
                }
            })
            .catch((err: unknown) => {
                if (!cancelled) {
                    setState({
                        settings: null,
                        files: EMPTY_FILES,
                        saving: false,
                        loading: false,
                        error: normalizeError(err),
                    })
                }
            })

        return () => {
            cancelled = true
        }
    }, [])

    function updateField<K extends keyof ProfileSettings>(
        key: K,
        value: ProfileSettings[K],
    ) {
        setState((prev) => ({
            ...prev,
            settings: prev.settings
                ? { ...prev.settings, [key]: value }
                : prev.settings,
        }))
    }

    function setFile(key: keyof IdentityVerificationFiles, file: File | null) {
        setState((prev) => ({
            ...prev,
            files: { ...prev.files, [key]: file },
        }))
    }

    async function save() {
        if (!state.settings) return false

        setState((prev) => ({ ...prev, saving: true, error: null }))
        try {
            const next = await profileService.updateProfileSettings(
                state.settings,
                state.files.avatar,
            )
            setState((prev) => ({ ...prev, settings: next, saving: false }))
            return true
        } catch (err) {
            setState((prev) => ({
                ...prev,
                saving: false,
                error: normalizeError(err),
            }))
            return false
        }
    }

    async function saveLegal() {
        if (!state.settings) return false

        setState((prev) => ({ ...prev, saving: true, error: null }))
        try {
            const next = await profileService.updateProfileLegalSettings(
                state.settings,
                state.files,
            )
            setState((prev) => ({ ...prev, settings: next, saving: false }))
            return true
        } catch (err) {
            setState((prev) => ({
                ...prev,
                saving: false,
                error: normalizeError(err),
            }))
            return false
        }
    }

    async function uploadAvatar(file: File) {
        setFile('avatar', file)
    }

    async function uploadDocument(file: File, kind: 'front-id' | 'back-id') {
        setFile(kind === 'front-id' ? 'frontIdCard' : 'backIdCard', file)
    }

    async function submitReport(payload: ReportPayload) {
        await profileService.submitReport(payload)
    }

    return {
        ...state,
        updateField,
        setFile,
        save,
        saveLegal,
        uploadAvatar,
        uploadDocument,
        submitReport,
    }
}
