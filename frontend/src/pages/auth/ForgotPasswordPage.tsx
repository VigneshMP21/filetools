import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { EnvelopeIcon, ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../../hooks/useAuth'

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<{ email: string }>()

  const onSubmit = async (data: { email: string }) => {
    setIsSubmitting(true)
    try {
      await forgotPassword(data.email)
      setIsSent(true)
      toast.success('Reset link sent to your email')
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Failed to send reset email')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-primary-900/20 to-slate-900 p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="glass rounded-3xl p-8 sm:p-10">
          {isSent ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-accent-500/10">
                <CheckCircleIcon className="h-10 w-10 text-accent-400" />
              </div>
              <h1 className="mt-6 text-2xl font-bold text-white">Check Your Email</h1>
              <p className="mt-3 text-slate-400 leading-relaxed">
                We have sent a password reset link to your email. Please check your inbox and follow the instructions.
              </p>
              <Link
                to="/auth/login"
                className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-accent-400 hover:text-accent-300 transition-colors"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Back to Login
              </Link>
            </motion.div>
          ) : (
            <>
              <div className="mb-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-500/10">
                  <EnvelopeIcon className="h-8 w-8 text-accent-400" />
                </div>
                <h1 className="mt-6 text-2xl font-bold text-white">Forgot Password?</h1>
                <p className="mt-2 text-slate-400">Enter your email and we&apos;ll send you a reset link</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-accent-500 focus:ring-1 focus:ring-accent-500"
                      placeholder="you@example.com"
                    />
                  </div>
                  {errors.email && <p className="mt-1.5 text-sm text-red-400">{errors.email.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-accent-500 px-6 py-3.5 text-base font-semibold text-slate-900 transition-all hover:bg-accent-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <Link to="/auth/login" className="inline-flex items-center gap-2 text-sm font-medium text-accent-400 hover:text-accent-300 transition-colors">
                  <ArrowLeftIcon className="h-4 w-4" />
                  Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}
