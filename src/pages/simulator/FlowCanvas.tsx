import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ReactFlow,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  reconnectEdge,
  BackgroundVariant,
  ReactFlowProvider,
  type Connection,
  type Node,
  type Edge,
  type NodeChange,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import type { Flow } from './flowRegistry'
import { refreshDynamicFlow } from './flowRegistry'
import { getFlowGraph, saveFlowGraph } from './flowGraphStore'
import { autoGenerateFlowGraph } from './flowGraphAutoGen'
import { alignNodes } from './alignNodes'
import { addScreenToFlow } from './dynamicFlowStore'
import { saveVersion, type FlowVersion } from './flowVersionStore'
import { nodeTypes } from './nodes'
import type { FlowNodeType, FlowNodeData } from './flowGraph.types'
import { syncNodeLabelToScreen } from './flowGraphSync'
import FloatingCanvasToolbar from './FloatingCanvasToolbar'
import FlowViewAnnotationsPanel from './FlowViewAnnotationsPanel'
import HelperLines from './HelperLines'
import { getHelperLines, type HelperLineResult } from './getHelperLines'
import { recalculateEdgeHandles } from './resolveEdgeHandles'

interface FlowCanvasProps {
  flow: Flow
  onNavigateToScreen: (screenId: string) => void
  onNavigateToFlow?: (flowId: string) => void
  onFlowChanged?: () => void
  versions?: FlowVersion[]
  suggestedVersion?: string
  onVersionsChanged?: () => void
  onViewVersion?: (versionEntry: FlowVersion) => void
  onRestoreVersion?: (versionEntry: FlowVersion) => void
  graphOverride?: { nodes: Node[], edges: Edge[] } | null
}

interface UndoState {
  nodes: Node[]
  edges: Edge[]
}

const MAX_UNDO = 50

