import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  UserIcon, AtSymbolIcon, EnvelopeIcon, LockClosedIcon,
  SunIcon, MoonIcon, ExclamationTriangleIcon, CheckIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../hooks/useTheme'

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

export default function DashboardSettingsPage() {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const { register: registerProfile, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors } } = useForm({
    defaultValues: {
      fullName: user?.full_name || '',
      username: user?.username || '',
      email: user?.email || '',
    },
  })

  const { register: registerPassword, handleSubmit: handlePasswordSubmit, watch: watchPassword, formState: { errors: passwordErrors } } = useForm<{
    currentPassword: string
    newPassword: string
    confirmNewPassword: string
  }>()

  const newPassword = watchPassword('newPassword', '')
  const strength = useMemo(() => getPasswordStrength(newPassword), [newPassword])

  const handleProfileSave = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    toast.success('Profile updated successfully')
  }

  const handlePasswordChange = async (data: { currentPassword: string; newPassword: string; confirmNewPassword: string }) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    toast.success('Password changed successfully')
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success('Account deleted')
    } catch {
      toast.error('Failed to delete account')
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="mt-1 text-slate-400">Manage your account preferences</p>
      </div>

      <div className="max-w-2xl space-y-8">
        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 sm:p-8"
        >
          <h2 className="text-xl font-semibold text-white">Profile Settings</h2>
          <p className="mt-1 text-sm text-slate-400">Update your personal information</p>

          <form onSubmit={handleProfileSubmit(handleProfileSave)} className="mt-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  {...registerProfile('fullName')}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-accent-500 focus:ring-1 focus:ring-accent-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Username</label>
              <div className="relative">
                <AtSymbolIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  {...registerProfile('username', { required: 'Username is required' })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-accent-500 focus:ring-1 focus:ring-accent-500"
                />
              </div>
              {profileErrors.username && <p className="mt-1.5 text-sm text-red-400">{profileErrors.username.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  {...registerProfile('email')}
                  disabled
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white/50 placeholder-slate-500 outline-none cursor-not-allowed"
                />
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-2xl bg-accent-500 px-6 py-3 text-sm font-semibold text-slate-900 transition-all hover:bg-accent-400"
            >
              <CheckIcon className="h-4 w-4" />
              Save Changes
            </button>
          </form>
        </motion.div>

        {/* Change Password */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 sm:p-8"
        >
          <h2 className="text-xl font-semibold text-white">Change Password</h2>
          <p className="mt-1 text-sm text-slate-400">Update your password regularly for security</p>

          <form onSubmit={handlePasswordSubmit(handlePasswordChange)} className="mt-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Current Password</label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="password"
                  {...registerPassword('currentPassword', { required: 'Current password is required' })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-accent-500 focus:ring-1 focus:ring-accent-500"
                  placeholder="Enter current password"
                />
              </div>
              {passwordErrors.currentPassword && <p className="mt-1.5 text-sm text-red-400">{passwordErrors.currentPassword.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">New Password</label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="password"
                  {...registerPassword('newPassword', { required: 'New password is required', minLength: { value: 8, message: 'At least 8 characters' } })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-accent-500 focus:ring-1 focus:ring-accent-500"
                  placeholder="Enter new password"
                />
              </div>
              {passwordErrors.newPassword && <p className="mt-1.5 text-sm text-red-400">{passwordErrors.newPassword.message}</p>}
              {newPassword && (
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
                  {...registerPassword('confirmNewPassword', {
                    required: 'Please confirm your new password',
                    validate: (value) => value === newPassword || 'Passwords do not match',
                  })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-accent-500 focus:ring-1 focus:ring-accent-500"
                  placeholder="Re-enter new password"
                />
              </div>
              {passwordErrors.confirmNewPassword && <p className="mt-1.5 text-sm text-red-400">{passwordErrors.confirmNewPassword.message}</p>}
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-2xl bg-accent-500 px-6 py-3 text-sm font-semibold text-slate-900 transition-all hover:bg-accent-400"
            >
              <CheckIcon className="h-4 w-4" />
              Update Password
            </button>
          </form>
        </motion.div>

        {/* Theme Preference */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6 sm:p-8"
        >
          <h2 className="text-xl font-semibold text-white">Theme Preference</h2>
          <p className="mt-1 text-sm text-slate-400">Choose your preferred appearance</p>

          <div className="mt-6">
            <button
              onClick={toggleTheme}
              className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-white/10"
            >
              {theme === 'dark' ? (
                <>
                  <SunIcon className="h-5 w-5 text-yellow-400" />
                  Switch to Light Mode
                </>
              ) : (
                <>
                  <MoonIcon className="h-5 w-5 text-accent-400" />
                  Switch to Dark Mode
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 sm:p-8"
        >
          <div className="flex items-center gap-3">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
            <div>
              <h2 className="text-xl font-semibold text-red-400">Danger Zone</h2>
              <p className="mt-1 text-sm text-red-300/70">Irreversible actions. Proceed with caution.</p>
            </div>
          </div>

          {showDeleteConfirm ? (
            <div className="mt-6 space-y-4">
              <p className="text-sm text-red-300">
                This will permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="inline-flex items-center gap-2 rounded-2xl bg-red-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  ) : (
                    'Yes, Delete My Account'
                  )}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-6 py-3 text-sm font-medium text-slate-300 transition-all hover:bg-white/5"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-3 text-sm font-medium text-red-400 transition-all hover:bg-red-500/20"
            >
              <ExclamationTriangleIcon className="h-4 w-4" />
              Delete Account
            </button>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
