import { motion, Variants } from 'framer-motion'

// Animation variants
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
}

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
}

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
}

export const slideInFromTop: Variants = {
  hidden: { opacity: 0, y: -100 },
  visible: { opacity: 1, y: 0 },
}

// Staggered children animation
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

// Card hover animation
export const cardHover: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
    }
  },
  hover: {
    y: -5,
    transition: {
      duration: 0.2,
    }
  }
}

// Button hover animation
export const buttonHover = {
  scale: 1.02,
  transition: {
    duration: 0.2,
  }
}

export const buttonTap = {
  scale: 0.98,
}

// Page transition
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    x: -20,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.2,
    },
  },
}

// Animation props helpers
export const getAnimationProps = (
  animation: 'fadeIn' | 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn',
  delay: number = 0
) => {
  const variants: Record<string, Variants> = {
    fadeIn,
    fadeInUp,
    fadeInDown,
    fadeInLeft,
    fadeInRight,
    scaleIn,
  }

  return {
    initial: 'hidden',
    animate: 'visible',
    variants: variants[animation],
    transition: {
      delay,
      duration: 0.5,
      ease: 'easeOut',
    },
  }
}
