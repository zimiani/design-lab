import { type ReactNode, useState, useEffect } from 'react'
import { useLayout } from './LayoutProvider'
import { registerComponent } from '../registry'

export interface StickyFooterProps {
  children: ReactNode
}

export default function StickyFooter({ children }: StickyFooterProps) {
  const { isDesktop, level } = useLayout()
  const [keyboardOpen, setKeyboardOpen] = useState(false)

  // Detect keyboard by listening for input focus/blur
  useEffect(() => {
    if (isDesktop) return

    function handleFocusIn(e: FocusEvent) {
      const el = e.target as HTMLElement
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        setKeyboardOpen(true)
      }
    }

    function handleFocusOut(e: FocusEvent) {
      const next = (e as FocusEvent).relatedTarget as HTMLElement | null
      if (!next || (next.tagName !== 'INPUT' && next.tagName !== 'TEXTAREA')) {
        setKeyboardOpen(false)
      }
    }

    document.addEventListener('focusin', handleFocusIn)
    document.addEventListener('focusout', handleFocusOut)
    return () => {
      document.removeEventListener('focusin', handleFocusIn)
      document.removeEventListener('focusout', handleFocusOut)
    }
  }, [isDesktop])

  if (isDesktop) {
    return (
      <div data-component="StickyFooter" className="shrink-0 px-[var(--token-spacing-24)] py-[var(--token-spacing-16)]">
        {children}
      </div>
    )
  }

  // Compact padding when keyboard is open or tabbar is rendered (level 1)
  const isCompact = keyboardOpen || level === 1

  return (
    <div
      data-component="StickyFooter"
      className="relative shrink-0 px-[var(--token-spacing-24)] pt-0 bg-surface-level-0"
      style={{
        paddingBottom: isCompact ? 8 : 32,
        transition: 'padding-bottom 200ms ease-out',
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 right-0 -top-[32px] h-[32px]"
        style={{ background: 'linear-gradient(to top, var(--color-surface-level-0) 0%, transparent 100%)' }}
      />
      {children}
    </div>
  )
}

registerComponent({
  name: 'StickyFooter',
  category: 'layout',
  description: 'Bottom action area. Sticky (fixed to bottom) on mobile, inline on desktop. Compact padding (8px) when keyboard is open or tabbar is rendered. Use inside BaseLayout as the last child.',
  component: StickyFooter,
  props: [
    { name: 'children', type: 'ReactNode', required: true, description: 'Footer content — typically a Button or button group' },
  ],
})
