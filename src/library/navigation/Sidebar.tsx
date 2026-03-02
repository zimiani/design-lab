import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { registerComponent } from '../registry'

export interface SidebarItem {
  id: string
  label: string
  icon: ReactNode
}

export interface SidebarProps {
  items: SidebarItem[]
  activeId: string
  onChange: (id: string) => void
  header?: ReactNode
}

export default function Sidebar({
  items,
  activeId,
  onChange,
  header,
}: SidebarProps) {
  return (
    <aside data-component="Sidebar" className="w-[240px] h-full bg-surface-primary border-r border-border-default flex flex-col shrink-0">
      {header && (
        <div className="px-[var(--token-spacing-5)] py-[var(--token-spacing-5)]">
          {header}
        </div>
      )}
      <nav className="flex flex-col gap-[var(--token-spacing-1)] px-[var(--token-spacing-3)] py-[var(--token-spacing-2)]">
        {items.map((item) => {
          const active = item.id === activeId
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={cn(
                'flex items-center gap-[var(--token-spacing-3)] h-[48px] px-[var(--token-spacing-3)] rounded-[var(--token-radius-md)] transition-colors duration-[var(--token-transition-fast)] cursor-pointer border-0 bg-transparent w-full text-left',
                active
                  ? 'bg-surface-secondary text-content-primary font-medium'
                  : 'text-content-secondary hover:bg-surface-secondary'
              )}
            >
              <span className="w-[20px] h-[20px] flex items-center justify-center shrink-0">
                {item.icon}
              </span>
              <span className="text-[length:var(--token-font-size-body-md)] leading-[var(--token-line-height-body-md)]">
                {item.label}
              </span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

registerComponent({
  name: 'Sidebar',
  category: 'navigation',
  description: 'Vertical navigation sidebar for desktop. 240px wide with icon + label nav items. Replaces TabBar on desktop viewports.',
  component: Sidebar,
  props: [
    { name: 'items', type: 'SidebarItem[]', required: true, description: 'Navigation items with id, label, and icon' },
    { name: 'activeId', type: 'string', required: true, description: 'Currently active item ID' },
    { name: 'onChange', type: '(id: string) => void', required: true, description: 'Handler called when a nav item is clicked' },
    { name: 'header', type: 'ReactNode', required: false, description: 'Logo or branding at the top of the sidebar' },
  ],
})
