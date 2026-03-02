import { motion } from 'framer-motion'
import { RiCheckLine } from '@remixicon/react'
import { registerComponent } from '../registry'

export interface CheckboxProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

export default function Checkbox({
  checked = false,
  onChange,
  disabled = false,
  className = '',
}: CheckboxProps) {
  const handlePress = () => {
    if (!disabled) onChange?.(!checked)
  }

  return (
    <button
      data-component="Checkbox"
      type="button"
      onClick={handlePress}
      disabled={disabled}
      className={`flex items-center ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
    >
      <motion.div
        animate={{
          backgroundColor: checked ? 'var(--token-interactive-default)' : 'transparent',
          borderColor: checked ? 'var(--token-interactive-default)' : 'var(--token-border-strong)',
        }}
        transition={{ duration: 0.15 }}
        className="w-[22px] h-[22px] rounded-[var(--token-radius-sm)] border-2 flex items-center justify-center shrink-0"
      >
        {checked && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.15 }}>
            <RiCheckLine size={14} color="var(--token-text-inverse)" />
          </motion.div>
        )}
      </motion.div>
    </button>
  )
}

registerComponent({
  name: 'Checkbox',
  category: 'inputs',
  description: 'Check mark for boolean selection. Use inside ListItem for labeled rows.',
  component: Checkbox,
  props: [
    { name: 'checked', type: 'boolean', required: false, defaultValue: 'false', description: 'Whether checked' },
    { name: 'onChange', type: '(checked: boolean) => void', required: false, description: 'Toggle handler' },
    { name: 'disabled', type: 'boolean', required: false, defaultValue: 'false', description: 'Disable interaction' },
  ],
})
