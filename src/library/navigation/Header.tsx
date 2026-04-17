import type { ReactNode } from 'react'
import { RiArrowLeftLine, RiCloseLine } from '@remixicon/react'
import Avatar from '../display/Avatar'
import { registerComponent } from '../registry'
import { cn } from '../../lib/cn'
import { useLayout } from '../layout/LayoutProvider'

export interface HeaderProps {
  title: string
  description?: string
  onBack?: () => void
  onClose?: () => void
  rightAction?: ReactNode
  className?: string
}

export default function Header({
  title,
  description,
  onBack,
  onClose,
  rightAction,
  className = '',
}: HeaderProps) {
  const { isDesktop } = useLayout()
  const showLeftButton = !isDesktop && (onBack || onClose)

  return (
    <div data-component="Header" className={cn('w-full flex flex-col gap-[var(--token-spacing-8)]', className)}>
      {/* Top actions row */}
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-1 items-center">
          {showLeftButton && (
            <Avatar
              size="md"
              icon={onBack
                ? <RiArrowLeftLine size={24} className="text-content-primary" />
                : <RiCloseLine size={24} className="text-content-primary" />
              }
              onPress={onBack || onClose}
            />
          )}
        </div>

        {rightAction && (
          <div className="flex items-center gap-[var(--token-spacing-12)]">
            {rightAction}
          </div>
        )}
      </div>

      {/* Title + description */}
      <div className="flex flex-col gap-[var(--token-spacing-8)]">
        <h1 data-text-id={title} className="text-[length:var(--token-font-size-h1)] leading-[var(--token-line-height-h1)] font-semibold tracking-[-0.6px] text-content-primary m-0">
          {title}
        </h1>
        {description && (
          <p data-text-id={description} className="text-[length:var(--token-font-size-body-md)] leading-[var(--token-line-height-body-md)] text-content-secondary m-0">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}

registerComponent({
  name: 'Header',
  category: 'presentation',
  description: 'Screen header with back or close button, large title, and optional right action. Back and close are mutually exclusive. Right action should use Avatar size="md".',
  component: Header,
  props: [
    { name: 'title', type: 'string', required: true, description: 'Screen title (30px semibold)' },
    { name: 'description', type: 'string', required: false, description: 'Page description below the title' },
    { name: 'onBack', type: '() => void', required: false, description: 'Back arrow handler — mutually exclusive with onClose' },
    { name: 'onClose', type: '() => void', required: false, description: 'Close (X) handler — mutually exclusive with onBack' },
    { name: 'rightAction', type: 'ReactNode', required: false, description: 'Additional action element on the right — use Avatar size="md"' },
  ],
})
