import { HTMLAttributes, forwardRef } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '../../lib/utils'

interface CardProps extends Omit<HTMLMotionProps<"div">, "variant"> {
  variant?: 'default' | 'glass' | 'gradient' | 'bordered'
  hover?: boolean
  hoverEffect?: 'scale' | 'glow' | 'lift' | 'none'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const variantClasses = {
  default: 'bg-white border border-gray-200',
  glass: 'bg-white/80 border border-gray-200 shadow-sm',
  gradient: 'bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200',
  bordered: 'bg-transparent border border-gray-200',
}

const hoverEffects = {
  scale: 'hover:scale-[1.02]',
  glow: 'hover:shadow-lg hover:border-primary-200',
  lift: 'hover:-translate-y-1 hover:shadow-lg',
  none: '',
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({
    variant = 'default',
    hover = false,
    hoverEffect = 'lift',
    padding = 'md',
    className = '',
    children,
    ...props
  }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={hover ? { y: -5 } : undefined}
        className={cn(
          'rounded-2xl transition-all duration-300',
          variantClasses[variant],
          hover && hoverEffects[hoverEffect],
          paddingClasses[padding],
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

Card.displayName = 'Card'

// Card Header Component
interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  action?: React.ReactNode
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ title, description, action, className = '', children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('mb-4', className)} {...props}>
        {children || (
          <div className="flex items-start justify-between">
            <div>
              {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
              {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
            </div>
            {action && <div>{action}</div>}
          </div>
        )}
      </div>
    )
  }
)

CardHeader.displayName = 'CardHeader'

// Card Content Component
export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('', className)} {...props}>
        {children}
      </div>
    )
  }
)

CardContent.displayName = 'CardContent'

// Card Footer Component
export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('mt-4 pt-4 border-t border-gray-100', className)} {...props}>
        {children}
      </div>
    )
  }
)

CardFooter.displayName = 'CardFooter'
