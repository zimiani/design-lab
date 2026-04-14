/**
 * PreviewPage — Guest page rendered inside an iframe.
 *
 * Listens for postMessage commands from the host (FlowPlayer) and renders
 * the requested screen with the full layout stack (LayoutProvider → AppShell → Screen).
 *
 * The iframe's real viewport width drives CSS media queries and Tailwind breakpoints
 * naturally, so components like AppShell, BaseLayout, StickyFooter etc. respond to
 * actual width rather than a prop-based `isDesktop` flag.
 *
 * Standalone mode: if opened directly (no parent iframe), reads from URL params
 * and renders with navigation as no-ops.
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  RiHomeLine, RiHomeFill,
  RiBankCardLine, RiBankCardFill,
  RiGiftLine, RiGiftFill,
  RiPieChart2Line, RiPieChart2Fill,
} from '@remixicon/react'
import { PiPiggyBank, PiPiggyBankFill } from 'react-icons/pi'

/* Auto-discover all flow registrations */
import.meta.glob('../flows/*/index.ts', { eager: true })

import { getFlow, hydrateDynamicFlows } from './simulator/flowRegistry'
import { getFlowGraph } from './simulator/flowGraphStore'
import {
  resolveScreenElementTarget,
  resolveOverlayElementTarget,
  getOverlaysForScreen,
} from './simulator/flowGraphNavigation'
import type { FlowNodeData } from './simulator/flowGraph.types'
import { ScreenDataProvider } from '../lib/ScreenDataContext'
import { LayoutProvider } from '../library/layout/LayoutProvider'
import AppShell from '../library/layout/AppShell'
import Sidebar from '../library/navigation/Sidebar'
import TabBar from '../library/navigation/TabBar'
import BottomSheet from '../library/layout/BottomSheet'
import Text from '../library/foundations/Text'
import {
  isPreviewMessage,
  packMessage,
  type RenderMessage,
  type GuestMessage,
} from './simulator/iframeProtocol'

// Hydrate dynamic flows on module load
hydrateDynamicFlows()

const navItems = [
  { id: 'home', label: 'Início', icon: <RiHomeLine size={20} />, activeIcon: <RiHomeFill size={20} /> },
  { id: 'cards', label: 'Cartão', icon: <RiBankCardLine size={20} />, activeIcon: <RiBankCardFill size={20} /> },
  { id: 'invest', label: 'Caixinha', icon: <PiPiggyBank size={20} />, activeIcon: <PiPiggyBankFill size={20} />, linkedFlowId: 'save-manage' },
  { id: 'investir', label: 'Investir', icon: <RiPieChart2Line size={20} />, activeIcon: <RiPieChart2Fill size={20} />, linkedFlowId: 'invest-manage' },
  { id: 'perks', label: 'Benefícios', icon: <RiGiftLine size={20} />, activeIcon: <RiGiftFill size={20} /> },
]

const slideVariants = {
  enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d > 0 ? -300 : 300, opacity: 0 }),
}

const fadeVariants = {
  enter: () => ({ opacity: 0 }),
  center: { opacity: 1 },
  exit: () => ({ opacity: 0 }),
}

function postToHost(msg: GuestMessage) {
  if (window.parent !== window) {
    window.parent.postMessage(packMessage(msg), '*')
  }
}

const isStandalone = window.parent === window

