import type { ReactNode } from 'react'
import { registerComponent } from '../registry'
import { cn } from '../../lib/cn'

export interface LinkProps {
  linkText: string
  onLinkPress?: () => void
  size?: 'xs' | 'base'
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
  disabled?: boolean
  className?: string
}

const typographyClasses = {
  xs: 'text-sm leading-[22px] tracking-[0.175px]',
  base: 'text-base leading-[24px] tracking-[0.16px]',
}

export default function Link({
  linkText,
  onLinkPress,
  size = 'xs',
  leadingIcon,
  trailingIcon,
  disabled = false,
  className = '',
}: LinkProps) {
  return (
    <button
      data-component="Link"
      onClick={disabled ? undefined : onLinkPress}
      disabled={disabled}
      className={cn(
        'inline-flex items-center gap-2 bg-transparent border-none p-0',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        className,
      )}
    >
      {leadingIcon}
      <span
        className={cn(
          'font-semibold border-b text-[var(--color-interactive-primary)] border-[var(--color-interactive-primary)] text-center',
          typographyClasses[size],
          disabled && 'text-[var(--color-interactive-disabled)]',
        )}
      >
        {linkText}
      </span>
      {trailingIcon}
    </button>
  )
}

registerComponent({
  name: 'Link',
  category: 'foundations-removed',
  description: 'Inline text link with optional icons. Use for navigation to external resources or secondary actions.',
  component: Link,
  sizes: ['xs', 'base'],
  props: [
    { name: 'linkText', type: 'string', required: true, description: 'Link display text' },
    { name: 'onLinkPress', type: '() => void', required: false, description: 'Click handler' },
    { name: 'size', type: '"xs" | "base"', required: false, defaultValue: 'xs', description: 'Text size' },
    { name: 'leadingIcon', type: 'ReactNode', required: false, description: 'Icon before text' },
    { name: 'trailingIcon', type: 'ReactNode', required: false, description: 'Icon after text' },
    { name: 'disabled', type: 'boolean', required: false, defaultValue: 'false', description: 'Disable interaction' },
  ],
})
