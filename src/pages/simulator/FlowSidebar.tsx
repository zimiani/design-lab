import { useState } from 'react'
import { Plus } from 'lucide-react'
import { getFlowsByArea, registerDynamicFlow, type Flow } from './flowRegistry'
import { saveDynamicFlow, type DynamicFlowDef } from './dynamicFlowStore'
import NewFlowDialog from './NewFlowDialog'

interface FlowSidebarProps {
  selectedFlowId: string | null
  onSelect: (flowId: string) => void
  onFlowCreated?: () => void
}

export default function FlowSidebar({ selectedFlowId, onSelect, onFlowCreated }: FlowSidebarProps) {
  const [showNewDialog, setShowNewDialog] = useState(false)
  const grouped = getFlowsByArea()
  const areas = Object.keys(grouped)

  const handleCreateFlow = (name: string, area: string, description: string) => {
    const id = `flow-${Date.now()}`
    const def: DynamicFlowDef = {
      id,
      name,
      area,
      description,
      screens: [],
    }
    saveDynamicFlow(def)
    registerDynamicFlow(def)
    setShowNewDialog(false)
    onSelect(id)
    onFlowCreated?.()
  }

  return (
    <>
      <aside className="w-[240px] h-full shrink-0 overflow-y-auto border-r border-shell-border bg-shell-surface flex flex-col">
        <div className="p-[var(--token-spacing-md)] flex items-center justify-between">
          <h2 className="text-[length:var(--token-font-size-caption)] leading-[var(--token-line-height-caption)] font-semibold text-shell-text-tertiary uppercase tracking-wider">
            Flows
          </h2>
          <button
            type="button"
            onClick={() => setShowNewDialog(true)}
            title="New Flow"
            className="w-[24px] h-[24px] flex items-center justify-center rounded-[var(--token-radius-sm)] text-shell-text-tertiary hover:text-shell-selected-text hover:bg-shell-hover transition-colors cursor-pointer"
          >
            <Plus size={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {areas.length === 0 && (
            <p className="px-[var(--token-spacing-md)] text-[length:var(--token-font-size-body-sm)] text-shell-text-tertiary">
              No flows yet
            </p>
          )}

          {areas.map((area) => (
            <div key={area} className="mb-[var(--token-spacing-2)]">
              <p className="px-[var(--token-spacing-md)] py-[var(--token-spacing-1)] text-[length:var(--token-font-size-caption)] font-medium text-shell-text-tertiary uppercase tracking-wider">
                {area}
              </p>
              {grouped[area].map((flow: Flow) => (
                <button
                  key={flow.id}
                  type="button"
                  onClick={() => onSelect(flow.id)}
                  className={`
                    w-full text-left px-[var(--token-spacing-md)] py-[var(--token-spacing-2)]
                    text-[length:var(--token-font-size-body-sm)] leading-[var(--token-line-height-body-sm)]
                    transition-colors duration-[var(--token-transition-fast)] cursor-pointer
                    ${
                      selectedFlowId === flow.id
                        ? 'bg-shell-selected text-shell-selected-text font-medium'
                        : 'text-shell-text hover:bg-shell-hover'
                    }
                  `}
                >
                  {flow.name}
                  <span className="block text-[length:var(--token-font-size-caption)] text-shell-text-tertiary">
                    {flow.screens.length} screen{flow.screens.length !== 1 ? 's' : ''}
                  </span>
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* New flow button at bottom */}
        <div className="p-[var(--token-spacing-2)] border-t border-shell-border">
          <button
            type="button"
            onClick={() => setShowNewDialog(true)}
            className="w-full flex items-center justify-center gap-[var(--token-spacing-1)] py-[var(--token-spacing-2)] text-[length:var(--token-font-size-body-sm)] text-shell-text-tertiary hover:text-shell-selected-text hover:bg-shell-hover rounded-[var(--token-radius-sm)] transition-colors cursor-pointer"
          >
            <Plus size={14} />
            New Flow
          </button>
        </div>
      </aside>

      {showNewDialog && (
        <NewFlowDialog
          onClose={() => setShowNewDialog(false)}
          onCreate={handleCreateFlow}
        />
      )}
    </>
  )
}
