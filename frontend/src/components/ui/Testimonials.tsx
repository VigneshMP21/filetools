import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'
import { Star, Quote } from 'lucide-react'

interface Testimonial {
  id: number
  name: string
  role: string
  company?: string
  avatar?: string
  content: string
  rating?: number
}

interface TestimonialCardProps {
  testimonial: Testimonial
  className?: string
}

export function TestimonialCard({ testimonial, className = '' }: TestimonialCardProps) {
  const { name, role, company, content, rating = 5 } = testimonial

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        'relative p-6 rounded-2xl bg-slate-800/30 border border-white/5',
        'hover:border-white/10 transition-all duration-300',
        className
      )}
    >
      {/* Quote Icon */}
      <Quote className="absolute top-4 right-4 w-8 h-8 text-primary-500/20" />

      {/* Rating */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              'w-4 h-4',
              i < rating ? 'text-warning-400 fill-warning-400' : 'text-slate-600'
            )}
          />
        ))}
      </div>

      {/* Content */}
      <p className="text-slate-300 leading-relaxed mb-6">
        "{content}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-semibold">
          {name.charAt(0)}
        </div>
        <div>
          <p className="font-medium text-white">{name}</p>
          <p className="text-sm text-slate-400">
            {role}{company && ` at ${company}`}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

// Testimonials Grid
interface TestimonialsGridProps {
  testimonials: Testimonial[]
  columns?: 1 | 2 | 3
  className?: string
}

export function TestimonialsGrid({ testimonials, columns = 3, className = '' }: TestimonialsGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  }

  return (
    <div className={cn('grid gap-6', gridCols[columns], className)}>
      {testimonials.map((testimonial, index) => (
        <TestimonialCard key={testimonial.id} testimonial={testimonial} />
      ))}
    </div>
  )
}

// Statistics Card
interface StatCardProps {
  value: string | number
  label: string
  icon?: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function StatCard({ value, label, icon, trend, className = '' }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        'p-6 rounded-2xl bg-slate-800/30 border border-white/5',
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400">
            {icon}
          </div>
        )}
        {trend && (
          <span className={cn(
            'text-sm font-medium',
            trend.isPositive ? 'text-success-400' : 'text-danger-400'
          )}>
            {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm text-slate-400">{label}</p>
    </motion.div>
  )
}

// Statistics Grid
interface StatsGridProps {
  children: React.ReactNode
  columns?: 2 | 3 | 4
  className?: string
}

export function StatsGrid({ children, columns = 4, className = '' }: StatsGridProps) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div className={cn('grid gap-6', gridCols[columns], className)}>
      {children}
    </div>
  )
}
