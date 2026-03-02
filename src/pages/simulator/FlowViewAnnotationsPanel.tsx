import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { RiPencilLine, RiCheckLine, RiPlayLine, RiComputerLine, RiGitBranchLine, RiErrorWarningLine, RiExternalLinkLine, RiCursorLine, RiStackLine, RiFlashlightLine, RiRefreshLine, RiSaveLine, RiHistoryLine, RiFileTextLine } from '@remixicon/react'
import type { Node } from '@xyflow/react'
import type { Flow } from './flowRegistry'
import { getAllFlows } from './flowRegistry'
import { getPage } from '../gallery/pageRegistry'
import type { FlowVersion, VersionTag } from './flowVersionStore'
import SaveVersionDialog from './SaveVersionDialog'

interface FlowViewAnnotationsPanelProps {
  flow: Flow
  selectedNode: Node | null
  onOpenInPrototype: () => void
  onNodeUpdate: (nodeId: string, updates: Record<string, unknown>) => void
  onAlignNodes?: () => void
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
            rows={4}
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

const nodeTypeConfig = {
  screen: { label: 'Screen', icon: RiComputerLine, color: 'text-shell-selected-text' },
  page: { label: 'Page', icon: RiComputerLine, color: 'text-shell-selected-text' },
  state: { label: 'State', icon: RiFlashlightLine, color: 'text-[#94A3B8]' },
  decision: { label: 'Decision', icon: RiGitBranchLine, color: 'text-[#FBBF24]' },
  error: { label: 'Error State', icon: RiErrorWarningLine, color: 'text-[#F87171]' },
  'flow-reference': { label: 'Flow Reference', icon: RiExternalLinkLine, color: 'text-[#60A5FA]' },
  action: { label: 'Action', icon: RiCursorLine, color: 'text-[#A78BFA]' },
  overlay: { label: 'Overlay', icon: RiStackLine, color: 'text-[#2DD4BF]' },
}

export default function FlowViewAnnotationsPanel({
  flow,
  selectedNode,
  onOpenInPrototype,
  onNodeUpdate,
  onAlignNodes,
  versions = [],
  suggestedVersion = '1.0',
  onSaveVersion,
  onViewVersion,
}: FlowViewAnnotationsPanelProps) {
  const navigate = useNavigate()
  const [confirmReset, setConfirmReset] = useState(false)
  const [showVersionDialog, setShowVersionDialog] = useState(false)
  const handleLabelSave = useCallback(
    (label: string) => {
      if (selectedNode) {
        onNodeUpdate(selectedNode.id, { label })
      }
    },
    [selectedNode, onNodeUpdate],
  )

  const handleDescriptionSave = useCallback(
    (description: string) => {
      if (selectedNode) {
        onNodeUpdate(selectedNode.id, { description })
      }
    },
    [selectedNode, onNodeUpdate],
  )

  const nodeData = selectedNode?.data as { label: string; screenId: string | null; nodeType: string; description?: string } | undefined
  const typeConfig = nodeData ? nodeTypeConfig[nodeData.nodeType as keyof typeof nodeTypeConfig] : null

  // Find linked screen info
  const linkedScreen = nodeData?.screenId
    ? flow.screens.find(s => s.id === nodeData.screenId)
    : null

  return (
    <aside className="w-[300px] h-full shrink-0 overflow-y-auto border-l border-shell-border bg-shell-surface">
      <div className="p-[var(--token-spacing-md)] border-b border-shell-border">
        <h2 className="text-[length:var(--token-font-size-caption)] leading-[var(--token-line-height-caption)] font-semibold text-shell-text-tertiary uppercase tracking-wider">
          Node Properties
        </h2>
      </div>

      {selectedNode && nodeData && typeConfig ? (
        <div className="p-[var(--token-spacing-md)]">
          {/* Node type badge */}
          <div className="mb-[var(--token-spacing-lg)]">
            <div className={`flex items-center gap-[var(--token-spacing-2)] ${typeConfig.color}`}>
              <typeConfig.icon size={14} />
              <span className="text-[length:var(--token-font-size-body-sm)] font-medium">
                {typeConfig.label}
              </span>
            </div>
          </div>

          {/* Label (editable) */}
          <div className="mb-[var(--token-spacing-2)]">
            <p className="text-[length:var(--token-font-size-caption)] text-shell-text-tertiary uppercase tracking-wider mb-[var(--token-spacing-1)]">
              Label
            </p>
            <div className="text-[length:var(--token-font-size-heading-sm)] font-medium text-shell-text">
              <EditableField value={nodeData.label} onSave={handleLabelSave} label="node label" />
            </div>
          </div>

          {/* Description (editable) */}
          <div className="mb-[var(--token-spacing-lg)]">
            <p className="text-[length:var(--token-font-size-caption)] text-shell-text-tertiary uppercase tracking-wider mb-[var(--token-spacing-1)]">
              Description
            </p>
            <div className="text-[length:var(--token-font-size-body-sm)] text-shell-text-secondary">
              <EditableField
                value={nodeData.description ?? ''}
                onSave={handleDescriptionSave}
                multiline
                label="node description"
              />
            </div>
          </div>

          {/* Linked screen info */}
          {linkedScreen && (
            <div className="mb-[var(--token-spacing-lg)]">
              <p className="text-[length:var(--token-font-size-caption)] text-shell-text-tertiary uppercase tracking-wider mb-[var(--token-spacing-2)]">
                Linked Screen
              </p>
              <div className="flex flex-col gap-[var(--token-spacing-1)]">
                <div className="flex justify-between text-[length:var(--token-font-size-body-sm)]">
                  <span className="text-shell-text-secondary">Screen</span>
                  <span className="text-shell-text">{linkedScreen.title}</span>
                </div>
                <div className="flex justify-between text-[length:var(--token-font-size-body-sm)]">
                  <span className="text-shell-text-secondary">Components</span>
                  <span className="text-shell-text">{linkedScreen.componentsUsed.length}</span>
                </div>
              </div>
            </div>
          )}

          {/* Components used */}
          {linkedScreen && linkedScreen.componentsUsed.length > 0 && (
            <div className="mb-[var(--token-spacing-lg)]">
              <p className="text-[length:var(--token-font-size-caption)] text-shell-text-tertiary uppercase tracking-wider mb-[var(--token-spacing-2)]">
                Components
              </p>
              <div className="flex flex-wrap gap-[var(--token-spacing-1)]">
                {linkedScreen.componentsUsed.map((c) => (
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
          )}

          {/* Open in Prototype button */}
          {nodeData.screenId && (
            <div className="flex flex-col gap-[var(--token-spacing-2)]">
              <button
                type="button"
                onClick={onOpenInPrototype}
                className="w-full flex items-center justify-center gap-[var(--token-spacing-2)] py-[var(--token-spacing-2)] px-[var(--token-spacing-3)] bg-shell-selected-text/10 border border-shell-selected-text/30 text-shell-selected-text rounded-[var(--token-radius-md)] text-[length:var(--token-font-size-body-sm)] font-medium hover:bg-shell-selected-text/20 transition-colors cursor-pointer"
              >
                <RiPlayLine size={14} />
                Open in Prototype
              </button>
              {linkedScreen?.pageId && (
                <button
                  type="button"
                  onClick={() => navigate(`/pages?selected=${encodeURIComponent(linkedScreen.pageId!)}`)}
                  className="w-full flex items-center justify-center gap-[var(--token-spacing-2)] py-[var(--token-spacing-2)] px-[var(--token-spacing-3)] bg-shell-hover border border-shell-border text-shell-text-secondary rounded-[var(--token-radius-md)] text-[length:var(--token-font-size-body-sm)] font-medium hover:text-shell-text hover:border-shell-active transition-colors cursor-pointer"
                >
                  <RiFileTextLine size={14} />
                  View Page
                </button>
              )}
            </div>
          )}

          {/* Link to screen dropdown (for screen/page nodes) */}
          {(nodeData.nodeType === 'screen' || nodeData.nodeType === 'page') && (
            <div className="mb-[var(--token-spacing-lg)]">
              <p className="text-[length:var(--token-font-size-caption)] text-shell-text-tertiary uppercase tracking-wider mb-[var(--token-spacing-1)]">
                Link to Screen
              </p>
              <select
                value={nodeData.screenId ?? ''}
                onChange={(e) => {
                  onNodeUpdate(selectedNode.id, { screenId: e.target.value || null })
                }}
                className="w-full px-[var(--token-spacing-2)] py-[var(--token-spacing-1)] text-[length:var(--token-font-size-body-sm)] text-shell-text bg-shell-input border border-shell-border rounded-[var(--token-radius-sm)] outline-none focus:border-shell-selected-text cursor-pointer"
              >
                <option value="">(Placeholder)</option>
                {flow.screens.map((s) => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
            </div>
          )}

          {/* Target flow dropdown (for flow-reference nodes) */}
          {nodeData.nodeType === 'flow-reference' && (
            <div className="mb-[var(--token-spacing-lg)]">
              <p className="text-[length:var(--token-font-size-caption)] text-shell-text-tertiary uppercase tracking-wider mb-[var(--token-spacing-1)]">
                Target Flow
              </p>
              <select
                value={(nodeData as { targetFlowId?: string }).targetFlowId ?? ''}
                onChange={(e) => {
                  onNodeUpdate(selectedNode.id, { targetFlowId: e.target.value || null })
                }}
                className="w-full px-[var(--token-spacing-2)] py-[var(--token-spacing-1)] text-[length:var(--token-font-size-body-sm)] text-shell-text bg-shell-input border border-shell-border rounded-[var(--token-radius-sm)] outline-none focus:border-shell-selected-text cursor-pointer"
              >
                <option value="">(None)</option>
                {getAllFlows().filter(f => f.id !== flow.id).map((f) => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Action node properties */}
          {nodeData.nodeType === 'action' && (
            <div className="mb-[var(--token-spacing-lg)]">
              <p className="text-[length:var(--token-font-size-caption)] text-shell-text-tertiary uppercase tracking-wider mb-[var(--token-spacing-1)]">
                Action Type
              </p>
              <select
                value={(nodeData as { actionType?: string }).actionType ?? 'tap'}
                onChange={(e) => {
                  onNodeUpdate(selectedNode.id, { actionType: e.target.value })
                }}
                className="w-full px-[var(--token-spacing-2)] py-[var(--token-spacing-1)] text-[length:var(--token-font-size-body-sm)] text-shell-text bg-shell-input border border-shell-border rounded-[var(--token-radius-sm)] outline-none focus:border-[#A78BFA] cursor-pointer mb-[var(--token-spacing-2)]"
              >
                <option value="tap">Tap</option>
                <option value="swipe">Swipe</option>
                <option value="input">Input</option>
                <option value="scroll">Scroll</option>
                <option value="long-press">Long Press</option>
              </select>

              <p className="text-[length:var(--token-font-size-caption)] text-shell-text-tertiary uppercase tracking-wider mb-[var(--token-spacing-1)]">
                Target
              </p>
              <EditableField
                value={(nodeData as { actionTarget?: string }).actionTarget ?? ''}
                onSave={(val) => onNodeUpdate(selectedNode.id, { actionTarget: val })}
                label="action target"
              />
            </div>
          )}

          {/* Overlay node properties */}
          {nodeData.nodeType === 'overlay' && (
            <div className="mb-[var(--token-spacing-lg)]">
              <p className="text-[length:var(--token-font-size-caption)] text-shell-text-tertiary uppercase tracking-wider mb-[var(--token-spacing-1)]">
                Overlay Type
              </p>
              <select
                value={(nodeData as { overlayType?: string }).overlayType ?? 'bottom-sheet'}
                onChange={(e) => {
                  onNodeUpdate(selectedNode.id, { overlayType: e.target.value })
                }}
                className="w-full px-[var(--token-spacing-2)] py-[var(--token-spacing-1)] text-[length:var(--token-font-size-body-sm)] text-shell-text bg-shell-input border border-shell-border rounded-[var(--token-radius-sm)] outline-none focus:border-[#2DD4BF] cursor-pointer mb-[var(--token-spacing-2)]"
              >
                <option value="bottom-sheet">Bottom Sheet</option>
                <option value="modal">Modal</option>
                <option value="dialog">Dialog</option>
                <option value="popover">Popover</option>
                <option value="toast">Toast</option>
              </select>

              <p className="text-[length:var(--token-font-size-caption)] text-shell-text-tertiary uppercase tracking-wider mb-[var(--token-spacing-1)]">
                Parent Screen
              </p>
              <select
                value={(nodeData as { parentScreenNodeId?: string }).parentScreenNodeId ?? ''}
                onChange={(e) => {
                  onNodeUpdate(selectedNode.id, { parentScreenNodeId: e.target.value || null })
                }}
                className="w-full px-[var(--token-spacing-2)] py-[var(--token-spacing-1)] text-[length:var(--token-font-size-body-sm)] text-shell-text bg-shell-input border border-shell-border rounded-[var(--token-radius-sm)] outline-none focus:border-[#2DD4BF] cursor-pointer"
              >
                <option value="">(None)</option>
                {flow.screens.map((s) => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
            </div>
          )}

          {/* State node properties */}
          {nodeData.nodeType === 'state' && (
            <div className="mb-[var(--token-spacing-lg)]">
              <p className="text-[length:var(--token-font-size-caption)] text-shell-text-tertiary uppercase tracking-wider mb-[var(--token-spacing-1)]">
                State ID
              </p>
              <EditableField
                value={(nodeData as { stateId?: string }).stateId ?? ''}
                onSave={(val) => onNodeUpdate(selectedNode.id, { stateId: val })}
                label="state ID"
              />

              {(nodeData as { parentPageNodeId?: string }).parentPageNodeId && (
                <>
                  <p className="text-[length:var(--token-font-size-caption)] text-shell-text-tertiary uppercase tracking-wider mb-[var(--token-spacing-1)] mt-[var(--token-spacing-2)]">
                    Parent Page Node
                  </p>
                  <span className="text-[length:var(--token-font-size-body-sm)] text-shell-text-secondary">
                    {(nodeData as { parentPageNodeId?: string }).parentPageNodeId}
                  </span>
                </>
              )}
            </div>
          )}

          {/* Active State selector (for page/screen nodes with a linked page that has states) */}
          {(nodeData.nodeType === 'screen' || nodeData.nodeType === 'page') && (() => {
            const pid = (nodeData as { pageId?: string }).pageId ?? (linkedScreen?.pageId)
            const page = pid ? getPage(pid) : null
            if (!page?.states?.length) return null
            return (
              <div className="mb-[var(--token-spacing-lg)]">
                <p className="text-[length:var(--token-font-size-caption)] text-shell-text-tertiary uppercase tracking-wider mb-[var(--token-spacing-1)]">
                  Active State
                </p>
                <select
                  value={(nodeData as { activeStateId?: string }).activeStateId ?? ''}
                  onChange={(e) => {
                    onNodeUpdate(selectedNode.id, { activeStateId: e.target.value || undefined })
                  }}
                  className="w-full px-[var(--token-spacing-2)] py-[var(--token-spacing-1)] text-[length:var(--token-font-size-body-sm)] text-shell-text bg-shell-input border border-shell-border rounded-[var(--token-radius-sm)] outline-none focus:border-shell-selected-text cursor-pointer"
                >
                  <option value="">(Default)</option>
                  {page.states.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            )
          })()}

          {/* Placeholder notice */}
          {!nodeData.screenId && nodeData.nodeType === 'screen' && (
            <div className="py-[var(--token-spacing-3)] px-[var(--token-spacing-3)] border border-dashed border-shell-border rounded-[var(--token-radius-md)] text-center">
              <p className="text-[length:var(--token-font-size-caption)] text-shell-text-tertiary">
                This is a placeholder screen. Build the screen component and link it to see it in the prototype view.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="p-[var(--token-spacing-md)] text-center">
          <p className="text-[length:var(--token-font-size-body-sm)] text-shell-text-tertiary mt-[var(--token-spacing-lg)]">
            Select a node to see its properties
          </p>
          <p className="text-[length:var(--token-font-size-caption)] text-shell-text-tertiary mt-[var(--token-spacing-2)]">
            Double-click a screen node to open it in the prototype view
          </p>
        </div>
      )}

      {/* Versions / Changelog */}
      {onSaveVersion && (
        <div className="p-[var(--token-spacing-md)] border-t border-shell-border">
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

      {/* Flow info */}
      <div className="p-[var(--token-spacing-md)] border-t border-shell-border mt-auto">
        <p className="text-[length:var(--token-font-size-caption)] text-shell-text-tertiary uppercase tracking-wider mb-[var(--token-spacing-2)]">
          Flow Info
        </p>
        <div className="flex flex-col gap-[var(--token-spacing-1)]">
          <div className="flex justify-between text-[length:var(--token-font-size-body-sm)]">
            <span className="text-shell-text-secondary">Flow</span>
            <span className="text-shell-text">{flow.name}</span>
          </div>
          <div className="flex justify-between text-[length:var(--token-font-size-body-sm)]">
            <span className="text-shell-text-secondary">Domain</span>
            <span className="text-shell-text">{flow.domain}</span>
          </div>
          <div className="flex justify-between text-[length:var(--token-font-size-body-sm)]">
            <span className="text-shell-text-secondary">Screens</span>
            <span className="text-shell-text">{flow.screens.length}</span>
          </div>
        </div>

        {/* Align nodes — with confirmation */}
        {onAlignNodes && (
          <div className="mt-[var(--token-spacing-3)]">
            {confirmReset ? (
              <div className="flex flex-col gap-[var(--token-spacing-2)]">
                <p className="text-[length:var(--token-font-size-caption)] text-error">
                  Align all nodes in a centered layout? This will reposition nodes but keep all connections.
                </p>
                <div className="flex gap-[var(--token-spacing-2)]">
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="flex-1 py-[var(--token-spacing-1)] text-[length:var(--token-font-size-caption)] text-shell-text-tertiary hover:text-shell-text-secondary rounded-[var(--token-radius-sm)] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onAlignNodes()
                      setConfirmReset(false)
                    }}
                    className="flex-1 py-[var(--token-spacing-1)] text-[length:var(--token-font-size-caption)] text-error bg-error/10 border border-error/30 rounded-[var(--token-radius-sm)] font-medium hover:bg-error/20 cursor-pointer flex items-center justify-center gap-[4px]"
                  >
                    <RiRefreshLine size={11} />
                    Align
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="w-full flex items-center justify-center gap-[4px] py-[var(--token-spacing-1)] text-[length:var(--token-font-size-caption)] text-shell-text-tertiary hover:text-error rounded-[var(--token-radius-sm)] transition-colors cursor-pointer"
              >
                <RiRefreshLine size={11} />
                Align nodes
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  )
}
