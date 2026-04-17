import { useState, useCallback, type ReactNode } from 'react'
import {
  RiInformationLine,
  RiCheckLine,
  RiAlertLine,
  RiErrorWarningLine,
  RiCloseLine,
  RiArrowDownSLine,
} from '@remixicon/react'
import Avatar, { type AvatarTone } from './Avatar'
import { registerComponent } from '../registry'
import { cn } from '../../lib/cn'

export type AlertVariant = 'neutral' | 'success' | 'warning' | 'critical'

export interface AlertProps {
  title: string
  description?: string
  variant?: AlertVariant
  collapsable?: boolean
  defaultExpanded?: boolean
  dismissible?: boolean
  onDismiss?: () => void
  action?: ReactNode
  className?: string
}

const variantConfig: Record<AlertVariant, { bg: string; border: string; tone: AvatarTone | undefined; icon: ReactNode }> = {
  neutral:  { bg: 'bg-[var(--color-surface-level-1)]',          border: 'border border-[var(--token-neutral-300)]',  tone: 'neutral',  icon: <RiInformationLine size={24} /> },
  success:  { bg: 'bg-[var(--color-surface-feedback-success)]', border: 'border border-[var(--token-avocado-200)]', tone: 'success',  icon: <RiCheckLine size={24} /> },
  warning:  { bg: 'bg-[var(--color-surface-feedback-warning)]', border: 'border border-[var(--token-banana-200)]',  tone: 'warning',  icon: <RiAlertLine size={24} /> },
  critical: { bg: 'bg-[var(--color-surface-feedback-error)]',   border: 'border border-[var(--token-apple-100)]',   tone: 'critical', icon: <RiErrorWarningLine size={24} /> },
}

export default function Alert({
  title,
  description,
  variant = 'neutral',
  collapsable = false,
  defaultExpanded = false,
  dismissible = false,
  onDismiss,
  action,
  className,
}: AlertProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const [dismissed, setDismissed] = useState(false)

  const { bg, border, tone, icon } = variantConfig[variant]

  const handleDismiss = useCallback(() => {
    setDismissed(true)
    onDismiss?.()
  }, [onDismiss])

  if (dismissed) return null

  const showContent = !collapsable || expanded

  return (
    <div
      data-component="Alert"
      className={cn(
        'flex gap-[12px] items-start p-[12px] rounded-[var(--token-radius-lg)] w-full',
        bg,
        border,
        collapsable && 'cursor-pointer',
        className,
      )}
      onClick={collapsable ? () => setExpanded(!expanded) : undefined}
    >
      {/* Icon slot — md Avatar (40px) with 24px icon */}
      <Avatar size="md" tone={tone} icon={icon} />

      {/* Content */}
      <div className="flex-1 flex flex-col gap-[8px] min-w-0 py-[2px]">
        <div className="flex flex-col gap-[2px]">
          <span
            data-text-id={title}
            className="text-[length:var(--token-font-size-body-md)] leading-[var(--token-line-height-body-md)] font-semibold text-[var(--color-content-primary)] tracking-[var(--token-letter-spacing-body-md)]"
          >
            {title}
          </span>

          {showContent && description && (
            <p
              data-text-id={description}
              className="text-[length:var(--token-font-size-body-sm)] leading-[var(--token-line-height-body-sm)] text-[var(--color-content-secondary)] m-0"
            >
              {description}
            </p>
          )}
        </div>

        {showContent && action && (
          <div onClick={(e) => e.stopPropagation()}>
            {action}
          </div>
        )}
      </div>

      {/* Right slot */}
      {collapsable && (
        <span
          className="shrink-0 text-[var(--color-content-secondary)] transition-transform duration-[var(--token-transition-normal)] mt-[8px]"
          style={{ transform: expanded ? 'rotate(180deg)' : undefined }}
        >
          <RiArrowDownSLine size={24} />
        </span>
      )}

      {!collapsable && dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          className="shrink-0 text-[var(--color-content-secondary)] hover:text-[var(--color-content-primary)] transition-colors cursor-pointer mt-[8px]"
        >
          <RiCloseLine size={24} />
        </button>
      )}
    </div>
  )
}

/** Inline link style matching Figma Alert prompt slot — XS Bold, brand underline */
export function AlertLink({ children, onPress }: { children: ReactNode; onPress?: () => void }) {
  return (
    <button
      type="button"
      onClick={onPress}
      className="text-[length:var(--token-font-size-caption)] leading-[var(--token-line-height-caption)] font-semibold text-[var(--color-content-primary)] cursor-pointer w-fit border-b-2 border-[var(--token-brand-500)]"
    >
      {children}
    </button>
  )
}

registerComponent({
  name: 'Alert',
  category: 'presentation',
  reviewed: true,
  description: 'Contextual message with semantic variants. Neutral uses surface-level-1; success/warning/critical use their respective feedback surface tokens. Supports collapsible content, dismissal (mutually exclusive with collapsable), and a custom action slot.',
  component: Alert,
  variants: ['neutral', 'success', 'warning', 'critical'],
  props: [
    { name: 'title',           type: 'string',                                          required: true,  description: 'Alert title' },
    { name: 'description',     type: 'string',                                          required: false, description: 'Body text below the title' },
    { name: 'variant',         type: '"neutral" | "success" | "warning" | "critical"',  required: false, defaultValue: 'neutral', description: 'Drives icon circle color — background is always surface-level-1' },
    { name: 'collapsable',     type: 'boolean',                                         required: false, defaultValue: 'false', description: 'Tapping the alert toggles description/action visibility' },
    { name: 'defaultExpanded', type: 'boolean',                                         required: false, defaultValue: 'false', description: 'Initial expanded state when collapsable' },
    { name: 'dismissible',     type: 'boolean',                                         required: false, defaultValue: 'false', description: 'Show close button — hides the alert on press' },
    { name: 'onDismiss',       type: '() => void',                                      required: false, description: 'Called after the alert is dismissed' },
    { name: 'action',          type: 'ReactNode',                                       required: false, description: 'Custom action slot — use AlertLink for the standard inline link style' },
  ],
})
