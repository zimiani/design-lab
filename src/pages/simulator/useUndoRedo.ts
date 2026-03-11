import { useCallback, useRef, useState } from 'react'
import type { Node, Edge } from '@xyflow/react'
import { deepClone } from '../../lib/deepClone'

interface UndoState {
  nodes: Node[]
  edges: Edge[]
}

const MAX_UNDO = 50

export function useUndoRedo() {
  const undoStackRef = useRef<UndoState[]>([])
  const redoStackRef = useRef<UndoState[]>([])
  const [undoCount, setUndoCount] = useState(0)
  const [redoCount, setRedoCount] = useState(0)

  const pushUndo = useCallback((nodes: Node[], edges: Edge[]) => {
    undoStackRef.current.push({
      nodes: deepClone(nodes),
      edges: deepClone(edges),
    })
    if (undoStackRef.current.length > MAX_UNDO) undoStackRef.current.shift()
    redoStackRef.current = []
    setUndoCount(undoStackRef.current.length)
    setRedoCount(0)
  }, [])

  const undo = useCallback(
    (
      setNodes: (fn: (nds: Node[]) => Node[]) => void,
      setEdges: (fn: (eds: Edge[]) => Edge[]) => void,
    ) => {
      if (undoStackRef.current.length === 0) return
      const prev = undoStackRef.current.pop()!
      setNodes((currentNodes) => {
        setEdges((currentEdges) => {
          redoStackRef.current.push({
            nodes: deepClone(currentNodes),
            edges: deepClone(currentEdges),
          })
          setRedoCount(redoStackRef.current.length)
          return prev.edges as Edge[]
        })
        return prev.nodes as Node[]
      })
      setUndoCount(undoStackRef.current.length)
    },
    [],
  )

  const redo = useCallback(
    (
      setNodes: (fn: (nds: Node[]) => Node[]) => void,
      setEdges: (fn: (eds: Edge[]) => Edge[]) => void,
    ) => {
      if (redoStackRef.current.length === 0) return
      const next = redoStackRef.current.pop()!
      setNodes((currentNodes) => {
        setEdges((currentEdges) => {
          undoStackRef.current.push({
            nodes: deepClone(currentNodes),
            edges: deepClone(currentEdges),
          })
          setUndoCount(undoStackRef.current.length)
          return next.edges as Edge[]
        })
        return next.nodes as Node[]
      })
      setRedoCount(redoStackRef.current.length)
    },
    [],
  )

  const reset = useCallback(() => {
    undoStackRef.current = []
    redoStackRef.current = []
    setUndoCount(0)
    setRedoCount(0)
  }, [])

  return { pushUndo, undo, redo, reset, canUndo: undoCount > 0, canRedo: redoCount > 0 }
}
