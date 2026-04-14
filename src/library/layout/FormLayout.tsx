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
      <div className="flex-1 overflow-y-auto px-[var(--token-gap-lg)] py-[var(--token-padding-lg)]">
        <div className="flex flex-col gap-[var(--token-padding-lg)]">{children}</div>
      </div>
      {submitButton && (
        <div className="shrink-0 p-[var(--token-gap-lg)] pb-[var(--token-gap-xl)] bg-surface-level-0 border-t border-border">
          {submitButton}
        </div>
      )}
    </div>
  )
}
