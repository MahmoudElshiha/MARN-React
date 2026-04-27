import { useMutation } from '@tanstack/react-query'
import { authService } from '@/services/authService'
import { useAuth } from './useAuth'
import type { LoginPayload } from '@/services/authService'

interface UseLoginOptions {
  remember?: boolean
  onSuccess?: () => void
}

export function useLogin({ remember = false, onSuccess }: UseLoginOptions = {}) {
  const { login } = useAuth()

  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (response) => {
      const { token, user } = response.data
      login(token, user, remember)
      onSuccess?.()
    },
  })
}
