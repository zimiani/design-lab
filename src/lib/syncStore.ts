/**
 * Centralized sync status + manual sync trigger.
 *
 * Tracks whether the last hydration round succeeded or failed,
 * and exposes a `syncAll()` that re-runs every hydrate function.
 */

import { isSupabaseConnected } from './supabase'
import { hydrateFromSupabase } from '../pages/simulator/flowStore'
import { hydrateGraphsFromSupabase } from '../pages/simulator/flowGraphStore'
import { hydrateVersionsFromSupabase } from '../pages/simulator/flowVersionStore'
import { hydrateDynamicFlowsFromSupabase } from '../pages/simulator/dynamicFlowStore'
import { hydratePageOverridesFromSupabase } from '../pages/gallery/pageStore'
import { hydrateDynamicPagesFromSupabase } from '../pages/gallery/dynamicPageStore'
import { hydrateTokensFromSupabase } from '../lib/tokenStore'

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error' | 'local'

type Listener = (status: SyncStatus) => void

let currentStatus: SyncStatus = isSupabaseConnected() ? 'idle' : 'local'
const listeners = new Set<Listener>()

export function getSyncStatus(): SyncStatus {
  return currentStatus
}

function setStatus(status: SyncStatus) {
  currentStatus = status
  listeners.forEach((fn) => fn(status))
}

export function subscribeSyncStatus(fn: Listener): () => void {
  listeners.add(fn)
  return () => { listeners.delete(fn) }
}

/**
 * Run all hydration functions. Returns true if at least one succeeded.
 */
export async function syncAll(): Promise<boolean> {
  if (!isSupabaseConnected()) {
    setStatus('local')
    return false
  }

  setStatus('syncing')

  try {
    const results = await Promise.all([
      hydrateFromSupabase(),
      hydrateGraphsFromSupabase(),
      hydrateVersionsFromSupabase(),
      hydrateDynamicFlowsFromSupabase(),
      hydratePageOverridesFromSupabase(),
      hydrateDynamicPagesFromSupabase(),
      hydrateTokensFromSupabase(),
    ])

    const anySucceeded = results.some(Boolean)
    setStatus(anySucceeded ? 'synced' : 'synced')
    return anySucceeded
  } catch {
    setStatus('error')
    return false
  }
}

/** Mark status as synced (call after successful writes or initial hydration). */
export function markSynced(): void {
  if (isSupabaseConnected()) setStatus('synced')
}

/** Mark status as error (call from write failures if desired). */
export function markError(): void {
  if (isSupabaseConnected()) setStatus('error')
}
