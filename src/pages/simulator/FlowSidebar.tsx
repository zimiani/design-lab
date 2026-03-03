import { useState } from 'react'
import {
  RiAddLine, RiArrowDownSLine, RiArrowRightSLine, RiFilterLine, RiDeleteBinLine,
} from '@remixicon/react'
import { getFlow, getFlowsByDomain, getAllDomains, getDomain, registerDynamicFlow, unregisterFlow, type Flow } from './flowRegistry'
import { getFlowTag, resetFlowOverrides, type FlowTag } from './flowStore'
import { saveDynamicFlow, deleteDynamicFlow, type DynamicFlowDef } from './dynamicFlowStore'
import { deleteFlowGraph } from './flowGraphStore'
import { deleteAllVersions } from './flowVersionStore'
import NewFlowDialog from './NewFlowDialog'
import { slugify, uniqueId } from '../../lib/slugify'

interface FlowSidebarProps {
  selectedFlowId: string | null
  onSelect: (flowId: string) => void
  onFlowCreated?: () => void
  onFlowDeleted?: () => void
}

const allTags: { value: FlowTag; label: string; color: string }[] = [
  { value: 'draft', label: 'Draft', color: 'bg-[#FBBF24]' },
  { value: 'approved', label: 'Approved', color: 'bg-[#4ADE80]' },
  { value: 'in-production', label: 'In Prod', color: 'bg-[#60A5FA]' },
]

