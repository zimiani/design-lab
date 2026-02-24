/**
 * localStorage persistence for flow edits.
 * Stores overrides for flow name, screen titles/descriptions, and spec content.
 */

const STORAGE_KEY = 'picnic-design-lab:flow-overrides'

export interface ScreenOverrides {
  title?: string
  description?: string
}

export interface FlowOverrides {
  name?: string
  spec?: string
  screens?: Record<string, ScreenOverrides>
}

type AllOverrides = Record<string, FlowOverrides>

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

export function getFlowOverrides(flowId: string): FlowOverrides {
  return readAll()[flowId] ?? {}
}

export function setFlowName(flowId: string, name: string): void {
  const all = readAll()
  if (!all[flowId]) all[flowId] = {}
  all[flowId].name = name
  writeAll(all)
}

export function setFlowSpec(flowId: string, spec: string): void {
  const all = readAll()
  if (!all[flowId]) all[flowId] = {}
  all[flowId].spec = spec
  writeAll(all)
}

export function setScreenOverride(
  flowId: string,
  screenId: string,
  field: keyof ScreenOverrides,
  value: string,
): void {
  const all = readAll()
  if (!all[flowId]) all[flowId] = {}
  if (!all[flowId].screens) all[flowId].screens = {}
  if (!all[flowId].screens![screenId]) all[flowId].screens![screenId] = {}
  all[flowId].screens![screenId][field] = value
  writeAll(all)
}

export function resetFlowOverrides(flowId: string): void {
  const all = readAll()
  delete all[flowId]
  writeAll(all)
}

export function resetAllOverrides(): void {
  localStorage.removeItem(STORAGE_KEY)
}
