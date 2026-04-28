import { useMutation } from '@tanstack/react-query'
import { authService } from '@/services/authService'
import { useAuth } from './useAuth'
import type { LoginPayload } from '@/services/authService'
import { decodeUserFromToken } from '@/utils/tokenUtils'

interface UseLoginOptions {
  remember?: boolean
  onSuccess?: () => void
}

export function useLogin({
  remember = false,
  onSuccess,
}: UseLoginOptions = {}) {
  const { login } = useAuth()

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const response = await authService.login(payload)
      const user = decodeUserFromToken(response.data.token)
      return { ...response, user }
    },
    onSuccess: (result) => {
      login(result.data.token, result.user, remember)
      onSuccess?.()
    },
  })
}
