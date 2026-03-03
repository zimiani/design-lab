import type { Node, Edge } from '@xyflow/react'

const NODE_WIDTH = 240
const NODE_HEIGHT = 100
const H_GAP = 120
const V_GAP = 160

/**
 * Lays out flow-map nodes using BFS longest-path layering.
 * Same algorithm as alignNodes.ts but with larger constants and
 * no edge handle recalculation (uses standard smoothstep edges).
 */
export function layoutFlowMap(
  nodes: Node[],
  edges: Edge[],
): Node[] {
  if (nodes.length === 0) return nodes

  // Build adjacency
  const childrenOf = new Map<string, string[]>()
  const parentsOf = new Map<string, string[]>()

  for (const edge of edges) {
    if (!childrenOf.has(edge.source)) childrenOf.set(edge.source, [])
    childrenOf.get(edge.source)!.push(edge.target)
    if (!parentsOf.has(edge.target)) parentsOf.set(edge.target, [])
    parentsOf.get(edge.target)!.push(edge.source)
  }

  // Assign layers via BFS (longest-path layering)
  const layerOf = new Map<string, number>()
  const roots = nodes.filter(
    (n) => !parentsOf.has(n.id) || parentsOf.get(n.id)!.length === 0,
  )

  const queue: { id: string; layer: number }[] = roots.map((n) => ({
    id: n.id,
    layer: 0,
  }))

  while (queue.length > 0) {
    const { id, layer } = queue.shift()!
    if (layerOf.has(id) && layerOf.get(id)! >= layer) continue
    layerOf.set(id, layer)
    for (const childId of childrenOf.get(id) ?? []) {
      queue.push({ id: childId, layer: layer + 1 })
    }
  }

  // Handle disconnected nodes
  const maxAssignedLayer = Math.max(0, ...layerOf.values())
  let nextLayer = maxAssignedLayer + 1
  for (const node of nodes) {
    if (!layerOf.has(node.id)) {
      layerOf.set(node.id, nextLayer++)
    }
  }

  // Group nodes by layer
  const layerGroups = new Map<number, Node[]>()
  for (const node of nodes) {
    const layer = layerOf.get(node.id)!
    if (!layerGroups.has(layer)) layerGroups.set(layer, [])
    layerGroups.get(layer)!.push(node)
  }

  const sortedLayers = [...layerGroups.entries()].sort((a, b) => a[0] - b[0])

  // Calculate total height and center vertically
  const totalHeight = (sortedLayers.length - 1) * (NODE_HEIGHT + V_GAP)
  const startY = -totalHeight / 2

  // Position each node
  const newPositions = new Map<string, { x: number; y: number }>()

  for (let i = 0; i < sortedLayers.length; i++) {
    const layerNodes = sortedLayers[i][1]
    const y = startY + i * (NODE_HEIGHT + V_GAP)

    const totalWidth =
      layerNodes.length * NODE_WIDTH +
      (layerNodes.length - 1) * H_GAP

    let x = -totalWidth / 2
    for (const node of layerNodes) {
      newPositions.set(node.id, { x, y })
      x += NODE_WIDTH + H_GAP
    }
  }

  return nodes.map((n) => ({
    ...n,
    position: newPositions.get(n.id) ?? n.position,
  }))
}
