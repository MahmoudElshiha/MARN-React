import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { normalizeError } from '@/services/httpErrors'
import type { ApiError } from '@/types/common'
import { authService } from '../services/authService'
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
  const mutation = useMutation<SignUpResponse, Error, SignUpRequest>({
    mutationFn: authService.signUp,
  })

  return {
    signUp: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error ? normalizeError(mutation.error) : null,
    data: mutation.data ?? null,
  }
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

export function useResetPassword() {
  const [state, setState] = useState<MutationState<ResetPasswordResponse>>({
    data: null,
    loading: false,
    error: null,
  })

  async function resetPassword(
    payload: ResetPasswordRequest,
  ): Promise<ResetPasswordResponse | null> {
    setState({ data: null, loading: true, error: null })

    try {
      const data = await authService.resetPassword(payload)
      setState({ data, loading: false, error: null })
      return data
    } catch (err) {
      setState({ data: null, loading: false, error: normalizeError(err) })
      return null
    }
  }

  return { ...state, resetPassword }
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

export function useConfirmEmail(userId: string, token: string) {
  const query = useQuery<ConfirmEmailResponse, Error>({
    queryKey: ['confirm-email', userId, token],
    queryFn: () => authService.confirmEmail(userId, token),
    enabled: Boolean(userId && token),
    retry: false,
  })

  return {
    loading: query.isLoading,
    success: query.isSuccess,
    error: query.error ? normalizeError(query.error) : null,
    data: query.data ?? null,
  }
}

export function useResendConfirmationEmail() {
  const [state, setState] = useState<
    MutationState<ResendEmailConfirmationResponse>
  >({
    data: null,
    loading: false,
    error: null,
  })

  async function resendConfirmationEmail(
    payload: ResendEmailConfirmationRequest,
  ): Promise<ResendEmailConfirmationResponse | null> {
    setState({ data: null, loading: true, error: null })

    try {
      const data = await authService.resendConfirmationEmail(payload)
      setState({ data, loading: false, error: null })
      return data
    } catch (err) {
      setState({ data: null, loading: false, error: normalizeError(err) })
      return null
    }
  }

  return { ...state, resendConfirmationEmail }
}
