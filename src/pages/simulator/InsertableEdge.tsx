import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import {
  BaseEdge,
  getSmoothStepPath,
  useNodes,
  type EdgeProps,
} from '@xyflow/react'
import type { CreatableNodeType } from './flowGraph.types'

interface InsertableEdgeData {
  onInsertNode?: (edgeId: string, nodeType: CreatableNodeType, position: { x: number; y: number }) => void
  onEdgeLabelChange?: (edgeId: string, label: string) => void
  isDecisionEdge?: boolean
  [key: string]: unknown
}

export default function InsertableEdge({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  markerEnd,
  label,
  labelStyle,
  labelBgStyle,
  data,
}: EdgeProps) {
  const [hovered, setHovered] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const edgeData = data as InsertableEdgeData | undefined
  const isDecisionEdge = edgeData?.isDecisionEdge ?? false

  // Hide arrow on edges going into action nodes — they're small pass-through pills
  const allNodes = useNodes()
  const resolvedMarker = useMemo(() => {
    const targetNode = allNodes.find((n) => n.id === target)
    return targetNode?.type === 'action' ? undefined : markerEnd
  }, [allNodes, target, markerEnd])

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  })

  const handleLabelClick = useCallback(() => {
    setDraft(typeof label === 'string' ? label : '')
    setEditing(true)
  }, [label])

  const handleLabelSave = useCallback(() => {
    edgeData?.onEdgeLabelChange?.(id, draft.trim())
    setEditing(false)
  }, [id, edgeData, draft])

  // Auto-focus input when editing starts
  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editing])

  // Close label editor on outside click
  useEffect(() => {
    if (!editing) return
    const handleClick = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as HTMLElement)) {
        handleLabelSave()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [editing, handleLabelSave])

  return (
    <>
      {/* Render base edge — hide built-in label for decision edges (we render our own) */}
      <BaseEdge
        path={edgePath}
        style={style}
        markerEnd={resolvedMarker}
        label={isDecisionEdge ? undefined : label}
        labelX={labelX}
        labelY={labelY}
        labelStyle={labelStyle}
        labelBgStyle={labelBgStyle}
        labelBgPadding={[4, 6]}
        labelBgBorderRadius={4}
      />
      {/* Invisible wider hit area for hover */}
      <path
        d={edgePath}
        fill="none"
        strokeWidth={20}
        stroke="transparent"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ cursor: 'default' }}
      />

      {/* Decision edge: clickable label / inline editor */}
      {isDecisionEdge && !editing && label && (
        <foreignObject
          x={labelX - 40}
          y={labelY - 12}
          width={80}
          height={24}
          className="overflow-visible pointer-events-auto"
        >
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); handleLabelClick() }}
            className="px-[6px] py-[2px] rounded-[4px] text-[11px] font-semibold cursor-pointer transition-colors whitespace-nowrap"
            style={{
              color: '#FBBF24',
              backgroundColor: 'rgba(44, 44, 44, 0.9)',
              border: '1px solid transparent',
            }}
            onMouseEnter={(e) => { (e.currentTarget.style.borderColor = '#FBBF24') }}
            onMouseLeave={(e) => { (e.currentTarget.style.borderColor = 'transparent') }}
          >
            {label}
          </button>
        </foreignObject>
      )}
      {/* Decision edge with no label: show + on hover to add one */}
      {isDecisionEdge && !editing && !label && hovered && (
        <foreignObject
          x={labelX - 10}
          y={labelY - 10}
          width={20}
          height={20}
          className="overflow-visible pointer-events-auto"
        >
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); handleLabelClick() }}
            onMouseEnter={() => setHovered(true)}
            className="w-[20px] h-[20px] flex items-center justify-center rounded-full cursor-pointer text-[12px] font-bold leading-none transition-colors"
            style={{
              color: '#FBBF24',
              backgroundColor: 'rgba(44, 44, 44, 0.9)',
              border: '1px solid #FBBF24',
            }}
          >
            +
          </button>
        </foreignObject>
      )}

      {/* Decision edge: inline input */}
      {isDecisionEdge && editing && (
        <foreignObject
          x={labelX - 50}
          y={labelY - 13}
          width={100}
          height={26}
          className="overflow-visible pointer-events-auto"
        >
          <input
            ref={inputRef}
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              e.stopPropagation()
              if (e.key === 'Enter') handleLabelSave()
              if (e.key === 'Escape') setEditing(false)
            }}
            placeholder="condition"
            className="w-full px-[6px] py-[2px] text-[11px] font-semibold text-[#FBBF24] rounded-[4px] outline-none"
            style={{
              backgroundColor: '#2C2C2C',
              border: '1px solid #FBBF24',
              caretColor: '#FBBF24',
            }}
          />
        </foreignObject>
      )}

    </>
  )
}
