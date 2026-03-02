/**
 * Manual version history for flow graphs — like a changelog.
 * Users explicitly save named versions with a number, description, and tag.
 */

import type { Node, Edge } from '@xyflow/react'
import { getFlowOverrides } from './flowStore'
import { getFlow } from './flowRegistry'

const STORAGE_KEY = 'picnic-design-lab:flow-versions'

export type VersionTag = 'exploration' | 'milestone' | 'production'

export interface FlowVersion {
  id: string
  flowId: string
  version: string       // e.g. "1.0", "1.1", "2.0"
  description: string   // what changed — user-written
  tag: VersionTag       // type of version
  // Graph state
  nodes: Node[]
  edges: Edge[]
  // Flow metadata snapshot
  flowName: string
  flowDescription: string
  // Screen overrides snapshot
  screenOverrides: Record<string, { title?: string; description?: string }>
  createdAt: string
  /** Optional subset/order of screen IDs for this version. When present, only these screens are shown. */
  screenIds?: string[]
}

// ── localStorage layer ──

function readAll(): Record<string, FlowVersion[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function writeAll(data: Record<string, FlowVersion[]>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

// ── Public API ──

export function getVersions(flowId: string): FlowVersion[] {
  return readAll()[flowId] ?? []
}

export function saveVersion(
  flowId: string,
  version: string,
  description: string,
  nodes: Node[],
  edges: Edge[],
  tag: VersionTag = 'milestone',
  screenIds?: string[],
): FlowVersion {
  const all = readAll()
  if (!all[flowId]) all[flowId] = []

  // Capture current flow metadata
  const flow = getFlow(flowId)
  const overrides = getFlowOverrides(flowId)

  // Build screen overrides snapshot
  const screenOverrides: Record<string, { title?: string; description?: string }> = {}
  if (overrides.screens) {
    for (const [screenId, so] of Object.entries(overrides.screens)) {
      if (so.title || so.description) {
        screenOverrides[screenId] = { title: so.title, description: so.description }
      }
    }
  }

  const entry: FlowVersion = {
    id: `v-${Date.now()}`,
    flowId,
    version,
    description,
    tag,
    nodes: JSON.parse(JSON.stringify(nodes)),
    edges: JSON.parse(JSON.stringify(edges)),
    flowName: flow?.name ?? '',
    flowDescription: flow?.description ?? '',
    screenOverrides,
    createdAt: new Date().toISOString(),
    ...(screenIds ? { screenIds } : {}),
  }

  all[flowId].push(entry)
  writeAll(all)
  return entry
}

export function deleteVersion(flowId: string, versionId: string): void {
  const all = readAll()
  if (!all[flowId]) return
  all[flowId] = all[flowId].filter((v) => v.id !== versionId)
  if (all[flowId].length === 0) delete all[flowId]
  writeAll(all)
}

export function getVersion(flowId: string, versionId: string): FlowVersion | null {
  const versions = readAll()[flowId] ?? []
  return versions.find((v) => v.id === versionId) ?? null
}

/**
 * Suggests the next version number based on existing versions.
 * If no versions exist: "1.0"
 * Otherwise increments the minor: "1.0" → "1.1" → "1.2" etc.
 */
export function suggestNextVersion(flowId: string): string {
  const versions = getVersions(flowId)
  if (versions.length === 0) return '1.0'

  const last = versions[versions.length - 1].version
  const parts = last.split('.')
  if (parts.length === 2) {
    const major = parseInt(parts[0], 10)
    const minor = parseInt(parts[1], 10)
    if (!isNaN(major) && !isNaN(minor)) {
      return `${major}.${minor + 1}`
    }
  }
  return `${versions.length + 1}.0`
}

// ── Active version per flow ──
// Tracks which version is currently being viewed for each flow (in-memory only).

const activeVersions = new Map<string, string | null>()

/** Get the active version ID for a flow, or null if viewing current state. */
export function getActiveVersion(flowId: string): string | null {
  return activeVersions.get(flowId) ?? null
}

/** Set the active version for a flow. Pass null to go back to current state. */
export function setActiveVersion(flowId: string, versionId: string | null): void {
  if (versionId === null) {
    activeVersions.delete(flowId)
  } else {
    activeVersions.set(flowId, versionId)
  }
}

/** Get the active FlowVersion object (with screenIds etc.), or null. */
export function getActiveFlowVersion(flowId: string): FlowVersion | null {
  const vId = getActiveVersion(flowId)
  if (!vId) return null
  return getVersion(flowId, vId)
}
