import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { RiLoader4Line, RiLoader5Line } from '@remixicon/react'
import { cn } from '@/lib/cn'
import { registerComponent } from '../registry'

export type ButtonVariant = 'primary' | 'secondary' | 'minimal' | 'destructive'
export type ButtonSize = 'xs' | 'sm' | 'base'

export interface ButtonProps {
  variant?: ButtonVariant
  /** xs=26px, sm=38px, base=56px. Legacy aliases accepted: sm→xs, md→sm, lg→base */
  size?: ButtonSize | 'md' | 'lg'
  inverse?: boolean
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  children: ReactNode
  subtitle?: string
  icon?: ReactNode
  trailingIcon?: ReactNode
  onPress?: () => void
  className?: string
  style?: React.CSSProperties
}

function resolveSize(size: ButtonProps['size']): ButtonSize {
  if (size === 'lg') return 'base'
  if (size === 'md') return 'sm'
  return (size as ButtonSize) ?? 'sm'
}

// Dimensions per size
const SIZES: Record<ButtonSize, { h: string; px: string; gap: string; radius: string; text: string; leading: string; tracking: string; iconPx: number }> = {
  base: { h: 'h-[56px]', px: 'px-[32px]', gap: 'gap-[8px]', radius: 'rounded-[var(--token-radius-md)]', text: 'text-[16px]', leading: 'leading-[24px]', tracking: 'tracking-[-0.01em]', iconPx: 20 },
  sm:   { h: 'h-[38px]', px: 'px-[12px]', gap: 'gap-[4px]',  radius: 'rounded-[var(--token-radius-sm)]', text: 'text-[14px]', leading: 'leading-[22px]', tracking: '',               iconPx: 20 },
  xs:   { h: 'h-[26px]', px: 'px-[8px]',  gap: 'gap-[4px]',  radius: 'rounded-[var(--token-radius-full)]', text: 'text-[12px]', leading: 'leading-[18px]', tracking: '',             iconPx: 16 },
}

// Loading: left padding shrinks to accommodate spinner
const LOADING_PX: Record<ButtonSize, string> = {
  base: 'pl-[24px] pr-[32px]',
  sm:   'px-[12px]',
  xs:   'px-[8px]',
}

// Background + hover per variant+inverse (only for filled variants)
const BG: Record<ButtonVariant, Record<'default' | 'inverse', string>> = {
  primary:     { default: 'bg-[var(--color-action)] hover:bg-[var(--color-action-accent)]', inverse: 'bg-[var(--color-surface-inverse-level-0)] hover:bg-[var(--color-surface-inverse-level-1)]' },
  secondary:   { default: 'bg-[var(--color-surface-items)] hover:bg-[var(--color-surface-level-1)]', inverse: 'bg-[var(--color-surface-inverse-level-2)] hover:bg-[var(--color-surface-inverse-level-1)]' },
  minimal:     { default: '', inverse: '' },
  destructive: { default: 'bg-[var(--color-feedback-error)] hover:bg-[var(--color-feedback-error-accent)]', inverse: 'bg-[var(--color-feedback-error)] hover:bg-[var(--color-feedback-error-accent)]' },
}

// Text color per variant+inverse (active state, not disabled/loading)
const TEXT: Record<ButtonVariant, Record<'default' | 'inverse', string>> = {
  primary:     { default: 'text-[var(--color-content-primary)]', inverse: 'text-[var(--color-content-inverse-primary)]' },
  secondary:   { default: 'text-[var(--color-content-primary)]', inverse: 'text-[var(--color-content-inverse-primary)]' },
  minimal:     { default: 'text-[var(--color-content-primary)]', inverse: 'text-[var(--color-content-inverse-primary)]' },
  destructive: { default: 'text-[var(--color-content-inverse-primary)]', inverse: 'text-[var(--color-content-inverse-primary)]' },
}

