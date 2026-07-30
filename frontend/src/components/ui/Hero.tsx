import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'
import { Button } from './Button'

interface HeroProps {
  title: string
  subtitle?: string
  description?: string
  badge?: string
  badgeColor?: 'primary' | 'secondary' | 'accent'
  primaryButton?: {
    label: string
    onClick?: () => void
    href?: string
  }
  secondaryButton?: {
    label: string
    onClick?: () => void
    href?: string
  }
  alignment?: 'center' | 'left' | 'right'
  variant?: 'default' | 'gradient' | 'aurora' | 'grid'
  className?: string
  children?: React.ReactNode
}

const badgeColors = {
  primary: 'bg-primary-500/10 text-primary-400 border-primary-500/20',
  secondary: 'bg-secondary-500/10 text-secondary-400 border-secondary-500/20',
  accent: 'bg-accent-500/10 text-accent-400 border-accent-500/20',
}

const alignmentClasses = {
  center: 'text-center items-center',
  left: 'text-left items-start',
  right: 'text-right items-end',
}

export function Hero({
  title,
  subtitle,
  description,
  badge,
  badgeColor = 'primary',
  primaryButton,
  secondaryButton,
  alignment = 'center',
  variant = 'default',
  className = '',
  children,
}: HeroProps) {
  return (
    <section className={cn('relative flex flex-col gap-6 py-20 lg:py-32', alignmentClasses[alignment], className)}>
      {/* Background Variants */}
      {variant === 'gradient' && (
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary-500/5 via-transparent to-accent-500/5" />
      )}
      {variant === 'aurora' && (
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-[128px]" />
        </div>
      )}
      {variant === 'grid' && (
        <div className="absolute inset-0 -z-10 bg-grid bg-[size:40px_40px] opacity-[0.03]" />
      )}

      {/* Badge */}
      {badge && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className={cn(
            'inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium border',
            badgeColors[badgeColor]
          )}>
            {badge}
          </span>
        </motion.div>
      )}

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight"
      >
        {title}
      </motion.h1>

      {/* Subtitle */}
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl md:text-2xl text-primary-400 font-medium"
        >
          {subtitle}
        </motion.p>
      )}

      {/* Description */}
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-lg text-slate-400 max-w-2xl"
        >
          {description}
        </motion.p>
      )}

      {/* Buttons */}
      {(primaryButton || secondaryButton) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap gap-4 mt-4"
        >
          {primaryButton && (
            primaryButton.href ? (
              <a href={primaryButton.href}>
                <Button size="lg">{primaryButton.label}</Button>
              </a>
            ) : (
              <Button size="lg" onClick={primaryButton.onClick}>{primaryButton.label}</Button>
            )
          )}
          {secondaryButton && (
            secondaryButton.href ? (
              <a href={secondaryButton.href}>
                <Button variant="outline" size="lg">{secondaryButton.label}</Button>
              </a>
            ) : (
              <Button variant="outline" size="lg" onClick={secondaryButton.onClick}>{secondaryButton.label}</Button>
            )
          )}
        </motion.div>
      )}

      {/* Custom Children */}
      {children}
    </section>
  )
}
