import type { ReactNode } from 'react'
import { registerComponent } from '../registry'
import { cn } from '../../lib/cn'

export type ChipVariant = 'neutral' | 'neutral-light' | 'inverse' | 'inverse-light' | 'positive' | 'warning' | 'critical'

export interface ChipProps {
  variant?: ChipVariant
  outline?: boolean
  icon?: ReactNode
  children: ReactNode
  className?: string
}

const variantConfig: Record<ChipVariant, {
  filled: { bg: string; text: string }
  outline: { border: string; text: string }
}> = {
  'neutral':       { filled: { bg: 'bg-[var(--color-surface-items)]',           text: 'text-[var(--color-content-primary)]'         }, outline: { border: 'border-[var(--color-surface-items)]',           text: 'text-[var(--color-content-secondary)]'        } },
  'neutral-light': { filled: { bg: 'bg-[var(--color-surface-level-0)]',          text: 'text-[var(--color-content-primary)]'         }, outline: { border: 'border-[var(--color-content-inverse-primary)]', text: 'text-[var(--color-content-inverse-primary)]'  } },
  'inverse':       { filled: { bg: 'bg-[var(--color-surface-inverse-level-0)]',  text: 'text-[var(--color-content-inverse-primary)]' }, outline: { border: 'border-[var(--color-surface-inverse-level-0)]', text: 'text-[var(--color-content-inverse-primary)]' } },
  'inverse-light': { filled: { bg: 'bg-[var(--color-surface-inverse-level-2)]',  text: 'text-[var(--color-content-inverse-primary)]' }, outline: { border: 'border-[var(--color-content-secondary)]',       text: 'text-[var(--color-content-inverse-secondary)]'} },
  'positive':      { filled: { bg: 'bg-[var(--color-feedback-success)]',         text: 'text-[var(--color-content-inverse-primary)]' }, outline: { border: 'border-[var(--color-feedback-success)]',         text: 'text-[var(--color-content-primary)]'          } },
  'warning':       { filled: { bg: 'bg-[var(--color-feedback-warning)]',         text: 'text-[var(--color-content-primary)]'         }, outline: { border: 'border-[var(--color-feedback-warning)]',         text: 'text-[var(--color-content-primary)]'          } },
  'critical':      { filled: { bg: 'bg-[var(--color-feedback-error)]',           text: 'text-[var(--color-content-inverse-primary)]' }, outline: { border: 'border-[var(--color-feedback-error)]',           text: 'text-[var(--color-content-primary)]'          } },
}

export default function Chip({
  variant = 'neutral',
  outline = false,
  icon,
  children,
  className,
}: ChipProps) {
  const config = variantConfig[variant]

  return (
    <span
      data-component="Chip"
      className={cn(
        'inline-flex items-center justify-center',
        'px-[var(--token-padding-sm)] py-[var(--token-padding-xs)]',
        'rounded-[var(--token-radius-full)]',
        'text-[length:var(--token-font-size-caption)] leading-[var(--token-line-height-caption)] font-semibold',
        outline
          ? cn('border', config.outline.border, config.outline.text)
          : cn(config.filled.bg, config.filled.text),
        className,
      )}
    >
      {icon}
      {children}
    </span>
  )
}

registerComponent({
  name: 'Chip',
  category: 'presentation',
  description: 'Compact label with semantic color variants. Supports filled and outline styles. neutral-light and inverse variants are designed for use on dark surfaces.',
  component: Chip,
  variants: ['neutral', 'neutral-light', 'inverse', 'inverse-light', 'positive', 'warning', 'critical'],
  props: [
    { name: 'variant',  type: '"neutral" | "neutral-light" | "inverse" | "inverse-light" | "positive" | "warning" | "critical"', required: false, defaultValue: 'neutral', description: 'Color scheme' },
    { name: 'outline',  type: 'boolean',   required: false, defaultValue: 'false', description: 'Outline style — transparent bg with colored border' },
    { name: 'icon',     type: 'ReactNode', required: false, description: 'Leading icon' },
    { name: 'children', type: 'ReactNode', required: true,  description: 'Label text' },
  ],
})
