import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'
import { LucideIcon } from 'lucide-react'

interface ToolCardProps {
  icon: LucideIcon
  title: string
  description: string
  href?: string
  onClick?: () => void
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger'
  popular?: boolean
  className?: string
}

const colorClasses = {
  primary: {
    bg: 'bg-primary-500/10',
    text: 'text-primary-400',
    border: 'border-primary-500/20',
    hover: 'hover:border-primary-500/50 hover:bg-primary-500/15',
  },
  secondary: {
    bg: 'bg-secondary-500/10',
    text: 'text-secondary-400',
    border: 'border-secondary-500/20',
    hover: 'hover:border-secondary-500/50 hover:bg-secondary-500/15',
  },
  accent: {
    bg: 'bg-accent-500/10',
    text: 'text-accent-400',
    border: 'border-accent-500/20',
    hover: 'hover:border-accent-500/50 hover:bg-accent-500/15',
  },
  success: {
    bg: 'bg-success-500/10',
    text: 'text-success-400',
    border: 'border-success-500/20',
    hover: 'hover:border-success-500/50 hover:bg-success-500/15',
  },
  warning: {
    bg: 'bg-warning-500/10',
    text: 'text-warning-400',
    border: 'border-warning-500/20',
    hover: 'hover:border-warning-500/50 hover:bg-warning-500/15',
  },
  danger: {
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    border: 'border-red-500/20',
    hover: 'hover:border-red-500/50 hover:bg-red-500/15',
  },
}

export function ToolCard({
  icon: Icon,
  title,
  description,
  href,
  onClick,
  color = 'primary',
  popular = false,
  className = '',
}: ToolCardProps) {
  const colors = colorClasses[color]

  const content = (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'group relative p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer',
        colors.border,
        colors.hover,
        'bg-slate-900/50 backdrop-blur',
        className
      )}
    >
      {/* Popular Badge */}
      {popular && (
        <div className="absolute -top-3 right-4">
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white">
            Popular
          </span>
        </div>
      )}

      {/* Icon */}
      <div className={cn(
        'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
        colors.bg
      )}>
        <Icon className={cn('w-6 h-6', colors.text)} />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-slate-400">
        {description}
      </p>

      {/* Arrow indicator */}
      <div className={cn(
        'absolute bottom-6 right-6 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0',
        colors.text
      )}>
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
    </motion.div>
  )

  if (href) {
    return <a href={href}>{content}</a>
  }

  return <div onClick={onClick}>{content}</div>
}
