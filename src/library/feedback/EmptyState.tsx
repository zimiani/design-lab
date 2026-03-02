import type { ReactNode } from 'react'
import { registerComponent } from '../registry'

export interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div data-component="EmptyState" className={`flex flex-col items-center text-center px-[var(--token-spacing-xl)] py-[var(--token-spacing-2xl)] ${className}`}>
      {icon && (
        <div className="mb-[var(--token-spacing-md)] text-text-tertiary">{icon}</div>
      )}
      <h3 className="text-[length:var(--token-font-size-heading-sm)] leading-[var(--token-line-height-heading-sm)] font-medium text-text-primary mb-[var(--token-spacing-2)]">
        {title}
      </h3>
      {description && (
        <p className="text-[length:var(--token-font-size-body-md)] leading-[var(--token-line-height-body-md)] text-text-secondary mb-[var(--token-spacing-lg)]">
          {description}
        </p>
      )}
      {action}
    </div>
  )
}

registerComponent({
  name: 'EmptyState',
  category: 'feedback',
  description: 'Placeholder for empty screens. Use when a list, search, or page has no content to display.',
  component: EmptyState,
  props: [
    { name: 'icon', type: 'ReactNode', required: false, description: 'Illustration icon' },
    { name: 'title', type: 'string', required: true, description: 'Title text' },
    { name: 'description', type: 'string', required: false, description: 'Description text' },
    { name: 'action', type: 'ReactNode', required: false, description: 'CTA button' },
  ],
})
