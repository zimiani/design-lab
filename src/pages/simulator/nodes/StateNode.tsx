import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { RiFlashlightLine } from '@remixicon/react'
import type { FlowNodeData } from '../flowGraph.types'

function StateNode({ data, selected }: NodeProps) {
  const nodeData = data as FlowNodeData

  return (
    <div
      className={`
        w-[140px] rounded-[var(--token-radius-md)] border-2 overflow-hidden
        transition-colors duration-[var(--token-transition-fast)]
        ${selected
          ? 'border-[#94A3B8] shadow-[0_0_0_2px_rgba(148,163,184,0.3)]'
          : 'border-[#475569]'
        }
        bg-[#1E293B]
      `}
      style={{
        boxShadow: selected
          ? '0 0 0 2px rgba(148,163,184,0.3), 3px 3px 0 0 rgba(148,163,184,0.1)'
          : '3px 3px 0 0 rgba(148,163,184,0.1)',
      }}
    >
      <Handle type="target" position={Position.Top} id="top" className="!bg-[#94A3B8] !w-[8px] !h-[8px] !border-2 !border-[#1E293B]" />
      <Handle type="target" position={Position.Left} id="left-target" className="!bg-[#94A3B8] !w-[8px] !h-[8px] !border-2 !border-[#1E293B]" />
      <Handle type="source" position={Position.Left} id="left-source" className="!bg-[#94A3B8] !w-[8px] !h-[8px] !border-2 !border-[#1E293B]" />
      <Handle type="target" position={Position.Right} id="right-target" className="!bg-[#94A3B8] !w-[8px] !h-[8px] !border-2 !border-[#1E293B]" />
      <Handle type="source" position={Position.Right} id="right-source" className="!bg-[#94A3B8] !w-[8px] !h-[8px] !border-2 !border-[#1E293B]" />

      <div className="flex items-center gap-[var(--token-spacing-1)] px-[var(--token-spacing-2)] py-[var(--token-spacing-2)]">
        <RiFlashlightLine size={12} className="text-[#94A3B8] shrink-0" />
        <span className="text-[length:var(--token-font-size-caption)] font-medium text-shell-text-secondary truncate flex-1">
          {nodeData.label}
        </span>
      </div>

      <Handle type="source" position={Position.Bottom} id="bottom" className="!bg-[#94A3B8] !w-[8px] !h-[8px] !border-2 !border-[#1E293B]" />
    </div>
  )
}

export default memo(StateNode)