// Text color when loading
const LOADING_TEXT: Record<ButtonVariant, Record<'default' | 'inverse', string>> = {
  primary:     { default: 'text-[var(--color-brand-800)]', inverse: 'text-[var(--color-surface-level-2)]' },
  secondary:   { default: 'text-[var(--color-content-secondary)]', inverse: 'text-[var(--color-surface-level-2)]' },
  minimal:     { default: 'text-[var(--color-content-primary)]', inverse: 'text-[var(--color-content-inverse-primary)]' },
  destructive: { default: 'text-[var(--color-apple-100)]', inverse: 'text-[var(--color-apple-100)]' },
}

// Icon color (CSS var string) when loading — must match LOADING_TEXT
function loadingIconColor(variant: ButtonVariant, inverse: boolean): string {
  if (variant === 'primary')     return 'var(--color-brand-800)'
  if (variant === 'secondary')   return 'var(--color-content-secondary)'
  if (variant === 'destructive') return 'var(--color-brand-800)'
  // minimal: needs inverse treatment since it has no background
  return inverse ? 'var(--color-content-inverse-primary)' : 'var(--color-content-primary)'
}

// Minimal underline/highlight color
function minimalUnderline(inverse: boolean): string {
  return inverse ? 'var(--color-content-tertiary)' : 'var(--color-action)'
}

function deriveTextId(children: ReactNode): string | undefined {
  if (typeof children === 'string') return children
  if (typeof children === 'number') return String(children)
  return undefined
}

// ─── Minimal variant ──────────────────────────────────────────────────────────

