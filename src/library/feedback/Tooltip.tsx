import type { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RiCloseLine } from '@remixicon/react'
import { registerComponent } from '../registry'

export interface TooltipProps {
  visible?: boolean
  onClose?: () => void
  children: ReactNode
  position?: 'top' | 'bottom'
  className?: string
}

function Arrow({ position }: { position: 'top' | 'bottom' }) {
  const isTop = position === 'top'
  return (
    <div className={`flex items-center justify-center ${isTop ? '' : 'rotate-180'}`}>
      <svg width="17" height="9" viewBox="0 0 17 9" fill="none">
        <path d="M6.79 1.37a2 2 0 0 1 3.42 0L17 9H0l6.79-7.63Z" fill="#22232F" />
      </svg>
    </div>
  )
}

export default function Tooltip({
  visible = true,
  onClose,
  children,
  position = 'top',
  className = '',
}: TooltipProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          data-component="Tooltip"
          initial={{ opacity: 0, y: position === 'top' ? 4 : -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: position === 'top' ? 4 : -4 }}
          transition={{ duration: 0.15 }}
          className={`flex flex-col items-center ${className}`}
          style={{ filter: 'drop-shadow(0px 0px 40px rgba(69, 71, 69, 0.2))' }}
        >
          {position === 'top' && <Arrow position="top" />}

          <div className="bg-[#22232F] rounded-[var(--token-radius-md)] p-[var(--token-spacing-16)] w-full overflow-hidden">
            <div className="flex gap-[var(--token-spacing-16)] items-start">
              <div className="flex-1 text-[14px] font-normal leading-[21px] text-white">
                {children}
              </div>
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="shrink-0 w-[24px] h-[24px] rounded-full bg-[var(--color-surface-items,#DBE0D8)] flex items-center justify-center cursor-pointer"
                >
                  <RiCloseLine size={16} className="text-content-primary" />
                </button>
              )}
            </div>
          </div>

          {position === 'bottom' && <Arrow position="bottom" />}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

registerComponent({
  name: 'Tooltip',
  category: 'feedback',
  description: 'Dark floating callout with arrow and close button. Use for contextual tips, onboarding hints, and inline guidance.',
  component: Tooltip,
  props: [
    { name: 'visible', type: 'boolean', required: false, defaultValue: 'true', description: 'Whether the tooltip is shown' },
    { name: 'onClose', type: '() => void', required: false, description: 'Close handler — renders close button when provided' },
    { name: 'children', type: 'ReactNode', required: true, description: 'Tooltip content (supports mixed text with bold spans)' },
    { name: 'position', type: '"top" | "bottom"', required: false, defaultValue: 'top', description: 'Arrow position — top means arrow points up' },
  ],
})
