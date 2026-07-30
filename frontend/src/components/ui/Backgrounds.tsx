import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

// Gradient Background Component
interface GradientBackgroundProps {
  className?: string
  children?: React.ReactNode
  variant?: 'primary' | 'aurora' | 'mesh' | 'radial'
}

export function GradientBackground({
  className = '',
  children,
  variant = 'aurora',
}: GradientBackgroundProps) {
  const variants = {
    primary: 'bg-gradient-to-br from-primary-500/20 via-background to-accent-500/20',
    aurora: '',
    mesh: '',
    radial: '',
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {variant === 'aurora' && (
        <>
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-500/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        </>
      )}
      {variant === 'mesh' && (
        <>
          <div className="absolute inset-0 bg-grid opacity-[0.03]" />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-background" />
        </>
      )}
      {variant === 'radial' && (
        <div className="absolute inset-0 bg-radial" />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

// Animated Grid Pattern
interface AnimatedGridProps {
  className?: string
  speed?: number
}

export function AnimatedGrid({ className = '', speed = 20 }: AnimatedGridProps) {
  return (
    <div
      className={cn(
        'absolute inset-0 bg-[size:40px_40px] opacity-[0.03]',
        className
      )}
      style={{
        backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
                          linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
        animation: `gridMove ${speed}s linear infinite`,
      }}
    >
      <style>{`
        @keyframes gridMove {
          0% { transform: translateY(0); }
          100% { transform: translateY(40px); }
        }
      `}</style>
    </div>
  )
}

// Dot Pattern Background
interface DotPatternProps {
  className?: string
  dotSize?: number
  gap?: number
}

export function DotPattern({
  className = '',
  dotSize = 2,
  gap = 20,
}: DotPatternProps) {
  return (
    <div
      className={cn('absolute inset-0 opacity-[0.05]', className)}
      style={{
        backgroundImage: `radial-gradient(circle, currentColor ${dotSize}px, transparent ${dotSize}px)`,
        backgroundSize: `${gap}px ${gap}px`,
      }}
    />
  )
}

// Animated Beam Effect
interface BeamProps {
  className?: string
}

export function Beam({ className = '' }: BeamProps) {
  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)}>
      <motion.div
        initial={{ x: '-100%', opacity: 0 }}
        animate={{ x: '200%', opacity: 1 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
          ease: 'easeInOut',
        }}
        className="absolute top-1/2 left-0 w-[50%] h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent"
      />
    </div>
  )
}

// Spotlight Effect
interface SpotlightProps {
  className?: string
}

export function Spotlight({ className = '' }: SpotlightProps) {
  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[100px]"
      />
    </div>
  )
}

// Shimmer Border Effect
interface ShimmerBorderProps {
  className?: string
  children: React.ReactNode
}

export function ShimmerBorder({ className = '', children }: ShimmerBorderProps) {
  return (
    <div className={cn('relative group', className)}>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 via-accent-500 to-secondary-500 rounded-2xl opacity-30 group-hover:opacity-70 blur transition duration-500" />
      <div className="relative">{children}</div>
    </div>
  )
}

// Floating Orbs
interface FloatingOrbProps {
  className?: string
  count?: number
}

export function FloatingOrbs({ className = '', count = 3 }: FloatingOrbProps) {
  const orbs = Array.from({ length: count })

  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      {orbs.map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0.2 }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            delay: i * 0.5,
            ease: 'easeInOut',
          }}
          className={cn(
            'absolute rounded-full blur-[60px]',
            i === 0 && 'w-64 h-64 bg-primary-500/20 top-10 left-10',
            i === 1 && 'w-48 h-48 bg-accent-500/20 bottom-20 right-10',
            i === 2 && 'w-40 h-40 bg-secondary-500/20 top-1/2 right-1/3'
          )}
        />
      ))}
    </div>
  )
}

// Background Container
interface BackgroundContainerProps {
  children: React.ReactNode
  variant?: 'default' | 'gradient' | 'grid' | 'dots' | 'aurora'
  className?: string
}

export function BackgroundContainer({
  children,
  variant = 'default',
  className = '',
}: BackgroundContainerProps) {
  return (
    <div className={cn('relative', className)}>
      {variant === 'gradient' && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-accent-500/5 -z-10" />
      )}
      {variant === 'grid' && <AnimatedGrid />}
      {variant === 'dots' && <DotPattern />}
      {variant === 'aurora' && <FloatingOrbs count={3} />}
      {children}
    </div>
  )
}
