import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { registerComponent } from '../registry'

export interface CardProps {
  variant?: 'elevated' | 'flat'
  pressable?: boolean
  onPress?: () => void
  children: ReactNode
  className?: string
}

const variantStyles = {
  elevated: 'bg-surface-level-1 border-transparent',
  flat: 'bg-surface-level-0 border-transparent',
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
      data-component="Card"
      className={`
        rounded-[var(--token-radius-lg)] p-[var(--token-gap-lg)]
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
        data-component="Card"
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
  category: 'presentation',
  description: 'Container for grouped content. `elevated` for prominent cards, `flat` for subtle grouping.',
  component: Card,
  variants: ['elevated', 'flat'],
  props: [
    { name: 'variant', type: '"elevated" | "flat"', required: false, defaultValue: 'elevated', description: 'Visual style' },
    { name: 'pressable', type: 'boolean', required: false, defaultValue: 'false', description: 'Enable tap animation' },
    { name: 'onPress', type: '() => void', required: false, description: 'Press handler' },
    { name: 'children', type: 'ReactNode', required: true, description: 'Card content' },
  ],
})
