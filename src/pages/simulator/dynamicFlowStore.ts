/**
 * Persistence for user-created (dynamic) flows.
 * These flows use PlaceholderScreen components and are stored in localStorage.
 */

const STORAGE_KEY = 'picnic-design-lab:dynamic-flows'

export interface DynamicScreen {
  id: string
  title: string
  description: string
  componentsUsed: string[]
}

export interface DynamicFlowDef {
  id: string
  name: string
  description: string
  area: string
  screens: DynamicScreen[]
  specContent?: string
}

// ── localStorage layer ──

function readAll(): Record<string, DynamicFlowDef> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function writeAll(data: Record<string, DynamicFlowDef>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

// ── Public API ──

export function getDynamicFlows(): DynamicFlowDef[] {
  return Object.values(readAll())
}

export function getDynamicFlow(id: string): DynamicFlowDef | null {
  return readAll()[id] ?? null
}

export function saveDynamicFlow(flow: DynamicFlowDef): void {
  const all = readAll()
  all[flow.id] = flow
  writeAll(all)
}

export function deleteDynamicFlow(id: string): void {
  const all = readAll()
  delete all[id]
  writeAll(all)
}

export function addScreenToFlow(flowId: string, screen: DynamicScreen): void {
  const all = readAll()
  const flow = all[flowId]
  if (!flow) return
  flow.screens.push(screen)
  writeAll(all)
}

export function removeScreenFromFlow(flowId: string, screenId: string): void {
  const all = readAll()
  const flow = all[flowId]
  if (!flow) return
  flow.screens = flow.screens.filter((s) => s.id !== screenId)
  writeAll(all)
}

export function updateScreenInFlow(
  flowId: string,
  screenId: string,
  updates: Partial<Omit<DynamicScreen, 'id'>>,
): void {
  const all = readAll()
  const flow = all[flowId]
  if (!flow) return
  const screen = flow.screens.find((s) => s.id === screenId)
  if (!screen) return
  Object.assign(screen, updates)
  writeAll(all)
}
