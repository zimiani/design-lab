import type { Node, Edge } from '@xyflow/react'
import { NODE_WIDTHS } from './resolveEdgeHandles'
import { recalculateEdgeHandles } from './resolveEdgeHandles'

const NODE_HEIGHT = 80
const VERTICAL_GAP = 120
const HORIZONTAL_GAP = 60

/**
 * Repositions all existing nodes in a centered layered layout
 * using topological ordering from edges, then recalculates edge handles.
 *
 * - Layer 0 = root nodes (no incoming edges)
 * - Each subsequent layer = nodes whose parents are in previous layers
 * - Nodes within a layer are centered horizontally
 * - The entire layout is centered on (0, 0)
 */
export function alignNodes(
  nodes: Node[],
  edges: Edge[],
): { nodes: Node[]; edges: Edge[] } {
  if (nodes.length === 0) return { nodes, edges }

  // Build adjacency
  const childrenOf = new Map<string, string[]>()
  const parentsOf = new Map<string, string[]>()

  for (const edge of edges) {
    if (!childrenOf.has(edge.source)) childrenOf.set(edge.source, [])
    childrenOf.get(edge.source)!.push(edge.target)
    if (!parentsOf.has(edge.target)) parentsOf.set(edge.target, [])
    parentsOf.get(edge.target)!.push(edge.source)
  }

  // Assign layers via BFS (longest-path layering so children always sit below parents)
  const layerOf = new Map<string, number>()
  const roots = nodes.filter(
    (n) => !parentsOf.has(n.id) || parentsOf.get(n.id)!.length === 0,
  )

  // If no roots found (cycles or isolated), treat all as layer 0
  const queue: { id: string; layer: number }[] = roots.map((n) => ({
    id: n.id,
    layer: 0,
  }))

  while (queue.length > 0) {
    const { id, layer } = queue.shift()!
    // Use the maximum layer (longest path) to avoid overlaps
    if (layerOf.has(id) && layerOf.get(id)! >= layer) continue
    layerOf.set(id, layer)
    for (const childId of childrenOf.get(id) ?? []) {
      queue.push({ id: childId, layer: layer + 1 })
    }
  }

  // Handle disconnected nodes — give them their own layers at the end
  const maxAssignedLayer = Math.max(0, ...layerOf.values())
  let nextLayer = maxAssignedLayer + 1
  for (const node of nodes) {
    if (!layerOf.has(node.id)) {
      layerOf.set(node.id, nextLayer++)
    }
  }

  // Group nodes by layer, preserving original left-to-right order within each layer
  const layerGroups = new Map<number, Node[]>()
  for (const node of nodes) {
    const layer = layerOf.get(node.id)!
    if (!layerGroups.has(layer)) layerGroups.set(layer, [])
    layerGroups.get(layer)!.push(node)
  }

  // Sort each layer's nodes by their current X position for stable ordering
  for (const group of layerGroups.values()) {
    group.sort((a, b) => a.position.x - b.position.x)
  }

  const sortedLayers = [...layerGroups.entries()].sort((a, b) => a[0] - b[0])

  // Calculate total height and center vertically
  const totalHeight = (sortedLayers.length - 1) * (NODE_HEIGHT + VERTICAL_GAP)
  const startY = -totalHeight / 2

  // Position each node
  const newPositions = new Map<string, { x: number; y: number }>()

  for (let i = 0; i < sortedLayers.length; i++) {
    const layerNodes = sortedLayers[i][1]
    const y = startY + i * (NODE_HEIGHT + VERTICAL_GAP)

    // Calculate total width of this layer
    const widths = layerNodes.map((n) => NODE_WIDTHS[n.type ?? 'screen'] ?? 200)
    const totalWidth =
      widths.reduce((sum, w) => sum + w, 0) +
      (layerNodes.length - 1) * HORIZONTAL_GAP

    // Center horizontally: start at -totalWidth/2
    let x = -totalWidth / 2
    for (let j = 0; j < layerNodes.length; j++) {
      newPositions.set(layerNodes[j].id, { x, y })
      x += widths[j] + HORIZONTAL_GAP
    }
  }

  const alignedNodes = nodes.map((n) => ({
    ...n,
    position: newPositions.get(n.id) ?? n.position,
  }))

  const alignedEdges = recalculateEdgeHandles(alignedNodes, edges) as Edge[]

  return { nodes: alignedNodes, edges: alignedEdges }
}
