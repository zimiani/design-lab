import type { ReactNode } from 'react'
import { registerComponent } from '../registry'
import { cn } from '../../lib/cn'

export interface StackProps {
  children: ReactNode
  gap?: 'none' | 'sm' | 'default' | 'lg'
  direction?: 'column' | 'row'
  align?: 'start' | 'center' | 'end' | 'between'
  className?: string
}

const gapClasses: Record<NonNullable<StackProps['gap']>, string> = {
  none: 'gap-0',
  sm: 'gap-[var(--token-spacing-2)]',
  default: 'gap-[var(--token-spacing-4)]',
  lg: 'gap-[var(--token-spacing-6)]',
}

const alignClasses: Record<NonNullable<StackProps['align']>, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  between: 'justify-between',
}

export default function Stack({ children, gap = 'default', direction = 'column', align, className = '' }: StackProps) {
  const dirClass = direction === 'row' ? 'flex-row' : 'flex-col'
  const alignClass = align ? alignClasses[align] : ''

  return (
    <div data-component="Stack" className={cn('flex', dirClass, gapClasses[gap], alignClass, direction === 'row' && 'w-full', className)}>
      {children}
    </div>
  )
}

registerComponent({
  name: 'Stack',
  category: 'layout',
  description: 'Flex container with configurable gap and direction. Use to group items with consistent spacing — form fields, list rows, card groups, or side-by-side elements.',
  component: Stack,
  props: [
    { name: 'children', type: 'ReactNode', required: true, description: 'Items to stack' },
    { name: 'gap', type: "'none' | 'sm' | 'default' | 'lg'", required: false, description: '0px / 8px / 16px / 24px gap between children (default: 16px)' },
    { name: 'direction', type: "'column' | 'row'", required: false, defaultValue: 'column', description: 'Stack direction — column (vertical) or row (horizontal)' },
    { name: 'align', type: "'start' | 'center' | 'end' | 'between'", required: false, description: 'Cross-axis alignment (items-*) or main-axis distribution (justify-between)' },
  ],
})
