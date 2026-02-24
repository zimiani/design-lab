import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react'
import { registerComponent } from '../registry'

export interface ToastProps {
  variant?: 'success' | 'error' | 'info' | 'warning'
  message: string
  visible?: boolean
  onDismiss?: () => void
  className?: string
}

const config = {
  success: { icon: CheckCircle, bg: 'bg-success', text: 'text-text-inverse' },
  error: { icon: AlertCircle, bg: 'bg-error', text: 'text-text-inverse' },
  info: { icon: Info, bg: 'bg-info', text: 'text-text-inverse' },
  warning: { icon: AlertTriangle, bg: 'bg-warning', text: 'text-text-inverse' },
} as const

export default function Toast({
  variant = 'info',
  message,
  visible = true,
  onDismiss,
  className = '',
}: ToastProps) {
  const { icon: IconComp, bg, text } = config[variant]

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={`
            flex items-center gap-[var(--token-spacing-3)]
            px-[var(--token-spacing-md)] py-[var(--token-spacing-3)]
            rounded-[var(--token-radius-md)] shadow-md
            ${bg} ${text} ${className}
          `}
        >
          <IconComp size={18} className="shrink-0" />
          <span className="flex-1 text-[length:var(--token-font-size-body-sm)] leading-[var(--token-line-height-body-sm)]">
            {message}
          </span>
          {onDismiss && (
            <button type="button" onClick={onDismiss} className="shrink-0 opacity-80 hover:opacity-100 cursor-pointer">
              <X size={16} />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

registerComponent({
  name: 'Toast',
  category: 'feedback',
  description: 'Notification toast with success, error, info, warning variants.',
  component: Toast,
  variants: ['success', 'error', 'info', 'warning'],
  props: [
    { name: 'variant', type: '"success" | "error" | "info" | "warning"', required: false, defaultValue: 'info', description: 'Toast type' },
    { name: 'message', type: 'string', required: true, description: 'Message text' },
    { name: 'visible', type: 'boolean', required: false, defaultValue: 'true', description: 'Visibility' },
    { name: 'onDismiss', type: '() => void', required: false, description: 'Dismiss handler' },
  ],
})
