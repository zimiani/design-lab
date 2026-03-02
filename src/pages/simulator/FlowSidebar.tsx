import { useState } from 'react'
import {
  RiAddLine, RiArrowDownSLine, RiArrowRightSLine,
} from '@remixicon/react'
import { getFlowsByDomain, getAllDomains, getDomain, registerDynamicFlow, type Flow } from './flowRegistry'
import { saveDynamicFlow, type DynamicFlowDef } from './dynamicFlowStore'
import NewFlowDialog from './NewFlowDialog'

interface FlowSidebarProps {
  selectedFlowId: string | null
  onSelect: (flowId: string) => void
  onFlowCreated?: () => void
}

export default function FlowSidebar({ selectedFlowId, onSelect, onFlowCreated }: FlowSidebarProps) {
  const [showNewDialog, setShowNewDialog] = useState(false)
  const [collapsedDomains, setCollapsedDomains] = useState<Set<string>>(new Set())

  const grouped = getFlowsByDomain()
  const allDomains = getAllDomains()

  // Build ordered domain list: all registered domains (in order), then any unknown domains from flows
  const orderedDomainIds: string[] = allDomains.map((d) => d.id)
  for (const key of Object.keys(grouped)) {
    if (!orderedDomainIds.includes(key)) orderedDomainIds.push(key)
  }

  const toggleCollapse = (domainId: string) => {
    setCollapsedDomains((prev) => {
      const next = new Set(prev)
      if (next.has(domainId)) next.delete(domainId)
      else next.add(domainId)
      return next
    })
  }

  const handleCreateFlow = (name: string, domain: string, description: string) => {
    const id = `flow-${Date.now()}`
    const def: DynamicFlowDef = {
      id,
      name,
      domain,
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
            <RiAddLine size={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {orderedDomainIds.length === 0 && (
            <p className="px-[var(--token-spacing-md)] text-[length:var(--token-font-size-body-sm)] text-shell-text-tertiary">
              No flows yet
            </p>
          )}

          {orderedDomainIds.map((domainId) => {
            const domainDef = getDomain(domainId)
            const domainName = domainDef?.name ?? domainId
            const isCollapsed = collapsedDomains.has(domainId)
            const ChevronIcon = isCollapsed ? RiArrowRightSLine : RiArrowDownSLine

            return (
              <div key={domainId} className="mb-[var(--token-spacing-1)]">
                <button
                  type="button"
                  onClick={() => toggleCollapse(domainId)}
                  className="w-full flex items-center gap-[var(--token-spacing-1)] px-[var(--token-spacing-md)] py-[var(--token-spacing-1)] text-[length:var(--token-font-size-caption)] font-medium text-shell-text-tertiary uppercase tracking-wider hover:text-shell-text-secondary transition-colors cursor-pointer"
                >
                  <ChevronIcon size={14} className="shrink-0" />
                  <span className="flex-1 text-left">{domainName}</span>
                  <span className="text-[length:10px] tabular-nums">{(grouped[domainId] ?? []).length}</span>
                </button>
                {!isCollapsed && (grouped[domainId] ?? []).length > 0 && (
                  <div>
                    {grouped[domainId].map((flow: Flow) => (
                      <button
                        key={flow.id}
                        type="button"
                        onClick={() => onSelect(flow.id)}
                        className={`
                          w-full text-left pl-[calc(var(--token-spacing-md)+22px)] pr-[var(--token-spacing-md)] py-[var(--token-spacing-2)]
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
                )}
              </div>
            )
          })}
        </div>

        {/* New flow button at bottom */}
        <div className="p-[var(--token-spacing-2)] border-t border-shell-border">
          <button
            type="button"
            onClick={() => setShowNewDialog(true)}
            className="w-full flex items-center justify-center gap-[var(--token-spacing-1)] py-[var(--token-spacing-2)] text-[length:var(--token-font-size-body-sm)] text-shell-text-tertiary hover:text-shell-selected-text hover:bg-shell-hover rounded-[var(--token-radius-sm)] transition-colors cursor-pointer"
          >
            <RiAddLine size={14} />
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
