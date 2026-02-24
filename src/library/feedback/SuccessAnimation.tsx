import { motion } from 'framer-motion'
import { registerComponent } from '../registry'

export interface SuccessAnimationProps {
  size?: number
  className?: string
}

export default function SuccessAnimation({
  size = 80,
  className = '',
}: SuccessAnimationProps) {
  return (
    <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <motion.svg
        viewBox="0 0 80 80"
        width={size}
        height={size}
        initial="hidden"
        animate="visible"
      >
        <motion.circle
          cx="40" cy="40" r="36"
          fill="none"
          stroke="var(--token-success)"
          strokeWidth="3"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: { pathLength: 1, opacity: 1 },
          }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
        <motion.circle
          cx="40" cy="40" r="36"
          fill="var(--token-success-light)"
          variants={{
            hidden: { scale: 0, opacity: 0 },
            visible: { scale: 1, opacity: 1 },
          }}
          transition={{ duration: 0.3, delay: 0.3 }}
        />
        <motion.path
          d="M25 40 L35 50 L55 30"
          fill="none"
          stroke="var(--token-success)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: { pathLength: 1, opacity: 1 },
          }}
          transition={{ duration: 0.3, delay: 0.5 }}
        />
      </motion.svg>
    </div>
  )
}

registerComponent({
  name: 'SuccessAnimation',
  category: 'feedback',
  description: 'Animated checkmark for success states.',
  component: SuccessAnimation,
  props: [
    { name: 'size', type: 'number', required: false, defaultValue: '80', description: 'Animation size in px' },
  ],
})
