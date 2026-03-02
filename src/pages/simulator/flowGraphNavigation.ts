/**
 * Pure navigation logic that derives screen navigation from the flow graph.
 *
 * The graph IS the navigation model — the Prototype player follows edges
 * to navigate between screens. Non-screen nodes (decision, error,
 * flow-reference, action, overlay) are pass-through: the player skips them
 * and follows their outgoing edges to reach the next screen node.
 */

import type { Node, Edge } from '@xyflow/react'
import type { FlowNodeData, OverlayType, ActionType } from './flowGraph.types'

export interface ScreenOverlayInfo {
  nodeId: string
  label: string
  description?: string
  overlayType: OverlayType
  triggerLabel?: string
  triggerActionType?: ActionType
}

export interface NavigableStep {
  nodeId: string
  screenId: string
  label: string
}

/** Check whether a node is a navigable screen/page node with a linked screenId or pageId. */
function isScreenNode(node: Node): boolean {
  const d = node.data as FlowNodeData
  if (d.nodeType === 'screen' || d.nodeType === 'page') {
    return d.screenId !== null || d.pageId !== undefined
  }
  return false
}

/** Info about a state connected to a page node. */
export interface PageStateInfo {
  nodeId: string
  stateId: string
  label: string
  description?: string
}

/**
 * Build an adjacency map: nodeId → list of target nodeIds via outgoing edges.
 */
function buildAdjacency(edges: Edge[]): Map<string, string[]> {
  const adj = new Map<string, string[]>()
  for (const edge of edges) {
    const list = adj.get(edge.source) ?? []
    list.push(edge.target)
    adj.set(edge.source, list)
  }
  return adj
}

/**
 * Build a reverse adjacency map: nodeId → list of source nodeIds.
 */
function buildReverseAdjacency(edges: Edge[]): Map<string, string[]> {
  const rev = new Map<string, string[]>()
  for (const edge of edges) {
    const list = rev.get(edge.target) ?? []
    list.push(edge.source)
    rev.set(edge.target, list)
  }
  return rev
}

/**
 * Find the start node: a screen node with no incoming edges from other screen
 * nodes. If multiple candidates exist, pick the topmost by Y position.
 * Falls back to the topmost screen node overall.
 */
function findStartNode(nodes: Node[], edges: Edge[]): Node | null {
  const screenNodes = nodes.filter(isScreenNode)
  if (screenNodes.length === 0) return null

  // All nodes that are targets of an edge from a screen node
  const screenNodeIds = new Set(screenNodes.map((n) => n.id))
  const hasIncomingFromScreen = new Set<string>()

  for (const edge of edges) {
    if (screenNodeIds.has(edge.source) && screenNodeIds.has(edge.target)) {
      hasIncomingFromScreen.add(edge.target)
    }
  }

  // Screen nodes with no incoming edge from another screen node
  const roots = screenNodes.filter((n) => !hasIncomingFromScreen.has(n.id))
  const candidates = roots.length > 0 ? roots : screenNodes

  // Pick topmost by Y position
  return candidates.reduce((best, n) =>
    n.position.y < best.position.y ? n : best,
  )
}

/**
 * From a given node, follow outgoing edges to find the next reachable screen
 * nodes, skipping pass-through nodes (decision, error, flow-reference, action, overlay).
 */
function followEdgesToScreens(
  fromNodeId: string,
  adj: Map<string, string[]>,
  nodeMap: Map<string, Node>,
  visited: Set<string> = new Set(),
): Node[] {
  const results: Node[] = []
  const targets = adj.get(fromNodeId) ?? []

  for (const targetId of targets) {
    if (visited.has(targetId)) continue
    visited.add(targetId)

    const targetNode = nodeMap.get(targetId)
    if (!targetNode) continue

    if (isScreenNode(targetNode)) {
      results.push(targetNode)
    } else {
      // Pass-through: keep following edges
      results.push(...followEdgesToScreens(targetId, adj, nodeMap, visited))
    }
  }

  return results
}

/**
 * Derive a linear navigation path from the graph by walking edges
 * starting from the start node. Unreachable screen nodes are appended
 * at the end to ensure no screens are lost.
 */
