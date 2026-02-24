import type { ComponentType } from 'react'

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
  specPath?: string
}

const flows = new Map<string, Flow>()

export function registerFlow(flow: Flow): void {
  flows.set(flow.id, flow)
}

export function getFlow(id: string): Flow | undefined {
  return flows.get(id)
}

export function getAllFlows(): Flow[] {
  return Array.from(flows.values())
}

export function getFlowsByArea(): Record<string, Flow[]> {
  const grouped: Record<string, Flow[]> = {}
  for (const flow of flows.values()) {
    if (!grouped[flow.area]) grouped[flow.area] = []
    grouped[flow.area].push(flow)
  }
  return grouped
}
