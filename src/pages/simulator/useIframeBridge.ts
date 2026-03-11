/**
 * Host-side hook for iframe ↔ FlowPlayer communication.
 *
 * Manages the iframe ref, sends render commands, and receives navigation
 * events from the guest (PreviewPage).
 */

import { useRef, useEffect, useCallback, useState } from 'react'
import type { ScreenOverlayInfo } from './flowGraphNavigation'
import type { PageStateDefinition } from '../gallery/pageRegistry'
import type { BreadcrumbItem } from '../../library/navigation/Breadcrumb'
import {
  isPreviewMessage,
  packMessage,
  type HostMessage,
  type RenderMessage,
} from './iframeProtocol'

type KeyboardType = 'numeric' | 'text' | null

export interface IframeBridgeCallbacks {
  onNavigate: (nodeId: string, screenId: string) => void
  onBack: () => void
  onNext: () => void
  onNavigateFlow: (flowId: string) => void
  onStateChange: (stateId: string) => void
  onOpenOverlay: (overlayId: string) => void
  onCloseOverlay: () => void
  onOverlayElementClick: (element: { id: string; component: string; label: string }) => void
}

export interface IframeBridgeRenderData {
  flowId: string
  screenId: string
  screenTitle: string
  screenDescription: string
  stateData: Record<string, unknown>
  direction: number
  stateKey: number
  level: number
  breadcrumbs: BreadcrumbItem[]
  overlays: ScreenOverlayInfo[]
  activeOverlayId: string | null
  overlayElements?: { id: string; component: string; label: string }[]
  activeNavId: string
  states?: PageStateDefinition[]
}

export function useIframeBridge(callbacks: IframeBridgeCallbacks) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [ready, setReady] = useState(false)
  const [keyboardType, setKeyboardType] = useState<KeyboardType>(null)
  const pendingRender = useRef<RenderMessage | null>(null)

  // Listen for guest messages
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (!isPreviewMessage(event)) return

      const msg = event.data
      switch (msg.type) {
        case 'ready':
          setReady(true)
          // Send any pending render
          if (pendingRender.current && iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage(
              packMessage(pendingRender.current), '*'
            )
            pendingRender.current = null
          }
          break
        case 'navigate':
          callbacks.onNavigate(msg.nodeId, msg.screenId)
          break
        case 'back':
          callbacks.onBack()
          break
        case 'next':
          callbacks.onNext()
          break
        case 'navigate-flow':
          callbacks.onNavigateFlow(msg.flowId)
          break
        case 'state-change':
          callbacks.onStateChange(msg.stateId)
          break
        case 'keyboard':
          setKeyboardType(msg.keyboardType)
          break
        case 'open-overlay':
          callbacks.onOpenOverlay(msg.overlayId)
          break
        case 'close-overlay':
          callbacks.onCloseOverlay()
          break
        case 'overlay-element-click':
          callbacks.onOverlayElementClick({
            id: msg.elementId,
            component: msg.component,
            label: msg.label,
          })
          break
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [callbacks])

  // Send a host message to the iframe
  const sendMessage = useCallback((msg: HostMessage) => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(packMessage(msg), '*')
    }
  }, [])

  // Send render command
  const sendRender = useCallback((data: IframeBridgeRenderData) => {
    const msg: RenderMessage = {
      type: 'render',
      ...data,
    }

    if (ready && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(packMessage(msg), '*')
    } else {
      // Queue until ready
      pendingRender.current = msg
    }
  }, [ready])

  // Send safe areas
  const sendSafeAreas = useCallback((safeAreaTop: string, safeAreaBottom: string) => {
    sendMessage({ type: 'set-safe-areas', safeAreaTop, safeAreaBottom })
  }, [sendMessage])

  // Reset ready state when iframe src changes
  const resetReady = useCallback(() => {
    setReady(false)
    setKeyboardType(null)
  }, [])

  return {
    iframeRef,
    ready,
    keyboardType,
    sendRender,
    sendSafeAreas,
    resetReady,
  }
}
