import { useMutation } from '@tanstack/react-query'
import { authService } from '@/services/authService'
import { useAuth } from './useAuth'
import { decodeUserFromToken } from '@/utils/tokenUtils'
import type { LoginMutationResult } from './useLogin'

interface UseGoogleLoginOptions {
  remember?: boolean
  onSuccess?: () => void
}

/**
 * Login (or first-time register) with a Google ID token.
 * Mirrors {@link useLogin} — returns the same discriminated union so callers
 * can share the 2FA handling logic.
 */
export function useGoogleAuth({
  remember = false,
  onSuccess,
}: UseGoogleLoginOptions = {}) {
  const { login } = useAuth()

  return useMutation({
    mutationFn: async (idToken: string): Promise<LoginMutationResult> => {
      const response = await authService.googleLogin({
        idToken,
        rememberMe: remember,
      })
      const { token, requiresTwoFactor, twoFactorProvider } = response.data

      if (requiresTwoFactor) {
        return {
          requiresTwoFactor: true,
          tempToken: token,
          twoFactorProvider: twoFactorProvider ?? 'Email',
        }
      }

      const user = decodeUserFromToken(token)
      return { requiresTwoFactor: false, token, user }
    },
    onSuccess: (result) => {
      // Persist the session immediately unless 2FA is still required; the 2FA
      // branch is handled by the page (navigate to the verify page).
      if (!result.requiresTwoFactor) {
        login(result.token, result.user, remember)
        onSuccess?.()
      }
    },
  })
}
