import type { ReactNode } from 'react'
import { registerComponent } from '../registry'

export interface BadgeProps {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'guava' | 'grape' | 'lime' | 'none'
  size?: 'sm' | 'md'
  children: ReactNode
  icon?: ReactNode
  className?: string
}

const variantStyles = {
  success: 'bg-success-light text-success',
  warning: 'bg-warning-light text-warning',
  error: 'bg-error-light text-error',
  info: 'bg-info-light text-info',
  neutral: 'bg-neutral-100 text-neutral-600',
  guava: 'bg-[var(--color-brand-guava-300)] text-white',
  grape: 'bg-[var(--color-brand-grape-300)] text-[var(--color-brand-lime-300)]',
  lime: 'bg-[var(--color-brand-lime-300)] text-[var(--color-brand-core-500)]',
  none: 'bg-transparent border border-[var(--color-border-default)] text-[var(--color-content-secondary)]',
} as const

const sizeStyles = {
  sm: 'px-[var(--token-spacing-2)] py-[1px] text-[length:var(--token-font-size-caption)]',
  md: 'px-[var(--token-spacing-3)] py-[2px] text-[length:var(--token-font-size-body-sm)]',
} as const

export default function Badge({
  variant = 'neutral',
  size = 'sm',
  children,
  icon,
  className = '',
}: BadgeProps) {
  return (
    <span
      data-component="Badge"
      className={`
        inline-flex items-center gap-1 font-medium rounded-[var(--token-radius-full)]
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {icon}
      {children}
    </span>
  )
}

registerComponent({
  name: 'Badge',
  category: 'presentation',
  description: 'Small status indicator with color variants. Use for counts, labels, and status markers.',
  component: Badge,
  variants: ['success', 'warning', 'error', 'info', 'neutral', 'guava', 'grape', 'lime', 'none'],
  sizes: ['sm', 'md'],
  props: [
    { name: 'variant', type: '"success" | "warning" | "error" | "info" | "neutral" | "guava" | "grape" | "lime" | "none"', required: false, defaultValue: 'neutral', description: 'Color variant' },
    { name: 'size', type: '"sm" | "md"', required: false, defaultValue: 'sm', description: 'Badge size' },
    { name: 'children', type: 'ReactNode', required: true, description: 'Badge content' },
    { name: 'icon', type: 'ReactNode', required: false, description: 'Leading icon' },
  ],
})
