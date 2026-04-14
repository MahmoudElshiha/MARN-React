import { apiClient } from '@/services/apiClient'
import type { ApiResponse } from '@/types/common'
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

type MaybeApiResponse<T> = T | ApiResponse<T>

function unwrapResponse<T>(response: MaybeApiResponse<T>): T {
    if (
        typeof response === 'object' &&
        response !== null &&
        'data' in response &&
        'success' in response
    ) {
        return (response as ApiResponse<T>).data
    }

    return response as T
}

export const authService = {
    async login(payload: LoginRequest): Promise<LoginResponse> {
        const response = await apiClient.post<MaybeApiResponse<LoginResponse>>(
            '/auth/login',
            payload,
        )
        const data = unwrapResponse(response)

        if (data.token) {
            localStorage.setItem('token', data.token)
        }

        return data
    },

    async signUp(payload: SignUpRequest): Promise<SignUpResponse> {
        const response = await apiClient.post<MaybeApiResponse<SignUpResponse>>(
            '/auth/signup',
            payload,
        )

        return unwrapResponse(response)
    },

    async forgotPassword(
        payload: ForgotPasswordRequest,
    ): Promise<ForgotPasswordResponse> {
        const response = await apiClient.post<
            MaybeApiResponse<ForgotPasswordResponse>
        >('/auth/forgot-password', payload)

        return unwrapResponse(response)
    },

    async verifyOtp(payload: VerifyOtpRequest): Promise<VerifyOtpResponse> {
        const response = await apiClient.post<MaybeApiResponse<VerifyOtpResponse>>(
            '/auth/verify-otp',
            payload,
        )
        const data = unwrapResponse(response)

        if (data.token) {
            localStorage.setItem('token', data.token)
        }

        return data
    },

    async resendOtp(payload: ResendOtpRequest): Promise<ResendOtpResponse> {
        const response = await apiClient.post<MaybeApiResponse<ResendOtpResponse>>(
            '/auth/resend-otp',
            payload,
        )

        return unwrapResponse(response)
    },
}
