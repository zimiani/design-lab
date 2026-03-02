import { type ChangeEvent } from 'react'
import { registerComponent } from '../registry'

const DEFAULT_TOKEN_ICON = 'https://coin-images.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png'

export interface CurrencyInputProps {
  label?: string
  value?: string
  onChange?: (value: string) => void
  tokenIcon?: string
  helperText?: string
  error?: string
  disabled?: boolean
  readOnly?: boolean
  className?: string
}

function formatCurrency(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (!digits) return ''
  const cents = parseInt(digits, 10)
  return (cents / 100).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function toRawDigits(formatted: string): string {
  return formatted.replace(/\D/g, '')
}

const fontFeatures = "'ss01' 1, 'ss03' 1, 'cv05' 1, 'cv10' 1, 'tnum' 1"

export default function CurrencyInput({
  label,
  value = '',
  onChange,
  tokenIcon = DEFAULT_TOKEN_ICON,
  helperText,
  error,
  disabled = false,
  readOnly = false,
  className = '',
}: CurrencyInputProps) {
  const hasError = !!error
  const displayValue = formatCurrency(value)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = toRawDigits(e.target.value)
    onChange?.(raw)
  }

  return (
    <div data-component="CurrencyInput" className={`flex flex-col gap-[var(--token-spacing-3)] items-end pt-[6px] pb-[var(--token-spacing-4)] ${className}`}>
      {label && (
        <span className="text-[14px] font-medium leading-[22px] text-content-tertiary">
          {label}
        </span>
      )}

      <div className={`flex items-center justify-between w-full ${disabled ? 'opacity-50' : ''}`}>
        {/* Token avatar */}
        <img
          src={tokenIcon}
          alt=""
          className="w-[40px] h-[40px] rounded-full object-cover shrink-0"
        />

        {/* Value */}
        <input
          type="text"
          inputMode="numeric"
          placeholder="0,00"
          value={displayValue}
          onChange={handleChange}
          disabled={disabled}
          readOnly={readOnly}
          className="
            flex-1 min-w-0 bg-transparent outline-none
            text-[40px] font-bold leading-[40px]
            text-content-primary placeholder:text-content-tertiary
            text-right
          "
          style={{ fontFeatureSettings: fontFeatures }}
        />
      </div>

      {(helperText || error) && (
        <span
          className={`text-[length:var(--token-font-size-caption)] leading-[var(--token-line-height-caption)] ${
            hasError ? 'text-error' : 'text-content-tertiary'
          }`}
        >
          {error ?? helperText}
        </span>
      )}
    </div>
  )
}

registerComponent({
  name: 'CurrencyInput',
  category: 'inputs',
  description: 'Large currency display with token avatar. Use for swap amounts, deposit/withdrawal values, and transfer entry.',
  component: CurrencyInput,
  props: [
    { name: 'label', type: 'string', required: false, description: 'Right-aligned label above the value (e.g., "Receba")' },
    { name: 'value', type: 'string', required: false, description: 'Raw digit string' },
    { name: 'onChange', type: '(value: string) => void', required: false, description: 'Change handler (raw digits)' },
    { name: 'tokenIcon', type: 'string', required: false, defaultValue: 'AVAX logo', description: 'URL for the token avatar' },
    { name: 'helperText', type: 'string', required: false, description: 'Helper text below input' },
    { name: 'error', type: 'string', required: false, description: 'Error message' },
    { name: 'disabled', type: 'boolean', required: false, defaultValue: 'false', description: 'Disable input' },
    { name: 'readOnly', type: 'boolean', required: false, defaultValue: 'false', description: 'Read-only mode (no opacity change)' },
  ],
})
