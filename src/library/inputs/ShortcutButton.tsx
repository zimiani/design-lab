import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { registerComponent } from '../registry'

export interface ShortcutButtonProps {
  icon: ReactNode
  label?: string
  variant?: 'primary' | 'secondary'
  disabled?: boolean
  onPress?: () => void
  className?: string
}

const variantStyles = {
  primary: 'bg-[var(--color-interactive-accent)] hover:bg-[var(--color-interactive-accent-hover)]',
  secondary: 'bg-[var(--color-interactive-secondary)] hover:opacity-80',
} as const

export default function ShortcutButton({
  icon,
  label,
  variant = 'primary',
  disabled = false,
  onPress,
  className = '',
}: ShortcutButtonProps) {
  return (
    <button
      data-component="ShortcutButton"
      onClick={disabled ? undefined : onPress}
      disabled={disabled}
      className={`flex flex-col gap-2 items-center max-w-[75px] bg-transparent border-none p-0 ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
    >
      <motion.div
        whileTap={disabled ? undefined : { scale: 0.92 }}
        className={`w-[52px] h-[52px] rounded-full flex items-center justify-center transition-colors ${variantStyles[variant]}`}
      >
        {icon}
      </motion.div>
      {label && (
        <span className="text-[var(--color-interactive-primary)] text-sm font-medium leading-[18px] tracking-[-0.28px] text-center">
          {label}
        </span>
      )}
    </button>
  )
}

registerComponent({
  name: 'ShortcutButton',
  category: 'actions',
  description: 'Circular quick-action with icon and label. Use for primary actions on home screens and dashboards.',
  component: ShortcutButton,
  variants: ['primary', 'secondary'],
  props: [
    { name: 'icon', type: 'ReactNode', required: true, description: 'Center icon' },
    { name: 'label', type: 'string', required: false, description: 'Text below button' },
    { name: 'variant', type: '"primary" | "secondary"', required: false, defaultValue: 'primary', description: 'Color variant' },
    { name: 'disabled', type: 'boolean', required: false, defaultValue: 'false', description: 'Disable interaction' },
    { name: 'onPress', type: '() => void', required: false, description: 'Click handler' },
  ],
})
