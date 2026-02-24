/**
 * Manual version history for flow graphs — like a changelog.
 * Users explicitly save named versions with a number and description.
 */

import type { Node, Edge } from '@xyflow/react'

const STORAGE_KEY = 'picnic-design-lab:flow-versions'

export interface FlowVersion {
  id: string
  flowId: string
  version: string       // e.g. "1.0", "1.1", "2.0"
  description: string   // what changed — user-written
  nodes: Node[]
  edges: Edge[]
  createdAt: string
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
): FlowVersion {
  const all = readAll()
  if (!all[flowId]) all[flowId] = []

  const entry: FlowVersion = {
    id: `v-${Date.now()}`,
    flowId,
    version,
    description,
    nodes: JSON.parse(JSON.stringify(nodes)),
    edges: JSON.parse(JSON.stringify(edges)),
    createdAt: new Date().toISOString(),
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
