import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { RiPencilLine, RiCheckLine, RiRefreshLine, RiHistoryLine, RiSaveLine } from '@remixicon/react'
import type { FlowScreen, Flow } from './flowRegistry'
import type { FlowVersion, VersionTag } from './flowVersionStore'
import SaveVersionDialog from './SaveVersionDialog'
import { getBaseFlow } from './flowRegistry'
import {
  setFlowName,
  setFlowDescription,
  setFlowSpec,
  setScreenOverride,
  resetFlowOverrides,
} from './flowStore'
import { syncScreenTitleToNode } from './flowGraphSync'

interface AnnotationsPanelProps {
  flow: Flow
  currentScreen: FlowScreen
  screenIndex: number
  onFlowEdited: () => void
  versions?: FlowVersion[]
  suggestedVersion?: string
  onSaveVersion?: (version: string, description: string, tag: VersionTag, screenIds?: string[]) => void
  onViewVersion?: (version: FlowVersion) => void
}

function EditableField({
  value,
  onSave,
  multiline,
  label,
}: {
  value: string
  onSave: (val: string) => void
  multiline?: boolean
  label: string
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  const handleEdit = () => {
    setDraft(value)
    setEditing(true)
  }

  const handleSave = () => {
    onSave(draft)
    setEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault()
      handleSave()
    }
    if (e.key === 'Escape') {
      setEditing(false)
    }
  }

  if (editing) {
    return (
      <div className="flex flex-col gap-[var(--token-spacing-1)]">
        {multiline ? (
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={6}
            autoFocus
            className="w-full px-[var(--token-spacing-2)] py-[var(--token-spacing-1)] text-[length:var(--token-font-size-body-sm)] leading-[var(--token-line-height-body-sm)] text-shell-text bg-shell-input border border-shell-selected-text rounded-[var(--token-radius-sm)] outline-none resize-y"
          />
        ) : (
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="w-full px-[var(--token-spacing-2)] py-[var(--token-spacing-1)] text-[length:var(--token-font-size-body-sm)] leading-[var(--token-line-height-body-sm)] text-shell-text bg-shell-input border border-shell-selected-text rounded-[var(--token-radius-sm)] outline-none"
          />
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
            className="px-[var(--token-spacing-2)] py-[1px] text-[length:var(--token-font-size-caption)] text-shell-selected-text hover:text-[#6EE7A0] font-medium cursor-pointer flex items-center gap-[2px]"
          >
            <RiCheckLine size={12} />
            Save
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleEdit}
      onKeyDown={(e) => { if (e.key === 'Enter') handleEdit() }}
      title={`Click to edit ${label}`}
      className="w-full text-left cursor-pointer flex items-start gap-[var(--token-spacing-1)] px-[var(--token-spacing-1)] py-[2px] -mx-[var(--token-spacing-1)] rounded-[var(--token-radius-sm)] hover:bg-shell-hover transition-colors border border-transparent hover:border-shell-border"
    >
      <span className="flex-1">{value || '(empty)'}</span>
      <RiPencilLine
        size={12}
        className="shrink-0 mt-[3px] text-shell-text-tertiary"
      />
    </div>
  )
}

export default function AnnotationsPanel({
  flow,
  currentScreen,
  screenIndex,
  onFlowEdited,
  versions = [],
  suggestedVersion = '1.0',
  onSaveVersion,
  onViewVersion,
}: AnnotationsPanelProps) {
  const navigate = useNavigate()
  const [showVersionDialog, setShowVersionDialog] = useState(false)
  const [specEditing, setSpecEditing] = useState(false)
  const [specDraft, setSpecDraft] = useState(flow.specContent ?? '')

  const handleExport = () => {
    const lines = [
      `# ${flow.name} — Flow Handoff`,
      '',
      flow.description ? `> ${flow.description}` : '',
      '',
      `## Spec`,
      flow.specContent ?? '_No spec available_',
      '',
      `## Screens (${flow.screens.length})`,
      ...flow.screens.map(
        (s, i) => `${i + 1}. **${s.title}** — ${s.description}`,
      ),
      '',
      `## Components Used`,
      ...Array.from(
        new Set(flow.screens.flatMap((s) => s.componentsUsed)),
      ).map((c) => `- ${c}`),
      '',
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${flow.id}-handoff.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleReset = useCallback(() => {
    resetFlowOverrides(flow.id)
    onFlowEdited()
  }, [flow.id, onFlowEdited])

  const handleNameSave = useCallback(
    (name: string) => {
      setFlowName(flow.id, name)
      onFlowEdited()
    },
    [flow.id, onFlowEdited],
  )

  const handleDescriptionSave = useCallback(
    (desc: string) => {
      setFlowDescription(flow.id, desc)
      onFlowEdited()
    },
    [flow.id, onFlowEdited],
  )

  const handleScreenTitleSave = useCallback(
    (title: string) => {
      setScreenOverride(flow.id, currentScreen.id, 'title', title)
      syncScreenTitleToNode(flow.id, currentScreen.id, title)
      onFlowEdited()
    },
    [flow.id, currentScreen.id, onFlowEdited],
  )

  const handleScreenDescSave = useCallback(
    (desc: string) => {
      setScreenOverride(flow.id, currentScreen.id, 'description', desc)
      onFlowEdited()
    },
    [flow.id, currentScreen.id, onFlowEdited],
  )

  const handleSpecSave = useCallback(() => {
    setFlowSpec(flow.id, specDraft)
    setSpecEditing(false)
    onFlowEdited()
  }, [flow.id, specDraft, onFlowEdited])

  const baseFlow = getBaseFlow(flow.id)
  const hasOverrides =
    flow.name !== baseFlow?.name ||
    flow.description !== baseFlow?.description ||
    flow.specContent !== baseFlow?.specContent ||
    flow.screens.some(
      (s, i) =>
        s.title !== baseFlow?.screens[i]?.title ||
        s.description !== baseFlow?.screens[i]?.description,
    )

  return (
    <aside className="w-[300px] h-full shrink-0 overflow-y-auto border-l border-shell-border bg-shell-surface">
      <div className="p-[var(--token-spacing-md)] border-b border-shell-border flex items-center justify-between">
        <h2 className="text-[length:var(--token-font-size-caption)] leading-[var(--token-line-height-caption)] font-semibold text-shell-text-tertiary uppercase tracking-wider">
          Annotations
        </h2>
        <div className="flex gap-[var(--token-spacing-2)]">
          {hasOverrides && (
            <button
              type="button"
              onClick={handleReset}
              title="Reset all edits"
              className="text-[length:var(--token-font-size-caption)] text-shell-text-tertiary hover:text-error font-medium cursor-pointer flex items-center gap-[2px]"
            >
              <RiRefreshLine size={11} />
              Reset
            </button>
          )}
          <button
            type="button"
            onClick={handleExport}
            className="text-[length:var(--token-font-size-caption)] text-shell-selected-text hover:text-[#6EE7A0] font-medium cursor-pointer"
          >
            Export
          </button>
        </div>
      </div>

      <div className="p-[var(--token-spacing-md)]">
        {/* Flow name (editable) */}
        <div className="mb-[var(--token-spacing-2)]">
          <p className="text-[length:var(--token-font-size-caption)] text-shell-text-tertiary uppercase tracking-wider mb-[var(--token-spacing-1)]">
            Flow Name
          </p>
          <div className="text-[length:var(--token-font-size-heading-sm)] font-medium text-shell-text">
            <EditableField value={flow.name} onSave={handleNameSave} label="flow name" />
          </div>
        </div>

        {/* Flow description (editable) */}
        <div className="mb-[var(--token-spacing-lg)]">
          <p className="text-[length:var(--token-font-size-caption)] text-shell-text-tertiary uppercase tracking-wider mb-[var(--token-spacing-1)]">
            Overview
          </p>
          <div className="text-[length:var(--token-font-size-body-sm)] text-shell-text-secondary">
            <EditableField
              value={flow.description}
              onSave={handleDescriptionSave}
              multiline
              label="flow description"
            />
          </div>
        </div>

        {/* Current screen info (editable) */}
        <div className="mb-[var(--token-spacing-lg)]">
          <p className="text-[length:var(--token-font-size-caption)] text-shell-text-tertiary uppercase tracking-wider mb-[var(--token-spacing-1)]">
            Screen {screenIndex + 1} of {flow.screens.length}
          </p>
          <div className="text-[length:var(--token-font-size-heading-sm)] font-medium text-shell-text mb-[var(--token-spacing-1)]">
            <EditableField
              value={currentScreen.title}
              onSave={handleScreenTitleSave}
              label="screen title"
            />
          </div>
          <div className="text-[length:var(--token-font-size-body-sm)] text-shell-text-secondary">
            <EditableField
              value={currentScreen.description}
              onSave={handleScreenDescSave}
              multiline
              label="screen description"
            />
          </div>
        </div>

        {/* Components used */}
        <div className="mb-[var(--token-spacing-lg)]">
          <p className="text-[length:var(--token-font-size-caption)] text-shell-text-tertiary uppercase tracking-wider mb-[var(--token-spacing-2)]">
            Components
          </p>
          <div className="flex flex-wrap gap-[var(--token-spacing-1)]">
            {currentScreen.componentsUsed.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => navigate(`/components?selected=${encodeURIComponent(c)}`)}
                className="px-[var(--token-spacing-2)] py-[1px] bg-shell-hover rounded-[var(--token-radius-full)] text-[length:var(--token-font-size-caption)] text-shell-text-secondary hover:bg-shell-active hover:text-shell-text transition-colors cursor-pointer"
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Flow metadata */}
        <div className="mb-[var(--token-spacing-lg)]">
          <p className="text-[length:var(--token-font-size-caption)] text-shell-text-tertiary uppercase tracking-wider mb-[var(--token-spacing-2)]">
            Flow Info
          </p>
          <div className="flex flex-col gap-[var(--token-spacing-1)]">
            <div className="flex justify-between text-[length:var(--token-font-size-body-sm)]">
              <span className="text-shell-text-secondary">Domain</span>
              <span className="text-shell-text">{flow.domain}</span>
            </div>
            <div className="flex justify-between text-[length:var(--token-font-size-body-sm)]">
              <span className="text-shell-text-secondary">Total screens</span>
              <span className="text-shell-text">{flow.screens.length}</span>
            </div>
            <div className="flex justify-between text-[length:var(--token-font-size-body-sm)]">
              <span className="text-shell-text-secondary">Storage</span>
              <span className="text-shell-text">
                {hasOverrides ? 'localStorage (edited)' : 'Default'}
              </span>
            </div>
          </div>
        </div>

        {/* Spec content (editable) */}
        <div>
          <div className="flex items-center justify-between mb-[var(--token-spacing-2)]">
            <p className="text-[length:var(--token-font-size-caption)] text-shell-text-tertiary uppercase tracking-wider">
              Spec
            </p>
            {!specEditing && (
              <button
                type="button"
                onClick={() => {
                  setSpecDraft(flow.specContent ?? '')
                  setSpecEditing(true)
                }}
                className="text-[length:var(--token-font-size-caption)] text-shell-selected-text hover:text-[#6EE7A0] font-medium cursor-pointer flex items-center gap-[2px]"
              >
                <RiPencilLine size={11} />
                Edit
              </button>
            )}
          </div>

          {specEditing ? (
            <div className="flex flex-col gap-[var(--token-spacing-2)]">
              <textarea
                value={specDraft}
                onChange={(e) => setSpecDraft(e.target.value)}
                rows={16}
                autoFocus
                className="w-full px-[var(--token-spacing-3)] py-[var(--token-spacing-2)] text-[length:var(--token-font-size-caption)] leading-[18px] text-shell-text bg-shell-input border border-shell-selected-text rounded-[var(--token-radius-md)] outline-none resize-y font-mono"
              />
              <div className="flex gap-[var(--token-spacing-2)] justify-end">
                <button
                  type="button"
                  onClick={() => setSpecEditing(false)}
                  className="px-[var(--token-spacing-3)] py-[var(--token-spacing-1)] text-[length:var(--token-font-size-caption)] text-shell-text-tertiary hover:text-shell-text-secondary rounded-[var(--token-radius-sm)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSpecSave}
                  className="px-[var(--token-spacing-3)] py-[var(--token-spacing-1)] text-[length:var(--token-font-size-caption)] text-shell-bg bg-shell-selected-text hover:bg-[#6EE7A0] rounded-[var(--token-radius-sm)] font-medium cursor-pointer flex items-center gap-[4px]"
                >
                  <RiCheckLine size={12} />
                  Save
                </button>
              </div>
            </div>
          ) : flow.specContent ? (
            <pre className="text-[length:var(--token-font-size-caption)] text-shell-text-secondary whitespace-pre-wrap bg-shell-input p-[var(--token-spacing-3)] rounded-[var(--token-radius-md)] max-h-[300px] overflow-y-auto">
              {flow.specContent}
            </pre>
          ) : (
            <button
              type="button"
              onClick={() => {
                setSpecDraft('')
                setSpecEditing(true)
              }}
              className="w-full py-[var(--token-spacing-3)] border border-dashed border-shell-border rounded-[var(--token-radius-md)] text-[length:var(--token-font-size-body-sm)] text-shell-text-tertiary hover:text-shell-text-secondary hover:border-shell-active transition-colors cursor-pointer"
            >
              + Add spec
            </button>
          )}
        </div>

        {/* Versions */}
        {onSaveVersion && (
          <div className="mt-[var(--token-spacing-lg)] pt-[var(--token-spacing-lg)] border-t border-shell-border">
            <div className="flex items-center justify-between mb-[var(--token-spacing-2)]">
              <p className="text-[length:var(--token-font-size-caption)] text-shell-text-tertiary uppercase tracking-wider flex items-center gap-[4px]">
                <RiHistoryLine size={11} />
                Versions
              </p>
              <button
                type="button"
                onClick={() => setShowVersionDialog(true)}
                className="text-[length:var(--token-font-size-caption)] text-shell-selected-text hover:text-[#6EE7A0] font-medium cursor-pointer flex items-center gap-[4px]"
              >
                <RiSaveLine size={11} />
                Save
              </button>
            </div>

            {versions.length === 0 ? (
              <p className="text-[length:var(--token-font-size-caption)] text-shell-text-tertiary">
                No versions saved yet
              </p>
            ) : (
              <div className="flex flex-col gap-[var(--token-spacing-2)] max-h-[200px] overflow-y-auto">
                {[...versions].reverse().map((v) => {
                  const tagColor = v.tag === 'production' ? 'bg-[#60A5FA]'
                    : v.tag === 'exploration' ? 'bg-[#FBBF24]'
                    : 'bg-[#4ADE80]'
                  return (
                    <div
                      key={v.id}
                      className="flex items-start justify-between gap-[var(--token-spacing-2)] py-[var(--token-spacing-1)]"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-[var(--token-spacing-1)]">
                          <div className={`w-[6px] h-[6px] rounded-full shrink-0 ${tagColor}`} />
                          <span className="text-[length:var(--token-font-size-caption)] font-mono font-medium text-shell-selected-text">
                            v{v.version}
                          </span>
                          <span className="text-[length:10px] text-shell-text-tertiary">
                            {v.tag}
                          </span>
                          <span className="text-[length:var(--token-font-size-caption)] text-shell-text-tertiary">
                            {new Date(v.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-[length:var(--token-font-size-caption)] text-shell-text-secondary truncate pl-[10px]">
                          {v.description}
                        </p>
                      </div>
                      {onViewVersion && (
                        <button
                          type="button"
                          onClick={() => onViewVersion(v)}
                          className="text-[length:var(--token-font-size-caption)] text-shell-text-tertiary hover:text-shell-text shrink-0 cursor-pointer"
                        >
                          View
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {showVersionDialog && onSaveVersion && (
        <SaveVersionDialog
          suggestedVersion={suggestedVersion}
          currentScreenIds={flow.screens.map(s => s.id)}
          onClose={() => setShowVersionDialog(false)}
          onSave={(version, description, tag, screenIds) => {
            onSaveVersion(version, description, tag, screenIds)
            setShowVersionDialog(false)
          }}
        />
      )}
    </aside>
  )
}
