import { Link, useSearchParams } from 'react-router'
import { motion } from 'motion/react'
import { MailCheck, ArrowRight, CircleCheck, CircleHelp } from 'lucide-react'
import { Button } from '@/app/components/ui/button'

function maskEmail(email: string): string {
  const [local, domain] = email.split('@')

  if (!local || !domain) return email
  if (local.length <= 2) return `${local[0] ?? ''}*@${domain}`

  return `${local.slice(0, 2)}${'*'.repeat(Math.max(local.length - 2, 1))}@${domain}`
}

export function EmailVerificationSentView() {
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') ?? ''
  const maskedEmail = email ? maskEmail(email) : 'your email address'

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F4F6] via-[#9CBBDC] to-[#3A6EA5] flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl shadow-[#3A6EA5]/20">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#3A6EA5] to-[#9CBBDC] flex items-center justify-center shadow-lg mb-6">
                <MailCheck className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-3">
                Verify your email to continue
              </h1>
              <p className="text-[#4a5565] max-w-xl">
                We sent a verification link to{' '}
                <span className="font-semibold text-[#1a1a1a]">
                  {maskedEmail}
                </span>
                . Open your inbox and click the link to activate your account.
              </p>
            </div>

            <div className="rounded-2xl bg-[#f5f7fa] border border-[#3A6EA5]/15 p-5 mb-8">
              <p className="text-sm font-semibold text-[#1a1a1a] mb-3">
                Next steps
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-[#4a5565]">
                  <CircleCheck className="w-5 h-5 text-[#3A6EA5] shrink-0 mt-0.5" />
                  Check your inbox (and spam or promotions folder).
                </li>
                <li className="flex items-start gap-3 text-[#4a5565]">
                  <CircleCheck className="w-5 h-5 text-[#3A6EA5] shrink-0 mt-0.5" />
                  Click the verification link in the email from MARN.
                </li>
                <li className="flex items-start gap-3 text-[#4a5565]">
                  <CircleHelp className="w-5 h-5 text-[#3A6EA5] shrink-0 mt-0.5" />
                  If you used the wrong email, create an account again with the
                  correct one.
                </li>
              </ul>
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              <Button
                asChild
                size="lg"
                className="flex-1 bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2a5a8a] hover:to-[#3A6EA5] text-white rounded-xl py-6 shadow-lg shadow-[#3A6EA5]/30"
              >
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2"
                >
                  Go to sign in
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="flex-1 rounded-xl border-[#3A6EA5]/20 hover:bg-[#f5f7fa] py-6"
              >
                <Link to="/signup">Use another email</Link>
              </Button>
            </div>

            <p className="text-sm text-center text-[#6a7282] mt-6">
              Need help?{' '}
              <Link
                to="/contact"
                className="text-[#3A6EA5] hover:underline font-semibold"
              >
                Contact support
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
