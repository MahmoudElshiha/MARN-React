import { useState } from 'react'
import { normalizeError } from '@/services/httpErrors'
import type { ApiError } from '@/types/common'
import { authService } from '../services/authService'
import type {
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    LoginRequest,
    LoginResponse,
    ResendOtpRequest,
    ResendOtpResponse,
    SignUpRequest,
    SignUpResponse,
    VerifyOtpRequest,
    VerifyOtpResponse,
} from '../types/auth'

interface MutationState<T> {
    data: T | null
    loading: boolean
    error: ApiError | null
}

export function useLogin() {
    const [state, setState] = useState<MutationState<LoginResponse>>({
        data: null,
        loading: false,
        error: null,
    })

    async function login(payload: LoginRequest): Promise<LoginResponse | null> {
        setState({ data: null, loading: true, error: null })

        try {
            const data = await authService.login(payload)
            setState({ data, loading: false, error: null })
            return data
        } catch (err) {
            setState({ data: null, loading: false, error: normalizeError(err) })
            return null
        }
    }

    return { ...state, login }
}

export function useSignUp() {
    const [state, setState] = useState<MutationState<SignUpResponse>>({
        data: null,
        loading: false,
        error: null,
    })

    async function signUp(
        payload: SignUpRequest,
    ): Promise<SignUpResponse | null> {
        setState({ data: null, loading: true, error: null })

        try {
            const data = await authService.signUp(payload)
            setState({ data, loading: false, error: null })
            return data
        } catch (err) {
            setState({ data: null, loading: false, error: normalizeError(err) })
            return null
        }
    }

    return { ...state, signUp }
}

export function useForgotPassword() {
    const [state, setState] = useState<MutationState<ForgotPasswordResponse>>({
        data: null,
        loading: false,
        error: null,
    })

    async function forgotPassword(
        payload: ForgotPasswordRequest,
    ): Promise<ForgotPasswordResponse | null> {
        setState({ data: null, loading: true, error: null })

        try {
            const data = await authService.forgotPassword(payload)
            setState({ data, loading: false, error: null })
            return data
        } catch (err) {
            setState({ data: null, loading: false, error: normalizeError(err) })
            return null
        }
    }

    return { ...state, forgotPassword }
}

export function useVerifyOtp() {
    const [state, setState] = useState<MutationState<VerifyOtpResponse>>({
        data: null,
        loading: false,
        error: null,
    })

    async function verifyOtp(
        payload: VerifyOtpRequest,
    ): Promise<VerifyOtpResponse | null> {
        setState({ data: null, loading: true, error: null })

        try {
            const data = await authService.verifyOtp(payload)
            setState({ data, loading: false, error: null })
            return data
        } catch (err) {
            setState({ data: null, loading: false, error: normalizeError(err) })
            return null
        }
    }

    return { ...state, verifyOtp }
}

export function useResendOtp() {
    const [state, setState] = useState<MutationState<ResendOtpResponse>>({
        data: null,
        loading: false,
        error: null,
    })

    async function resendOtp(
        payload: ResendOtpRequest,
    ): Promise<ResendOtpResponse | null> {
        setState({ data: null, loading: true, error: null })

        try {
            const data = await authService.resendOtp(payload)
            setState({ data, loading: false, error: null })
            return data
        } catch (err) {
            setState({ data: null, loading: false, error: normalizeError(err) })
            return null
        }
    }

    return { ...state, resendOtp }
}