export default function PreviewPage() {
  const { flowId: urlFlowId } = useParams<{ flowId: string }>()
  const [searchParams] = useSearchParams()

  // Render state — driven by host messages or standalone URL params
  const [renderState, setRenderState] = useState<RenderMessage | null>(null)
  const [activeNavId, setActiveNavId] = useState('home')
  const renderStateRef = useRef(renderState)
  renderStateRef.current = renderState

  // Override dark shell chrome styles — the iframe inherits the same global CSS
  // which sets body { background: #1E1E1E; color: #E8E8E8 } for the IDE shell.
  // Inside the iframe we need the app's real colors instead.
  //
  // Safe area simulation: detect phone vs desktop from viewport width and set
  // CSS vars immediately. This avoids a timing gap where the postMessage-based
  // set-safe-areas hasn't arrived yet but layout components already need the values.
  // Values match PhoneFrame.tsx: --safe-area-top: 62px (status bar), --safe-area-bottom: 34px (home indicator).
  // The host can still override via set-safe-areas (e.g. keyboard open → bottom = 0px).
  useEffect(() => {
    // Fix height chain for iframe: html → body → #root must all have explicit height
    // so that h-full (height: 100%) cascades correctly through AppShell → BaseLayout → StickyFooter.
    // Without this, min-height: 100vh on #root doesn't establish a definite height for % resolution.
    document.documentElement.style.height = '100%'
    document.body.style.height = '100%'
    document.body.style.backgroundColor = 'transparent'
    document.body.style.color = 'var(--color-content-primary)'
    const root = document.getElementById('root')
    if (root) {
      root.style.height = '100%'
      root.style.minHeight = '0' // override min-height: 100vh which fights with flex
    }

    const isPhone = window.innerWidth <= 500
    document.documentElement.style.setProperty('--safe-area-top', isPhone ? '62px' : '0px')
    document.documentElement.style.setProperty('--safe-area-bottom', isPhone ? '34px' : '0px')
  }, [])

  // Listen for host messages
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (!isPreviewMessage(event)) return

      const msg = event.data
      if (msg.type === 'render') {
        const rm = msg as RenderMessage
        setRenderState(rm)
        // Sync active tab: prefer flow-linked tab, fall back to host's activeNavId
        const matchedTab = navItems.find((n) => n.linkedFlowId === rm.flowId)
        if (matchedTab) {
          setActiveNavId(matchedTab.id)
        } else if (rm.activeNavId) {
          setActiveNavId(rm.activeNavId)
        }
      } else if (msg.type === 'set-safe-areas') {
        document.documentElement.style.setProperty('--safe-area-top', msg.safeAreaTop)
        document.documentElement.style.setProperty('--safe-area-bottom', msg.safeAreaBottom)
      }
    }

    window.addEventListener('message', handleMessage)

    // Signal ready to host
    postToHost({ type: 'ready' })

    return () => window.removeEventListener('message', handleMessage)
  }, [])

  // Standalone mode: build a render state from URL params
  useEffect(() => {
    if (!isStandalone || !urlFlowId) return

    const flow = getFlow(urlFlowId)
    if (!flow) return

    const screenId = searchParams.get('screen') || flow.screens[0]?.id
    const screen = flow.screens.find(s => s.id === screenId) || flow.screens[0]
    if (!screen) return

    const stateId = searchParams.get('state')
    const activeState = stateId
      ? screen.states?.find(s => s.id === stateId)
      : screen.states?.find(s => s.isDefault)

    // Find the node for this screen in the graph
    const graph = getFlowGraph(urlFlowId)
    const screenNode = graph?.nodes.find(n => {
      const d = n.data as FlowNodeData
      return (d.screenId === screenId || d.pageId === screenId)
    })
    const overlays = screenNode && graph
      ? getOverlaysForScreen(screenNode.id, graph.nodes, graph.edges)
      : []

    setRenderState({
      type: 'render',
      flowId: urlFlowId,
      screenId: screen.id,
      screenTitle: screen.title,
      screenDescription: screen.description,
      stateData: activeState?.data ?? {},
      direction: 1,
      stateKey: 0,
      level: 1,
      breadcrumbs: [],
      overlays,
      activeOverlayId: null,
      activeNavId: 'home',
      states: screen.states,
    })
  }, [urlFlowId, searchParams])

  // Handle keyboard detection — forward to host
  useEffect(() => {
    function handleFocusIn(e: FocusEvent) {
      const el = e.target as HTMLElement
      if (el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA') return
      const input = el as HTMLInputElement
      if (input.readOnly || input.disabled) return
      const mode = input.inputMode || input.getAttribute('inputmode')
      const keyboardType = mode === 'numeric' || mode === 'decimal' ? 'numeric' as const : 'text' as const
      postToHost({ type: 'keyboard', keyboardType })
    }

    function handleFocusOut(e: FocusEvent) {
      const next = e.relatedTarget as HTMLElement | null
      if (!next || (next.tagName !== 'INPUT' && next.tagName !== 'TEXTAREA')) {
        postToHost({ type: 'keyboard', keyboardType: null })
      }
    }

    document.addEventListener('focusin', handleFocusIn)
    document.addEventListener('focusout', handleFocusOut)
    return () => {
      document.removeEventListener('focusin', handleFocusIn)
      document.removeEventListener('focusout', handleFocusOut)
    }
  }, [])

  // Resolve screen from render state
  const flow = renderState ? getFlow(renderState.flowId) : null
  const screen = flow?.screens.find(s => s.id === renderState?.screenId) ?? flow?.screens[0]

  // onElementTap: resolve locally using graph, send result to host
  const handleElementTap = useCallback((elementLabel: string): boolean => {
    const state = renderStateRef.current
    if (!state) return false

    const graph = getFlowGraph(state.flowId)
    if (!graph) return false

    // Find the current screen's node ID
    const screenNode = graph.nodes.find(n => {
      const d = n.data as FlowNodeData
      return (d.screenId === state.screenId || d.pageId === state.screenId)
    })
    if (!screenNode) return false

    // Try screen element target
    const target = resolveScreenElementTarget(screenNode.id, elementLabel, graph.nodes, graph.edges)
    if (target) {
      if (target.type === 'flow') {
        postToHost({ type: 'navigate-flow', flowId: target.flowId })
        return true
      }
      if (target.type === 'screen') {
        postToHost({ type: 'navigate', nodeId: target.nodeId, screenId: target.screenId })
        return true
      }
    }

    // Try overlay element targets
    for (const overlay of (state.overlays ?? [])) {
      const overlayTarget = resolveOverlayElementTarget(overlay.nodeId, elementLabel, graph.nodes, graph.edges)
      if (!overlayTarget) continue
      if (overlayTarget.type === 'flow') {
        postToHost({ type: 'navigate-flow', flowId: overlayTarget.flowId })
        return true
      }
      if (overlayTarget.type === 'screen') {
        postToHost({ type: 'navigate', nodeId: overlayTarget.nodeId, screenId: overlayTarget.screenId })
        return true
      }
    }

    return false
  }, [])

  const handleNext = useCallback(() => {
    postToHost({ type: 'next' })
  }, [])

  const handleBack = useCallback(() => {
    postToHost({ type: 'back' })
  }, [])

  const handleOpenOverlay = useCallback((overlayId: string) => {
    postToHost({ type: 'open-overlay', overlayId })
  }, [])

  const handleStateChange = useCallback((stateId: string) => {
    postToHost({ type: 'state-change', stateId })
  }, [])

  const handleTabChange = useCallback((id: string) => {
    setActiveNavId(id)
    const item = navItems.find((n) => n.id === id)
    if (item?.linkedFlowId) {
      postToHost({ type: 'navigate-flow', flowId: item.linkedFlowId })
    }
  }, [])

  if (!renderState || !flow || !screen) {
    return (
      <div className="flex items-center justify-center h-screen bg-surface-primary text-content-secondary">
        {isStandalone ? 'Flow not found' : 'Waiting for host...'}
      </div>
    )
  }

  const isStateSwap = renderState.stateKey > 0

  const sidebarNode = (
    <Sidebar
      items={navItems}
      activeId={activeNavId}
      onChange={setActiveNavId}
      header={<Text variant="h3">Picnic</Text>}
    />
  )

  const tabBarNode = (
    <TabBar
      items={navItems}
      activeId={activeNavId}
      onChange={handleTabChange}
    />
  )

  // Build overlay content
  const activeOverlay = renderState.activeOverlayId
    ? renderState.overlays?.find(o => o.nodeId === renderState.activeOverlayId) ?? null
    : null

  const overlayElements = renderState.overlayElements

  const handleOverlayElementClick = (el: { id: string; component: string; label: string }) => {
    postToHost({ type: 'overlay-element-click', elementId: el.id, component: el.component, label: el.label })
  }

  return (
    <LayoutProvider level={renderState.level} breadcrumbs={renderState.breadcrumbs}>
      <AppShell sidebar={sidebarNode} tabBar={tabBarNode}>
        <AnimatePresence mode="wait" custom={renderState.direction}>
          <motion.div
            key={`${renderState.screenId}-s${renderState.stateKey}`}
            custom={renderState.direction}
            variants={isStateSwap ? fadeVariants : slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: isStateSwap ? 0.15 : 0.25, ease: 'easeOut' }}
            className="h-full"
          >
            <ScreenDataProvider data={renderState.stateData}>
              <screen.component
                onNext={handleNext}
                onBack={handleBack}
                overlays={renderState.overlays}
                onOpenOverlay={handleOpenOverlay}
                onElementTap={handleElementTap}
                onStateChange={handleStateChange}
                screenTitle={renderState.screenTitle}
                screenDescription={renderState.screenDescription}
              />
            </ScreenDataProvider>
          </motion.div>
        </AnimatePresence>

        {/* Overlays render inside the iframe (position: fixed is scoped to iframe viewport) */}
        <BottomSheet open={!!activeOverlay} onClose={() => postToHost({ type: 'close-overlay' })} title={activeOverlay?.label}>
          {overlayElements && overlayElements.length > 0 ? (
            <div className="flex flex-col">
              {overlayElements.map((el) => (
                <button
                  key={el.id}
                  type="button"
                  onClick={() => handleOverlayElementClick(el)}
                  className="flex items-center gap-3 px-4 py-3 text-left hover:bg-[var(--color-surface-secondary)] transition-colors cursor-pointer border-b border-[var(--color-border-primary)] last:border-b-0"
                >
                  <span className="text-[14px] font-medium text-[var(--color-content-primary)]">{el.label}</span>
                  <span className="text-[12px] text-[var(--color-content-tertiary)] ml-auto">{el.component}</span>
                </button>
              ))}
            </div>
          ) : (
            <Text variant="body-md" color="content-secondary">
              {activeOverlay?.description || 'Overlay placeholder'}
            </Text>
          )}
        </BottomSheet>
      </AppShell>
    </LayoutProvider>
  )
}
