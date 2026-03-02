import type { ComponentType } from 'react'
import { getFlowOverrides } from './flowStore'
import { getActiveFlowVersion } from './flowVersionStore'
import { getDynamicFlows, type DynamicFlowDef } from './dynamicFlowStore'
import { createPlaceholderComponent } from '../../flows/PlaceholderScreen'

export interface FlowScreen {
  id: string
  title: string
  description: string
  componentsUsed: readonly string[]
  component: ComponentType<FlowScreenProps>
  /** Optional reference to a standalone Page entity in the page registry */
  pageId?: string
}

export interface FlowScreenProps {
  onNext: () => void
  onBack: () => void
  overlays?: import('./flowGraphNavigation').ScreenOverlayInfo[]
  onOpenOverlay?: (nodeId: string) => void
  activeStateId?: string | null
}

// ── Domain system ──

export interface DomainDef {
  id: string       // 'cards', 'earn', 'add-funds', etc.
  name: string     // 'Cards'
  order: number    // Display order
}

const domains = new Map<string, DomainDef>()

export function registerDomain(domain: DomainDef): void {
  domains.set(domain.id, domain)
}

export function getDomain(id: string): DomainDef | undefined {
  return domains.get(id)
}

export function getAllDomains(): DomainDef[] {
  return Array.from(domains.values()).sort((a, b) => a.order - b.order)
}

// Register default domains
registerDomain({ id: 'authentication', name: 'Authentication', order: 1 })
registerDomain({ id: 'onboarding', name: 'Onboarding', order: 2 })
registerDomain({ id: 'dashboard', name: 'Dashboard', order: 3 })
registerDomain({ id: 'cards', name: 'Cards', order: 4 })
registerDomain({ id: 'add-funds', name: 'Add Funds', order: 5 })
registerDomain({ id: 'send-funds', name: 'Send Funds', order: 6 })
registerDomain({ id: 'perks', name: 'Perks', order: 7 })
registerDomain({ id: 'earn', name: 'Earn', order: 8 })
registerDomain({ id: 'transaction-history', name: 'Transaction History', order: 9 })
registerDomain({ id: 'settings', name: 'Settings', order: 10 })

// ── Flow registry ──

export interface Flow {
  id: string
  name: string
  description: string
  domain: string
  screens: FlowScreen[]
  specContent?: string
  isDynamic?: boolean
  /** Navigation level for the flow. Level 1 shows TabBar (main tabs), level 2 hides it (deeper screens). Defaults to 1. */
  level?: 1 | 2
}

const flows = new Map<string, Flow>()

export function registerFlow(flow: Flow): void {
  flows.set(flow.id, flow)
}

export function unregisterFlow(id: string): void {
  flows.delete(id)
}

/** Register a dynamic flow from the dynamicFlowStore data model. */
export function registerDynamicFlow(def: DynamicFlowDef): void {
  const flow: Flow = {
    id: def.id,
    name: def.name,
    description: def.description,
    domain: def.domain,
    specContent: def.specContent,
    isDynamic: true,
    screens: def.screens.map((s) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      componentsUsed: s.componentsUsed,
      component: createPlaceholderComponent(s.title, s.description),
    })),
  }
  flows.set(flow.id, flow)
}

/** Hydrate all dynamic flows from localStorage into the registry. */
export function hydrateDynamicFlows(): void {
  const dynamicFlows = getDynamicFlows()
  for (const def of dynamicFlows) {
    registerDynamicFlow(def)
  }
}

/** Re-register a single dynamic flow (after adding/removing screens). */
export function refreshDynamicFlow(id: string): void {
  // Re-read from localStorage and re-register
  const dynamicFlows = getDynamicFlows()
  const def = dynamicFlows.find((f) => f.id === id)
  if (def) {
    registerDynamicFlow(def)
  }
}

/** Returns the flow with localStorage overrides merged in.
 *  When an active version with screenIds is set, only those screens are returned (in order). */
export function getFlow(id: string): Flow | undefined {
  const base = flows.get(id)
  if (!base) return undefined

  const overrides = getFlowOverrides(id)
  let screens = base.screens.map((s) => {
    const so = overrides.screens?.[s.id]
    return {
      ...s,
      title: so?.title ?? s.title,
      description: so?.description ?? s.description,
    }
  })

  // Filter screens by active version's screenIds (if any)
  const activeVersion = getActiveFlowVersion(id)
  if (activeVersion?.screenIds && activeVersion.screenIds.length > 0) {
    const screenMap = new Map(screens.map((s) => [s.id, s]))
    screens = activeVersion.screenIds
      .map((sid) => screenMap.get(sid))
      .filter((s): s is FlowScreen => s !== undefined)
  }

  return {
    ...base,
    name: overrides.name ?? base.name,
    description: overrides.description ?? base.description,
    specContent: overrides.spec ?? base.specContent,
    screens,
  }
}

/** Returns base flow without overrides (for reset comparisons). */
export function getBaseFlow(id: string): Flow | undefined {
  return flows.get(id)
}

export function getAllFlows(): Flow[] {
  return Array.from(flows.keys()).map((id) => getFlow(id)!)
}

/** @deprecated Use getFlowsByDomain() instead */
export function getFlowsByArea(): Record<string, Flow[]> {
  return getFlowsByDomain()
}

export function getFlowsByDomain(): Record<string, Flow[]> {
  const grouped: Record<string, Flow[]> = {}
  for (const id of flows.keys()) {
    const flow = getFlow(id)!
    if (!grouped[flow.domain]) grouped[flow.domain] = []
    grouped[flow.domain].push(flow)
  }
  return grouped
}
