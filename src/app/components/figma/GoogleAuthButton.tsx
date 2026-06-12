import { GoogleLogin } from '@react-oauth/google'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { useGoogleAuth } from '@/hooks/useGoogleLogin'
import { decodeUserFromToken } from '@/utils/tokenUtils'
import type { UserRole } from '@/types/user'
import { useTranslation } from 'react-i18next'

function roleDestination(role: UserRole): string {
  if (role === 'admin') return '/admin-dashboard'
  if (role === 'owner') return '/owner-dashboard'
  return '/tenant-dashboard'
}

interface GoogleAuthButtonProps {
  /** Persist the session to localStorage instead of sessionStorage. */
  remember?: boolean
  /** Label shown inside Google's widget. */
  text?: 'signin_with' | 'signup_with' | 'continue_with'
}

/**
 * Google sign-in / sign-up button. Uses Google's official widget to obtain an
 * ID token, exchanges it with the backend, and routes the user to their
 * dashboard (or the 2FA challenge when required).
 */
export function GoogleAuthButton({
  remember = false,
  text = 'signin_with',
}: GoogleAuthButtonProps) {
  const navigate = useNavigate()
  const googleAuth = useGoogleAuth({ remember })
  const { t } = useTranslation('auth')

  return (
    <GoogleLogin
      text={text}
      width="100%"
      shape="rectangular"
      onSuccess={(credentialResponse) => {
        const idToken = credentialResponse.credential
        if (!idToken) {
          toast.error(t('google.credentialsError'))
          return
        }

        googleAuth.mutate(idToken, {
          onSuccess: (result) => {
            if (result.requiresTwoFactor) {
              // The temp token is a JWT — pull the email claim for the 2FA page.
              const { email } = decodeUserFromToken(result.tempToken)
              navigate('/2fa-verification', {
                state: {
                  email,
                  tempToken: result.tempToken,
                  remember,
                },
              })
            } else {
              navigate(roleDestination(result.user.role))
            }
          },
          onError: (err) => {
            const msg =
              err instanceof Error
                ? err.message
                : t('google.signInFailed')
            toast.error(msg)
          },
        })
      }}
      onError={() => toast.error(t('google.cancelledOrFailed'))}
    />
  )
}
