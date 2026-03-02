import type { ReactNode } from 'react'
import { registerComponent } from '../registry'
import { cn } from '../../lib/cn'

export interface IconButtonProps {
  icon: ReactNode
  variant?: 'large' | 'base' | 'small' | 'no_background'
  /** Use on images or colorful backgrounds — dark translucent bg with white icon */
  inverted?: boolean
  backgroundColor?: string
  tintColor?: string
  disabled?: boolean
  onPress?: () => void
  className?: string
}

const sizeConfig = {
  large: { container: 'w-[48px] h-[48px]', icon: 30 },
  base: { container: 'w-[40px] h-[40px]', icon: 24 },
  small: { container: 'w-[32px] h-[32px]', icon: 20 },
  no_background: { container: 'w-[24px] h-[24px]', icon: 24 },
} as const

export default function IconButton({
  icon,
  variant = 'no_background',
  inverted = false,
  backgroundColor,
  disabled = false,
  onPress,
  className,
}: IconButtonProps) {
  const config = sizeConfig[variant]
  const hasBg = variant !== 'no_background'

  return (
    <button
      data-component="IconButton"
      type="button"
      onClick={disabled ? undefined : onPress}
      disabled={disabled}
      className={cn(
        config.container,
        'rounded-[var(--token-radius-full)] flex items-center justify-center shrink-0 transition-colors',
        inverted
          ? 'bg-[var(--color-neutral-900)]/60 hover:bg-[var(--color-neutral-900)]/80 text-white [&_svg]:text-white'
          : hasBg && !backgroundColor
            ? 'bg-black/[0.06] hover:bg-black/[0.10]'
            : !hasBg
              ? 'hover:bg-black/[0.06]'
              : undefined,
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        className,
      )}
      style={!inverted && hasBg && backgroundColor ? { backgroundColor } : undefined}
    >
      <span style={{ width: config.icon, height: config.icon }} className="flex items-center justify-center">
        {icon}
      </span>
    </button>
  )
}

registerComponent({
  name: 'IconButton',
  category: 'actions',
  description: 'Icon-only action trigger. Use for toolbar actions, close buttons, and compact controls.',
  component: IconButton,
  variants: ['large', 'base', 'small', 'no_background'],
  props: [
    { name: 'icon', type: 'ReactNode', required: true, description: 'Icon element' },
    { name: 'variant', type: '"large" | "base" | "small" | "no_background"', required: false, defaultValue: 'no_background', description: 'Size variant' },
    { name: 'inverted', type: 'boolean', required: false, defaultValue: 'false', description: 'Dark translucent background with white icon — use on images or colorful backgrounds.' },
    { name: 'backgroundColor', type: 'string', required: false, description: 'Custom background color' },
    { name: 'disabled', type: 'boolean', required: false, defaultValue: 'false', description: 'Disable interaction' },
    { name: 'onPress', type: '() => void', required: false, description: 'Click handler' },
  ],
})
