import { motion } from 'motion/react'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Checkbox } from '../components/ui/checkbox'
import { Link, useNavigate } from 'react-router'
import { useState } from 'react'
import { useLogin } from '@/hooks/useLogin'
import { toast } from 'sonner'
import type { UserRole } from '@/types/user'
import { useTranslation } from 'react-i18next'

function roleDestination(role: UserRole): string {
  //TODO: review business logic for role-based redirection after login
  if (role === 'admin') return '/admin-dashboard'
  if (role === 'owner') return '/owner-dashboard'
  return '/tenant-dashboard'
}

export function LoginPage() {
  const { t, i18n } = useTranslation('auth')
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  })

  const navigate = useNavigate()

  const login = useLogin({ remember: formData.remember })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login.mutate(
      { email: formData.email, password: formData.password },
      {
        onSuccess: (result) => {
          if (result.requiresTwoFactor) {
            // Redirect to 2FA verification; pass context via router state
            navigate('/2fa-verification', {
              state: {
                email: formData.email,
                tempToken: result.tempToken,
                remember: formData.remember,
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
              : t('login.failed')
          toast.error(msg)
        },
      },
    )
  }

  return (
    <div className="min-h-screen bg-[#F2F4F6] flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block"
        >
          <div className="flex items-center gap-3 mb-8">
            <Link to="/" className="flex items-center gap-2">
              <img src="/Logo-Signup.svg" alt={t('logoAlt', { defaultValue: 'MARN Logo' })} className="h-16 w-auto" />
            </Link>
          </div>
          <h1 className="text-5xl font-bold text-[#1a1a1a] mb-6">
            {t('login.heading')}
          </h1>
          <p className="text-xl text-[#4a5565] mb-8">
            {t('login.subtitle')}
          </p>
          <div className="space-y-4">
            {[
              t('login.features.manageListings'),
              t('login.features.trackBookings'),
              t('login.features.messageTenants'),
              t('login.features.viewAnalytics'),
            ].map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                className="flex items-center gap-3"
              >
                <div className="w-2 h-2 rounded-full bg-[#3A6EA5]"></div>
                <span className="text-[#4a5565]">{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl shadow-black/10">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#1a1a1a] mb-2">
                {t('login.title')}
              </h2>
              <p className="text-[#4a5565]">
                {t('login.noAccount')} {' '}
                <Link
                  to="/signup"
                  className="text-[#3A6EA5] hover:underline font-semibold"
                >
                  {t('login.signUp')}
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-[#1a1a1a] mb-2 block">
                  {t('login.emailLabel')}
                </Label>
                <div className="relative">
                  <Mail className={`absolute ${i18n.language === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-5 h-5 text-[#6a7282]`} />
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className={`${i18n.language === 'ar' ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-6 bg-[#f5f7fa] rounded-xl border-[#3A6EA5]/20 focus:border-[#3A6EA5]`}
                    placeholder={t('login.emailPlaceholder')}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="password" className="text-[#1a1a1a]">
                    {t('login.passwordLabel')}
                  </Label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-[#3A6EA5] hover:underline"
                  >
                    {t('login.forgotPassword')}
                  </Link>
                </div>
                <div className="relative">
                  <Lock className={`absolute ${i18n.language === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-5 h-5 text-[#6a7282]`} />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className={`${i18n.language === 'ar' ? 'pr-12 pl-12' : 'pl-12 pr-12'} py-6 bg-[#f5f7fa] rounded-xl border-[#3A6EA5]/20 focus:border-[#3A6EA5]`}
                    placeholder={t('login.passwordPlaceholder')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute ${i18n.language === 'ar' ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-[#6a7282] hover:text-[#3A6EA5]`}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={formData.remember}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, remember: checked as boolean })
                  }
                  className="border-[#3A6EA5] data-[state=checked]:bg-[#3A6EA5]"
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-[#4a5565] cursor-pointer"
                >
                  {t('login.rememberMe')}
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                disabled={login.isPending}
                className="w-full bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2a5a8a] hover:to-[#3A6EA5] text-white rounded-xl py-6 shadow-lg shadow-[#3A6EA5]/30"
              >
                {login.isPending ? t('login.signingIn') : t('login.signIn')}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#3A6EA5]/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-[#6a7282]">
                  {t('login.orContinueWith')}
                </span>
              </div>
            </div>

            {/* Social Login */}
            <Button
              variant="outline"
              className="w-full rounded-xl border-[#3A6EA5]/20 hover:bg-[#f5f7fa] py-6"
              type="button"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
