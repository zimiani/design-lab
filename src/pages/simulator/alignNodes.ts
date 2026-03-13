import type { Node, Edge } from '@xyflow/react'
import ELK from 'elkjs/lib/elk.bundled.js'
import { NODE_WIDTHS } from './resolveEdgeHandles'
import { recalculateEdgeHandles } from './resolveEdgeHandles'
import type { FlowNodeData } from './flowGraph.types'

const DEFAULT_NODE_HEIGHT = 80
const ACTION_NODE_HEIGHT = 28
const SATELLITE_GAP = 80
/** Uniform slot width for ELK — matches the most common node width (screen/decision/etc).
 *  Narrow nodes (action pills) get center-offset within the slot after layout. */
const SLOT_WIDTH = 200

const elk = new ELK()

/**
 * Repositions all existing nodes using ELK (Eclipse Layout Kernel) for
 * crossing-minimized hierarchical layout, then positions overlay satellites
 * relative to their parent screens.
 *
 * All non-overlay nodes participate in the ELK spine — including action pills,
 * decision branches, and error nodes. ELK guarantees no overlaps within the spine.
 * Only overlay nodes (which have a parent-child visual relationship) are positioned
 * manually as satellites.
 */
export async function alignNodes(
  nodes: Node[],
  edges: Edge[],
): Promise<{ nodes: Node[]; edges: Edge[] }> {
  if (nodes.length === 0) return { nodes, edges }

  const nodeMap = new Map(nodes.map((n) => [n.id, n]))

  // Build edge lookup
  const edgesToTarget = new Map<string, Edge[]>()
  for (const edge of edges) {
    if (!edgesToTarget.has(edge.target)) edgesToTarget.set(edge.target, [])
    edgesToTarget.get(edge.target)!.push(edge)
  }

  // ── Identify satellite nodes: overlays (left) + inline errors (right) + their bridge action nodes ──
  const satelliteNodeIds = new Set<string>()
  const overlaySatellitesOf = new Map<string, { actionId: string; overlayId: string }[]>()
  const errorSatellitesOf = new Map<string, { actionId: string; errorId: string }[]>()

  /** Find the bridge action node between a parent screen and a satellite node. */
  function findBridgeAction(satelliteNodeId: string, parentId: string): string | null {
    const incomingEdges = edgesToTarget.get(satelliteNodeId) ?? []
    for (const inEdge of incomingEdges) {
      const sourceNode = nodeMap.get(inEdge.source)
      if (!sourceNode) continue
      const sourceData = sourceNode.data as FlowNodeData
      if (sourceData.nodeType === 'action') {
        const actionIncoming = edgesToTarget.get(sourceNode.id) ?? []
        if (actionIncoming.some((e) => e.source === parentId)) {
          return sourceNode.id
        }
      }
    }
    return null
  }

  for (const node of nodes) {
    const data = node.data as FlowNodeData

    // Overlay satellites (left side)
    if (data.nodeType === 'overlay' && data.parentScreenNodeId) {
      const parentId = data.parentScreenNodeId
      if (!nodeMap.has(parentId)) continue

      const bridgeActionId = findBridgeAction(node.id, parentId)

      satelliteNodeIds.add(node.id)
      if (bridgeActionId) satelliteNodeIds.add(bridgeActionId)

      if (!overlaySatellitesOf.has(parentId)) overlaySatellitesOf.set(parentId, [])
      overlaySatellitesOf.get(parentId)!.push({
        actionId: bridgeActionId ?? '',
        overlayId: node.id,
      })
    }

    // Error satellites (right side) — only toast/banner modes with a parent
    if (data.nodeType === 'error' && data.errorParentScreenNodeId && data.errorDisplay !== 'full-screen') {
      const parentId = data.errorParentScreenNodeId
      if (!nodeMap.has(parentId)) continue

      const bridgeActionId = findBridgeAction(node.id, parentId)

      satelliteNodeIds.add(node.id)
      if (bridgeActionId) satelliteNodeIds.add(bridgeActionId)

      if (!errorSatellitesOf.has(parentId)) errorSatellitesOf.set(parentId, [])
      errorSatellitesOf.get(parentId)!.push({
        actionId: bridgeActionId ?? '',
        errorId: node.id,
      })
    }
  }

  // ── Build spine: all non-satellite nodes ──
  const spineNodeIds = new Set(
    nodes.filter((n) => !satelliteNodeIds.has(n.id)).map((n) => n.id),
  )

  // Spine edges: direct edges between spine nodes, bridging through satellites
  const spineEdges: { id: string; source: string; target: string }[] = []
  const seenSpineEdges = new Set<string>()

  function addSpineEdge(source: string, target: string, edgeId: string) {
    const key = `${source}→${target}`
    if (seenSpineEdges.has(key)) return
    seenSpineEdges.add(key)
    spineEdges.push({ id: edgeId, source, target })
  }

  // Follow through satellites to find the next spine nodes
  function followToNextSpine(startId: string): string[] {
    const results: string[] = []
    const visited = new Set<string>()
    const queue = [startId]
    while (queue.length > 0) {
      const id = queue.pop()!
      if (visited.has(id)) continue
      visited.add(id)
      if (spineNodeIds.has(id)) {
        results.push(id)
      } else {
        for (const e of edges) {
          if (e.source === id) queue.push(e.target)
        }
      }
    }
    return results
  }

  for (const edge of edges) {
    if (spineNodeIds.has(edge.source) && spineNodeIds.has(edge.target)) {
      addSpineEdge(edge.source, edge.target, edge.id)
    } else if (spineNodeIds.has(edge.source) && satelliteNodeIds.has(edge.target)) {
      const nextSpine = followToNextSpine(edge.target)
      for (const dsId of nextSpine) {
        addSpineEdge(edge.source, dsId, `virtual-${edge.source}-${dsId}`)
      }
    }
  }

  // ── Run ELK layout on spine ──
  const elkGraph = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': 'DOWN',
      // Spacing — horizontal generous to prevent edge/node overlap, vertical tight
      'elk.spacing.nodeNode': '40',
      'elk.layered.spacing.nodeNodeBetweenLayers': '40',
      'elk.layered.spacing.edgeNodeBetweenLayers': '20',
      'elk.spacing.edgeNode': '30',
      'elk.spacing.edgeEdge': '20',
      // Crossing minimization
      'elk.layered.thoroughness': '20',
      'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
      // Node placement — NETWORK_SIMPLEX with straight edges keeps vertical chains aligned
      'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
      'elk.layered.nodePlacement.networkSimplex.nodeFlexibility.default': 'NODE_SIZE',
      'elk.layered.nodePlacement.favorStraightEdges': 'true',
      // Respect edge order from the model
      'elk.layered.considerModelOrder.strategy': 'PREFER_EDGES',
    },
    children: [...spineNodeIds].map((id) => {
      const node = nodeMap.get(id)!
      const data = node.data as FlowNodeData
      const h = data.nodeType === 'action'
        ? ACTION_NODE_HEIGHT
        : (node.measured?.height ?? DEFAULT_NODE_HEIGHT)
      return { id, width: SLOT_WIDTH, height: h }
    }),
    edges: spineEdges.map((e) => ({
      id: e.id,
      sources: [e.source],
      targets: [e.target],
    })),
  }

  const layoutResult = await elk.layout(elkGraph)

  // ── Apply ELK positions, centered on origin ──
  const newPositions = new Map<string, { x: number; y: number }>()

  if (layoutResult.children) {
    const root = layoutResult as { width?: number; height?: number; children?: typeof layoutResult.children }
    const totalW = root.width ?? 0
    const totalH = root.height ?? 0
    const offsetX = -totalW / 2
    const offsetY = -totalH / 2

    for (const elkNode of layoutResult.children) {
      const node = nodeMap.get(elkNode.id)!
      const actualW = node.measured?.width ?? NODE_WIDTHS[node.type ?? 'screen'] ?? 200
      const centerOffset = (SLOT_WIDTH - actualW) / 2
      newPositions.set(elkNode.id, {
        x: (elkNode.x ?? 0) + offsetX + centerOffset,
        y: (elkNode.y ?? 0) + offsetY,
      })
    }
  }

  const nodeWidth = 200

  // ── Position overlay satellites to the left of their parent screen ──
  for (const [parentId, satellites] of overlaySatellitesOf) {
    const parentPos = newPositions.get(parentId)
    if (!parentPos) continue

    for (let i = 0; i < satellites.length; i++) {
      const { actionId, overlayId } = satellites[i]
      const verticalOffset = i * (DEFAULT_NODE_HEIGHT + 20)
      const actionX = parentPos.x - nodeWidth - SATELLITE_GAP
      const overlayX = parentPos.x - (nodeWidth + SATELLITE_GAP) * 2

      if (actionId) {
        newPositions.set(actionId, { x: actionX, y: parentPos.y + verticalOffset })
      }
      newPositions.set(overlayId, { x: overlayX, y: parentPos.y + verticalOffset })
    }
  }

  // ── Position error satellites to the right of their parent screen ──
  for (const [parentId, satellites] of errorSatellitesOf) {
    const parentPos = newPositions.get(parentId)
    if (!parentPos) continue

    for (let i = 0; i < satellites.length; i++) {
      const { actionId, errorId } = satellites[i]
      const verticalOffset = i * (DEFAULT_NODE_HEIGHT + 20)
      const actionX = parentPos.x + nodeWidth + SATELLITE_GAP
      const errorX = parentPos.x + (nodeWidth + SATELLITE_GAP) * 2

      if (actionId) {
        newPositions.set(actionId, { x: actionX, y: parentPos.y + verticalOffset })
      }
      newPositions.set(errorId, { x: errorX, y: parentPos.y + verticalOffset })
    }
  }

  const alignedNodes = nodes.map((n) => ({
    ...n,
    position: newPositions.get(n.id) ?? n.position,
  }))

  const alignedEdges = recalculateEdgeHandles(alignedNodes, edges) as Edge[]

  return { nodes: alignedNodes, edges: alignedEdges }
}
