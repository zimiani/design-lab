import { useState } from 'react'
import { RiCloseLine } from '@remixicon/react'
import type { VersionTag } from './flowVersionStore'

interface SaveVersionDialogProps {
  suggestedVersion: string
  onClose: () => void
  onSave: (version: string, description: string, tag: VersionTag, screenIds?: string[]) => void
  /** Current screen IDs (for "Include screen set" option) */
  currentScreenIds?: string[]
}

const tagOptions: { value: VersionTag; label: string; color: string; description: string }[] = [
  { value: 'milestone', label: 'Milestone', color: 'bg-[#4ADE80]', description: 'Design review, feature ready' },
  { value: 'exploration', label: 'Exploration', color: 'bg-[#FBBF24]', description: 'UX test, alternative, draft' },
  { value: 'production', label: 'Production', color: 'bg-[#60A5FA]', description: 'Currently live in the app' },
]

export default function SaveVersionDialog({
  suggestedVersion,
  onClose,
  onSave,
  currentScreenIds,
}: SaveVersionDialogProps) {
  const [version, setVersion] = useState(suggestedVersion)
  const [description, setDescription] = useState('')
  const [tag, setTag] = useState<VersionTag>('milestone')
  const [includeScreenSet, setIncludeScreenSet] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!version.trim() || !description.trim()) return
    onSave(version.trim(), description.trim(), tag, includeScreenSet && currentScreenIds ? currentScreenIds : undefined)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        onKeyDown={(e) => { if (e.key === 'Escape') onClose() }}
        role="button"
        tabIndex={0}
      />

      {/* Dialog */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-[400px] bg-shell-surface border border-shell-border rounded-[var(--token-radius-lg)] shadow-lg"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-[var(--token-spacing-md)] border-b border-shell-border">
          <h2 className="text-[length:var(--token-font-size-heading-sm)] font-semibold text-shell-text">
            Save Version
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-[28px] h-[28px] flex items-center justify-center rounded-[var(--token-radius-sm)] text-shell-text-tertiary hover:text-shell-text hover:bg-shell-hover transition-colors cursor-pointer"
          >
            <RiCloseLine size={16} />
          </button>
        </div>

        {/* Fields */}
        <div className="p-[var(--token-spacing-md)] flex flex-col gap-[var(--token-spacing-3)]">
          <div>
            <label className="block text-[length:var(--token-font-size-caption)] text-shell-text-tertiary uppercase tracking-wider mb-[var(--token-spacing-1)]">
              Version *
            </label>
            <input
              type="text"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="e.g. 1.0, 2.0"
              autoFocus
              className="w-full px-[var(--token-spacing-3)] py-[var(--token-spacing-2)] text-[length:var(--token-font-size-body-sm)] text-shell-text bg-shell-input border border-shell-border rounded-[var(--token-radius-sm)] outline-none focus:border-shell-selected-text font-mono"
            />
          </div>

          <div>
            <label className="block text-[length:var(--token-font-size-caption)] text-shell-text-tertiary uppercase tracking-wider mb-[var(--token-spacing-2)]">
              Tag
            </label>
            <div className="flex gap-[var(--token-spacing-2)]">
              {tagOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setTag(opt.value)}
                  className={`
                    flex-1 flex flex-col items-center gap-[4px] py-[var(--token-spacing-2)] px-[var(--token-spacing-2)]
                    rounded-[var(--token-radius-sm)] border text-[length:var(--token-font-size-caption)]
                    transition-colors cursor-pointer
                    ${tag === opt.value
                      ? 'border-shell-selected-text bg-shell-selected-text/10 text-shell-text'
                      : 'border-shell-border text-shell-text-secondary hover:border-shell-active'
                    }
                  `}
                >
                  <div className={`w-[8px] h-[8px] rounded-full ${opt.color}`} />
                  <span className="font-medium">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[length:var(--token-font-size-caption)] text-shell-text-tertiary uppercase tracking-wider mb-[var(--token-spacing-1)]">
              What changed? *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what changed in this version..."
              rows={3}
              className="w-full px-[var(--token-spacing-3)] py-[var(--token-spacing-2)] text-[length:var(--token-font-size-body-sm)] text-shell-text bg-shell-input border border-shell-border rounded-[var(--token-radius-sm)] outline-none focus:border-shell-selected-text resize-y"
            />
          </div>
        </div>

        {/* Include screen set */}
        {currentScreenIds && currentScreenIds.length > 0 && (
          <div className="px-[var(--token-spacing-md)] pb-[var(--token-spacing-2)]">
            <label className="flex items-center gap-[var(--token-spacing-2)] cursor-pointer">
              <input
                type="checkbox"
                checked={includeScreenSet}
                onChange={(e) => setIncludeScreenSet(e.target.checked)}
                className="accent-[#4ADE80]"
              />
              <span className="text-[length:var(--token-font-size-body-sm)] text-shell-text-secondary">
                Include current screen set ({currentScreenIds.length} screens)
              </span>
            </label>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-[var(--token-spacing-2)] p-[var(--token-spacing-md)] border-t border-shell-border">
          <button
            type="button"
            onClick={onClose}
            className="px-[var(--token-spacing-4)] py-[var(--token-spacing-2)] text-[length:var(--token-font-size-body-sm)] text-shell-text-secondary hover:text-shell-text rounded-[var(--token-radius-sm)] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!version.trim() || !description.trim()}
            className="px-[var(--token-spacing-4)] py-[var(--token-spacing-2)] text-[length:var(--token-font-size-body-sm)] text-shell-bg bg-shell-selected-text rounded-[var(--token-radius-sm)] font-medium cursor-pointer hover:bg-[#6EE7A0] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Save Version
          </button>
        </div>
      </form>
    </div>
  )
}
