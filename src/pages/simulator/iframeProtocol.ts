/**
 * Shared types for host ↔ iframe (guest) postMessage communication.
 *
 * Host = FlowPlayer (manages navigation, state pills, device chrome)
 * Guest = PreviewPage (renders screen with real responsive layout inside iframe)
 */

import type { ScreenOverlayInfo } from './flowGraphNavigation'
import type { PageStateDefinition } from '../gallery/pageRegistry'

// ── Host → Guest messages ──

export interface RenderMessage {
  type: 'render'
  flowId: string
  screenId: string
  screenTitle: string
  screenDescription: string
  stateData: Record<string, unknown>
  direction: number
  stateKey: number
  level: number
  breadcrumbs: { label: string }[]
  overlays: ScreenOverlayInfo[]
  activeOverlayId: string | null
  overlayElements?: { id: string; component: string; label: string }[]
  activeNavId: string
  states?: PageStateDefinition[]
}

export interface SetSafeAreasMessage {
  type: 'set-safe-areas'
  safeAreaTop: string
  safeAreaBottom: string
}

export type HostMessage = RenderMessage | SetSafeAreasMessage

// ── Guest → Host messages ──

export interface ReadyMessage {
  type: 'ready'
}

export interface NavigateMessage {
  type: 'navigate'
  nodeId: string
  screenId: string
}

export interface BackMessage {
  type: 'back'
}

export interface NavigateFlowMessage {
  type: 'navigate-flow'
  flowId: string
}

export interface StateChangeMessage {
  type: 'state-change'
  stateId: string
}

export interface KeyboardMessage {
  type: 'keyboard'
  keyboardType: 'numeric' | 'text' | null
}

export interface OpenOverlayMessage {
  type: 'open-overlay'
  overlayId: string
}

export interface CloseOverlayMessage {
  type: 'close-overlay'
}

export interface OverlayElementClickMessage {
  type: 'overlay-element-click'
  elementId: string
  component: string
  label: string
}

export interface NextMessage {
  type: 'next'
}

export type GuestMessage =
  | ReadyMessage
  | NavigateMessage
  | BackMessage
  | NavigateFlowMessage
  | StateChangeMessage
  | KeyboardMessage
  | OpenOverlayMessage
  | CloseOverlayMessage
  | OverlayElementClickMessage
  | NextMessage

// ── Channel identifier ──

export const IFRAME_CHANNEL = 'picnic-preview' as const

/** Wrap a message with the channel tag for identification. */
export function packMessage<T extends HostMessage | GuestMessage>(msg: T): { channel: typeof IFRAME_CHANNEL } & T {
  return { channel: IFRAME_CHANNEL, ...msg }
}

/** Check if a MessageEvent is from our channel. */
export function isPreviewMessage(event: MessageEvent): boolean {
  return event.data?.channel === IFRAME_CHANNEL
}