function MinimalButton({
  size, inverse, loading, disabled, fullWidth, children, icon, trailingIcon, onPress, style, className, textId,
}: {
  size: ButtonSize; inverse: boolean; loading: boolean; disabled: boolean; fullWidth: boolean
  children: ReactNode; icon?: ReactNode; trailingIcon?: ReactNode
  onPress?: () => void; style?: React.CSSProperties; className?: string; textId?: string
}) {
  const s = SIZES[size]
  const ctx = inverse ? 'inverse' : 'default'
  const textColor = disabled ? 'text-[var(--color-action-disabled)]' : loading ? LOADING_TEXT.minimal[ctx] : TEXT.minimal[ctx]
  const underline = minimalUnderline(inverse)

  return (
    <motion.button
      data-component="Button"
      data-text-id={textId}
      whileTap={disabled || loading ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      onClick={onPress}
      disabled={disabled || loading}
      style={style}
      className={cn(
        'inline-flex items-center font-semibold transition-colors duration-[var(--token-transition-fast)]',
        s.gap, s.text, s.leading, s.tracking,
        textColor,
        disabled || loading ? 'cursor-not-allowed' : 'cursor-pointer',
        fullWidth ? 'w-full justify-center' : '',
        className,
      )}
    >
      {icon && !loading && <span className="flex-shrink-0">{icon}</span>}
      {loading ? (
        <>
          <LoadingIcon size={s.iconPx} iconColor={loadingIconColor('minimal', inverse)} />
          <span style={{ borderBottom: `2px solid ${underline}` }} className="inline-flex items-center">
            {children}
          </span>
        </>
      ) : disabled ? (
        <span className="relative inline-flex items-center">
          <span>{children}</span>
          <span className="absolute inset-x-0 top-1/2 border-t border-[var(--color-action-disabled)]" />
        </span>
      ) : (
        <span style={{ borderBottom: `2px solid ${underline}` }} className="inline-flex items-center">
          {children}
        </span>
      )}
      {trailingIcon && !loading && <span className="flex-shrink-0">{trailingIcon}</span>}
    </motion.button>
  )
}

// ─── Filled variants (primary, secondary, destructive) ────────────────────────

export default function Button({
  variant = 'primary',
  size: sizeProp = 'sm',
  inverse = false,
  loading = false,
  disabled = false,
  fullWidth = false,
  children,
  subtitle,
  icon,
  trailingIcon,
  onPress,
  className,
  style,
}: ButtonProps) {
  const size = resolveSize(sizeProp)
  const isDisabled = disabled || loading
  const textId = deriveTextId(children)

  if (variant === 'minimal') {
    return (
      <MinimalButton
        size={size} inverse={inverse} loading={loading} disabled={disabled} fullWidth={fullWidth}
        icon={icon} trailingIcon={trailingIcon} onPress={onPress} style={style} className={className} textId={textId}
      >
        {children}
      </MinimalButton>
    )
  }

  const ctx = inverse ? 'inverse' : 'default'
  const s = SIZES[size]

  const bg = isDisabled ? 'bg-[var(--color-action-disabled)]' : BG[variant][ctx]
  const textColor = isDisabled
    ? 'text-[var(--color-content-tertiary)]'
    : loading
      ? LOADING_TEXT[variant][ctx]
      : TEXT[variant][ctx]

  return (
    <motion.button
      data-component="Button"
      data-text-id={textId}
      whileTap={isDisabled ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      onClick={onPress}
      disabled={isDisabled}
      style={style}
      className={cn(
        'inline-flex items-center justify-center font-semibold',
        'transition-colors duration-[var(--token-transition-fast)]',
        s.h, loading ? LOADING_PX[size] : s.px, s.gap, s.radius, s.text, s.leading, s.tracking,
        bg, textColor,
        fullWidth ? 'w-full' : '',
        isDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
        className,
      )}
    >
      {loading ? (
        <>
          <LoadingIcon size={s.iconPx} iconColor={loadingIconColor(variant, inverse)} />
          {children}
        </>
      ) : subtitle ? (
        <span className="flex justify-between w-full">
          <span>{children}</span>
          <span>{subtitle}</span>
        </span>
      ) : (
        <>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          {children}
          {trailingIcon && <span className="flex-shrink-0">{trailingIcon}</span>}
        </>
      )}
    </motion.button>
  )
}

function LoadingIcon({ size, iconColor }: { size: number; iconColor: string }) {
  return (
    <span className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <RiLoader4Line size={size} className="absolute inset-0 opacity-30" style={{ color: iconColor }} />
      <RiLoader5Line size={size} className="absolute inset-0 animate-spin" style={{ color: iconColor }} />
    </span>
  )
}

registerComponent({
  name: 'Button',
  category: 'actions',
  reviewed: true,
  description: 'Triggers an action. `primary` (green/black) for main CTA, `secondary` (gray) for alternatives, `minimal` (underline) for inline actions, `destructive` for irreversible. Use `inverse` on dark backgrounds.',
  component: Button,
  variants: ['primary', 'secondary', 'minimal', 'destructive'],
  sizes: ['xs', 'sm', 'base'],
  props: [
    { name: 'variant', type: '"primary" | "secondary" | "minimal" | "destructive"', required: false, defaultValue: 'primary', description: 'Visual priority' },
    { name: 'size', type: '"xs" | "sm" | "base"', required: false, defaultValue: 'sm', description: 'xs=26px, sm=38px, base=56px' },
    { name: 'inverse', type: 'boolean', required: false, defaultValue: 'false', description: 'Dark background variant' },
    { name: 'loading', type: 'boolean', required: false, defaultValue: 'false', description: 'Show loading spinner' },
    { name: 'disabled', type: 'boolean', required: false, defaultValue: 'false', description: 'Disable interaction' },
    { name: 'fullWidth', type: 'boolean', required: false, defaultValue: 'false', description: 'Stretch to full width' },
    { name: 'children', type: 'ReactNode', required: true, description: 'Button label' },
    { name: 'icon', type: 'ReactNode', required: false, description: 'Leading icon' },
    { name: 'trailingIcon', type: 'ReactNode', required: false, description: 'Trailing icon' },
    { name: 'subtitle', type: 'string', required: false, description: 'Secondary text shown to the right' },
    { name: 'onPress', type: '() => void', required: false, description: 'Click handler' },
  ],
})
