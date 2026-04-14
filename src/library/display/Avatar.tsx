import type { ReactNode } from 'react'
import { RiUserLine } from '@remixicon/react'
import { registerComponent } from '../registry'
import { cn } from '../../lib/cn'

export interface AvatarProps {
  src?: string
  initials?: string
  icon?: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  bgColor?: string
  iconColor?: string
  overlay?: ReactNode
  badge?: boolean
  badgeColor?: string
  className?: string
}

const sizeStyles = {
  sm: 'w-[32px] h-[32px] text-[length:var(--token-font-size-caption)]',
  md: 'w-[40px] h-[40px] text-[length:var(--token-font-size-body-sm)]',
  lg: 'w-[56px] h-[56px] text-[length:var(--token-font-size-body-lg)]',
  xl: 'w-[72px] h-[72px] text-[length:var(--token-font-size-h2)]',
} as const

const iconSizes = { sm: 14, md: 18, lg: 24, xl: 32 } as const

const overlaySizes = {
  sm: 'w-[16px] h-[16px]',
  md: 'w-[20px] h-[20px]',
  lg: 'w-[24px] h-[24px]',
  xl: 'w-[32px] h-[32px]',
} as const

const badgeSizes = {
  sm: 'w-[10px] h-[10px] top-0 right-0',
  md: 'w-[14px] h-[14px] top-[-1px] right-[-1px]',
  lg: 'w-[18px] h-[18px] top-[-1px] right-[-1px]',
  xl: 'w-[22px] h-[22px] top-0 right-0',
} as const

export default function Avatar({
  src,
  initials,
  icon,
  size = 'md',
  bgColor,
  iconColor,
  overlay,
  badge = false,
  badgeColor = '#EF4444',
  className,
}: AvatarProps) {
  const base = cn(
    'inline-flex items-center justify-center shrink-0 rounded-[var(--token-radius-full)] overflow-hidden font-medium',
    !bgColor && 'bg-[var(--color-surface-level-1)]',
    !iconColor && 'text-[var(--color-content-secondary)]',
    sizeStyles[size],
  )

  let content: ReactNode
  if (src) {
    content = <img src={src} alt="" className="w-full h-full object-cover" />
  } else if (initials) {
    content = initials.slice(0, 2).toUpperCase()
  } else {
    content = icon ?? <RiUserLine size={iconSizes[size]} />
  }

  const hasAdornments = overlay || badge
  const inlineStyle = (bgColor || iconColor) ? { backgroundColor: bgColor, color: iconColor } : undefined

  if (!hasAdornments) {
    return <div data-component="Avatar" className={cn(base, className)} style={inlineStyle}>{content}</div>
  }

  return (
    <div data-component="Avatar" className={cn('relative inline-flex shrink-0', sizeStyles[size], className)}>
      <div className={base} style={inlineStyle}>{content}</div>

      {overlay && (
        <div
          className={cn(
            'absolute bottom-[-2px] right-[-2px] rounded-[var(--token-radius-full)] bg-[var(--color-surface-level-1)] border-2 border-[var(--color-surface-level-0)] flex items-center justify-center overflow-hidden',
            overlaySizes[size],
          )}
        >
          {overlay}
        </div>
      )}

      {badge && (
        <div
          className={cn(
            'absolute rounded-[var(--token-radius-full)] border-2 border-[var(--color-surface-level-0)]',
            badgeSizes[size],
          )}
          style={{ backgroundColor: badgeColor }}
        />
      )}
    </div>
  )
}

registerComponent({
  name: 'Avatar',
  category: 'presentation',
  description: 'User or entity avatar with image, initials, or icon fallback. Use in profile headers, lists, and chat.',
  component: Avatar,
  sizes: ['sm', 'md', 'lg', 'xl'],
  props: [
    { name: 'src', type: 'string', required: false, description: 'Image URL' },
    { name: 'initials', type: 'string', required: false, description: 'Initials (max 2 chars)' },
    { name: 'icon', type: 'ReactNode', required: false, description: 'Custom icon' },
    { name: 'size', type: '"sm" | "md" | "lg" | "xl"', required: false, defaultValue: 'md', description: 'Avatar size' },
    { name: 'bgColor', type: 'string', required: false, description: 'Custom background color' },
    { name: 'iconColor', type: 'string', required: false, description: 'Custom icon/text color' },
    { name: 'overlay', type: 'ReactNode', required: false, description: 'Bottom-right overlay (chain logo, camera icon, etc.)' },
    { name: 'badge', type: 'boolean', required: false, defaultValue: 'false', description: 'Show notification dot at top-right' },
    { name: 'badgeColor', type: 'string', required: false, defaultValue: '#EF4444', description: 'Badge dot color' },
  ],
})
