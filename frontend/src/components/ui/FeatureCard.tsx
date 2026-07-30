import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'
import { LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  icon?: LucideIcon
  title: string
  description: string
  href?: string
  color?: 'primary' | 'secondary' | 'accent'
  className?: string
  delay?: number
}

const colorClasses = {
  primary: {
    bg: 'bg-primary-500/10',
    text: 'text-primary-400',
    gradient: 'from-primary-500/20 to-transparent',
  },
  secondary: {
    bg: 'bg-secondary-500/10',
    text: 'text-secondary-400',
    gradient: 'from-secondary-500/20 to-transparent',
  },
  accent: {
    bg: 'bg-accent-500/10',
    text: 'text-accent-400',
    gradient: 'from-accent-500/20 to-transparent',
  },
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  href,
  color = 'primary',
  className = '',
  delay = 0,
}: FeatureCardProps) {
  const colors = colorClasses[color]

  const content = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
      className={cn(
        'relative p-6 rounded-2xl bg-slate-800/30 border border-white/5',
        'hover:border-white/10 hover:bg-slate-800/50 transition-all duration-300',
        className
      )}
    >
      {/* Gradient background */}
      <div className={cn(
        'absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300',
        colors.gradient
      )} />

      <div className="relative z-10">
        {/* Icon */}
        {Icon && (
          <div className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
            colors.bg
          )}>
            <Icon className={cn('w-6 h-6', colors.text)} />
          </div>
        )}

        {/* Title */}
        <h3 className="text-lg font-semibold text-white mb-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-400 leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  )

  if (href) {
    return <a href={href}>{content}</a>
  }

  return content
}

// Feature Grid Component
interface FeatureGridProps {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4
  className?: string
}

export function FeatureGrid({ children, columns = 3, className = '' }: FeatureGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div className={cn('grid gap-6', gridCols[columns], className)}>
      {children}
    </div>
  )
}
