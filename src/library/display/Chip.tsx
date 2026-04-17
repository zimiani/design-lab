import type { ReactNode } from 'react'
import { registerComponent } from '../registry'
import { cn } from '../../lib/cn'

export type ChipVariant = 'neutral' | 'inverse' | 'positive' | 'warning' | 'critical' | 'grape' | 'guava'
export type ChipSurface = 'light' | 'dark'

export interface ChipProps {
  variant?: ChipVariant
  outline?: boolean
  surface?: ChipSurface
  icon?: ReactNode
  children: ReactNode
  className?: string
}

type StyleDef = { bg?: string; border?: string; text: string }

const variantConfig: Record<ChipVariant, Record<ChipSurface, { solid: StyleDef; outline: StyleDef }>> = {
  neutral: {
    light: {
      solid:   { bg: 'bg-[var(--color-surface-items)]',                    text: 'text-[var(--color-content-primary)]'         },
      outline: { border: 'border-[var(--color-surface-items)]',            text: 'text-[var(--color-content-secondary)]'       },
    },
    dark: {
      solid:   { bg: 'bg-[var(--color-surface-level-0)]',                  text: 'text-[var(--color-content-primary)]'         },
      outline: { border: 'border-[var(--color-content-inverse-primary)]',  text: 'text-[var(--color-content-inverse-primary)]' },
    },
  },
  inverse: {
    light: {
      solid:   { bg: 'bg-[var(--color-surface-inverse-level-0)]',          text: 'text-[var(--color-content-inverse-primary)]' },
      outline: { border: 'border-[var(--color-surface-inverse-level-0)]',  text: 'text-[var(--color-content-primary)]'         },
    },
    dark: {
      solid:   { bg: 'bg-[var(--color-surface-inverse-level-2)]',          text: 'text-[var(--color-content-inverse-primary)]' },
      outline: { border: 'border-[var(--color-content-secondary)]',        text: 'text-[var(--color-content-inverse-secondary)]' },
    },
  },
  positive: {
    light: {
      solid:   { bg: 'bg-[var(--color-feedback-success)]',                 text: 'text-[var(--color-content-inverse-primary)]' },
      outline: { border: 'border-[var(--color-feedback-success)]',         text: 'text-[var(--color-content-primary)]'         },
    },
    dark: {
      solid:   { bg: 'bg-[var(--color-feedback-success)]',                 text: 'text-[var(--color-content-inverse-primary)]' },
      outline: { border: 'border-[var(--color-feedback-success)]',         text: 'text-[var(--color-content-inverse-primary)]' },
    },
  },
  warning: {
    light: {
      solid:   { bg: 'bg-[var(--color-feedback-warning)]',                 text: 'text-[var(--color-content-primary)]'         },
      outline: { border: 'border-[var(--color-feedback-warning)]',         text: 'text-[var(--color-content-primary)]'         },
    },
    dark: {
      solid:   { bg: 'bg-[var(--color-feedback-warning)]',                 text: 'text-[var(--color-content-primary)]'         },
      outline: { border: 'border-[var(--color-feedback-warning)]',         text: 'text-[var(--color-content-inverse-primary)]' },
    },
  },
  critical: {
    light: {
      solid:   { bg: 'bg-[var(--color-feedback-error)]',                   text: 'text-[var(--color-content-inverse-primary)]' },
      outline: { border: 'border-[var(--color-feedback-error)]',           text: 'text-[var(--color-content-primary)]'         },
    },
    dark: {
      solid:   { bg: 'bg-[var(--color-feedback-error)]',                   text: 'text-[var(--color-content-inverse-primary)]' },
      outline: { border: 'border-[var(--color-feedback-error)]',           text: 'text-[var(--color-content-inverse-primary)]' },
    },
  },
  grape: {
    light: {
      solid:   { bg: 'bg-[var(--color-grape-500)]',                        text: 'text-[var(--color-content-inverse-primary)]' },
      outline: { border: 'border-[var(--color-grape-500)]',                text: 'text-[var(--color-content-primary)]'         },
    },
    dark: {
      solid:   { bg: 'bg-[var(--color-grape-500)]',                        text: 'text-[var(--color-content-inverse-primary)]' },
      outline: { border: 'border-[var(--color-grape-500)]',                text: 'text-[var(--color-content-inverse-primary)]' },
    },
  },
  guava: {
    light: {
      solid:   { bg: 'bg-[var(--color-guava-600)]',                        text: 'text-[var(--color-content-inverse-primary)]' },
      outline: { border: 'border-[var(--color-guava-600)]',                text: 'text-[var(--color-content-primary)]'         },
    },
    dark: {
      solid:   { bg: 'bg-[var(--color-guava-600)]',                        text: 'text-[var(--color-content-inverse-primary)]' },
      outline: { border: 'border-[var(--color-guava-600)]',                text: 'text-[var(--color-content-inverse-primary)]' },
    },
  },
}

export default function Chip({
  variant = 'neutral',
  outline = false,
  surface = 'light',
  icon,
  children,
  className,
}: ChipProps) {
  const { solid, outline: outlineStyle } = variantConfig[variant][surface]
  const style = outline ? outlineStyle : solid
  const textId = typeof children === 'string' ? children : typeof children === 'number' ? String(children) : undefined

  return (
    <span
      data-component="Chip"
      data-text-id={textId}
      className={cn(
        'inline-flex items-center gap-[var(--token-gap-sm)]',
        'px-[var(--token-padding-sm)] py-[var(--token-padding-xs)]',
        'rounded-[var(--token-radius-full)]',
        'text-[length:var(--token-font-size-caption)] leading-[var(--token-line-height-caption)] font-semibold',
        outline ? cn('border', style.border, style.text) : cn(style.bg, style.text),
        className,
      )}
    >
      {icon && <span className="shrink-0 inline-flex">{icon}</span>}
      {children}
    </span>
  )
}

registerComponent({
  name: 'Chip',
  category: 'presentation',
  description: 'Compact label. 7 variants × solid/outline × light/dark surface. Use surface="dark" when the chip sits on an inverse or dark background.',
  component: Chip,
  variants: ['neutral', 'inverse', 'positive', 'warning', 'critical', 'grape', 'guava'],
  props: [
    { name: 'variant', type: '"neutral" | "inverse" | "positive" | "warning" | "critical" | "grape" | "guava"', required: false, defaultValue: 'neutral', description: 'Color identity' },
    { name: 'outline', type: 'boolean',            required: false, defaultValue: 'false', description: 'Outline style — transparent bg with colored border' },
    { name: 'surface', type: '"light" | "dark"',   required: false, defaultValue: 'light', description: 'Surface context — switches text and neutral tones for dark backgrounds' },
    { name: 'icon',    type: 'ReactNode',           required: false, description: 'Leading icon' },
    { name: 'children', type: 'ReactNode',          required: true,  description: 'Label text' },
  ],
})