export function deriveNavigationPath(nodes: Node[], edges: Edge[]): NavigableStep[] {
  const screenNodes = nodes.filter(isScreenNode)
  if (screenNodes.length === 0) return []

  const nodeMap = new Map(nodes.map((n) => [n.id, n]))
  const adj = buildAdjacency(edges)
  const startNode = findStartNode(nodes, edges)
  if (!startNode) return []

  const path: NavigableStep[] = []
  const visited = new Set<string>()
  const queue: Node[] = [startNode]

  while (queue.length > 0) {
    const current = queue.shift()!
    if (visited.has(current.id)) continue
    visited.add(current.id)

    const d = current.data as FlowNodeData
    path.push({
      nodeId: current.id,
      screenId: d.screenId ?? d.pageId!,
      label: d.label,
    })

    // Follow edges to next screen nodes
    const nextScreens = followEdgesToScreens(current.id, adj, nodeMap, new Set())
    for (const next of nextScreens) {
      if (!visited.has(next.id)) {
        queue.push(next)
      }
    }
  }

  // Append unreachable screen nodes
  for (const node of screenNodes) {
    if (!visited.has(node.id)) {
      const d = node.data as FlowNodeData
      path.push({
        nodeId: node.id,
        screenId: d.screenId ?? d.pageId!,
        label: d.label,
      })
    }
  }

  return path
}

/**
 * Given the current node, return the next screen nodes reachable via edges
 * (skipping non-screen pass-through nodes).
 */
export function getNextScreenOptions(
  currentNodeId: string,
  nodes: Node[],
  edges: Edge[],
): NavigableStep[] {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]))
  const adj = buildAdjacency(edges)
  const nextNodes = followEdgesToScreens(currentNodeId, adj, nodeMap)

  return nextNodes.map((n) => {
    const d = n.data as FlowNodeData
    return {
      nodeId: n.id,
      screenId: d.screenId ?? d.pageId!,
      label: d.label,
    }
  })
}

/**
 * Given the current node, return the previous screen node by following
 * reverse edges (skipping pass-through nodes).
 */
export function getPreviousScreen(
  currentNodeId: string,
  nodes: Node[],
  edges: Edge[],
): NavigableStep | null {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]))
  const rev = buildReverseAdjacency(edges)

  const visited = new Set<string>()

  function findPrevScreen(nodeId: string): Node | null {
    const sources = rev.get(nodeId) ?? []
    for (const srcId of sources) {
      if (visited.has(srcId)) continue
      visited.add(srcId)

      const srcNode = nodeMap.get(srcId)
      if (!srcNode) continue

      if (isScreenNode(srcNode)) {
        return srcNode
      }
      // Pass-through: keep going backwards
      const found = findPrevScreen(srcId)
      if (found) return found
    }
    return null
  }

  const prev = findPrevScreen(currentNodeId)
  if (!prev) return null

  const d = prev.data as FlowNodeData
  return {
    nodeId: prev.id,
    screenId: d.screenId ?? d.pageId!,
    label: d.label,
  }
}

/**
 * Find all state nodes connected to a page/screen node.
 * Walks direct outgoing edges to find child state nodes.
 */
export function getStatesForPage(
  pageNodeId: string,
  nodes: Node[],
  edges: Edge[],
): PageStateInfo[] {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]))
  const adj = buildAdjacency(edges)
  const results: PageStateInfo[] = []

  const targets = adj.get(pageNodeId) ?? []
  for (const targetId of targets) {
    const targetNode = nodeMap.get(targetId)
    if (!targetNode) continue
    const td = targetNode.data as FlowNodeData
    if (td.nodeType !== 'state') continue

    results.push({
      nodeId: targetNode.id,
      stateId: td.stateId ?? td.label,
      label: td.label,
      description: td.description,
    })
  }

  return results
}

/**
 * Find all overlay nodes reachable from a screen node.
 * Handles both direct screen→overlay and screen→action→overlay patterns.
 */
export function getOverlaysForScreen(
  screenNodeId: string,
  nodes: Node[],
  edges: Edge[],
): ScreenOverlayInfo[] {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]))
  const adj = buildAdjacency(edges)
  const results: ScreenOverlayInfo[] = []

  const directTargets = adj.get(screenNodeId) ?? []

  for (const targetId of directTargets) {
    const targetNode = nodeMap.get(targetId)
    if (!targetNode) continue
    const td = targetNode.data as FlowNodeData

    if (td.nodeType === 'overlay') {
      // Direct: screen → overlay
      results.push({
        nodeId: targetNode.id,
        label: td.label,
        description: td.description,
        overlayType: td.overlayType ?? 'bottom-sheet',
        triggerLabel: td.label,
      })
    } else if (td.nodeType === 'action') {
      // screen → action → overlay(s)
      const actionTargets = adj.get(targetId) ?? []
      for (const overlayId of actionTargets) {
        const overlayNode = nodeMap.get(overlayId)
        if (!overlayNode) continue
        const od = overlayNode.data as FlowNodeData
        if (od.nodeType !== 'overlay') continue

        results.push({
          nodeId: overlayNode.id,
          label: od.label,
          description: od.description,
          overlayType: od.overlayType ?? 'bottom-sheet',
          triggerLabel: td.label,
          triggerActionType: td.actionType,
        })
      }
    }
  }

  return results
}
