import type { ReactNode } from 'react'
import { RiUserLine } from '@remixicon/react'
import { registerComponent } from '../registry'
import { cn } from '../../lib/cn'

export type AvatarTone = 'neutral' | 'success' | 'warning' | 'critical'

export interface AvatarProps {
  src?: string
  initials?: string
  icon?: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  tone?: AvatarTone
  bgColor?: string
  iconColor?: string
  inverted?: boolean
  overlay?: ReactNode
  badge?: boolean
  badgeColor?: string
  onPress?: () => void
  disabled?: boolean
  className?: string
}

const sizeStyles = {
  sm: 'w-[24px] h-[24px] text-[length:var(--token-font-size-body-sm)]',
  md: 'w-[40px] h-[40px] text-[length:var(--token-font-size-body-md)]',
  lg: 'w-[52px] h-[52px] text-[length:var(--token-font-size-body-lg)]',
  xl: 'w-[72px] h-[72px] text-[length:var(--token-font-size-h2)]',
} as const

const iconSizes = { sm: 16, md: 20, lg: 32, xl: 40 } as const

const overlayConfig = {
  sm: { size: 'w-[12px] h-[12px]', offset: 'right-[-1px] bottom-[-1px]' },
  md: { size: 'w-[16px] h-[16px]', offset: 'right-[-2px] bottom-[-2px]' },
  lg: { size: 'w-[24px] h-[24px]', offset: 'right-[-3px] bottom-[-3px]' },
  xl: { size: 'w-[32px] h-[32px]', offset: 'right-[-3px] bottom-[-3px]' },
} as const

const badgeConfig = {
  sm: { size: 'w-[8px] h-[8px]',   border: 'border',   position: 'top-0 right-0' },
  md: { size: 'w-[12px] h-[12px]', border: 'border-2', position: 'top-0 right-0' },
  lg: { size: 'w-[16px] h-[16px]', border: 'border-2', position: 'top-0 right-0' },
  xl: { size: 'w-[20px] h-[20px]', border: 'border-2', position: 'top-0 right-0' },
} as const

const toneStyles: Record<AvatarTone, { bg: string; color: string }> = {
  neutral:  { bg: 'var(--token-neutral-400)',        color: 'var(--color-content-primary)' },
  success:  { bg: 'var(--color-feedback-success)',   color: 'var(--token-avocado-900)' },
  warning:  { bg: 'var(--color-feedback-warning)',   color: 'var(--token-banana-900)' },
  critical: { bg: 'var(--color-feedback-error)',     color: 'var(--token-apple-50)' },
}

