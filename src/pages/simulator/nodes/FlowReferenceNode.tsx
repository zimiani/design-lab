import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { RiExternalLinkLine } from '@remixicon/react'
import type { FlowNodeData } from '../flowGraph.types'

function FlowReferenceNode({ data, selected }: NodeProps) {
  const nodeData = data as FlowNodeData

  return (
    <div
      className={`
        w-[200px] rounded-[var(--token-radius-md)] border-2 overflow-hidden
        transition-colors duration-[var(--token-transition-fast)]
        ${selected
          ? 'border-[#60A5FA] shadow-[0_0_0_2px_rgba(96,165,250,0.3)]'
          : 'border-shell-border'
        }
        bg-shell-surface
      `}
    >
      <Handle type="target" position={Position.Top} id="top" className="!bg-[#60A5FA] !w-[10px] !h-[10px] !border-2 !border-shell-surface" />
      <Handle type="target" position={Position.Left} id="left-target" className="!bg-[#60A5FA] !w-[10px] !h-[10px] !border-2 !border-shell-surface" />
      <Handle type="source" position={Position.Left} id="left-source" className="!bg-[#60A5FA] !w-[10px] !h-[10px] !border-2 !border-shell-surface" />
      <Handle type="target" position={Position.Right} id="right-target" className="!bg-[#60A5FA] !w-[10px] !h-[10px] !border-2 !border-shell-surface" />
      <Handle type="source" position={Position.Right} id="right-source" className="!bg-[#60A5FA] !w-[10px] !h-[10px] !border-2 !border-shell-surface" />
      {/* Header bar */}
      <div className="flex items-center gap-[var(--token-spacing-2)] px-[var(--token-spacing-3)] py-[var(--token-spacing-2)] bg-[#1E3A5F]">
        <RiExternalLinkLine size={14} className="text-[#60A5FA] shrink-0" />
        <span className="text-[length:var(--token-font-size-body-sm)] font-medium text-shell-text truncate flex-1">
          {nodeData.label}
        </span>
      </div>
      {/* Description / target info */}
      <div className="px-[var(--token-spacing-3)] py-[var(--token-spacing-2)]">
        {nodeData.targetFlowId ? (
          <p className="text-[length:var(--token-font-size-caption)] text-[#60A5FA]">
            {nodeData.targetFlowId}
          </p>
        ) : (
          <p className="text-[length:var(--token-font-size-caption)] text-shell-text-tertiary italic">
            No target flow set
          </p>
        )}
        {nodeData.description && (
          <p className="text-[length:var(--token-font-size-caption)] text-shell-text-tertiary line-clamp-2 mt-[2px]">
            {nodeData.description}
          </p>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} id="bottom" className="!bg-[#60A5FA] !w-[10px] !h-[10px] !border-2 !border-shell-surface" />
    </div>
  )
}

export default memo(FlowReferenceNode)
