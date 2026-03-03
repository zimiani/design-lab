/**
 * Flow data persistence — Supabase with localStorage fallback.
 *
 * Write path: Supabase (if connected) + localStorage (always, as cache/fallback).
 * Read path: localStorage first (instant), then Supabase hydrate overwrites.
 */

import { supabase, isSupabaseConnected } from '../../lib/supabase'

const STORAGE_KEY = 'picnic-design-lab:flow-overrides'

export type FlowTag = 'draft' | 'approved' | 'in-production'

export interface ScreenOverrides {
  title?: string
  description?: string
}

export interface FlowOverrides {
  name?: string
  description?: string
  spec?: string
  tag?: FlowTag
  screens?: Record<string, ScreenOverrides>
}

type AllOverrides = Record<string, FlowOverrides>

// ── localStorage layer (always available) ──

function readAll(): AllOverrides {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function writeAll(data: AllOverrides): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

// ── Public API ──

export function getFlowOverrides(flowId: string): FlowOverrides {
  return readAll()[flowId] ?? {}
}

export function getFlowTag(flowId: string): FlowTag {
  return readAll()[flowId]?.tag ?? 'draft'
}

export async function setFlowTag(flowId: string, tag: FlowTag): Promise<void> {
  const all = readAll()
  if (!all[flowId]) all[flowId] = {}
  all[flowId].tag = tag
  writeAll(all)

  if (isSupabaseConnected()) {
    await supabase!.from('flow_overrides').upsert(
      { flow_id: flowId, tag, updated_at: new Date().toISOString() },
      { onConflict: 'flow_id' },
    )
  }
}

export async function setFlowName(flowId: string, name: string): Promise<void> {
  // localStorage (immediate)
  const all = readAll()
  if (!all[flowId]) all[flowId] = {}
  all[flowId].name = name
  writeAll(all)

  // Supabase (async)
  if (isSupabaseConnected()) {
    await supabase!.from('flow_overrides').upsert(
      { flow_id: flowId, name, updated_at: new Date().toISOString() },
      { onConflict: 'flow_id' },
    )
  }
}

export async function setFlowDescription(flowId: string, description: string): Promise<void> {
  const all = readAll()
  if (!all[flowId]) all[flowId] = {}
  all[flowId].description = description
  writeAll(all)

  if (isSupabaseConnected()) {
    await supabase!.from('flow_overrides').upsert(
      { flow_id: flowId, description, updated_at: new Date().toISOString() },
      { onConflict: 'flow_id' },
    )
  }
}

export async function setFlowSpec(flowId: string, spec: string): Promise<void> {
  const all = readAll()
  if (!all[flowId]) all[flowId] = {}
  all[flowId].spec = spec
  writeAll(all)

  if (isSupabaseConnected()) {
    await supabase!.from('flow_overrides').upsert(
      { flow_id: flowId, spec, updated_at: new Date().toISOString() },
      { onConflict: 'flow_id' },
    )
  }
}

export async function setScreenOverride(
  flowId: string,
  screenId: string,
  field: keyof ScreenOverrides,
  value: string,
): Promise<void> {
  const all = readAll()
  if (!all[flowId]) all[flowId] = {}
  if (!all[flowId].screens) all[flowId].screens = {}
  if (!all[flowId].screens![screenId]) all[flowId].screens![screenId] = {}
  all[flowId].screens![screenId][field] = value
  writeAll(all)

  if (isSupabaseConnected()) {
    const row: Record<string, string> = {
      flow_id: flowId,
      screen_id: screenId,
      updated_at: new Date().toISOString(),
    }
    row[field] = value
    await supabase!.from('screen_overrides').upsert(row, {
      onConflict: 'flow_id,screen_id',
    })
  }
}

export async function resetFlowOverrides(flowId: string): Promise<void> {
  const all = readAll()
  delete all[flowId]
  writeAll(all)

  if (isSupabaseConnected()) {
    await Promise.all([
      supabase!.from('flow_overrides').delete().eq('flow_id', flowId),
      supabase!.from('screen_overrides').delete().eq('flow_id', flowId),
    ])
  }
}

export async function resetAllOverrides(): Promise<void> {
  localStorage.removeItem(STORAGE_KEY)

  if (isSupabaseConnected()) {
    await Promise.all([
      supabase!.from('flow_overrides').delete().neq('flow_id', ''),
      supabase!.from('screen_overrides').delete().neq('flow_id', ''),
    ])
  }
}

// ── Supabase → localStorage hydration ──

export async function hydrateFromSupabase(): Promise<boolean> {
  if (!isSupabaseConnected()) return false

  try {
    const [flowRes, screenRes] = await Promise.all([
      supabase!.from('flow_overrides').select('*'),
      supabase!.from('screen_overrides').select('*'),
    ])

    if (flowRes.error || screenRes.error) return false

    const flowRows = flowRes.data ?? []
    const screenRows = screenRes.data ?? []
    if (flowRows.length === 0 && screenRows.length === 0) return false // nothing in Supabase yet — keep localStorage

    const all: AllOverrides = {}

    for (const row of flowRows) {
      const id = row.flow_id as string
      if (!all[id]) all[id] = {}
      if (row.name) all[id].name = row.name
      if (row.description) all[id].description = row.description
      if (row.spec) all[id].spec = row.spec
      if (row.tag) all[id].tag = row.tag
    }

    for (const row of screenRows) {
      const flowId = row.flow_id as string
      const screenId = row.screen_id as string
      if (!all[flowId]) all[flowId] = {}
      if (!all[flowId].screens) all[flowId].screens = {}
      if (!all[flowId].screens![screenId]) all[flowId].screens![screenId] = {}
      if (row.title) all[flowId].screens![screenId].title = row.title
      if (row.description) all[flowId].screens![screenId].description = row.description
    }

    writeAll(all)
    return true
  } catch {
    return false
  }
}

// ── Real-time subscription ──

export function subscribeToChanges(onUpdate: () => void): (() => void) | null {
  if (!isSupabaseConnected()) return null

  const channel = supabase!
    .channel('flow-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'flow_overrides' }, () => {
      hydrateFromSupabase().then(() => onUpdate())
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'screen_overrides' }, () => {
      hydrateFromSupabase().then(() => onUpdate())
    })
    .subscribe()

  return () => {
    supabase!.removeChannel(channel)
  }
}
