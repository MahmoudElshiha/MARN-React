import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { motion } from 'motion/react'
import { Mail, ArrowLeft } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { useResendOtp, useVerifyOtp } from '../hooks/useAuthMutations'

export function OTPVerificationView() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const email = searchParams.get('email') ?? ''

    const {
        verifyOtp,
        loading: verifyLoading,
        error: verifyError,
    } = useVerifyOtp()
    const {
        resendOtp,
        loading: resendLoading,
        error: resendError,
        data: resendData,
    } = useResendOtp()

    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [countdown, setCountdown] = useState(60)
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])
    const canResend = countdown === 0

    useEffect(() => {
        if (countdown === 0) return

        const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000)
        return () => clearTimeout(timer)
    }, [countdown])

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) return
        if (!/^\d*$/.test(value)) return

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData('text').slice(0, 6)
        if (!/^\d+$/.test(pastedData)) return

        const newOtp = [...otp]
        pastedData.split('').forEach((digit, i) => {
            if (i < 6) newOtp[i] = digit
        })
        setOtp(newOtp)

        const lastIndex = Math.min(pastedData.length, 5)
        inputRefs.current[lastIndex]?.focus()
    }

    const handleResend = async () => {
        if (!email) return

        const result = await resendOtp({ email })
        if (!result) return

        setCountdown(60)
    }

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault()
        const otpCode = otp.join('')
        if (otpCode.length !== 6 || !email) return

        const result = await verifyOtp({ email, otpCode })
        if (!result?.verified) return

        navigate(result.redirectPath ?? '/tenant-dashboard')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F2F4F6] via-[#9CBBDC] to-[#3A6EA5] flex items-center justify-center px-4 py-20">
            <div className="w-full max-w-lg">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl shadow-[#3A6EA5]/20">
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 text-[#4a5565] hover:text-[#3A6EA5] mb-6 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to login
                        </Link>

                        <div className="flex flex-col items-center mb-8">
                            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#3A6EA5] to-[#9CBBDC] flex items-center justify-center shadow-lg mb-6">
                                <Mail className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-2 text-center">
                                Verify Your Email
                            </h2>
                            <p className="text-[#4a5565] text-center">
                                OTP sent to your email
                            </p>
                            <p className="text-sm text-[#3A6EA5] font-semibold mt-1">
                                {email || 'Missing email context'}
                            </p>
                        </div>

                        <form onSubmit={handleVerify} className="space-y-8">
                            {(verifyError || resendError) && (
                                <p className="text-sm text-red-500 rounded-xl bg-red-50 px-4 py-3 border border-red-200">
                                    {verifyError?.message || resendError?.message}
                                </p>
                            )}

                            {resendData?.sent && !resendError && (
                                <p className="text-sm text-green-700 rounded-xl bg-green-50 px-4 py-3 border border-green-200 text-center">
                                    OTP has been sent again.
                                </p>
                            )}

                            <div>
                                <label className="text-[#1a1a1a] text-sm font-medium mb-3 block text-center">
                                    Enter 6-digit code
                                </label>
                                <div
                                    className="flex gap-2 justify-center"
                                    onPaste={handlePaste}
                                >
                                    {otp.map((digit, index) => (
                                        <Input
                                            key={index}
                                            ref={(el) => {
                                                inputRefs.current[index] = el
                                            }}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            className="w-12 h-14 text-center text-2xl font-bold bg-[#F2F4F6] rounded-xl border-[#3A6EA5]/20 focus:border-[#3A6EA5]"
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="text-center">
                                {canResend ? (
                                    <button
                                        type="button"
                                        onClick={handleResend}
                                        disabled={resendLoading || !email}
                                        className="text-[#3A6EA5] hover:underline font-semibold disabled:opacity-50"
                                    >
                                        {resendLoading ? 'Resending...' : 'Resend OTP'}
                                    </button>
                                ) : (
                                    <p className="text-[#4a5565]">
                                        Resend OTP in{' '}
                                        <span className="font-semibold text-[#3A6EA5]">
                                            {countdown}s
                                        </span>
                                    </p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                disabled={otp.join('').length !== 6 || verifyLoading || !email}
                                className="w-full bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2a5a8a] hover:to-[#3A6EA5] text-white rounded-xl py-6 shadow-lg shadow-[#3A6EA5]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {verifyLoading ? 'Verifying...' : 'Verify & Continue'}
                            </Button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-sm text-[#4a5565]">
                                Didn't receive the code?{' '}
                                <Link
                                    to="/contact"
                                    className="text-[#3A6EA5] hover:underline font-semibold"
                                >
                                    Contact support
                                </Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
