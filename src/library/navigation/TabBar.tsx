import type { ReactNode } from 'react'
import { registerComponent } from '../registry'

export interface TabBarItem {
  id: string
  label: string
  icon: ReactNode
  activeIcon?: ReactNode
}

export interface TabBarProps {
  items: TabBarItem[]
  activeId: string
  onChange: (id: string) => void
  className?: string
}

export default function TabBar({
  items,
  activeId,
  onChange,
  className = '',
}: TabBarProps) {
  return (
    <nav
      data-component="TabBar"
      className={`
        flex items-start justify-between shrink-0
        px-[24px] py-[4px] pb-[var(--safe-area-bottom,8px)]
        bg-surface-primary border-t border-border-default
        ${className}
      `}
    >
      {items.map((item) => {
        const active = item.id === activeId
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={`
              flex flex-col items-center justify-end gap-[4px]
              w-[72px] h-[60px]
              transition-colors duration-[var(--token-transition-fast)]
              cursor-pointer
              ${active ? 'text-content-primary' : 'text-content-tertiary'}
            `}
          >
            <span className="w-[28px] h-[28px] flex items-center justify-center [&>svg]:w-[28px] [&>svg]:h-[28px]">
              {active && item.activeIcon ? item.activeIcon : item.icon}
            </span>
            <span className="text-[12px] leading-[12px] font-medium">
              {item.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}

registerComponent({
  name: 'TabBar',
  category: 'navigation',
  description: 'Bottom tab navigation for primary app sections. Use for 4-5 top-level destinations.',
  component: TabBar,
  props: [
    { name: 'items', type: 'TabBarItem[]', required: true, description: 'Tab items' },
    { name: 'activeId', type: 'string', required: true, description: 'Active tab ID' },
    { name: 'onChange', type: '(id: string) => void', required: true, description: 'Tab change handler' },
  ],
})
