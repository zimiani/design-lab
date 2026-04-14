import { registerComponent } from '../registry'

export interface SliderProps {
  value: number
  minimumValue: number
  maximumValue: number
  onValueChange: (value: number) => void
  step?: number
  disabled?: boolean
  showLabels?: boolean
  className?: string
}

export default function Slider({
  value,
  minimumValue,
  maximumValue,
  onValueChange,
  step = 1,
  disabled = false,
  showLabels = true,
  className = '',
}: SliderProps) {
  const percentage = ((value - minimumValue) / (maximumValue - minimumValue)) * 100

  return (
    <div data-component="Slider" className={`w-full ${className}`}>
      <div className="relative">
        {/* Track background */}
        <div className="w-full h-2 rounded-lg bg-[var(--color-surface-items)]" />
        {/* Track fill */}
        <div
          className="absolute top-0 left-0 h-2 rounded-lg transition-all duration-200 ease-out"
          style={{
            backgroundColor: 'var(--color-feedback-success)',
            width: `${percentage}%`,
          }}
        />
        {/* Thumb */}
        <div
          className="absolute top-1/2 w-7 h-7 rounded-full border-4 border-white shadow-md z-10 transition-all duration-200 ease-out -translate-y-1/2"
          style={{
            backgroundColor: 'var(--color-feedback-success)',
            left: `calc(${percentage}% - 14px)`,
          }}
        />
        {/* Hidden range input for interaction */}
        <input
          type="range"
          min={minimumValue}
          max={maximumValue}
          value={value}
          onChange={(e) => onValueChange(Number(e.target.value))}
          step={step}
          disabled={disabled}
          className="absolute top-0 left-0 w-full h-2 opacity-0 cursor-pointer z-20"
        />
      </div>

      {showLabels && (
        <div className="flex justify-between mt-4">
          <span className="text-xs text-[var(--color-content-tertiary)]">
            {minimumValue.toLocaleString()}
          </span>
          <span className="text-xs text-[var(--color-content-tertiary)]">
            {maximumValue.toLocaleString()}
          </span>
        </div>
      )}
    </div>
  )
}

registerComponent({
  name: 'Slider',
  category: 'inputs',
  description: 'Draggable range input. Use for percentage selection, volume, and amount adjustments.',
  component: Slider,
  props: [
    { name: 'value', type: 'number', required: true, description: 'Current value' },
    { name: 'minimumValue', type: 'number', required: true, description: 'Minimum value' },
    { name: 'maximumValue', type: 'number', required: true, description: 'Maximum value' },
    { name: 'onValueChange', type: '(value: number) => void', required: true, description: 'Value change handler' },
    { name: 'step', type: 'number', required: false, defaultValue: '1', description: 'Step increment' },
    { name: 'disabled', type: 'boolean', required: false, defaultValue: 'false', description: 'Disable interaction' },
    { name: 'showLabels', type: 'boolean', required: false, defaultValue: 'true', description: 'Show min/max labels' },
  ],
})
