import { registerComponent } from '../registry'

export interface AmountProps {
  value: number
  currency?: string
  size?: 'sm' | 'md' | 'lg' | 'display'
  className?: string
}

const sizeStyles = {
  sm: 'text-[length:var(--token-font-size-body-sm)] leading-[var(--token-line-height-body-sm)]',
  md: 'text-[length:var(--token-font-size-body-lg)] leading-[var(--token-line-height-body-lg)]',
  lg: 'text-[length:var(--token-font-size-heading-lg)] leading-[var(--token-line-height-heading-lg)] font-semibold',
  display: 'text-[length:var(--token-font-size-display)] leading-[var(--token-line-height-display)] font-semibold',
} as const

function formatAmount(value: number, currency: string): string {
  const formatted = Math.abs(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  const sign = value < 0 ? '-' : ''
  return `${sign}${currency} ${formatted}`
}

export default function Amount({
  value,
  currency = 'R$',
  size = 'md',
  className = '',
}: AmountProps) {
  return (
    <span className={`${sizeStyles[size]} text-text-primary tabular-nums ${className}`}>
      {formatAmount(value, currency)}
    </span>
  )
}

registerComponent({
  name: 'Amount',
  category: 'display',
  description: 'Formatted currency display with size variants.',
  component: Amount,
  sizes: ['sm', 'md', 'lg', 'display'],
  props: [
    { name: 'value', type: 'number', required: true, description: 'Numeric value' },
    { name: 'currency', type: 'string', required: false, defaultValue: 'R$', description: 'Currency symbol' },
    { name: 'size', type: '"sm" | "md" | "lg" | "display"', required: false, defaultValue: 'md', description: 'Text size' },
  ],
})
