import type { ReactNode } from 'react'
import { registerComponent } from '../registry'

export interface BadgeProps {
  variant?: 'neutral' | 'neutral-light' | 'inverse' | 'inverse-light' | 'positive' | 'warning' | 'critical'
  outline?: boolean
  size?: 'sm' | 'md'
  children: ReactNode
  icon?: ReactNode
  className?: string
}

const filledStyles: Record<NonNullable<BadgeProps['variant']>, string> = {
  'neutral':       'bg-[var(--color-surface-items)] text-[var(--color-content-primary)]',
  'neutral-light': 'bg-[var(--color-surface-level-0)] text-[var(--color-content-primary)]',
  'inverse':       'bg-[var(--color-surface-inverse-level-0)] text-[var(--color-content-inverse-primary)]',
  'inverse-light': 'bg-[var(--color-surface-inverse-level-2)] text-[var(--color-content-inverse-primary)]',
  'positive':      'bg-[var(--color-feedback-success)] text-[var(--color-content-inverse-primary)]',
  'warning':       'bg-[var(--color-feedback-warning)] text-[var(--color-content-primary)]',
  'critical':      'bg-[var(--color-feedback-error)] text-[var(--color-content-inverse-primary)]',
}

const outlineStyles: Record<NonNullable<BadgeProps['variant']>, string> = {
  'neutral':       'border border-[var(--color-border)] text-[var(--color-content-secondary)]',
  'neutral-light': 'border border-[var(--color-content-inverse-primary)] text-[var(--color-content-primary)]',
  'inverse':       'border border-[var(--color-content-primary)] text-[var(--color-content-primary)]',
  'inverse-light': 'border border-[var(--color-content-secondary)] text-[var(--color-content-inverse-secondary)]',
  'positive':      'border border-[var(--color-feedback-success)] text-[var(--color-content-primary)]',
  'warning':       'border border-[var(--color-feedback-warning)] text-[var(--color-content-primary)]',
  'critical':      'border border-[var(--color-feedback-error)] text-[var(--color-content-primary)]',
}

const sizeStyles = {
  sm: 'px-[8px] py-[4px] text-[12px] leading-[18px]',
  md: 'px-[12px] py-[6px] text-[14px] leading-[20px]',
} as const

export default function Badge({
  variant = 'neutral',
  outline = false,
  size = 'sm',
  children,
  icon,
  className = '',
}: BadgeProps) {
  const textId = typeof children === 'string' ? children : typeof children === 'number' ? String(children) : undefined
  const colorStyle = outline ? outlineStyles[variant] : filledStyles[variant]

  return (
    <span
      data-component="Badge"
      data-text-id={textId}
      className={`
        inline-flex items-center gap-[4px] font-semibold rounded-[var(--token-radius-full)]
        ${colorStyle}
        ${sizeStyles[size]}
        ${className}
      `}
      style={{ fontFeatureSettings: "'ss01' 1" }}
    >
      {icon}
      {children}
    </span>
  )
}

registerComponent({
  name: 'Badge',
  category: 'presentation',
  description: 'Chip/badge for status and labels. 7 semantic variants × filled or outline style.',
  component: Badge,
  variants: ['neutral', 'neutral-light', 'inverse', 'inverse-light', 'positive', 'warning', 'critical'],
  sizes: ['sm', 'md'],
  props: [
    { name: 'variant', type: '"neutral" | "neutral-light" | "inverse" | "inverse-light" | "positive" | "warning" | "critical"', required: false, defaultValue: 'neutral', description: 'Semantic color variant' },
    { name: 'outline', type: 'boolean', required: false, defaultValue: 'false', description: 'Outline style instead of filled' },
    { name: 'size', type: '"sm" | "md"', required: false, defaultValue: 'sm', description: 'Badge size' },
    { name: 'children', type: 'ReactNode', required: true, description: 'Badge content' },
    { name: 'icon', type: 'ReactNode', required: false, description: 'Leading icon' },
  ],
})
