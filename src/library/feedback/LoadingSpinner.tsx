import { motion } from 'framer-motion'
import { registerComponent } from '../registry'

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = { sm: 20, md: 32, lg: 48 } as const

export default function LoadingSpinner({
  size = 'md',
  className = '',
}: LoadingSpinnerProps) {
  const px = sizeMap[size]

  return (
    <motion.div
      data-component="LoadingSpinner"
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      style={{ width: px, height: px }}
      className={`${className}`}
    >
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <circle
          cx="12" cy="12" r="10"
          stroke="var(--token-neutral-200)"
          strokeWidth="3"
        />
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke="var(--token-interactive-default)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </motion.div>
  )
}

registerComponent({
  name: 'LoadingSpinner',
  category: 'feedback',
  description: 'Spinning indicator for async operations. Use for page loads, form submissions, and data fetching.',
  component: LoadingSpinner,
  sizes: ['sm', 'md', 'lg'],
  props: [
    { name: 'size', type: '"sm" | "md" | "lg"', required: false, defaultValue: 'md', description: 'Spinner size' },
  ],
})
