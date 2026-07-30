import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
  lines?: number
}

// Basic Skeleton
export function Skeleton({
  className,
  variant = 'rectangular',
  width,
  height,
}: SkeletonProps) {
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  }

  return (
    <motion.div
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className={cn(
        'bg-slate-700/50',
        variantClasses[variant],
        className
      )}
      style={{ width, height }}
    />
  )
}

// Card Skeleton
export function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={cn('p-6 rounded-2xl bg-slate-800/30 border border-white/5', className)}>
      <div className="flex items-center gap-4 mb-4">
        <Skeleton className="w-12 h-12 rounded-xl" variant="circular" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3 mt-2" />
    </div>
  )
}

// Tool Card Skeleton
export function ToolCardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={cn('p-6 rounded-2xl bg-slate-800/30 border border-white/5', className)}>
      <div className="flex items-center gap-4 mb-4">
        <Skeleton className="w-12 h-12 rounded-xl" variant="circular" />
        <div className="flex-1">
          <Skeleton className="h-5 w-24 mb-2" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5 mt-2" />
    </div>
  )
}

// Table Row Skeleton
export function TableRowSkeleton({ columns = 4, className = '' }: { columns?: number; className?: string }) {
  return (
    <div className={cn('flex items-center gap-4 p-4 border-b border-white/5', className)}>
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} className="h-4 flex-1" />
      ))}
    </div>
  )
}

// Profile Skeleton
export function ProfileSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-4', className)}>
      <Skeleton className="w-12 h-12 rounded-full" variant="circular" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-48" />
      </div>
    </div>
  )
}

// Dashboard Stats Skeleton
export function StatsSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4', className)}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="p-6 rounded-2xl bg-slate-800/30 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="w-10 h-10 rounded-xl" variant="circular" />
            <Skeleton className="w-12 h-4 rounded" />
          </div>
          <Skeleton className="h-8 w-16 mb-1" />
          <Skeleton className="h-3 w-20" />
        </div>
      ))}
    </div>
  )
}

// Text Lines Skeleton
export function TextLinesSkeleton({
  lines = 3,
  className = '',
}: {
  lines?: number
  className?: string
}) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('h-3', i === lines - 1 ? 'w-2/3' : 'w-full')}
        />
      ))}
    </div>
  )
}

// Loading Spinner
export function Spinner({ className = '' }: { className?: string }) {
  return (
    <div className={cn('animate-spin rounded-full border-2 border-slate-700 border-t-primary-500', className)} />
  )
}

// Page Loading
export function PageLoading({ className = '' }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center min-h-[400px]', className)}>
      <div className="flex flex-col items-center gap-4">
        <Spinner className="w-10 h-10" />
        <p className="text-sm text-slate-400">Loading...</p>
      </div>
    </div>
  )
}

// Full Page Loading
export function FullPageLoading({ className = '' }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center min-h-screen bg-background', className)}>
      <div className="flex flex-col items-center gap-4">
        <Spinner className="w-12 h-12" />
        <p className="text-sm text-slate-400">Loading...</p>
      </div>
    </div>
  )
}
