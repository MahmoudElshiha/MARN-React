import { motion } from 'motion/react';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Link } from 'react-router';
import { useState } from 'react';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const isEmailValid = validateEmail(email);

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F2F4F6] via-[#9CBBDC] to-[#3A6EA5] flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl shadow-[#3A6EA5]/20 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-10 h-10 text-white" />
            </motion.div>

            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-4">Check Your Email</h2>
            <p className="text-[#4a5565] mb-2">
              We've sent password reset instructions to:
            </p>
            <p className="text-[#3A6EA5] font-semibold mb-6">{email}</p>
            <p className="text-sm text-[#4a5565] mb-8">
              Didn't receive the email? Check your spam folder or{' '}
              <button
                onClick={() => setIsSubmitted(false)}
                className="text-[#3A6EA5] hover:underline font-semibold"
              >
                try again
              </button>
            </p>

            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2a5a8a] hover:to-[#3A6EA5] text-white rounded-xl py-6"
              asChild
            >
              <Link to="/login">Back to Login</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F4F6] via-[#9CBBDC] to-[#3A6EA5] flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#3A6EA5] to-[#9CBBDC] flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-3xl">M</span>
            </div>
            <span className="text-4xl font-bold text-[#1a1a1a]">MARN</span>
          </div>
          <h1 className="text-5xl font-bold text-[#1a1a1a] mb-6">
            Forgot Your Password?
          </h1>
          <p className="text-xl text-[#4a5565] mb-8">
            No worries! Enter your email address and we'll send you instructions to reset your password.
          </p>
          <div className="space-y-4">
            {[
              'Reset link valid for 24 hours',
              'Secure password recovery',
              'Access restored in minutes'
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

        {/* Right Side - Reset Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl shadow-[#3A6EA5]/20">
            {/* Back to Login Link */}
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-[#4a5565] hover:text-[#3A6EA5] transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </Link>

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#1a1a1a] mb-2">Reset Your Password</h2>
              <p className="text-[#4a5565]">
                Enter your email to receive reset instructions
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <Label htmlFor="email" className="text-[#1a1a1a] mb-2 block">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4a5565]" />
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    className={`pl-12 pr-4 py-6 bg-[#F2F4F6] rounded-xl border-[#3A6EA5]/20 focus:border-[#3A6EA5] ${
                      error ? 'border-red-500 focus:border-red-500' : ''
                    }`}
                    placeholder="you@example.com"
                    disabled={isLoading}
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-500 mt-2">{error}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                disabled={!email || !isEmailValid || isLoading}
                className="w-full bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2a5a8a] hover:to-[#3A6EA5] text-white rounded-xl py-6 shadow-lg shadow-[#3A6EA5]/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </div>
                ) : (
                  'Send Reset Link'
                )}
              </Button>
            </form>

            {/* Help Text */}
            <div className="mt-8 p-4 bg-[#F2F4F6] rounded-2xl border border-[#3A6EA5]/20">
              <p className="text-sm text-[#4a5565] text-center">
                Remember your password?{' '}
                <Link to="/login" className="text-[#3A6EA5] hover:underline font-semibold">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}