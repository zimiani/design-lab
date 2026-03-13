/**
 * Persistence for user-created (dynamic) pages.
 * These pages use PlaceholderScreen components and are stored in localStorage.
 */

import { supabase, isSupabaseConnected } from '../../lib/supabase'
import { markUnsynced, markRemoteUpdated } from '../../lib/syncStore'

const STORAGE_KEY = 'picnic-design-lab:dynamic-pages'

export interface DynamicPageDef {
  id: string
  name: string
  description: string
  area: string
  componentsUsed: string[]
}

// ── localStorage layer ──

function readAll(): Record<string, DynamicPageDef> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function writeAll(data: Record<string, DynamicPageDef>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

// ── Public API ──

export function getDynamicPages(): DynamicPageDef[] {
  return Object.values(readAll())
}

export function getDynamicPage(id: string): DynamicPageDef | null {
  return readAll()[id] ?? null
}

export function saveDynamicPage(page: DynamicPageDef): void {
  const all = readAll()
  all[page.id] = page
  writeAll(all)
  markUnsynced()
}

export function deleteDynamicPage(id: string): void {
  const all = readAll()
  delete all[id]
  writeAll(all)
  markUnsynced()
}

// ── Supabase → localStorage hydration ──

export async function hydrateDynamicPagesFromSupabase(): Promise<boolean> {
  if (!isSupabaseConnected()) return false

  try {
    const { data, error } = await supabase!.from('dynamic_pages').select('*')
    if (error) return false

    const rows = data ?? []
    if (rows.length === 0) return true // empty table is valid — nothing to hydrate

    const all: Record<string, DynamicPageDef> = {}
    for (const row of rows) {
      all[row.id] = {
        id: row.id,
        name: row.name,
        description: row.description,
        area: row.area,
        componentsUsed: typeof row.components_used === 'string' ? JSON.parse(row.components_used) : row.components_used,
      }
    }
    writeAll(all)
    return true
  } catch {
    return false
  }
}

// ── Real-time subscription ──

export function subscribeToDynamicPageChanges(onUpdate: () => void): (() => void) | null {
  if (!isSupabaseConnected()) return null

  const channel = supabase!
    .channel('dynamic-page-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'dynamic_pages' }, () => {
      markRemoteUpdated()
      onUpdate()
    })
    .subscribe()

  return () => {
    supabase!.removeChannel(channel)
  }
}