export default function FlowSidebar({ selectedFlowId, onSelect, onFlowCreated, onFlowDeleted }: FlowSidebarProps) {
  const [showNewDialog, setShowNewDialog] = useState(false)
  const [collapsedDomains, setCollapsedDomains] = useState<Set<string>>(new Set())
  const [activeFilters, setActiveFilters] = useState<Set<FlowTag>>(new Set(['draft', 'approved', 'in-production']))
  const [showFilters, setShowFilters] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const isFiltering = activeFilters.size < 3

  const toggleFilter = (tag: FlowTag) => {
    setActiveFilters((prev) => {
      const next = new Set(prev)
      if (next.has(tag)) {
        // Don't allow deselecting all — keep at least one
        if (next.size > 1) next.delete(tag)
      } else {
        next.add(tag)
      }
      return next
    })
  }

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
    const id = uniqueId('flow-' + slugify(name), (id) => !!getFlow(id))
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

  const handleDeleteFlow = (flowId: string) => {
    // Clean up all associated data
    deleteDynamicFlow(flowId)
    deleteFlowGraph(flowId)
    deleteAllVersions(flowId)
    resetFlowOverrides(flowId)
    unregisterFlow(flowId)
    setConfirmDeleteId(null)
    if (selectedFlowId === flowId) {
      onSelect('')
    }
    onFlowDeleted?.()
  }

  return (
    <>
      <aside className="w-[240px] h-full shrink-0 overflow-y-auto border-r border-shell-border bg-shell-surface flex flex-col">
        <div className="p-[var(--token-spacing-md)] flex items-center justify-between">
          <h2 className="text-[length:var(--token-font-size-caption)] leading-[var(--token-line-height-caption)] font-semibold text-shell-text-tertiary uppercase tracking-wider">
            Flows
          </h2>
          <div className="flex items-center gap-[var(--token-spacing-1)]">
            <button
              type="button"
              onClick={() => setShowFilters((v) => !v)}
              title="Filter by status"
              className={`
                w-[24px] h-[24px] flex items-center justify-center rounded-[var(--token-radius-sm)] transition-colors cursor-pointer
                ${isFiltering || showFilters
                  ? 'text-shell-selected-text bg-shell-selected-text/10'
                  : 'text-shell-text-tertiary hover:text-shell-selected-text hover:bg-shell-hover'
                }
              `}
            >
              <RiFilterLine size={14} />
            </button>
            <button
              type="button"
              onClick={() => setShowNewDialog(true)}
              title="New Flow"
              className="w-[24px] h-[24px] flex items-center justify-center rounded-[var(--token-radius-sm)] text-shell-text-tertiary hover:text-shell-selected-text hover:bg-shell-hover transition-colors cursor-pointer"
            >
              <RiAddLine size={14} />
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="px-[var(--token-spacing-md)] pb-[var(--token-spacing-2)] flex gap-[var(--token-spacing-1)]">
            {allTags.map((opt) => {
              const active = activeFilters.has(opt.value)
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggleFilter(opt.value)}
                  className={`
                    flex items-center gap-[4px] px-[6px] py-[2px]
                    rounded-[var(--token-radius-full)] text-[length:10px] font-medium
                    transition-colors cursor-pointer border
                    ${active
                      ? 'border-shell-selected-text/40 bg-shell-selected-text/10 text-shell-text'
                      : 'border-shell-border text-shell-text-tertiary opacity-50 hover:opacity-75'
                    }
                  `}
                >
                  <span className={`w-[5px] h-[5px] rounded-full ${opt.color}`} />
                  {opt.label}
                </button>
              )
            })}
          </div>
        )}

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
            const domainFlows = (grouped[domainId] ?? []).filter((f) => activeFilters.has(getFlowTag(f.id)))

            return (
              <div key={domainId} className="mb-[var(--token-spacing-1)]">
                <button
                  type="button"
                  onClick={() => toggleCollapse(domainId)}
                  className="w-full flex items-center gap-[var(--token-spacing-1)] px-[var(--token-spacing-md)] py-[var(--token-spacing-1)] text-[length:var(--token-font-size-caption)] font-medium text-shell-text-tertiary uppercase tracking-wider hover:text-shell-text-secondary transition-colors cursor-pointer"
                >
                  <ChevronIcon size={14} className="shrink-0" />
                  <span className="flex-1 text-left">{domainName}</span>
                  <span className="text-[length:10px] tabular-nums">{domainFlows.length}</span>
                </button>
                {!isCollapsed && domainFlows.length > 0 && (
                  <div>
                    {domainFlows.map((flow: Flow) => {
                      const tag = getFlowTag(flow.id)
                      const tagColor: Record<FlowTag, string> = {
                        draft: 'bg-[#FBBF24]',
                        approved: 'bg-[#4ADE80]',
                        'in-production': 'bg-[#60A5FA]',
                      }
                      const isConfirmingDelete = confirmDeleteId === flow.id
                      return (
                        <div key={flow.id} className="group relative">
                          <button
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
                            <span className="flex items-center gap-[6px]">
                              <span className={`w-[6px] h-[6px] rounded-full shrink-0 ${tagColor[tag]}`} />
                              {flow.name}
                            </span>
                            <span className="block text-[length:var(--token-font-size-caption)] text-shell-text-tertiary pl-[12px]">
                              {flow.screens.length} screen{flow.screens.length !== 1 ? 's' : ''}
                            </span>
                            {selectedFlowId === flow.id && (
                              <span className="block text-[length:var(--token-font-size-caption)] text-shell-text-tertiary font-mono pl-[12px]">
                                {flow.id}
                              </span>
                            )}
                          </button>
                          {/* Delete button — visible on hover */}
                          {!isConfirmingDelete && (
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(flow.id) }}
                              className="absolute right-[var(--token-spacing-2)] top-1/2 -translate-y-1/2 w-[20px] h-[20px] items-center justify-center rounded-[var(--token-radius-sm)] text-shell-text-tertiary hover:text-error hover:bg-error/10 transition-colors cursor-pointer hidden group-hover:flex"
                              title="Delete flow"
                            >
                              <RiDeleteBinLine size={12} />
                            </button>
                          )}
                          {/* Inline delete confirmation */}
                          {isConfirmingDelete && (
                            <div className="flex items-center gap-[var(--token-spacing-1)] px-[var(--token-spacing-md)] py-[var(--token-spacing-1)] bg-error/5 border-y border-error/20">
                              <span className="text-[length:var(--token-font-size-caption)] text-error flex-1">
                                Delete this flow?
                              </span>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-[var(--token-spacing-2)] py-[1px] text-[length:var(--token-font-size-caption)] text-shell-text-tertiary hover:text-shell-text cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteFlow(flow.id)}
                                className="px-[var(--token-spacing-2)] py-[1px] text-[length:var(--token-font-size-caption)] text-error hover:text-[#FCA5A5] font-medium cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      )
                    })}
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
