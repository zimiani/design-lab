import type { ComponentType } from 'react'
import { getFlowOverrides } from './flowStore'

export interface FlowScreen {
  id: string
  title: string
  description: string
  componentsUsed: string[]
  component: ComponentType<FlowScreenProps>
}

export interface FlowScreenProps {
  onNext: () => void
  onBack: () => void
}

export interface Flow {
  id: string
  name: string
  area: string
  screens: FlowScreen[]
  specContent?: string
}

const flows = new Map<string, Flow>()

export function registerFlow(flow: Flow): void {
  flows.set(flow.id, flow)
}

/** Returns the flow with localStorage overrides merged in. */
export function getFlow(id: string): Flow | undefined {
  const base = flows.get(id)
  if (!base) return undefined

  const overrides = getFlowOverrides(id)
  return {
    ...base,
    name: overrides.name ?? base.name,
    specContent: overrides.spec ?? base.specContent,
    screens: base.screens.map((s) => {
      const so = overrides.screens?.[s.id]
      return {
        ...s,
        title: so?.title ?? s.title,
        description: so?.description ?? s.description,
      }
    }),
  }
}

/** Returns base flow without overrides (for reset comparisons). */
export function getBaseFlow(id: string): Flow | undefined {
  return flows.get(id)
}

export function getAllFlows(): Flow[] {
  return Array.from(flows.keys()).map((id) => getFlow(id)!)
}

export function getFlowsByArea(): Record<string, Flow[]> {
  const grouped: Record<string, Flow[]> = {}
  for (const id of flows.keys()) {
    const flow = getFlow(id)!
    if (!grouped[flow.area]) grouped[flow.area] = []
    grouped[flow.area].push(flow)
  }
  return grouped
}
