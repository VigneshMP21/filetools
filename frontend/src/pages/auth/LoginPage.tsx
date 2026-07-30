import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { EnvelopeIcon, LockClosedIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../../hooks/useAuth'

interface LoginFormData {
  email: string
  password: string
  rememberMe: boolean
}

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>()

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true)
    try {
      await login(data.email, data.password)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Invalid email or password')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hidden flex-1 flex-col justify-between bg-gradient-to-br from-primary-900 via-slate-900 to-accent-900 p-12 lg:flex">
        <div>
          <Link to="/" className="inline-flex items-center gap-3 text-lg font-semibold text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-500/20 text-accent-300">FT</span>
            FileTools
          </Link>
          <div className="mt-24">
            <div className="flex h-48 w-48 items-center justify-center rounded-3xl bg-white/5 backdrop-blur border border-white/10">
              <ArrowRightOnRectangleIcon className="h-20 w-20 text-accent-400" />
            </div>
            <h2 className="mt-10 text-3xl font-bold text-white">Welcome Back</h2>
            <p className="mt-3 text-lg text-slate-300">Sign in to access your files and tools</p>
          </div>
        </div>
        <p className="text-sm text-slate-400">&copy; 2026 FileTools. All rights reserved.</p>
      </motion.div>

      <div className="flex flex-1 items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="glass rounded-3xl p-8 sm:p-10">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white">Sign In</h1>
              <p className="mt-2 text-slate-400">Enter your credentials to continue</p>
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

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="password"
                    {...register('password', { required: 'Password is required' })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-accent-500 focus:ring-1 focus:ring-accent-500"
                    placeholder="Enter your password"
                  />
                </div>
                {errors.password && <p className="mt-1.5 text-sm text-red-400">{errors.password.message}</p>}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" {...register('rememberMe')} className="h-4 w-4 rounded border-white/10 bg-white/5 text-accent-500 focus:ring-accent-500" />
                  <span className="text-sm text-slate-300">Remember me</span>
                </label>
                <Link to="/auth/forgot-password" className="text-sm text-accent-400 hover:text-accent-300 transition-colors">Forgot password?</Link>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-accent-500 px-6 py-3.5 text-base font-semibold text-slate-900 transition-all hover:bg-accent-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                ) : (
                  <>Sign In</>
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-400">
              Don&apos;t have an account?{' '}
              <Link to="/auth/register" className="font-medium text-accent-400 hover:text-accent-300 transition-colors">Register</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
