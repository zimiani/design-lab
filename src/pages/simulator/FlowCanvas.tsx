import { useState, useCallback, useEffect, useRef } from 'react'
import {
  ReactFlow,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  ReactFlowProvider,
  type Connection,
  type Node,
  type Edge,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import type { Flow } from './flowRegistry'
import { refreshDynamicFlow } from './flowRegistry'
import { getFlowGraph, saveFlowGraph } from './flowGraphStore'
import { autoGenerateFlowGraph } from './flowGraphAutoGen'
import { addScreenToFlow } from './dynamicFlowStore'
import { saveVersion, getVersions, suggestNextVersion, type FlowVersion } from './flowVersionStore'
import { nodeTypes } from './nodes'
import type { FlowNodeType, FlowNodeData } from './flowGraph.types'
import FloatingCanvasToolbar from './FloatingCanvasToolbar'
import FlowViewAnnotationsPanel from './FlowViewAnnotationsPanel'

interface FlowCanvasProps {
  flow: Flow
  onNavigateToScreen: (screenId: string) => void
  onFlowChanged?: () => void
}

interface UndoState {
  nodes: Node[]
  edges: Edge[]
}

const MAX_UNDO = 50

function FlowCanvasInner({ flow, onNavigateToScreen, onFlowChanged }: FlowCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([] as Node[])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([] as Edge[])
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout>>()
  const initializedRef = useRef<string | null>(null)

  // Undo/redo stacks
  const undoStackRef = useRef<UndoState[]>([])
  const redoStackRef = useRef<UndoState[]>([])
  const [undoCount, setUndoCount] = useState(0)
  const [redoCount, setRedoCount] = useState(0)

  const pushUndo = useCallback((n: Node[], e: Edge[]) => {
    undoStackRef.current.push({
      nodes: JSON.parse(JSON.stringify(n)),
      edges: JSON.parse(JSON.stringify(e)),
    })
    if (undoStackRef.current.length > MAX_UNDO) undoStackRef.current.shift()
    redoStackRef.current = []
    setUndoCount(undoStackRef.current.length)
    setRedoCount(0)
  }, [])

  // Load or auto-generate graph when flow changes
  useEffect(() => {
    if (initializedRef.current === flow.id) return
    initializedRef.current = flow.id

    const existing = getFlowGraph(flow.id)
    if (existing) {
      setNodes(existing.nodes as Node[])
      setEdges(existing.edges as Edge[])
    } else {
      const generated = autoGenerateFlowGraph(flow)
      setNodes(generated.nodes as Node[])
      setEdges(generated.edges as Edge[])
      saveFlowGraph(flow.id, generated.nodes, generated.edges)
    }
    setSelectedNode(null)
    undoStackRef.current = []
    redoStackRef.current = []
    setUndoCount(0)
    setRedoCount(0)
  }, [flow.id, flow, setNodes, setEdges])

  // Debounced save
  const scheduleSave = useCallback(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    saveTimeoutRef.current = setTimeout(() => {
      setNodes((currentNodes) => {
        setEdges((currentEdges) => {
          saveFlowGraph(flow.id, currentNodes, currentEdges)
          return currentEdges
        })
        return currentNodes
      })
    }, 500)
  }, [flow.id, setNodes, setEdges])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    }
  }, [])

  const handleConnect = useCallback(
    (connection: Connection) => {
      setNodes((currentNodes) => {
        setEdges((currentEdges) => {
          pushUndo(currentNodes, currentEdges)
          return addEdge(connection, currentEdges)
        })
        return currentNodes
      })
      scheduleSave()
    },
    [setNodes, setEdges, scheduleSave, pushUndo],
  )

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      setSelectedNode(node)
    },
    [],
  )

  const handleNodeDoubleClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      const data = node.data as FlowNodeData
      if (data.screenId) {
        onNavigateToScreen(data.screenId)
      }
    },
    [onNavigateToScreen],
  )

  const handlePaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [])

  const handleNodeDragStop = useCallback(() => {
    scheduleSave()
  }, [scheduleSave])

  // Toolbar: Add node
  const handleAddNode = useCallback(
    (nodeType: FlowNodeType) => {
      const nodeId = `node-${Date.now()}`
      const labels: Record<FlowNodeType, string> = {
        screen: 'New Screen',
        decision: 'Decision',
        error: 'Error State',
      }

      // For dynamic flows, creating a screen node also creates a linked screen
      let linkedScreenId: string | null = null
      if (nodeType === 'screen' && flow.isDynamic) {
        linkedScreenId = `screen-${Date.now()}`
        addScreenToFlow(flow.id, {
          id: linkedScreenId,
          title: labels[nodeType],
          description: '',
          componentsUsed: [],
        })
        refreshDynamicFlow(flow.id)
        onFlowChanged?.()
      }

      setNodes((currentNodes) => {
        setEdges((currentEdges) => {
          pushUndo(currentNodes, currentEdges)
          return currentEdges
        })
        const newNode: Node = {
          id: nodeId,
          type: nodeType,
          position: { x: 300, y: (currentNodes.length + 1) * 200 },
          data: {
            label: labels[nodeType],
            screenId: linkedScreenId,
            nodeType,
            description: '',
          } satisfies FlowNodeData,
        }
        return [...currentNodes, newNode]
      })
      scheduleSave()
    },
    [setNodes, setEdges, scheduleSave, pushUndo, flow.id, flow.isDynamic, onFlowChanged],
  )

  // Undo
  const handleUndo = useCallback(() => {
    if (undoStackRef.current.length === 0) return
    const prev = undoStackRef.current.pop()!
    setNodes((currentNodes) => {
      setEdges((currentEdges) => {
        redoStackRef.current.push({
          nodes: JSON.parse(JSON.stringify(currentNodes)),
          edges: JSON.parse(JSON.stringify(currentEdges)),
        })
        setRedoCount(redoStackRef.current.length)
        return prev.edges as Edge[]
      })
      return prev.nodes as Node[]
    })
    setUndoCount(undoStackRef.current.length)
    scheduleSave()
  }, [setNodes, setEdges, scheduleSave])

  // Redo
  const handleRedo = useCallback(() => {
    if (redoStackRef.current.length === 0) return
    const next = redoStackRef.current.pop()!
    setNodes((currentNodes) => {
      setEdges((currentEdges) => {
        undoStackRef.current.push({
          nodes: JSON.parse(JSON.stringify(currentNodes)),
          edges: JSON.parse(JSON.stringify(currentEdges)),
        })
        setUndoCount(undoStackRef.current.length)
        return next.edges as Edge[]
      })
      return next.nodes as Node[]
    })
    setRedoCount(redoStackRef.current.length)
    scheduleSave()
  }, [setNodes, setEdges, scheduleSave])

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        handleUndo()
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault()
        handleRedo()
      } else if (e.key === 's' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        handleAddNode('screen')
      } else if (e.key === 'd' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        handleAddNode('decision')
      } else if (e.key === 'e' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        handleAddNode('error')
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleUndo, handleRedo, handleAddNode])

  // Reset to linear
  const handleResetToLinear = useCallback(() => {
    setNodes((currentNodes) => {
      setEdges((currentEdges) => {
        pushUndo(currentNodes, currentEdges)
        return currentEdges
      })
      return currentNodes
    })
    const generated = autoGenerateFlowGraph(flow)
    setNodes(generated.nodes as Node[])
    setEdges(generated.edges as Edge[])
    saveFlowGraph(flow.id, generated.nodes, generated.edges)
    setSelectedNode(null)
  }, [flow, setNodes, setEdges, pushUndo])

  // Annotations panel: update node label/description
  const handleNodeUpdate = useCallback(
    (nodeId: string, label: string, description: string) => {
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id !== nodeId) return n
          return {
            ...n,
            data: { ...n.data, label, description },
          }
        }),
      )
      setSelectedNode((prev) => {
        if (!prev || prev.id !== nodeId) return prev
        return {
          ...prev,
          data: { ...prev.data, label, description },
        }
      })
      scheduleSave()
    },
    [setNodes, scheduleSave],
  )

  // Open in prototype
  const handleOpenInPrototype = useCallback(() => {
    const data = selectedNode?.data as FlowNodeData | undefined
    if (data?.screenId) {
      onNavigateToScreen(data.screenId)
    }
  }, [selectedNode, onNavigateToScreen])

  // Version management
  const [versions, setVersions] = useState<FlowVersion[]>(() => getVersions(flow.id))
  const [suggestedVer, setSuggestedVer] = useState(() => suggestNextVersion(flow.id))

  // Refresh versions when flow changes
  useEffect(() => {
    setVersions(getVersions(flow.id))
    setSuggestedVer(suggestNextVersion(flow.id))
  }, [flow.id])

  const handleSaveVersion = useCallback(
    (version: string, description: string) => {
      setNodes((currentNodes) => {
        setEdges((currentEdges) => {
          saveVersion(flow.id, version, description, currentNodes, currentEdges)
          setVersions(getVersions(flow.id))
          setSuggestedVer(suggestNextVersion(flow.id))
          return currentEdges
        })
        return currentNodes
      })
    },
    [flow.id, setNodes, setEdges],
  )

  const handleRestoreVersion = useCallback(
    (versionEntry: FlowVersion) => {
      setNodes((currentNodes) => {
        setEdges((currentEdges) => {
          pushUndo(currentNodes, currentEdges)
          return currentEdges
        })
        return currentNodes
      })
      setNodes(versionEntry.nodes as Node[])
      setEdges(versionEntry.edges as Edge[])
      saveFlowGraph(flow.id, versionEntry.nodes, versionEntry.edges)
      setSelectedNode(null)
    },
    [flow.id, setNodes, setEdges, pushUndo],
  )

  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={handleConnect}
            onNodeClick={handleNodeClick}
            onNodeDoubleClick={handleNodeDoubleClick}
            onPaneClick={handlePaneClick}
            onNodeDragStop={handleNodeDragStop}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.3 }}
            proOptions={{ hideAttribution: true }}
            className="bg-shell-bg"
            defaultEdgeOptions={{
              type: 'smoothstep',
              style: { stroke: '#4ADE80', strokeWidth: 2 },
            }}
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={20}
              size={1}
              color="#3E3E3E"
            />
            <MiniMap
              nodeColor={(node) => {
                switch (node.type) {
                  case 'screen': return '#4ADE80'
                  case 'decision': return '#FBBF24'
                  case 'error': return '#F87171'
                  default: return '#6B6B6B'
                }
              }}
              maskColor="rgba(30, 30, 30, 0.8)"
              className="!bg-shell-surface !border-shell-border"
            />
          </ReactFlow>
        </div>
        <FloatingCanvasToolbar
          onAddNode={handleAddNode}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={undoCount > 0}
          canRedo={redoCount > 0}
        />
      </div>
      <FlowViewAnnotationsPanel
        flow={flow}
        selectedNode={selectedNode}
        onOpenInPrototype={handleOpenInPrototype}
        onNodeUpdate={handleNodeUpdate}
        onResetToLinear={handleResetToLinear}
        versions={versions}
        suggestedVersion={suggestedVer}
        onSaveVersion={handleSaveVersion}
        onRestoreVersion={handleRestoreVersion}
      />
    </div>
  )
}

export default function FlowCanvas(props: FlowCanvasProps) {
  return (
    <ReactFlowProvider>
      <FlowCanvasInner {...props} />
    </ReactFlowProvider>
  )
}
