import { apiClient } from './apiClient'
import type { ApiResponse } from '@/types/common'
import type { User } from '@/types/user'

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResult {
  token: string
  user: User
}

export interface RegisterPayload {
  firstName: string
  lastName: string
  email: string
  dateOfBirth: string
  password: string
  confirmPassword: string
  gender: 'Unknown' | 'Male' | 'Female'
}

export interface RegisterResult {
  message: string
  data: boolean
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ResetPasswordPayload {
  token: string
  newPassword: string
}

export interface VerifyOtpPayload {
  email: string
  otp: string
}

export const authService = {
  login: (payload: LoginPayload) =>
    apiClient.post<ApiResponse<LoginResult>>('/Auth/login', payload),

  register: (payload: RegisterPayload) =>
    apiClient.post<RegisterResult>('/api/Account/register', payload),

  forgotPassword: (payload: ForgotPasswordPayload) =>
    apiClient.post<ApiResponse<{ message: string }>>(
      '/Auth/forgot-password',
      payload,
    ),

  resetPassword: (payload: ResetPasswordPayload) =>
    apiClient.post<ApiResponse<{ message: string }>>(
      '/Auth/reset-password',
      payload,
    ),

  verifyOtp: (payload: VerifyOtpPayload) =>
    apiClient.post<ApiResponse<{ message: string }>>('/Auth/verify-otp', payload),
}