export default function Avatar({
  src,
  initials,
  icon,
  size = 'md',
  tone,
  bgColor,
  iconColor,
  inverted = false,
  overlay,
  badge = false,
  badgeColor = 'var(--token-apple-300)',
  onPress,
  disabled = false,
  className,
}: AvatarProps) {
  const resolvedBg    = tone ? toneStyles[tone].bg    : bgColor
  const resolvedColor = tone ? toneStyles[tone].color : iconColor

  const isGhost = !!onPress && !inverted && !tone && !resolvedBg && !src

  const base = cn(
    'inline-flex items-center justify-center shrink-0 rounded-[var(--token-radius-full)] overflow-hidden transition-colors',
    inverted
      ? 'bg-black/40 text-white'
      : isGhost
        ? 'bg-transparent text-[var(--color-content-primary)]'
        : cn(
            !resolvedBg    && 'bg-[var(--token-neutral-300)]',
            !resolvedColor && 'text-[var(--color-content-primary)]',
          ),
    onPress && !disabled && (
      inverted
        ? 'hover:bg-black/60 active:bg-black/70'
        : isGhost
          ? 'hover:bg-black/[0.06] active:bg-black/[0.10]'
          : 'hover:opacity-80 active:opacity-70'
    ),
    onPress ? (disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer') : undefined,
    sizeStyles[size],
  )

  let content: ReactNode
  if (src) {
    content = <img src={src} alt="" className="w-full h-full object-cover" />
  } else if (initials) {
    content = <span className="font-semibold">{initials.slice(0, 2).toUpperCase()}</span>
  } else {
    content = icon ?? <RiUserLine size={iconSizes[size]} />
  }

  const inlineStyle = !inverted && (resolvedBg || resolvedColor)
    ? { backgroundColor: resolvedBg, color: resolvedColor }
    : undefined

  const hasAdornments = overlay || badge
  const Tag = onPress ? 'button' : 'div'
  const interactiveProps = onPress
    ? { type: 'button' as const, onClick: disabled ? undefined : onPress, disabled }
    : {}

  if (!hasAdornments) {
    return (
      <Tag
        data-component="Avatar"
        className={cn(base, className)}
        style={inlineStyle}
        {...interactiveProps}
      >
        {content}
      </Tag>
    )
  }

  const oc = overlayConfig[size]
  const bc = badgeConfig[size]

  return (
    <Tag
      data-component="Avatar"
      className={cn('relative inline-flex shrink-0 isolate', sizeStyles[size], className)}
      {...interactiveProps}
    >
      <div className={cn(base, 'w-full h-full')} style={inlineStyle}>{content}</div>

      {overlay && (
        <div
          className={cn(
            'absolute rounded-[var(--token-radius-full)] bg-[var(--token-neutral-300)] border-2 border-[var(--color-surface-level-0)] flex items-center justify-center overflow-hidden',
            oc.size, oc.offset,
          )}
        >
          {overlay}
        </div>
      )}

      {badge && (
        <div
          className={cn(
            'absolute rounded-[var(--token-radius-full)] border-[var(--color-surface-level-0)]',
            bc.size, bc.border, bc.position,
          )}
          style={{ backgroundColor: badgeColor }}
        />
      )}
    </Tag>
  )
}

registerComponent({
  name: 'Avatar',
  category: 'presentation',
  reviewed: true,
  description: 'User or entity avatar — image, initials, or icon. Supports semantic tones (Alert icon slot) and interactive mode (icon buttons).',
  component: Avatar,
  sizes: ['sm', 'md', 'lg', 'xl'],
  props: [
    { name: 'src',        type: 'string',                                          required: false, description: 'Image URL' },
    { name: 'initials',   type: 'string',                                          required: false, description: 'Initials (max 2 chars)' },
    { name: 'icon',       type: 'ReactNode',                                       required: false, description: 'Custom icon' },
    { name: 'size',       type: '"sm" | "md" | "lg" | "xl"',                       required: false, defaultValue: 'md', description: 'Avatar size' },
    { name: 'tone',       type: '"neutral" | "success" | "warning" | "critical"',  required: false, description: 'Semantic tone — maps to DS feedback surface + icon colors' },
    { name: 'bgColor',    type: 'string',                                          required: false, description: 'Custom background color' },
    { name: 'iconColor',  type: 'string',                                          required: false, description: 'Custom icon/text color' },
    { name: 'inverted',   type: 'boolean',                                         required: false, defaultValue: 'false', description: 'Dark translucent background with white icon — for use on photos or gradient backgrounds' },
    { name: 'overlay',    type: 'ReactNode',                                       required: false, description: 'Bottom-right adornment (chain logo, etc.)' },
    { name: 'badge',      type: 'boolean',                                         required: false, defaultValue: 'false', description: 'Show notification dot at top-right' },
    { name: 'badgeColor', type: 'string',                                          required: false, defaultValue: 'var(--token-apple-300)', description: 'Badge dot color' },
    { name: 'onPress',    type: '() => void',                                      required: false, description: 'Click handler — renders as <button> when provided' },
    { name: 'disabled',   type: 'boolean',                                         required: false, defaultValue: 'false', description: 'Disable interaction' },
  ],
})
