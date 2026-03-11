import { useState } from 'react'
import { RiPencilLine, RiCheckLine } from '@remixicon/react'
import { getFlow } from './flowRegistry'
import { getDynamicFlow } from './dynamicFlowStore'
import { SLUG_REGEX, formatSlug } from '../../lib/slugify'

interface EditableFlowSlugProps {
  value: string
  onSave: (newId: string) => Promise<boolean>
  /** 'inline' for the sub-header, 'block' for annotation panels */
  variant?: 'inline' | 'block'
}

export default function EditableFlowSlug({ value, onSave, variant = 'block' }: EditableFlowSlugProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const handleEdit = () => {
    setDraft(value)
    setError(null)
    setEditing(true)
  }

  const validate = (slug: string): string | null => {
    if (!slug) return 'Required'
    if (!SLUG_REGEX.test(slug)) return 'Use lowercase, numbers, hyphens'
    if (slug !== value && (getFlow(slug) || getDynamicFlow(slug))) return 'ID already exists'
    return null
  }

  const handleSave = async () => {
    const formatted = formatSlug(draft)
    const err = validate(formatted)
    if (err) { setError(err); return }
    if (formatted === value) { setEditing(false); return }
    setSaving(true)
    const ok = await onSave(formatted)
    setSaving(false)
    if (ok) setEditing(false)
    else setError('Rename failed')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); handleSave() }
    if (e.key === 'Escape') setEditing(false)
  }

  if (editing) {
    const isInline = variant === 'inline'
    return (
      <div className={isInline ? 'flex items-center gap-[var(--token-spacing-1)]' : 'flex flex-col gap-[var(--token-spacing-1)]'}>
        <input
          type="text"
          value={draft}
          onChange={(e) => { setDraft(formatSlug(e.target.value)); setError(null) }}
          onKeyDown={handleKeyDown}
          onBlur={() => { if (!saving) setEditing(false) }}
          autoFocus
          className={`
            font-mono bg-shell-input border border-shell-selected-text rounded-[var(--token-radius-sm)] outline-none text-shell-text
            ${isInline
              ? 'px-[var(--token-spacing-2)] py-[1px] text-[length:var(--token-font-size-caption)] w-[200px]'
              : 'w-full px-[var(--token-spacing-2)] py-[var(--token-spacing-1)] text-[length:var(--token-font-size-body-sm)] leading-[var(--token-line-height-body-sm)]'
            }
          `}
        />
        {isInline ? (
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); handleSave() }}
            disabled={saving}
            className="text-shell-selected-text hover:text-[#6EE7A0] cursor-pointer disabled:opacity-40"
          >
            <RiCheckLine size={14} />
          </button>
        ) : (
          <>
            {error && (
              <p className="text-[length:var(--token-font-size-caption)] text-error">{error}</p>
            )}
            <div className="flex gap-[var(--token-spacing-1)] justify-end">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-[var(--token-spacing-2)] py-[1px] text-[length:var(--token-font-size-caption)] text-shell-text-tertiary hover:text-shell-text-secondary cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-[var(--token-spacing-2)] py-[1px] text-[length:var(--token-font-size-caption)] text-shell-selected-text hover:text-[#6EE7A0] font-medium cursor-pointer flex items-center gap-[2px] disabled:opacity-40"
              >
                <RiCheckLine size={12} />
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </>
        )}
        {isInline && error && (
          <span className="text-[length:var(--token-font-size-caption)] text-error whitespace-nowrap">{error}</span>
        )}
      </div>
    )
  }

  if (variant === 'inline') {
    return (
      <button
        type="button"
        onClick={handleEdit}
        title="Click to rename flow"
        className="text-[length:var(--token-font-size-caption)] text-shell-text-tertiary font-mono cursor-pointer hover:text-shell-text-secondary flex items-center gap-[var(--token-spacing-1)] group"
      >
        {value}
        <RiPencilLine size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>
    )
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleEdit}
      onKeyDown={(e) => { if (e.key === 'Enter') handleEdit() }}
      title="Click to rename flow"
      className="w-full text-left cursor-pointer flex items-start gap-[var(--token-spacing-1)] px-[var(--token-spacing-1)] py-[2px] -mx-[var(--token-spacing-1)] rounded-[var(--token-radius-sm)] hover:bg-shell-hover transition-colors border border-transparent hover:border-shell-border"
    >
      <span className="flex-1 text-[length:var(--token-font-size-heading-sm)] font-medium text-shell-text font-mono">
        {value}
      </span>
      <RiPencilLine
        size={12}
        className="shrink-0 mt-[3px] text-shell-text-tertiary"
      />
    </div>
  )
}
