import { useSearchParams, Link } from 'react-router'
import { motion } from 'motion/react'
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { useConfirmEmail } from '../hooks/useAuthMutations'

export function ConfirmEmailView() {
  const [searchParams] = useSearchParams()
  const userId = searchParams.get('userId') ?? ''
  const token = searchParams.get('token') ?? ''

  const { loading, success, error } = useConfirmEmail(userId, token)

  const missingParams = !userId || !token

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F4F6] via-[#9CBBDC] to-[#3A6EA5] flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl shadow-[#3A6EA5]/20 text-center">
            {/* Logo */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3A6EA5] to-[#9CBBDC] flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <span className="text-2xl font-bold text-[#1a1a1a]">MARN</span>
            </div>

            {/* Loading state */}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="w-20 h-20 rounded-full bg-[#3A6EA5]/10 flex items-center justify-center">
                  <Loader2 className="w-10 h-10 text-[#3A6EA5] animate-spin" />
                </div>
                <h2 className="text-2xl font-bold text-[#1a1a1a]">
                  Confirming your email…
                </h2>
                <p className="text-[#4a5565]">This will only take a moment.</p>
              </motion.div>
            )}

            {/* Success state */}
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-[#1a1a1a]">
                  Email confirmed!
                </h2>
                <p className="text-[#4a5565]">
                  Your account is now verified. You can sign in and start using
                  MARN.
                </p>
                <Button
                  asChild
                  size="lg"
                  className="mt-2 w-full bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2a5a8a] hover:to-[#3A6EA5] text-white rounded-xl py-6 shadow-lg shadow-[#3A6EA5]/30"
                >
                  <Link to="/login">Go to sign in</Link>
                </Button>
              </motion.div>
            )}

            {/* Missing params state */}
            {missingParams && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center">
                  <Mail className="w-10 h-10 text-amber-600" />
                </div>
                <h2 className="text-2xl font-bold text-[#1a1a1a]">
                  Invalid confirmation link
                </h2>
                <p className="text-[#4a5565]">
                  The link is missing required parameters. Please use the link
                  from your confirmation email.
                </p>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="mt-2 w-full rounded-xl border-[#3A6EA5]/20 hover:bg-[#f5f7fa] py-6"
                >
                  <Link to="/signup">Back to sign up</Link>
                </Button>
              </motion.div>
            )}

            {/* Error state */}
            {error && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                  <XCircle className="w-10 h-10 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-[#1a1a1a]">
                  Confirmation failed
                </h2>
                <p className="text-[#4a5565]">{error.message}</p>
                <p className="text-sm text-[#6a7282]">
                  The link may have expired or already been used.
                </p>
                <div className="flex flex-col gap-3 w-full mt-2">
                  <Button
                    asChild
                    size="lg"
                    className="w-full bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2a5a8a] hover:to-[#3A6EA5] text-white rounded-xl py-6 shadow-lg shadow-[#3A6EA5]/30"
                  >
                    <Link to="/login">Go to sign in</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="w-full rounded-xl border-[#3A6EA5]/20 hover:bg-[#f5f7fa] py-6"
                  >
                    <Link to="/contact">Contact support</Link>
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
