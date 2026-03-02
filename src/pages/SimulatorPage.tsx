import { useState, useEffect, useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RiComputerLine, RiGitBranchLine, RiArrowLeftLine } from '@remixicon/react'
import type { Node, Edge } from '@xyflow/react'

/* Force flow registrations */
import '../flows/deposit'
import '../flows/deposit-v2'
import '../flows/perks'
import '../flows/withdrawal'
import '../flows/invest-earn'

import AppHeader from '../components/AppHeader'
import FlowSidebar from './simulator/FlowSidebar'
import FlowPlayer from './simulator/FlowPlayer'
import FlowCanvas from './simulator/FlowCanvas'
import { getAllFlows, getFlow, hydrateDynamicFlows } from './simulator/flowRegistry'
import { getVersions, suggestNextVersion, setActiveVersion, type FlowVersion } from './simulator/flowVersionStore'
import { hydrateFromSupabase, subscribeToChanges } from './simulator/flowStore'
import { hydrateGraphsFromSupabase, subscribeToGraphChanges } from './simulator/flowGraphStore'

type ViewMode = 'flow' | 'prototype'

const viewModes = [
  { key: 'prototype' as const, label: 'Prototype', icon: RiComputerLine },
  { key: 'flow' as const, label: 'Flow', icon: RiGitBranchLine },
]

export default function SimulatorPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  // Derive selectedFlowId and viewMode from URL params
  const selectedFlowId = useMemo(() => {
    const param = searchParams.get('flow')
    if (param) return param
    const all = getAllFlows()
    return all.length > 0 ? all[0].id : null
  }, [searchParams])

  const viewMode: ViewMode = (searchParams.get('view') === 'flow' ? 'flow' : 'prototype')

  const setSelectedFlowId = useCallback((id: string | null) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (id) next.set('flow', id); else next.delete('flow')
      return next
    }, { replace: true })
  }, [setSearchParams])

  const setViewMode = useCallback((mode: ViewMode) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (mode === 'prototype') next.delete('view'); else next.set('view', mode)
      return next
    }, { replace: true })
  }, [setSearchParams])

  const [, setVersion] = useState(0)
  const [targetScreenId, setTargetScreenId] = useState<string | null>(null)

  // Version management (shared between FlowCanvas and FlowPlayer)
  const [versionTick, setVersionTick] = useState(0)
  const versions = useMemo(() => selectedFlowId ? getVersions(selectedFlowId) : [], [selectedFlowId, versionTick])
  const suggestedVer = useMemo(() => selectedFlowId ? suggestNextVersion(selectedFlowId) : '1.0', [selectedFlowId, versionTick])
  const [activeVersionGraph, setActiveVersionGraph] = useState<{ nodes: Node[], edges: Edge[] } | null>(null)

  const refreshVersions = useCallback(() => setVersionTick((t) => t + 1), [])

  const handleViewVersion = useCallback((versionEntry: FlowVersion) => {
    // Set this version as active (filters screens if it has screenIds)
    setActiveVersion(versionEntry.flowId, versionEntry.id)
    // Share the version's graph with both views
    setActiveVersionGraph({ nodes: versionEntry.nodes, edges: versionEntry.edges })
    setVersion((v) => v + 1) // force re-render to pick up filtered screens
  }, [])

  const handleClearVersion = useCallback(() => {
    if (selectedFlowId) {
      setActiveVersion(selectedFlowId, null)
    }
    setActiveVersionGraph(null)
    setVersion((v) => v + 1)
  }, [selectedFlowId])

  useEffect(() => {
    hydrateDynamicFlows()
    setVersion((v) => v + 1)
  }, [])

  // Clear version state when switching flows
  useEffect(() => {
    setActiveVersionGraph(null)
    if (selectedFlowId) {
      setActiveVersion(selectedFlowId, null)
    }
  }, [selectedFlowId])


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

  const handleNavigateToScreen = useCallback((screenId: string) => {
    setTargetScreenId(screenId)
    setViewMode('prototype')
  }, [setViewMode])

  const handleNavigateToFlow = useCallback((flowId: string) => {
    setSelectedFlowId(flowId)
  }, [setSelectedFlowId])

  const selectedFlow = selectedFlowId ? getFlow(selectedFlowId) : null
  const activeIndex = viewModes.findIndex((m) => m.key === viewMode)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="h-screen flex flex-col bg-shell-bg"
    >
      <AppHeader />

      {/* Sub-header: view toggle + flow name */}
      <div className="h-[40px] flex items-center px-[var(--token-spacing-md)] border-b border-shell-border bg-shell-surface shrink-0">
        <div className="flex-1 min-w-0" />

        {/* 2-way view toggle (centered) */}
        <div className="relative flex w-[200px] p-[2px] bg-shell-bg rounded-[var(--token-radius-sm)] shrink-0">
          <motion.div
            className="absolute top-[2px] bottom-[2px] bg-shell-hover rounded-[6px]"
            initial={false}
            animate={{
              left: activeIndex === 0 ? '2px' : 'calc(50%)',
              width: 'calc(50% - 2px)',
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
          {viewModes.map((mode) => (
            <button
              key={mode.key}
              type="button"
              onClick={() => setViewMode(mode.key)}
              className={`
                relative z-10 flex items-center justify-center gap-[var(--token-spacing-1)]
                flex-1 min-w-[80px]
                px-[var(--token-spacing-3)] py-[var(--token-spacing-1)]
                text-[length:var(--token-font-size-caption)] font-medium
                transition-colors cursor-pointer rounded-[6px]
                ${viewMode === mode.key ? 'text-shell-text' : 'text-shell-text-tertiary hover:text-shell-text-secondary'}
              `}
            >
              <mode.icon size={12} />
              {mode.label}
            </button>
          ))}
        </div>

        {/* Flow name (right side) */}
        <div className="flex-1 flex items-center justify-end min-w-0">
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
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Version banner */}
            {activeVersionGraph && (
              <div className="flex items-center gap-[var(--token-spacing-2)] px-[var(--token-spacing-md)] py-[var(--token-spacing-1)] bg-[#60A5FA]/10 border-b border-[#60A5FA]/30 shrink-0">
                <span className="text-[length:var(--token-font-size-caption)] text-[#60A5FA] font-medium">
                  Viewing saved version
                </span>
                <button
                  type="button"
                  onClick={handleClearVersion}
                  className="text-[length:var(--token-font-size-caption)] text-[#60A5FA] hover:text-[#93C5FD] font-medium cursor-pointer flex items-center gap-[2px] ml-auto"
                >
                  <RiArrowLeftLine size={11} />
                  Back to current
                </button>
              </div>
            )}
            {viewMode === 'prototype' ? (
              <FlowPlayer
                flowId={selectedFlowId}
                initialScreenId={targetScreenId}
                versions={versions}
                suggestedVersion={suggestedVer}
                onVersionsChanged={refreshVersions}
                onViewVersion={handleViewVersion}
                graphOverride={activeVersionGraph}
              />
            ) : (
              <FlowCanvas
                flow={selectedFlow}
                onNavigateToScreen={handleNavigateToScreen}
                onNavigateToFlow={handleNavigateToFlow}
                onFlowChanged={() => setVersion((v) => v + 1)}
                versions={versions}
                suggestedVersion={suggestedVer}
                onVersionsChanged={refreshVersions}
                onViewVersion={handleViewVersion}
                graphOverride={activeVersionGraph}
              />
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-shell-text-tertiary">
            Select a flow from the sidebar
          </div>
        )}
      </div>
    </motion.div>
  )
}
