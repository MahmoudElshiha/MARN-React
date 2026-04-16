import { apiClient } from '@/services/apiClient'
import type { ApiResponse } from '@/types/common'
import type {
  ConfirmEmailResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  LoginResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  ResendEmailConfirmationRequest,
  ResendEmailConfirmationResponse,
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
    ('success' in response || 'message' in response)
  ) {
    return (response as { data: T }).data
  }

  return response as T
}

export const authService = {
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<MaybeApiResponse<LoginResponse>>(
      '/Account/login',
      payload,
    )
    const data = unwrapResponse(response)

    if (data.token) {
      if (payload.rememberMe) {
        localStorage.setItem('token', data.token)
        sessionStorage.removeItem('token')
      } else {
        sessionStorage.setItem('token', data.token)
        localStorage.removeItem('token')
      }
    }

    return data
  },

  async signUp(payload: SignUpRequest): Promise<SignUpResponse> {
    const response = await apiClient.post<MaybeApiResponse<SignUpResponse>>(
      '/Account/register',
      payload,
    )

    return unwrapResponse(response)
  },

  async forgotPassword(
    payload: ForgotPasswordRequest,
  ): Promise<ForgotPasswordResponse> {
    const response = await apiClient.post<{ message: string; data: boolean }>(
      '/Account/forgot-password',
      payload,
    )

    return {
      email: payload.email,
      sent: response.data,
    }
  },

  async resetPassword(
    payload: ResetPasswordRequest,
  ): Promise<ResetPasswordResponse> {
    const response = await apiClient.put<{ message?: string; data: boolean }>(
      '/Account/reset-password',
      payload,
    )

    return {
      success: response.data,
      message: response.message,
    }
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

  async confirmEmail(
    userId: string,
    token: string,
  ): Promise<ConfirmEmailResponse> {
    const qs = new URLSearchParams({ userId, token }).toString()
    const response = await apiClient.get<
      MaybeApiResponse<ConfirmEmailResponse>
    >(`/Account/confirm-email?${qs}`)

    return unwrapResponse(response)
  },

  async resendConfirmationEmail(
    payload: ResendEmailConfirmationRequest,
  ): Promise<ResendEmailConfirmationResponse> {
    await apiClient.post('/Account/resend-confirmation-email', payload)

    return { sent: true }
  },
}
