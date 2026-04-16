import { useState, useCallback, type ReactNode } from 'react'
import {
  RiInformationLine,
  RiCheckLine,
  RiErrorWarningLine,
  RiCloseLine,
  RiArrowDownSLine,
} from '@remixicon/react'
import { registerComponent } from '../registry'

export interface AlertProps {
  title: string
  description?: string
  variant?: 'neutral' | 'success' | 'warning' | 'critical'
  collapsable?: boolean
  defaultExpanded?: boolean
  dismissible?: boolean
  onDismiss?: () => void
  linkText?: string
  onLinkPress?: () => void
  className?: string
}

const variantConfig: Record<
  string,
  { icon: ReactNode; bg: string; avatarBg: string; titleColor: string; descColor: string; linkColor: string }
> = {
  neutral: {
    icon: <RiInformationLine size={24} />,
    bg: 'bg-[var(--color-surface-level-1)]',
    avatarBg: 'bg-[var(--color-surface-level-1)]',
    titleColor: 'text-[var(--color-content-primary)]',
    descColor: 'text-[var(--color-content-secondary)]',
    linkColor: 'text-[var(--color-content-primary)]',
  },
  success: {
    icon: <RiCheckLine size={24} />,
    bg: 'bg-[var(--color-surface-level-1)]',
    avatarBg: 'bg-[var(--color-surface-level-1)]',
    titleColor: 'text-[var(--color-content-primary)]',
    descColor: 'text-[var(--color-content-secondary)]',
    linkColor: 'text-[var(--color-content-primary)]',
  },
  warning: {
    icon: <RiErrorWarningLine size={24} />,
    bg: 'bg-[var(--color-surface-level-1)]',
    avatarBg: 'bg-[var(--token-warning-light)]',
    titleColor: 'text-[var(--color-content-primary)]',
    descColor: 'text-[var(--color-content-secondary)]',
    linkColor: 'text-[var(--color-content-primary)]',
  },
  critical: {
    icon: <RiCloseLine size={24} />,
    bg: 'bg-[var(--color-feedback-error)]',
    avatarBg: 'bg-[var(--color-surface-level-1)]',
    titleColor: 'text-white',
    descColor: 'text-white',
    linkColor: 'text-white',
  },
}

const iconColors: Record<string, string> = {
  neutral: 'text-[var(--color-content-primary)]',
  success: 'text-[var(--color-feedback-success)]',
  warning: 'text-[var(--token-warning)]',
  critical: 'text-[var(--color-content-primary)]',
}

export default function Banner({
  title,
  description,
  variant = 'neutral',
  collapsable = false,
  defaultExpanded = false,
  dismissible = false,
  onDismiss,
  linkText,
  onLinkPress,
  className = '',
}: AlertProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const [dismissed, setDismissed] = useState(false)

  const config = variantConfig[variant]

  const handleDismiss = useCallback(() => {
    setDismissed(true)
    onDismiss?.()
  }, [onDismiss])

  if (dismissed) return null

  if (collapsable) {
    return (
      <div
        data-component="Banner"
        className={`
          bg-white border border-[var(--color-border)]
          flex gap-[12px] items-start p-[16px] rounded-[12px] w-full
          cursor-pointer overflow-hidden
          ${expanded ? '' : 'h-[56px]'}
          ${className}
        `}
        onClick={() => setExpanded(!expanded)}
      >
        <span className={`shrink-0 ${iconColors.neutral}`}>
          <RiInformationLine size={24} />
        </span>

        <div className="flex-1 flex flex-col gap-[8px]">
          <div className="flex items-center justify-between h-[24px]">
            <span data-text-id={title} className="text-[16px] leading-[24px] font-semibold text-[var(--color-content-primary)] tracking-[-0.16px]">
              {title}
            </span>
            <span
              className="shrink-0 text-[var(--color-content-primary)] transition-transform duration-200"
              style={{ transform: expanded ? 'rotate(180deg)' : undefined }}
            >
              <RiArrowDownSLine size={24} />
            </span>
          </div>

          {expanded && description && (
            <p data-text-id={description} className="text-[14px] leading-[1.4] font-medium text-[var(--color-content-secondary)]">
              {description}
            </p>
          )}

          {expanded && linkText && onLinkPress && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onLinkPress() }}
              data-text-id={linkText}
              className="text-[14px] leading-[22px] font-semibold underline text-[var(--color-content-primary)] hover:opacity-70 cursor-pointer w-fit"
            >
              {linkText}
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      data-component="Banner"
      className={`
        flex gap-[12px] items-start p-[16px] rounded-[12px] w-full
        ${config.bg} ${className}
      `}
    >
      <div
        className={`shrink-0 w-[32px] h-[32px] rounded-full ${config.avatarBg} flex items-center justify-center ${iconColors[variant]}`}
      >
        {config.icon}
      </div>

      <div className="flex-1 flex flex-col gap-[4px]">
        <span data-text-id={title} className={`text-[16px] leading-[24px] font-semibold tracking-[-0.16px] ${config.titleColor}`}>
          {title}
        </span>
        {description && (
          <p data-text-id={description} className={`text-[14px] leading-[1.5] ${config.descColor}`}>
            {description}
          </p>
        )}
        {linkText && onLinkPress && (
          <button
            type="button"
            onClick={onLinkPress}
            data-text-id={linkText}
            className={`text-[14px] leading-[22px] font-semibold underline ${config.linkColor} hover:opacity-70 cursor-pointer w-fit`}
          >
            {linkText}
          </button>
        )}
      </div>

      {dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          className="shrink-0 w-[32px] h-[32px] rounded-full bg-interactive-secondary flex items-center justify-center cursor-pointer hover:opacity-80"
        >
          <RiCloseLine size={24} className="text-[var(--color-content-primary)]" />
        </button>
      )}
    </div>
  )
}

registerComponent({
  name: 'Banner',
  category: 'presentation',
  description: 'Contextual message banner with variants for neutral, success, warning, and critical states. Supports collapsible content and dismissal.',
  component: Banner,
  variants: ['neutral', 'success', 'warning', 'critical'],
  props: [
    { name: 'title', type: 'string', required: true, description: 'Banner title' },
    { name: 'description', type: 'string', required: false, description: 'Description text' },
    { name: 'variant', type: '"neutral" | "success" | "warning" | "critical"', required: false, defaultValue: 'neutral', description: 'Color variant' },
    { name: 'collapsable', type: 'boolean', required: false, defaultValue: 'false', description: 'Enable collapse toggle (neutral variant only)' },
    { name: 'defaultExpanded', type: 'boolean', required: false, defaultValue: 'false', description: 'Initial expanded state when collapsable' },
    { name: 'dismissible', type: 'boolean', required: false, defaultValue: 'false', description: 'Show close button' },
    { name: 'onDismiss', type: '() => void', required: false, description: 'Dismiss handler' },
    { name: 'linkText', type: 'string', required: false, description: 'Link text' },
    { name: 'onLinkPress', type: '() => void', required: false, description: 'Link click handler' },
  ],
})
