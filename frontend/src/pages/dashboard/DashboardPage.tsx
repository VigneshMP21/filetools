import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  DocumentTextIcon, ServerStackIcon, ArrowTrendingUpIcon, Cog6ToothIcon,
  ClockIcon, ArrowUpTrayIcon, FolderOpenIcon, ExclamationCircleIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '../../hooks/useAuth'
import { uploadService, type FileResponse } from '../../services/upload.service'
import { formatBytes } from '../../utils/tools'

interface DashboardStats {
  totalFiles: number
  storageUsed: number
  thisWeek: number
  processing: number
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const statCards = [
  { key: 'totalFiles', icon: DocumentTextIcon, label: 'Total Files', color: 'bg-primary-500/10 text-primary-400' },
  { key: 'storageUsed', icon: ServerStackIcon, label: 'Storage Used', color: 'bg-accent-500/10 text-accent-400' },
  { key: 'thisWeek', icon: ArrowTrendingUpIcon, label: 'This Week', color: 'bg-purple-500/10 text-purple-400' },
  { key: 'processing', icon: ClockIcon, label: 'Processing', color: 'bg-yellow-500/10 text-yellow-400' },
]

const quickActions = [
  { icon: ArrowUpTrayIcon, label: 'Upload Files', to: '/dashboard/upload', desc: 'Upload new files' },
  { icon: FolderOpenIcon, label: 'My Files', to: '/dashboard/files', desc: 'Browse your files' },
  { icon: Cog6ToothIcon, label: 'Settings', to: '/dashboard/settings', desc: 'Manage preferences' },
]

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-white/5 ${className || ''}`} />
}

function StatCardSkeleton() {
  return (
    <div className="glass rounded-2xl p-6">
      <Skeleton className="h-12 w-12 mb-4" />
      <Skeleton className="h-4 w-24 mb-2" />
      <Skeleton className="h-8 w-32" />
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({ totalFiles: 0, storageUsed: 0, thisWeek: 0, processing: 0 })
  const [recentFiles, setRecentFiles] = useState<FileResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const storageLimit = 500 * 1024 * 1024
  const storagePercent = Math.min((stats.storageUsed / storageLimit) * 100, 100)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [fileRes] = await Promise.all([
          uploadService.getFiles(0, 5),
        ])
        const files = fileRes.files || []
        setRecentFiles(files)
        setStats({
          totalFiles: fileRes.total || files.length,
          storageUsed: files.reduce((acc: number, f: FileResponse) => acc + (f.file_size || 0), 0),
          thisWeek: files.filter((f: FileResponse) => {
            const created = new Date(f.created_at)
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            return created > weekAgo
          }).length,
          processing: files.filter((f: FileResponse) => f.status === 'processing').length,
        })
      } catch {
        // Handle errors silently
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  return (
    <motion.div initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }} className="space-y-8">
      <motion.div variants={fadeUp}>
        <h1 className="text-3xl font-bold text-white">
          Welcome back, {user?.full_name || user?.username || 'User'}
        </h1>
        <p className="mt-1 text-slate-400">Here&apos;s an overview of your account</p>
      </motion.div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)}
        </div>
      ) : (
        <motion.div variants={fadeUp} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon
            const value = card.key === 'storageUsed' ? formatBytes(stats[card.key]) : stats[card.key as keyof DashboardStats]
            return (
              <div key={card.key} className="glass rounded-2xl p-6">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <p className="mt-4 text-sm text-slate-400">{card.label}</p>
                <p className="mt-1 text-2xl font-bold text-white">{typeof value === 'number' ? value.toLocaleString() : value}</p>
              </div>
            )
          })}
        </motion.div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        <motion.div variants={fadeUp} className="lg:col-span-2 space-y-6">
          {isLoading ? (
            <>
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-64 w-full" />
            </>
          ) : (
            <>
              <div className="glass rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Storage Usage</h2>
                <div className="flex items-end justify-between mb-2">
                  <span className="text-sm text-slate-400">{formatBytes(stats.storageUsed)} of {formatBytes(storageLimit)}</span>
                  <span className="text-sm font-medium text-accent-400">{storagePercent.toFixed(1)}%</span>
                </div>
                <div className="h-3 w-full rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${storagePercent}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
                  />
                </div>
              </div>

              <div className="glass rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">Recent Files</h2>
                  <Link to="/dashboard/files" className="text-sm text-accent-400 hover:text-accent-300 transition-colors">View all</Link>
                </div>
                {recentFiles.length === 0 ? (
                  <div className="py-8 text-center">
                    <DocumentTextIcon className="mx-auto h-12 w-12 text-slate-500" />
                    <p className="mt-3 text-sm text-slate-400">No files uploaded yet</p>
                    <Link to="/dashboard/upload" className="mt-3 inline-flex items-center gap-1 text-sm text-accent-400 hover:text-accent-300 transition-colors">
                      <ArrowUpTrayIcon className="h-4 w-4" />
                      Upload your first file
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/5 text-left text-slate-400">
                          <th className="pb-3 pr-4 font-medium">Name</th>
                          <th className="pb-3 pr-4 font-medium">Size</th>
                          <th className="pb-3 pr-4 font-medium">Status</th>
                          <th className="pb-3 font-medium">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentFiles.map((file) => (
                          <tr key={file.id} className="border-b border-white/5 text-slate-300 last:border-0">
                            <td className="py-3 pr-4">
                              <div className="flex items-center gap-2">
                                <DocumentTextIcon className="h-4 w-4 shrink-0 text-accent-400" />
                                <span className="truncate max-w-[200px]">{file.original_name}</span>
                              </div>
                            </td>
                            <td className="py-3 pr-4 text-slate-400">{formatBytes(file.file_size)}</td>
                            <td className="py-3 pr-4">
                              <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                file.status === 'completed' ? 'bg-accent-500/10 text-accent-400' :
                                file.status === 'processing' ? 'bg-yellow-500/10 text-yellow-400' :
                                file.status === 'error' ? 'bg-red-500/10 text-red-400' :
                                'bg-slate-500/10 text-slate-400'
                              }`}>
                                {file.status || 'uploaded'}
                              </span>
                            </td>
                            <td className="py-3 text-slate-400">{new Date(file.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </motion.div>

        <motion.div variants={fadeUp} className="space-y-6">
          {isLoading ? (
            <>
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-32 w-full" />
            </>
          ) : (
            <>
              <div className="glass rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  {recentFiles.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-4">No recent activity</p>
                  ) : (
                    recentFiles.slice(0, 5).map((file, i) => (
                      <div key={file.id} className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-500/10">
                            <DocumentTextIcon className="h-4 w-4 text-accent-400" />
                          </div>
                          {i < recentFiles.length - 1 && <div className="mt-1 h-full w-px bg-white/5" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-200">{file.original_name}</p>
                          <p className="text-xs text-slate-400">{new Date(file.created_at).toLocaleDateString()} &bull; {formatBytes(file.file_size)}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="glass rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  {quickActions.map((action) => {
                    const Icon = action.icon
                    return (
                      <Link
                        key={action.to}
                        to={action.to}
                        className="flex items-center gap-3 rounded-xl border border-white/5 p-3 transition-all hover:border-accent-500/20 hover:bg-accent-500/[0.02]"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-500/10">
                          <Icon className="h-5 w-5 text-accent-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-200">{action.label}</p>
                          <p className="text-xs text-slate-400">{action.desc}</p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
