/**
 * Token persistence — localStorage with Supabase sync via Pull/Push.
 */

import { supabase, isSupabaseConnected } from './supabase'
import { markUnsynced, markRemoteUpdated } from './syncStore'

const STORAGE_KEY = 'picnic-design-lab:token-overrides'

type TokenMap = Record<string, string>

function readLocal(): TokenMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function writeLocal(data: TokenMap): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function getLocalTokenOverrides(): TokenMap {
  return readLocal()
}

export function setTokenOverride(cssVar: string, value: string): void {
  const all = readLocal()
  all[cssVar] = value
  writeLocal(all)
  markUnsynced()
}

export function resetTokenOverride(cssVar: string): void {
  const all = readLocal()
  delete all[cssVar]
  writeLocal(all)
  markUnsynced()
}

export function resetTokenCategory(cssVars: string[]): void {
  const all = readLocal()
  for (const v of cssVars) delete all[v]
  writeLocal(all)
  markUnsynced()
}

export function resetAllTokenOverrides(): void {
  localStorage.removeItem(STORAGE_KEY)
  markUnsynced()
}

export async function hydrateTokensFromSupabase(): Promise<boolean> {
  if (!isSupabaseConnected()) return false

  try {
    const { data, error } = await supabase!.from('token_overrides').select('*')
    if (error || !data) return false
    if (data.length === 0) return false // nothing in Supabase yet — keep localStorage

    const map: TokenMap = {}
    for (const row of data) {
      map[row.css_var as string] = row.value as string
    }
    writeLocal(map)

    // Apply to CSS
    for (const [cssVar, value] of Object.entries(map)) {
      document.documentElement.style.setProperty(`--token-${cssVar}`, value)
    }
    return true
  } catch {
    return false
  }
}

export function subscribeToTokenChanges(onUpdate: () => void): (() => void) | null {
  if (!isSupabaseConnected()) return null

  const channel = supabase!
    .channel('token-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'token_overrides' }, () => {
      markRemoteUpdated()
      onUpdate()
    })
    .subscribe()

  return () => {
    supabase!.removeChannel(channel)
  }
}
