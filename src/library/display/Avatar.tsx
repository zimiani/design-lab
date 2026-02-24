import type { ReactNode } from 'react'
import { User } from 'lucide-react'
import { registerComponent } from '../registry'

export interface AvatarProps {
  src?: string
  initials?: string
  icon?: ReactNode
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeStyles = {
  sm: 'w-[32px] h-[32px] text-[length:var(--token-font-size-caption)]',
  md: 'w-[40px] h-[40px] text-[length:var(--token-font-size-body-sm)]',
  lg: 'w-[56px] h-[56px] text-[length:var(--token-font-size-body-lg)]',
} as const

const iconSizes = { sm: 14, md: 18, lg: 24 } as const

export default function Avatar({
  src,
  initials,
  icon,
  size = 'md',
  className = '',
}: AvatarProps) {
  const baseClass = `
    inline-flex items-center justify-center shrink-0
    rounded-[var(--token-radius-full)] overflow-hidden
    bg-brand-100 text-brand-700 font-medium
    ${sizeStyles[size]} ${className}
  `

  if (src) {
    return (
      <div className={baseClass}>
        <img src={src} alt="" className="w-full h-full object-cover" />
      </div>
    )
  }

  if (initials) {
    return <div className={baseClass}>{initials.slice(0, 2).toUpperCase()}</div>
  }

  return (
    <div className={baseClass}>
      {icon ?? <User size={iconSizes[size]} />}
    </div>
  )
}

registerComponent({
  name: 'Avatar',
  category: 'display',
  description: 'Avatar with image, initials, or icon fallback.',
  component: Avatar,
  sizes: ['sm', 'md', 'lg'],
  props: [
    { name: 'src', type: 'string', required: false, description: 'Image URL' },
    { name: 'initials', type: 'string', required: false, description: 'Initials (max 2 chars)' },
    { name: 'icon', type: 'ReactNode', required: false, description: 'Custom icon fallback' },
    { name: 'size', type: '"sm" | "md" | "lg"', required: false, defaultValue: 'md', description: 'Avatar size' },
  ],
})
