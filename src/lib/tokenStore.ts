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

/* ── Semantic overrides ── */

const SEMANTIC_STORAGE_KEY = 'picnic-design-lab:semantic-overrides'

type SemanticMap = Record<string, string> // cssVar → base token cssVar

function readSemanticLocal(): SemanticMap {
  try {
    const raw = localStorage.getItem(SEMANTIC_STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function getSemanticOverrides(): SemanticMap {
  return readSemanticLocal()
}

/* Injects overrides via a <style> tag outside @layer, so they always
   win over Tailwind's @layer theme definitions. */
const SEMANTIC_STYLE_ID = 'picnic-semantic-overrides'

function resolveTokenValue(baseCssVar: string): string {
  // Try computed style first (live value), fall back to inline style override
  const computed = getComputedStyle(document.documentElement)
    .getPropertyValue(`--token-${baseCssVar}`)
    .trim()
  return computed || `var(--token-${baseCssVar})`
}

function flushSemanticStyleTag(all: SemanticMap): void {
  let el = document.getElementById(SEMANTIC_STYLE_ID) as HTMLStyleElement | null
  if (!el) {
    el = document.createElement('style')
    el.id = SEMANTIC_STYLE_ID
    document.head.appendChild(el)
  }
  if (Object.keys(all).length === 0) {
    el.textContent = ''
    // Also clear inline styles
    for (const key of Object.keys(all)) {
      document.documentElement.style.removeProperty(`--color-${key}`)
    }
    return
  }
  const rules = Object.entries(all)
    .map(([cssVar, base]) => `  --color-${cssVar}: ${resolveTokenValue(base)};`)
    .join('\n')
  el.textContent = `:root {\n${rules}\n}`

  // Belt-and-suspenders: also set as inline style on <html>
  for (const [cssVar, base] of Object.entries(all)) {
    document.documentElement.style.setProperty(`--color-${cssVar}`, resolveTokenValue(base))
  }
}

export function setSemanticOverride(cssVar: string, base: string): void {
  const all = readSemanticLocal()
  all[cssVar] = base
  localStorage.setItem(SEMANTIC_STORAGE_KEY, JSON.stringify(all))
  flushSemanticStyleTag(all)
}

export function resetSemanticOverride(cssVar: string): void {
  const all = readSemanticLocal()
  delete all[cssVar]
  localStorage.setItem(SEMANTIC_STORAGE_KEY, JSON.stringify(all))
  flushSemanticStyleTag(all)
}

export function applySemanticOverrides(): void {
  flushSemanticStyleTag(readSemanticLocal())
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
