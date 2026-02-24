import { motion } from 'framer-motion'
import { registerComponent } from '../registry'

export interface ProgressBarProps {
  value: number
  max?: number
  className?: string
}

export default function ProgressBar({
  value,
  max = 100,
  className = '',
}: ProgressBarProps) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div
      className={`w-full h-[4px] bg-neutral-200 rounded-[var(--token-radius-full)] overflow-hidden ${className}`}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="h-full bg-interactive-default rounded-[var(--token-radius-full)]"
      />
    </div>
  )
}

registerComponent({
  name: 'ProgressBar',
  category: 'display',
  description: 'Horizontal progress indicator with animated fill.',
  component: ProgressBar,
  props: [
    { name: 'value', type: 'number', required: true, description: 'Current value' },
    { name: 'max', type: 'number', required: false, defaultValue: '100', description: 'Maximum value' },
  ],
})
