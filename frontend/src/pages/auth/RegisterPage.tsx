import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { UserIcon, AtSymbolIcon, EnvelopeIcon, LockClosedIcon, UserPlusIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../../hooks/useAuth'

interface RegisterFormData {
  fullName: string
  username: string
  email: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}

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

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register: registerUser } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>()
  const password = watch('password', '')

  const strength = useMemo(() => getPasswordStrength(password), [password])

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true)
    try {
      await registerUser(data.email, data.username, data.password, data.fullName)
      toast.success('Account created successfully!')
      navigate('/dashboard')
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Registration failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hidden flex-1 flex-col justify-between bg-gradient-to-br from-accent-900 via-slate-900 to-primary-900 p-12 lg:flex">
        <div>
          <Link to="/" className="inline-flex items-center gap-3 text-lg font-semibold text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-500/20 text-accent-300">FT</span>
            FileTools
          </Link>
          <div className="mt-24">
            <div className="flex h-48 w-48 items-center justify-center rounded-3xl bg-white/5 backdrop-blur border border-white/10">
              <UserPlusIcon className="h-20 w-20 text-accent-400" />
            </div>
            <h2 className="mt-10 text-3xl font-bold text-white">Join FileTools</h2>
            <p className="mt-3 text-lg text-slate-300">Create an account to unlock premium features</p>
          </div>
        </div>
        <p className="text-sm text-slate-400">&copy; 2026 FileTools. All rights reserved.</p>
      </motion.div>

      <div className="flex flex-1 items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="glass rounded-3xl p-8 sm:p-10">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white">Create Account</h1>
              <p className="mt-2 text-slate-400">Fill in the details to get started</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    {...register('fullName', { required: 'Full name is required' })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-accent-500 focus:ring-1 focus:ring-accent-500"
                    placeholder="John Doe"
                  />
                </div>
                {errors.fullName && <p className="mt-1.5 text-sm text-red-400">{errors.fullName.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Username</label>
                <div className="relative">
                  <AtSymbolIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    {...register('username', { required: 'Username is required', minLength: { value: 3, message: 'At least 3 characters' } })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-accent-500 focus:ring-1 focus:ring-accent-500"
                    placeholder="johndoe"
                  />
                </div>
                {errors.username && <p className="mt-1.5 text-sm text-red-400">{errors.username.message}</p>}
              </div>

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

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="password"
                    {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'At least 8 characters' } })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-accent-500 focus:ring-1 focus:ring-accent-500"
                    placeholder="Create a strong password"
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
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="password"
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (value) => value === password || 'Passwords do not match',
                    })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-accent-500 focus:ring-1 focus:ring-accent-500"
                    placeholder="Re-enter your password"
                  />
                </div>
                {errors.confirmPassword && <p className="mt-1.5 text-sm text-red-400">{errors.confirmPassword.message}</p>}
              </div>

              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" {...register('acceptTerms', { required: 'You must accept the terms' })} className="mt-0.5 h-4 w-4 rounded border-white/10 bg-white/5 text-accent-500 focus:ring-accent-500" />
                <span className="text-sm text-slate-300">I accept the <Link to="/terms" className="text-accent-400 hover:text-accent-300">Terms of Service</Link> and <Link to="/privacy" className="text-accent-400 hover:text-accent-300">Privacy Policy</Link></span>
              </label>
              {errors.acceptTerms && <p className="text-sm text-red-400">{errors.acceptTerms.message}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-accent-500 px-6 py-3.5 text-base font-semibold text-slate-900 transition-all hover:bg-accent-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                ) : (
                  <>Create Account</>
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-400">
              Already have an account?{' '}
              <Link to="/auth/login" className="font-medium text-accent-400 hover:text-accent-300 transition-colors">Login</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
