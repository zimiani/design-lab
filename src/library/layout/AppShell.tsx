import type { ReactNode } from 'react'
import { useLayout } from './LayoutProvider'
import Breadcrumb from '../navigation/Breadcrumb'
import { registerComponent } from '../registry'

export interface AppShellProps {
  children: ReactNode
  sidebar: ReactNode
  tabBar?: ReactNode
  topBar?: ReactNode
}

export default function AppShell({
  children,
  sidebar,
  tabBar,
  topBar,
}: AppShellProps) {
  const { isDesktop, level, breadcrumbs } = useLayout()

  if (isDesktop) {
    return (
      <div data-component="AppShell" className="flex h-full w-full">
        {sidebar}
        <div className="flex-1 flex flex-col min-w-0 bg-background">
          {level >= 2 && breadcrumbs.length > 0 && (
            <div className="px-[var(--token-spacing-8)] pt-[var(--token-spacing-6)]">
              <Breadcrumb items={breadcrumbs} />
            </div>
          )}
          <div className="flex-1 flex justify-center overflow-y-auto py-[var(--token-spacing-8)] px-[var(--token-spacing-8)]">
            <div className="w-full max-w-[600px] bg-surface-primary rounded-xl shadow-sm overflow-hidden">
              {children}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Mobile layout
  return (
    <div data-component="AppShell" className="flex flex-col h-full w-full">
      {level === 1 && topBar}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
      {level === 1 && tabBar}
    </div>
  )
}

registerComponent({
  name: 'AppShell',
  category: 'layout',
  description: 'Root responsive container. On desktop: sidebar + white card on gray background. On mobile: optional top bar + content + tab bar (level 1 only).',
  component: AppShell,
  props: [
    { name: 'children', type: 'ReactNode', required: true, description: 'Page content rendered inside the shell' },
    { name: 'sidebar', type: 'ReactNode', required: true, description: 'Sidebar content for desktop — hidden on mobile' },
    { name: 'tabBar', type: 'ReactNode', required: false, description: 'TabBar for mobile level 1 — hidden on desktop and mobile level 2+' },
    { name: 'topBar', type: 'ReactNode', required: false, description: 'Optional top bar for mobile level 1' },
  ],
})
