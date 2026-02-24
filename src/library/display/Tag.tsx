import { X } from 'lucide-react'
import { registerComponent } from '../registry'

export interface TagProps {
  label: string
  removable?: boolean
  onRemove?: () => void
  className?: string
}

export default function Tag({
  label,
  removable = false,
  onRemove,
  className = '',
}: TagProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-[var(--token-spacing-1)]
        px-[var(--token-spacing-3)] py-[var(--token-spacing-1)]
        bg-surface-secondary rounded-[var(--token-radius-full)]
        text-[length:var(--token-font-size-body-sm)] leading-[var(--token-line-height-body-sm)]
        text-text-primary
        ${className}
      `}
    >
      {label}
      {removable && (
        <button
          type="button"
          onClick={onRemove}
          className="shrink-0 text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
        >
          <X size={12} />
        </button>
      )}
    </span>
  )
}

registerComponent({
  name: 'Tag',
  category: 'display',
  description: 'Tag label, optionally removable.',
  component: Tag,
  props: [
    { name: 'label', type: 'string', required: true, description: 'Tag text' },
    { name: 'removable', type: 'boolean', required: false, defaultValue: 'false', description: 'Show remove button' },
    { name: 'onRemove', type: '() => void', required: false, description: 'Remove handler' },
  ],
})
