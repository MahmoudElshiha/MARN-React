export interface LoginRequest {
  email: string
  password: string
  remember: boolean
}

export interface LoginResponse {
  token?: string
  redirectPath?: string
}

export interface SignUpRequest {
  firstName: string
  lastName: string
  email: string
  dateOfBirth: string
  password: string
  confirmPassword: string
  gender: 'Male' | 'Female'
}

export interface SignUpResponse {
  userId?: string
  email: string
  requiresOtp?: boolean
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ForgotPasswordResponse {
  email: string
  sent: boolean
}

export interface VerifyOtpRequest {
  email: string
  otpCode: string
}

export interface VerifyOtpResponse {
  verified: boolean
  token?: string
  redirectPath?: string
}

export interface ResendOtpRequest {
  email: string
}

export interface ResendOtpResponse {
  sent: boolean
}
