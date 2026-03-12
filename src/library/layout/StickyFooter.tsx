import type { ReactNode } from 'react'
import { useLayout } from './LayoutProvider'
import { registerComponent } from '../registry'

export interface StickyFooterProps {
  children: ReactNode
}

export default function StickyFooter({ children }: StickyFooterProps) {
  const { isDesktop } = useLayout()

  if (isDesktop) {
    return (
      <div data-component="StickyFooter" className="shrink-0 px-[var(--token-spacing-6)] py-[var(--token-spacing-4)]">
        {children}
      </div>
    )
  }

  return (
    <div data-component="StickyFooter" className="relative shrink-0 px-[var(--token-spacing-6)] pt-0 pb-[16px] bg-surface-primary">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 right-0 -top-[32px] h-[32px]"
        style={{ background: 'linear-gradient(to top, var(--color-surface-primary) 0%, transparent 100%)' }}
      />
      {children}
    </div>
  )
}

registerComponent({
  name: 'StickyFooter',
  category: 'layout',
  description: 'Bottom action area. Sticky (fixed to bottom) on mobile, inline on desktop. Use inside BaseLayout as the last child.',
  component: StickyFooter,
  props: [
    { name: 'children', type: 'ReactNode', required: true, description: 'Footer content — typically a Button or button group' },
  ],
})
