import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { registerComponent } from '../registry'

export interface CardProps {
  variant?: 'elevated' | 'outlined' | 'flat'
  pressable?: boolean
  onPress?: () => void
  children: ReactNode
  className?: string
}

const variantStyles = {
  elevated: 'bg-surface-elevated shadow-md border-transparent',
  outlined: 'bg-surface-primary border border-border-default',
  flat: 'bg-surface-secondary border-transparent',
} as const

export default function Card({
  variant = 'elevated',
  pressable = false,
  onPress,
  children,
  className = '',
}: CardProps) {
  const content = (
    <div
      className={`
        rounded-[var(--token-radius-lg)] p-[var(--token-spacing-md)]
        ${variantStyles[variant]}
        ${pressable ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )

  if (pressable) {
    return (
      <motion.div
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        onClick={onPress}
      >
        {content}
      </motion.div>
    )
  }

  return content
}

registerComponent({
  name: 'Card',
  category: 'display',
  description: 'Container with elevated, outlined, or flat variants. Optional pressable.',
  component: Card,
  variants: ['elevated', 'outlined', 'flat'],
  props: [
    { name: 'variant', type: '"elevated" | "outlined" | "flat"', required: false, defaultValue: 'elevated', description: 'Visual style' },
    { name: 'pressable', type: 'boolean', required: false, defaultValue: 'false', description: 'Enable tap animation' },
    { name: 'onPress', type: '() => void', required: false, description: 'Press handler' },
    { name: 'children', type: 'ReactNode', required: true, description: 'Card content' },
  ],
})
