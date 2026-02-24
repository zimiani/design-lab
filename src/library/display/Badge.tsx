import type { ReactNode } from 'react'
import { registerComponent } from '../registry'

export interface BadgeProps {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral'
  size?: 'sm' | 'md'
  children: ReactNode
  className?: string
}

const variantStyles = {
  success: 'bg-success-light text-success',
  warning: 'bg-warning-light text-warning',
  error: 'bg-error-light text-error',
  info: 'bg-info-light text-info',
  neutral: 'bg-neutral-100 text-neutral-600',
} as const

const sizeStyles = {
  sm: 'px-[var(--token-spacing-2)] py-[1px] text-[length:var(--token-font-size-caption)]',
  md: 'px-[var(--token-spacing-3)] py-[2px] text-[length:var(--token-font-size-body-sm)]',
} as const

export default function Badge({
  variant = 'neutral',
  size = 'sm',
  children,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-[var(--token-radius-full)]
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {children}
    </span>
  )
}

registerComponent({
  name: 'Badge',
  category: 'display',
  description: 'Status badge with semantic color variants.',
  component: Badge,
  variants: ['success', 'warning', 'error', 'info', 'neutral'],
  sizes: ['sm', 'md'],
  props: [
    { name: 'variant', type: '"success" | "warning" | "error" | "info" | "neutral"', required: false, defaultValue: 'neutral', description: 'Color variant' },
    { name: 'size', type: '"sm" | "md"', required: false, defaultValue: 'sm', description: 'Badge size' },
    { name: 'children', type: 'ReactNode', required: true, description: 'Badge content' },
  ],
})
