import type { Node, Edge, NodeChange, NodePositionChange } from '@xyflow/react'

/** Threshold for center-center alignment (higher priority) */
const CENTER_SNAP_THRESHOLD = 8
/** Extra threshold boost for nodes directly connected by an edge */
const CONNECTED_CENTER_BONUS = 4
/** Threshold for edge alignment (lower priority fallback) */
const EDGE_SNAP_THRESHOLD = 5

export interface HelperLineResult {
  horizontal?: number
  vertical?: number
  snapX?: number
  snapY?: number
}

interface NodeBounds {
  left: number
  right: number
  top: number
  bottom: number
  centerX: number
  centerY: number
  width: number
  height: number
}

function getBounds(node: Node): NodeBounds | null {
  const w = node.measured?.width ?? node.width ?? 200
  const h = node.measured?.height ?? node.height ?? 80
  if (w == null || h == null) return null
  const x = node.position.x
  const y = node.position.y
  return {
    left: x,
    right: x + w,
    top: y,
    bottom: y + h,
    centerX: x + w / 2,
    centerY: y + h / 2,
    width: w,
    height: h,
  }
}

/**
 * Given a set of node changes (during drag), compute alignment guide lines
 * and snap the dragged node's position to the nearest aligned edge/center.
 *
 * Priority:
 * 1. Center-center alignment with connected nodes (largest threshold)
 * 2. Center-center alignment with any node
 * 3. Edge alignment as fallback (only when no center match exists on that axis)
 *
 * This prevents edge-edge snaps from pulling nodes off-center when node
 * widths differ, which would cause connector lines to curve.
 */
export function getHelperLines(
  changes: NodeChange[],
  nodes: Node[],
  edges?: Edge[],
): { lines: HelperLineResult; adjustedChanges: NodeChange[] } {
  const lines: HelperLineResult = {}

  const posChange = changes.find(
    (c): c is NodePositionChange => c.type === 'position' && c.dragging === true,
  )

  if (!posChange?.position) {
    return { lines, adjustedChanges: changes }
  }

  const draggedNode = nodes.find((n) => n.id === posChange.id)
  if (!draggedNode) return { lines, adjustedChanges: changes }

  // Build set of node IDs directly connected to the dragged node
  const connectedIds = new Set<string>()
  if (edges) {
    for (const e of edges) {
      if (e.source === posChange.id) connectedIds.add(e.target)
      if (e.target === posChange.id) connectedIds.add(e.source)
    }
  }

  const dw = draggedNode.measured?.width ?? draggedNode.width ?? 200
  const dh = draggedNode.measured?.height ?? draggedNode.height ?? 80
  const dragLeft = posChange.position.x
  const dragRight = posChange.position.x + dw
  const dragCenterX = posChange.position.x + dw / 2
  const dragTop = posChange.position.y
  const dragBottom = posChange.position.y + dh
  const dragCenterY = posChange.position.y + dh / 2

  let bestDx = Infinity
  let bestDy = Infinity
  let snapX: number | undefined
  let snapY: number | undefined
  let guideV: number | undefined
  let guideH: number | undefined
  let foundCenterX = false
  let foundCenterY = false

  // ── Pass 1: Center-center alignment (high priority) ──
  for (const other of nodes) {
    if (other.id === posChange.id) continue
    const ob = getBounds(other)
    if (!ob) continue

    const isConnected = connectedIds.has(other.id)
    const threshold = CENTER_SNAP_THRESHOLD + (isConnected ? CONNECTED_CENTER_BONUS : 0)

    // X-axis center alignment
    const xDist = Math.abs(dragCenterX - ob.centerX)
    if (xDist < threshold && xDist < Math.abs(bestDx)) {
      bestDx = ob.centerX - dragCenterX
      snapX = posChange.position.x + bestDx
      guideV = ob.centerX
      foundCenterX = true
    }

    // Y-axis center alignment
    const yDist = Math.abs(dragCenterY - ob.centerY)
    if (yDist < threshold && yDist < Math.abs(bestDy)) {
      bestDy = ob.centerY - dragCenterY
      snapY = posChange.position.y + bestDy
      guideH = ob.centerY
      foundCenterY = true
    }
  }

  // ── Pass 2: Edge alignment (fallback — only for axes without a center match) ──
  if (!foundCenterX || !foundCenterY) {
    for (const other of nodes) {
      if (other.id === posChange.id) continue
      const ob = getBounds(other)
      if (!ob) continue

      if (!foundCenterX) {
        const xEdgeChecks: Array<{ dragVal: number; otherVal: number; guide: number }> = [
          { dragVal: dragLeft, otherVal: ob.left, guide: ob.left },
          { dragVal: dragRight, otherVal: ob.right, guide: ob.right },
          { dragVal: dragLeft, otherVal: ob.right, guide: ob.right },
          { dragVal: dragRight, otherVal: ob.left, guide: ob.left },
        ]
        for (const { dragVal, otherVal, guide } of xEdgeChecks) {
          const dist = Math.abs(dragVal - otherVal)
          if (dist < EDGE_SNAP_THRESHOLD && dist < Math.abs(bestDx)) {
            bestDx = otherVal - dragVal
            snapX = posChange.position.x + bestDx
            guideV = guide
          }
        }
      }

      if (!foundCenterY) {
        const yEdgeChecks: Array<{ dragVal: number; otherVal: number; guide: number }> = [
          { dragVal: dragTop, otherVal: ob.top, guide: ob.top },
          { dragVal: dragBottom, otherVal: ob.bottom, guide: ob.bottom },
          { dragVal: dragTop, otherVal: ob.bottom, guide: ob.bottom },
          { dragVal: dragBottom, otherVal: ob.top, guide: ob.top },
        ]
        for (const { dragVal, otherVal, guide } of yEdgeChecks) {
          const dist = Math.abs(dragVal - otherVal)
          if (dist < EDGE_SNAP_THRESHOLD && dist < Math.abs(bestDy)) {
            bestDy = otherVal - dragVal
            snapY = posChange.position.y + bestDy
            guideH = guide
          }
        }
      }
    }
  }

  lines.horizontal = guideH
  lines.vertical = guideV
  lines.snapX = snapX != null ? Math.round(snapX) : undefined
  lines.snapY = snapY != null ? Math.round(snapY) : undefined

  // Apply snap — round to integers to avoid sub-pixel drift
  const adjustedChanges = changes.map((c) => {
    if (c.type === 'position' && c.id === posChange.id && c.position) {
      return {
        ...c,
        position: {
          x: snapX != null ? Math.round(snapX) : c.position.x,
          y: snapY != null ? Math.round(snapY) : c.position.y,
        },
      }
    }
    return c
  })

  return { lines, adjustedChanges }
}
