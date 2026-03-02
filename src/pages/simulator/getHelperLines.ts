import type { Node, NodeChange, NodePositionChange } from '@xyflow/react'

const SNAP_THRESHOLD = 5

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
 */
export function getHelperLines(
  changes: NodeChange[],
  nodes: Node[],
): { lines: HelperLineResult; adjustedChanges: NodeChange[] } {
  const lines: HelperLineResult = {}

  // Find the position change for the dragged node
  const posChange = changes.find(
    (c): c is NodePositionChange => c.type === 'position' && c.dragging === true,
  )

  if (!posChange?.position) {
    return { lines, adjustedChanges: changes }
  }

  const draggedNode = nodes.find((n) => n.id === posChange.id)
  if (!draggedNode) return { lines, adjustedChanges: changes }

  // Use the proposed new position
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

  for (const other of nodes) {
    if (other.id === posChange.id) continue
    const ob = getBounds(other)
    if (!ob) continue

    // Vertical alignment (X axis): left-left, right-right, center-center, left-right, right-left
    const xChecks: Array<{ dragVal: number; otherVal: number; guide: number }> = [
      { dragVal: dragLeft, otherVal: ob.left, guide: ob.left },
      { dragVal: dragRight, otherVal: ob.right, guide: ob.right },
      { dragVal: dragCenterX, otherVal: ob.centerX, guide: ob.centerX },
      { dragVal: dragLeft, otherVal: ob.right, guide: ob.right },
      { dragVal: dragRight, otherVal: ob.left, guide: ob.left },
    ]

    for (const { dragVal, otherVal, guide } of xChecks) {
      const dist = Math.abs(dragVal - otherVal)
      if (dist < SNAP_THRESHOLD && dist < Math.abs(bestDx)) {
        bestDx = otherVal - dragVal
        snapX = posChange.position.x + bestDx
        guideV = guide
      }
    }

    // Horizontal alignment (Y axis): top-top, bottom-bottom, center-center, top-bottom, bottom-top
    const yChecks: Array<{ dragVal: number; otherVal: number; guide: number }> = [
      { dragVal: dragTop, otherVal: ob.top, guide: ob.top },
      { dragVal: dragBottom, otherVal: ob.bottom, guide: ob.bottom },
      { dragVal: dragCenterY, otherVal: ob.centerY, guide: ob.centerY },
      { dragVal: dragTop, otherVal: ob.bottom, guide: ob.bottom },
      { dragVal: dragBottom, otherVal: ob.top, guide: ob.top },
    ]

    for (const { dragVal, otherVal, guide } of yChecks) {
      const dist = Math.abs(dragVal - otherVal)
      if (dist < SNAP_THRESHOLD && dist < Math.abs(bestDy)) {
        bestDy = otherVal - dragVal
        snapY = posChange.position.y + bestDy
        guideH = guide
      }
    }
  }

  lines.horizontal = guideH
  lines.vertical = guideV

  // Apply snap to the position change
  const adjustedChanges = changes.map((c) => {
    if (c.type === 'position' && c.id === posChange.id && c.position) {
      return {
        ...c,
        position: {
          x: snapX ?? c.position.x,
          y: snapY ?? c.position.y,
        },
      }
    }
    return c
  })

  return { lines, adjustedChanges }
}
