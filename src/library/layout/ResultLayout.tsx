import type { ReactNode } from 'react'
import { registerComponent } from '../registry'

export interface ResultLayoutProps {
  header?: ReactNode
  animation?: ReactNode
  children: ReactNode
  actions?: ReactNode
  className?: string
}

export default function ResultLayout({
  header,
  animation,
  children,
  actions,
  className = '',
}: ResultLayoutProps) {
  return (
    <div className={`flex flex-col h-full bg-background ${className}`}>
      {header && <div className="shrink-0">{header}</div>}
      <div className="flex-1 flex flex-col items-center justify-center px-[var(--token-spacing-lg)]">
        {animation && <div className="mb-[var(--token-spacing-lg)]">{animation}</div>}
        <div className="text-center">{children}</div>
      </div>
      {actions && (
        <div className="shrink-0 p-[var(--token-spacing-md)] flex flex-col gap-[var(--token-spacing-3)]">
          {actions}
        </div>
      )}
    </div>
  )
}

registerComponent({
  name: 'ResultLayout',
  category: 'layout',
  description: 'Centered content for success/error screens with animation.',
  component: ResultLayout,
  props: [
    { name: 'header', type: 'ReactNode', required: false, description: 'Fixed header' },
    { name: 'animation', type: 'ReactNode', required: false, description: 'Animation element' },
    { name: 'children', type: 'ReactNode', required: true, description: 'Result text content' },
    { name: 'actions', type: 'ReactNode', required: false, description: 'Bottom actions' },
  ],
})
