import { type ReactNode, Children, isValidElement } from 'react'
import { registerComponent } from '../registry'
import { cn } from '../../lib/cn'
import { useLayout } from './LayoutProvider'
import StickyFooter from './StickyFooter'

export interface BaseLayoutProps {
  children: ReactNode
  className?: string
}

export default function BaseLayout({
  children,
  className = '',
}: BaseLayoutProps) {
  const { isDesktop } = useLayout()

  // Separate StickyFooter from the rest of children
  const childArray = Children.toArray(children)
  const footer = childArray.find(
    (child) => isValidElement(child) && child.type === StickyFooter
  )
  const rest = childArray.filter(
    (child) => !(isValidElement(child) && child.type === StickyFooter)
  )

  if (isDesktop) {
    // On desktop, let the AppShell card handle scrolling
    return (
      <div data-component="BaseLayout" className={cn('flex flex-col min-h-full bg-surface-level-0', className)}>
        <div className="pt-[var(--token-spacing-24)]">
          <div className="px-[var(--token-spacing-24)] pb-[48px] flex flex-col gap-[var(--token-spacing-24)]">
            {rest}
          </div>
        </div>
        {footer}
      </div>
    )
  }

  return (
    <div data-component="BaseLayout" className={cn('flex flex-col h-full bg-surface-level-0 overflow-hidden', className)}>
      <div className={cn('flex-1 overflow-y-auto pt-[var(--safe-area-top,0px)]')}>
        <div className="px-[var(--token-spacing-24)] pb-[48px] flex flex-col gap-[var(--token-spacing-24)]">
          {rest}
        </div>
      </div>
      {footer}
    </div>
  )
}

registerComponent({
  name: 'BaseLayout',
  category: 'layout',
  description: 'Full-screen scaffold with 24px horizontal margins, 24px vertical gap between children, and scrollable content. Use Header as first child, then Section/Stack to organize content. Use StickyFooter as last child for bottom actions.',
  component: BaseLayout,
  props: [
    { name: 'children', type: 'ReactNode', required: true, description: 'Page content — Header first, StickyFooter last if needed' },
  ],
})
