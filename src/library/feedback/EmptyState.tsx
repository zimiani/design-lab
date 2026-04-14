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
    <div data-component="EmptyState" className={`flex flex-col items-center text-center px-[var(--token-gap-xl)] py-[var(--token-spacing-48)] ${className}`}>
      {icon && (
        <div className="mb-[var(--token-gap-lg)] text-text-tertiary">{icon}</div>
      )}
      <h3 className="text-[length:var(--token-font-size-h3)] leading-[var(--token-line-height-h3)] font-medium text-text-primary mb-[var(--token-spacing-8)]">
        {title}
      </h3>
      {description && (
        <p className="text-[length:var(--token-font-size-body-md)] leading-[var(--token-line-height-body-md)] text-text-secondary mb-[var(--token-padding-lg)]">
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
