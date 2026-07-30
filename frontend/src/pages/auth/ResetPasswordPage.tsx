import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { LockClosedIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../../hooks/useAuth'

function getPasswordStrength(password: string): { label: string; color: string; width: string } {
  if (!password) return { label: '', color: '', width: '0%' }
  const score = [
    /.{8,}/,
    /[a-z]/,
    /[A-Z]/,
    /[0-9]/,
    /[^a-zA-Z0-9]/,
  ].reduce((s, re) => s + (re.test(password) ? 1 : 0), 0)

  if (score <= 1) return { label: 'Weak', color: 'bg-red-500', width: '25%' }
  if (score <= 2) return { label: 'Fair', color: 'bg-orange-500', width: '50%' }
  if (score <= 3) return { label: 'Good', color: 'bg-yellow-500', width: '75%' }
  return { label: 'Strong', color: 'bg-accent-500', width: '100%' }
}

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const { resetPassword } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<{ password: string; confirmPassword: string }>()
  const password = watch('password', '')

  const strength = useMemo(() => getPasswordStrength(password), [password])

  const onSubmit = async (data: { password: string; confirmPassword: string }) => {
    setIsSubmitting(true)
    try {
      await resetPassword(token, data.password)
      toast.success('Password reset successfully!')
      navigate('/auth/login')
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Invalid or expired reset token')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-primary-900/20 to-slate-900 p-6">
        <div className="glass rounded-3xl p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold text-white">Invalid Reset Link</h1>
          <p className="mt-3 text-slate-400">This reset link is invalid or expired. Please request a new one.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-primary-900/20 to-slate-900 p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="glass rounded-3xl p-8 sm:p-10">
          <div className="mb-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-500/10">
              <LockClosedIcon className="h-8 w-8 text-accent-400" />
            </div>
            <h1 className="mt-6 text-2xl font-bold text-white">Reset Your Password</h1>
            <p className="mt-2 text-slate-400">Choose a new password for your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">New Password</label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="password"
                  {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'At least 8 characters' } })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-accent-500 focus:ring-1 focus:ring-accent-500"
                  placeholder="New password"
                />
              </div>
              {errors.password && <p className="mt-1.5 text-sm text-red-400">{errors.password.message}</p>}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                    <div className={`h-full rounded-full ${strength.color} transition-all duration-300`} style={{ width: strength.width }} />
                  </div>
                  <p className={`text-xs ${strength.color.replace('bg-', 'text-')}`}>{strength.label}</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Confirm New Password</label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) => value === password || 'Passwords do not match',
                  })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-accent-500 focus:ring-1 focus:ring-accent-500"
                  placeholder="Re-enter new password"
                />
              </div>
              {errors.confirmPassword && <p className="mt-1.5 text-sm text-red-400">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-accent-500 px-6 py-3.5 text-base font-semibold text-slate-900 transition-all hover:bg-accent-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
