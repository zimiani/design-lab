import { registerComponent } from '../registry'
import { cn } from '../../lib/cn'

export interface RadioOption {
  id?: string
  title: string
  description?: string
  value: string | number
  disabled?: boolean
}

export interface RadioGroupProps {
  value: string | number
  onChange: (value: string | number) => void
  options: RadioOption[]
  label?: string
  errorMessage?: string
  className?: string
}

export default function RadioGroup({
  value,
  onChange,
  options,
  label,
  errorMessage,
  className = '',
}: RadioGroupProps) {
  return (
    <div data-component="RadioGroup" className={cn('w-full flex flex-col gap-2', className)}>
      {label && (
        <span className="text-[length:var(--token-font-size-body-sm)] leading-[var(--token-line-height-body-sm)] font-medium text-content-secondary">
          {label}
        </span>
      )}

      <div className="flex flex-col gap-1">
        {options.map((option) => {
          const isSelected = option.value === value
          const isDisabled = option.disabled || false

          return (
            <button
              key={option.id || String(option.value)}
              type="button"
              onClick={() => !isDisabled && onChange(option.value)}
              disabled={isDisabled}
              className={cn(
                'w-full flex items-center justify-between gap-[var(--token-spacing-3)] py-[var(--token-spacing-3)] text-left',
                isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
              )}
            >
              <div className="flex flex-col flex-1">
                <span className={cn(
                  'text-[length:var(--token-font-size-body-md)] leading-[var(--token-line-height-body-md)] text-content-primary',
                  isDisabled && 'text-content-tertiary',
                )}>
                  {option.title}
                </span>
                {option.description && (
                  <span className={cn(
                    'text-[length:var(--token-font-size-body-sm)] leading-[var(--token-line-height-body-sm)] text-content-secondary mt-[var(--token-spacing-0-5)]',
                    isDisabled && 'text-content-tertiary',
                  )}>
                    {option.description}
                  </span>
                )}
              </div>

              {/* Radio indicator */}
              <div className={cn(
                'w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center shrink-0 transition-colors',
                isSelected && !isDisabled
                  ? 'border-[var(--token-interactive-default)]'
                  : 'border-[var(--token-neutral-300)]',
              )}>
                {isSelected && (
                  <div className={cn(
                    'w-[14px] h-[14px] rounded-full transition-colors',
                    isDisabled ? 'bg-[var(--token-neutral-300)]' : 'bg-[var(--token-interactive-default)]',
                  )} />
                )}
              </div>
            </button>
          )
        })}
      </div>

      {errorMessage && (
        <span className="text-[length:var(--token-font-size-body-sm)] leading-[var(--token-line-height-body-sm)] text-error">
          {errorMessage}
        </span>
      )}
    </div>
  )
}

registerComponent({
  name: 'RadioGroup',
  category: 'inputs',
  description: 'Mutually exclusive option selector. Use for single-choice questions in forms and settings.',
  component: RadioGroup,
  props: [
    { name: 'value', type: 'string | number', required: true, description: 'Currently selected value' },
    { name: 'onChange', type: '(value: string | number) => void', required: true, description: 'Selection handler' },
    { name: 'options', type: 'RadioOption[]', required: true, description: 'Array of options with title, value, description' },
    { name: 'label', type: 'string', required: false, description: 'Group label' },
    { name: 'errorMessage', type: 'string', required: false, description: 'Error text below the group' },
  ],
})
