import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { EnvelopeIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../../hooks/useAuth'

export default function EmailVerificationPage() {
  const { user } = useAuth()
  const [countdown, setCountdown] = useState(60)
  const [isResending, setIsResending] = useState(false)

  useEffect(() => {
    if (countdown <= 0) return
    const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000)
    return () => clearInterval(timer)
  }, [countdown])

  const handleResend = async () => {
    if (countdown > 0 || isResending) return
    setIsResending(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success('Verification email resent!')
      setCountdown(60)
    } catch {
      toast.error('Failed to resend verification email')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-accent-900/20 to-slate-900 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass rounded-3xl p-8 sm:p-10 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-accent-500/10"
          >
            <EnvelopeIcon className="h-10 w-10 text-accent-400" />
          </motion.div>

          <h1 className="mt-6 text-2xl font-bold text-white">Check Your Email</h1>
          <p className="mt-3 text-slate-400 leading-relaxed">
            We have sent a verification email to{' '}
            <span className="font-medium text-white">{user?.email || 'your email'}</span>.
            Please check your inbox and click the verification link to activate your account.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 space-y-4"
          >
            <button
              onClick={handleResend}
              disabled={countdown > 0 || isResending}
              className="inline-flex items-center gap-2 rounded-2xl bg-accent-500 px-6 py-3.5 text-base font-semibold text-slate-900 transition-all hover:bg-accent-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? (
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
              ) : (
                <ArrowPathIcon className="h-5 w-5" />
              )}
              {isResending ? 'Sending...' : countdown > 0 ? `Resend in ${countdown}s` : 'Resend Email'}
            </button>

            <div className="mt-4">
              <Link to="/auth/login" className="text-sm text-accent-400 hover:text-accent-300 transition-colors">
                Change Email
              </Link>
            </div>

            <p className="text-xs text-slate-500 mt-6">
              Didn&apos;t receive the email? Check your spam folder or try a different email address.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
