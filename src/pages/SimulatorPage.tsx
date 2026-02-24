import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Monitor, GitBranch } from 'lucide-react'

/* Force flow registrations */
import '../flows/deposit'

import AppHeader from '../components/AppHeader'
import FlowSidebar from './simulator/FlowSidebar'
import FlowPlayer from './simulator/FlowPlayer'
import FlowCanvas from './simulator/FlowCanvas'
import { getAllFlows, getFlow, hydrateDynamicFlows } from './simulator/flowRegistry'
import { hydrateFromSupabase, subscribeToChanges } from './simulator/flowStore'
import { hydrateGraphsFromSupabase, subscribeToGraphChanges } from './simulator/flowGraphStore'

type ViewMode = 'prototype' | 'flow'

export default function SimulatorPage() {
  const [selectedFlowId, setSelectedFlowId] = useState<string | null>(null)
  const [, setVersion] = useState(0)
  const [viewMode, setViewMode] = useState<ViewMode>('prototype')
  const [targetScreenId, setTargetScreenId] = useState<string | null>(null)

  // Hydrate dynamic flows from localStorage on mount
  useEffect(() => {
    hydrateDynamicFlows()
    setVersion((v) => v + 1)
  }, [])

  useEffect(() => {
    if (!selectedFlowId) {
      const all = getAllFlows()
      if (all.length > 0) setSelectedFlowId(all[0].id)
    }
  }, [selectedFlowId])

  // Hydrate from Supabase + subscribe to real-time changes
  useEffect(() => {
    Promise.all([
      hydrateFromSupabase(),
      hydrateGraphsFromSupabase(),
    ]).then(([flowOk, graphOk]) => {
      if (flowOk || graphOk) setVersion((v) => v + 1)
    })
    const unsubFlows = subscribeToChanges(() => setVersion((v) => v + 1))
    const unsubGraphs = subscribeToGraphChanges(() => setVersion((v) => v + 1))
    return () => {
      unsubFlows?.()
      unsubGraphs?.()
    }
  }, [])

  // Navigate from flow view to prototype view at a specific screen
  const handleNavigateToScreen = useCallback((screenId: string) => {
    setTargetScreenId(screenId)
    setViewMode('prototype')
  }, [])

  const selectedFlow = selectedFlowId ? getFlow(selectedFlowId) : null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="h-screen flex flex-col bg-shell-bg"
    >
      <AppHeader />

      {/* Sub-header: view toggle + flow actions */}
      <div className="h-[40px] flex items-center justify-between px-[var(--token-spacing-md)] border-b border-shell-border bg-shell-surface shrink-0">
        {/* View toggle */}
        <div className="relative flex p-[2px] bg-shell-bg rounded-[var(--token-radius-sm)]">
          <motion.div
            className="absolute top-[2px] bottom-[2px] bg-shell-hover rounded-[6px]"
            initial={false}
            animate={{
              left: viewMode === 'prototype' ? '2px' : 'calc(50% + 0px)',
              width: 'calc(50% - 4px)',
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
          <button
            type="button"
            onClick={() => setViewMode('prototype')}
            className={`
              relative z-10 flex items-center gap-[var(--token-spacing-1)]
              px-[var(--token-spacing-3)] py-[var(--token-spacing-1)]
              text-[length:var(--token-font-size-caption)] font-medium
              transition-colors cursor-pointer rounded-[6px]
              ${viewMode === 'prototype' ? 'text-shell-text' : 'text-shell-text-tertiary hover:text-shell-text-secondary'}
            `}
          >
            <Monitor size={12} />
            Prototype
          </button>
          <button
            type="button"
            onClick={() => setViewMode('flow')}
            className={`
              relative z-10 flex items-center gap-[var(--token-spacing-1)]
              px-[var(--token-spacing-3)] py-[var(--token-spacing-1)]
              text-[length:var(--token-font-size-caption)] font-medium
              transition-colors cursor-pointer rounded-[6px]
              ${viewMode === 'flow' ? 'text-shell-text' : 'text-shell-text-tertiary hover:text-shell-text-secondary'}
            `}
          >
            <GitBranch size={12} />
            Flow
          </button>
        </div>

        {/* Flow-level actions (right side) */}
        <div className="flex items-center gap-[var(--token-spacing-2)]">
          {selectedFlow && (
            <span className="text-[length:var(--token-font-size-caption)] text-shell-text-tertiary">
              {selectedFlow.name}
            </span>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        <FlowSidebar selectedFlowId={selectedFlowId} onSelect={setSelectedFlowId} onFlowCreated={() => setVersion((v) => v + 1)} />
        {selectedFlowId && selectedFlow ? (
          viewMode === 'prototype' ? (
            <FlowPlayer flowId={selectedFlowId} initialScreenId={targetScreenId} />
          ) : (
            <FlowCanvas
              flow={selectedFlow}
              onNavigateToScreen={handleNavigateToScreen}
              onFlowChanged={() => setVersion((v) => v + 1)}
            />
          )
        ) : (
          <div className="flex-1 flex items-center justify-center text-shell-text-tertiary">
            Select a flow from the sidebar
          </div>
        )}
      </div>
    </motion.div>
  )
}