function FlowCanvasInner({ flow, onNavigateToScreen, onNavigateToFlow, onFlowChanged, versions: versionsProp = [], suggestedVersion: suggestedVerProp = '1.0', onVersionsChanged, onViewVersion: onViewVersionProp, onRestoreVersion: onRestoreVersionProp, graphOverride }: FlowCanvasProps) {
  const [nodes, setNodes, applyNodeChanges] = useNodesState<Node>([] as Node[])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([] as Edge[])
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [helperLines, setHelperLines] = useState<HelperLineResult>({})
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

  // Custom onNodesChange: intercept drag to compute alignment guides + snap
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const hasDrag = changes.some((c) => c.type === 'position' && c.dragging)
      if (hasDrag) {
        const { lines, adjustedChanges } = getHelperLines(changes, nodes, edges)
        setHelperLines(lines)
        applyNodeChanges(adjustedChanges)
      } else {
        // Clear guides when drag stops
        const dragStopped = changes.some((c) => c.type === 'position' && c.dragging === false)
        if (dragStopped) setHelperLines({})
        applyNodeChanges(changes)
      }
    },
    [nodes, edges, applyNodeChanges],
  )

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

  // Apply graphOverride when viewing a version, or reload own graph when clearing
  useEffect(() => {
    if (graphOverride) {
      setNodes(graphOverride.nodes as Node[])
      setEdges(graphOverride.edges as Edge[])
      setSelectedNode(null)
    } else if (initializedRef.current === flow.id) {
      // Version cleared — reload the flow's own persisted graph
      const existing = getFlowGraph(flow.id)
      if (existing) {
        setNodes(existing.nodes as Node[])
        setEdges(existing.edges as Edge[])
      }
    }
  }, [graphOverride, flow.id, setNodes, setEdges])

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

  // Edge reconnection: drag an existing edge endpoint to a new handle
  const edgeReconnectSuccessful = useRef(true)

  const handleReconnectStart = useCallback(() => {
    edgeReconnectSuccessful.current = false
  }, [])

  const handleReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      edgeReconnectSuccessful.current = true
      setNodes((currentNodes) => {
        setEdges((currentEdges) => {
          pushUndo(currentNodes, currentEdges)
          return reconnectEdge(oldEdge, newConnection, currentEdges)
        })
        return currentNodes
      })
      scheduleSave()
    },
    [setNodes, setEdges, scheduleSave, pushUndo],
  )

  const handleReconnectEnd = useCallback(
    (_event: MouseEvent | TouchEvent, edge: Edge) => {
      if (!edgeReconnectSuccessful.current) {
        // Edge was dropped in empty space — delete it
        setNodes((currentNodes) => {
          setEdges((currentEdges) => {
            pushUndo(currentNodes, currentEdges)
            return currentEdges.filter((e) => e.id !== edge.id)
          })
          return currentNodes
        })
        scheduleSave()
      }
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
      if (data.nodeType === 'flow-reference' && data.targetFlowId) {
        onNavigateToFlow?.(data.targetFlowId)
      } else if (data.screenId) {
        onNavigateToScreen(data.screenId)
      }
    },
    [onNavigateToScreen, onNavigateToFlow],
  )

  const handlePaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [])

  const handleNodeDragStop = useCallback(() => {
    // Recalculate edge handles based on new node positions
    setNodes((currentNodes) => {
      setEdges((currentEdges) => recalculateEdgeHandles(currentNodes, currentEdges) as Edge[])
      return currentNodes
    })
    scheduleSave()
  }, [setNodes, setEdges, scheduleSave])

  // Toolbar: Add node
  const handleAddNode = useCallback(
    (nodeType: FlowNodeType) => {
      const nodeId = `node-${Date.now()}`
      const labels: Record<FlowNodeType, string> = {
        screen: 'New Screen',
        page: 'New Page',
        decision: 'Decision',
        error: 'Error State',
        'flow-reference': 'Flow Reference',
        action: 'User Action',
        overlay: 'Overlay',
        'api-call': 'API Call',
        delay: 'Delay',
        note: 'Note',
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
        const maxY = currentNodes.reduce((max, n) => Math.max(max, n.position.y), 0)
        const nodeData: FlowNodeData = {
          label: labels[nodeType],
          screenId: linkedScreenId,
          nodeType,
          description: '',
        }
        const newNode: Node = {
          id: nodeId,
          type: nodeType,
          position: { x: 300, y: maxY + 200 },
          data: nodeData,
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
      } else if (e.key === 'f' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        handleAddNode('flow-reference')
      } else if (e.key === 'a' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        handleAddNode('action')
      } else if (e.key === 'o' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        handleAddNode('overlay')
      } else if (e.key === 'c' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        handleAddNode('api-call')
      } else if (e.key === 'w' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        handleAddNode('delay')
      } else if (e.key === 'n' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        handleAddNode('note')
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleUndo, handleRedo, handleAddNode])

  // Align nodes: reposition all nodes in a centered layered layout
  const handleAlignNodes = useCallback(() => {
    const result = { nodes: null as Node[] | null, edges: null as Edge[] | null }
    setNodes((currentNodes) => {
      setEdges((currentEdges) => {
        pushUndo(currentNodes, currentEdges)
        const aligned = alignNodes(currentNodes, currentEdges)
        result.nodes = aligned.nodes as Node[]
        result.edges = aligned.edges as Edge[]
        return result.edges
      })
      return result.nodes ?? currentNodes
    })
    if (result.nodes && result.edges) {
      saveFlowGraph(flow.id, result.nodes, result.edges)
    }
    setSelectedNode(null)
  }, [flow.id, setNodes, setEdges, pushUndo])

  // Annotations panel: update node data fields
  const handleNodeUpdate = useCallback(
    (nodeId: string, updates: Record<string, unknown>) => {
      // Sync label changes to the linked screen title
      if (updates.label) {
        const nodeData = nodes.find((n) => n.id === nodeId)?.data as FlowNodeData | undefined
        if (nodeData?.screenId) {
          syncNodeLabelToScreen(flow.id, nodeData.screenId, updates.label as string, !!flow.isDynamic)
        }
      }

      // Auto-generate action node labels when actionType or actionTarget changes
      const nodeData = nodes.find((n) => n.id === nodeId)?.data as FlowNodeData | undefined
      if (nodeData?.nodeType === 'action') {
        const hasTypeOrTargetChange = 'actionType' in updates || 'actionTarget' in updates
        const isDirectLabelEdit = 'label' in updates && !hasTypeOrTargetChange

        if (isDirectLabelEdit) {
          updates.labelManuallyEdited = true
        } else if (hasTypeOrTargetChange && !nodeData.labelManuallyEdited) {
          const verbMap: Record<string, string> = {
            tap: 'taps', swipe: 'swipes', input: 'inputs',
            scroll: 'scrolls', 'long-press': 'long-presses',
          }
          const actionType = (updates.actionType as string) ?? nodeData.actionType ?? 'tap'
          const actionTarget = (updates.actionTarget as string) ?? nodeData.actionTarget ?? ''
          const verb = verbMap[actionType] ?? actionType
          if (actionTarget) {
            updates.label = `User ${verb} ${actionTarget}`
          }
        }
      }

      setNodes((nds) =>
        nds.map((n) => {
          if (n.id !== nodeId) return n
          return {
            ...n,
            data: { ...n.data, ...updates },
          }
        }),
      )
      setSelectedNode((prev) => {
        if (!prev || prev.id !== nodeId) return prev
        return {
          ...prev,
          data: { ...prev.data, ...updates },
        }
      })
      scheduleSave()
    },
    [setNodes, scheduleSave, nodes, flow.id, flow.isDynamic],
  )

  // Open in prototype
  const handleOpenInPrototype = useCallback(() => {
    const data = selectedNode?.data as FlowNodeData | undefined
    if (data?.screenId) {
      onNavigateToScreen(data.screenId)
    }
  }, [selectedNode, onNavigateToScreen])

  // Version management (state is lifted to SimulatorPage, received via props)
  const handleSaveVersion = useCallback(
    (version: string, description: string, screenIds?: string[]) => {
      setNodes((currentNodes) => {
        setEdges((currentEdges) => {
          saveVersion(flow.id, version, description, currentNodes, currentEdges, screenIds)
          onVersionsChanged?.()
          return currentEdges
        })
        return currentNodes
      })
    },
    [flow.id, setNodes, setEdges, onVersionsChanged],
  )

  // Preview: non-destructive, in-memory only — never persists
  const handleViewVersion = useCallback(
    (versionEntry: FlowVersion) => {
      onViewVersionProp?.(versionEntry)
    },
    [onViewVersionProp],
  )

  // Restore: explicitly copies version graph → live graph (persisted)
  const handleRestoreVersion = useCallback(
    (versionEntry: FlowVersion) => {
      pushUndo(nodes, edges)
      setNodes(versionEntry.nodes as Node[])
      setEdges(versionEntry.edges as Edge[])
      saveFlowGraph(flow.id, versionEntry.nodes, versionEntry.edges)
      setSelectedNode(null)
      onRestoreVersionProp?.(versionEntry)
    },
    [flow.id, nodes, edges, setNodes, setEdges, pushUndo, onRestoreVersionProp],
  )

  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={handleConnect}
            onReconnectStart={handleReconnectStart}
            onReconnect={handleReconnect}
            onReconnectEnd={handleReconnectEnd}
            reconnectRadius={20}
            onNodeClick={handleNodeClick}
            onNodeDoubleClick={handleNodeDoubleClick}
            onPaneClick={handlePaneClick}
            onNodeDragStop={handleNodeDragStop}
            nodeTypes={nodeTypes}
            snapToGrid
            snapGrid={[20, 20]}
            fitView
            fitViewOptions={{ padding: 0.3 }}
            proOptions={{ hideAttribution: true }}
            defaultEdgeOptions={{
              type: 'smoothstep',
              style: { stroke: '#4ADE80', strokeWidth: 2 },
            }}
          >
            <Background
              variant={BackgroundVariant.Lines}
              gap={20}
              lineWidth={1}
              color="#2A2A2A"
              bgColor="#1E1E1E"
            />
            <MiniMap
              nodeColor={(node) => {
                switch (node.type) {
                  case 'screen': return '#4ADE80'
                  case 'page': return '#4ADE80'
                  case 'decision': return '#FBBF24'
                  case 'error': return '#F87171'
                  case 'flow-reference': return '#60A5FA'
                  case 'action': return '#A78BFA'
                  case 'overlay': return '#2DD4BF'
                  case 'api-call': return '#22D3EE'
                  case 'delay': return '#FB923C'
                  case 'note': return '#78716C'
                  default: return '#6B6B6B'
                }
              }}
              maskColor="rgba(30, 30, 30, 0.8)"
              className="!bg-shell-surface !border-shell-border"
            />
          </ReactFlow>
          <HelperLines horizontal={helperLines.horizontal} vertical={helperLines.vertical} />
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
        nodes={nodes}
        edges={edges}
        onOpenInPrototype={handleOpenInPrototype}
        onNodeUpdate={handleNodeUpdate}
        onAlignNodes={handleAlignNodes}
        versions={versionsProp}
        suggestedVersion={suggestedVerProp}
        onSaveVersion={handleSaveVersion}
        onViewVersion={handleViewVersion}
        onRestoreVersion={handleRestoreVersion}
        onVersionsChanged={onVersionsChanged}
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
