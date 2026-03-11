/**
 * Single source of truth for flow node type configuration:
 * labels, colors, keyboard shortcuts, and insertable options.
 */

import {
  RiCursorLine, RiComputerLine, RiGitBranchLine, RiErrorWarningLine,
  RiExternalLinkLine, RiStackLine, RiServerLine, RiTimerLine, RiStickyNoteLine,
  RiLoginBoxLine,
} from '@remixicon/react'
import type { CreatableNodeType } from './flowGraph.types'

export interface NodeTypeEntry {
  type: CreatableNodeType
  label: string
  icon: typeof RiCursorLine
  color: string
  /** Keyboard shortcut key (lowercase, no modifier) */
  shortcut: string
}

/** Ordered list of all creatable node types with their display config. */
export const NODE_TYPE_CONFIG: NodeTypeEntry[] = [
  { type: 'screen',         label: 'Screen',         icon: RiComputerLine,      color: '#4ADE80', shortcut: 's' },
  { type: 'overlay',        label: 'Overlay',         icon: RiStackLine,         color: '#2DD4BF', shortcut: 'o' },
  { type: 'decision',       label: 'Decision',        icon: RiGitBranchLine,     color: '#FBBF24', shortcut: 'd' },
  { type: 'error',          label: 'Error State',     icon: RiErrorWarningLine,  color: '#F87171', shortcut: 'e' },
  { type: 'api-call',       label: 'API Call',        icon: RiServerLine,        color: '#22D3EE', shortcut: 'c' },
  { type: 'delay',          label: 'Delay',           icon: RiTimerLine,         color: '#FB923C', shortcut: 'w' },
  { type: 'action',         label: 'Action',          icon: RiCursorLine,        color: '#A78BFA', shortcut: 'a' },
  { type: 'flow-reference', label: 'Flow Reference',  icon: RiExternalLinkLine,  color: '#60A5FA', shortcut: 'f' },
  { type: 'note',           label: 'Note',            icon: RiStickyNoteLine,    color: '#78716C', shortcut: 'n' },
  { type: 'entry-point',    label: 'Entry Point',     icon: RiLoginBoxLine,      color: '#F472B6', shortcut: 'p' },
]

/** Map from node type to display label. */
export const NODE_LABELS: Record<CreatableNodeType, string> = Object.fromEntries(
  NODE_TYPE_CONFIG.map((e) => [e.type, e.label]),
) as Record<CreatableNodeType, string>

/** Map from node type to color hex string (used for MiniMap, edges, etc.). */
export const NODE_COLORS: Record<string, string> = Object.fromEntries(
  NODE_TYPE_CONFIG.map((e) => [e.type, e.color]),
)

/** Map from keyboard shortcut key to node type. */
export const SHORTCUT_TO_NODE_TYPE: Record<string, CreatableNodeType> = Object.fromEntries(
  NODE_TYPE_CONFIG.map((e) => [e.shortcut, e.type]),
)
