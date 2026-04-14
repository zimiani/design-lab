import type { ReactNode } from 'react'
import { registerComponent } from '../registry'
import { cn } from '../../lib/cn'

export interface SectionProps {
  children: ReactNode
  title?: string
  className?: string
}

export default function Section({ children, title, className = '' }: SectionProps) {
  return (
    <div data-component="Section" className={cn('flex flex-col gap-[var(--token-spacing-12)]', className)}>
      {title && (
        <h2 className="text-[length:var(--token-font-size-h3)] leading-[var(--token-line-height-h3)] font-semibold text-content-primary tracking-[-0.2px] m-0">
          {title}
        </h2>
      )}
      {children}
    </div>
  )
}

registerComponent({
  name: 'Section',
  category: 'layout',
  description: 'Semantic content group with optional title. BaseLayout applies 24px gap between Sections automatically.',
  component: Section,
  props: [
    { name: 'children', type: 'ReactNode', required: true, description: 'Section content' },
    { name: 'title', type: 'string', required: false, description: 'Optional heading rendered above content' },
  ],
})
