import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'
import { Check, X } from 'lucide-react'
import { Button } from './Button'

interface PricingPlan {
  name: string
  description: string
  price: number
  period?: string
  features: string[]
  notIncluded?: string[]
  cta?: string
  popular?: boolean
}

interface PricingCardProps {
  plan: PricingPlan
  className?: string
}

export function PricingCard({ plan, className = '' }: PricingCardProps) {
  const {
    name,
    description,
    price,
    period = 'month',
    features,
    notIncluded = [],
    cta = 'Get Started',
    popular = false,
  } = plan

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        'relative p-8 rounded-3xl border transition-all duration-300',
        popular
          ? 'bg-gradient-to-b from-primary-500/10 to-accent-500/10 border-primary-500/50 shadow-lg shadow-primary-500/20'
          : 'bg-slate-800/30 border-white/10 hover:border-white/20',
        className
      )}
    >
      {/* Popular Badge */}
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="px-4 py-1.5 text-sm font-semibold rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg">
            Most Popular
          </span>
        </div>
      )}

      {/* Plan Name */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-white">{name}</h3>
        <p className="text-sm text-slate-400 mt-1">{description}</p>
      </div>

      {/* Price */}
      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-white">${price}</span>
          {price > 0 && <span className="text-slate-400">/{period}</span>}
        </div>
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-3 text-sm text-slate-300">
            <div className="w-5 h-5 rounded-full bg-success-500/20 flex items-center justify-center flex-shrink-0">
              <Check className="w-3 h-3 text-success-400" />
            </div>
            {feature}
          </li>
        ))}
        {notIncluded.map((feature, index) => (
          <li key={index} className="flex items-center gap-3 text-sm text-slate-500">
            <div className="w-5 h-5 rounded-full bg-slate-700/50 flex items-center justify-center flex-shrink-0">
              <X className="w-3 h-3 text-slate-500" />
            </div>
            {feature}
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <Button
        variant={popular ? 'primary' : 'outline'}
        className="w-full"
        size="lg"
      >
        {cta}
      </Button>
    </motion.div>
  )
}

// Pricing Grid Component
interface PricingGridProps {
  plans: PricingPlan[]
  className?: string
}

export function PricingGrid({ plans, className = '' }: PricingGridProps) {
  return (
    <div className={cn('grid gap-8 md:grid-cols-2 lg:grid-cols-3', className)}>
      {plans.map((plan, index) => (
        <PricingCard key={index} plan={plan} />
      ))}
    </div>
  )
}
