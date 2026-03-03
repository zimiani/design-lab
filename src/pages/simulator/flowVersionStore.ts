/**
 * Manual version history for flow graphs — like a changelog.
 * Users explicitly save named versions with a number, description, and tag.
 */

import type { Node, Edge } from '@xyflow/react'
import { getFlowOverrides } from './flowStore'
import { getFlow } from './flowRegistry'
import { supabase, isSupabaseConnected } from '../../lib/supabase'

const STORAGE_KEY = 'picnic-design-lab:flow-versions'

/** @deprecated Tags now live on flows (FlowTag in flowStore). Kept for backward compat with old versions. */
export type VersionTag = 'exploration' | 'milestone' | 'production'

export interface FlowVersion {
  id: string
  flowId: string
  version: string       // e.g. "1.0", "1.1", "2.0"
  description: string   // what changed — user-written
  /** @deprecated Legacy field — tags now live on flows. Kept for backward compat. */
  tag?: VersionTag
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

  // Supabase (async, fire-and-forget)
  if (isSupabaseConnected()) {
    supabase!.from('flow_versions').upsert(
      {
        id: entry.id,
        flow_id: entry.flowId,
        version: entry.version,
        description: entry.description,
        nodes: JSON.stringify(entry.nodes),
        edges: JSON.stringify(entry.edges),
        flow_name: entry.flowName,
        flow_description: entry.flowDescription,
        screen_overrides: JSON.stringify(entry.screenOverrides),
        screen_ids: entry.screenIds ? JSON.stringify(entry.screenIds) : null,
        created_at: entry.createdAt,
      },
      { onConflict: 'id' },
    )
  }

  return entry
}

export function deleteVersion(flowId: string, versionId: string): void {
  const all = readAll()
  if (!all[flowId]) return
  all[flowId] = all[flowId].filter((v) => v.id !== versionId)
  if (all[flowId].length === 0) delete all[flowId]
  writeAll(all)

  // Supabase
  if (isSupabaseConnected()) {
    supabase!.from('flow_versions').delete().eq('id', versionId)
  }
}

export function deleteAllVersions(flowId: string): void {
  const all = readAll()
  const versions = all[flowId]
  if (!versions) return
  delete all[flowId]
  writeAll(all)

  if (isSupabaseConnected()) {
    supabase!.from('flow_versions').delete().eq('flow_id', flowId)
  }
}

export function updateVersion(
  flowId: string,
  versionId: string,
  updates: { version?: string; description?: string },
): void {
  const all = readAll()
  if (!all[flowId]) return
  const idx = all[flowId].findIndex((v) => v.id === versionId)
  if (idx === -1) return

  if (updates.version !== undefined) all[flowId][idx].version = updates.version
  if (updates.description !== undefined) all[flowId][idx].description = updates.description
  writeAll(all)

  if (isSupabaseConnected()) {
    const row: Record<string, string> = { id: versionId }
    if (updates.version !== undefined) row.version = updates.version
    if (updates.description !== undefined) row.description = updates.description
    supabase!.from('flow_versions').update(row).eq('id', versionId)
  }
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

// ── Supabase → localStorage hydration ──

export async function hydrateVersionsFromSupabase(): Promise<boolean> {
  if (!isSupabaseConnected()) return false

  try {
    const { data, error } = await supabase!.from('flow_versions').select('*')
    if (error) return false

    const rows = data ?? []
    if (rows.length === 0) return false // nothing in Supabase yet — keep localStorage

    const grouped: Record<string, FlowVersion[]> = {}
    for (const row of rows) {
      const version: FlowVersion = {
        id: row.id,
        flowId: row.flow_id,
        version: row.version,
        description: row.description,
        tag: row.tag,
        nodes: typeof row.nodes === 'string' ? JSON.parse(row.nodes) : row.nodes,
        edges: typeof row.edges === 'string' ? JSON.parse(row.edges) : row.edges,
        flowName: row.flow_name,
        flowDescription: row.flow_description,
        screenOverrides: typeof row.screen_overrides === 'string' ? JSON.parse(row.screen_overrides) : row.screen_overrides,
        createdAt: row.created_at,
        ...(row.screen_ids ? { screenIds: typeof row.screen_ids === 'string' ? JSON.parse(row.screen_ids) : row.screen_ids } : {}),
      }
      if (!grouped[version.flowId]) grouped[version.flowId] = []
      grouped[version.flowId].push(version)
    }
    writeAll(grouped)
    return true
  } catch {
    return false
  }
}

// ── Real-time subscription ──

export function subscribeToVersionChanges(onUpdate: () => void): (() => void) | null {
  if (!isSupabaseConnected()) return null

  const channel = supabase!
    .channel('flow-version-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'flow_versions' }, () => {
      hydrateVersionsFromSupabase().then(() => onUpdate())
    })
    .subscribe()

  return () => {
    supabase!.removeChannel(channel)
  }
}
