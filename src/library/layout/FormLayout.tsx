import type { ReactNode } from 'react'

export interface FormLayoutProps {
  header?: ReactNode
  children: ReactNode
  submitButton?: ReactNode
  className?: string
}

export default function FormLayout({
  header,
  children,
  submitButton,
  className = '',
}: FormLayoutProps) {
  return (
    <div data-component="FormLayout" className={`flex flex-col h-full bg-background ${className}`}>
      {header && <div className="shrink-0">{header}</div>}
      <div className="flex-1 overflow-y-auto px-[var(--token-spacing-md)] py-[var(--token-spacing-lg)]">
        <div className="flex flex-col gap-[var(--token-spacing-lg)]">{children}</div>
      </div>
      {submitButton && (
        <div className="shrink-0 p-[var(--token-spacing-md)] pb-[var(--token-spacing-xl)] bg-surface-primary border-t border-border-default">
          {submitButton}
        </div>
      )}
    </div>
  )
}
