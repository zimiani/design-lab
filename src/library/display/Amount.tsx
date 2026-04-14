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
  lg: 'text-[length:var(--token-font-size-h1)] leading-[var(--token-line-height-h1)] font-semibold',
  display: 'text-[length:var(--token-font-size-display)] leading-[var(--token-line-height-display)] font-semibold',
} as const

function formatAmount(value: number, currency: string): string {
  const formatted = Math.abs(value).toLocaleString('pt-BR', {
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
    <span data-component="Amount" className={`${sizeStyles[size]} text-text-primary tabular-nums tracking-[-0.01em] ${className}`} style={{ fontFeatureSettings: "'ss01' 1, 'ss03' 1, 'cv05' 1, 'cv10' 1, 'tnum' 1" }}>
      {formatAmount(value, currency)}
    </span>
  )
}

registerComponent({
  name: 'Amount',
  category: 'foundations-removed',
  description: 'Formatted currency value with tabular numbers. Use for balances, prices, and transaction amounts.',
  component: Amount,
  sizes: ['sm', 'md', 'lg', 'display'],
  props: [
    { name: 'value', type: 'number', required: true, description: 'Numeric value' },
    { name: 'currency', type: 'string', required: false, defaultValue: 'R$', description: 'Currency symbol' },
    { name: 'size', type: '"sm" | "md" | "lg" | "display"', required: false, defaultValue: 'md', description: 'Text size' },
  ],
})
