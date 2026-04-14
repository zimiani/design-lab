import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { RiErrorWarningLine } from '@remixicon/react'
import type { FlowNodeData, ErrorDisplayMode } from '../flowGraph.types'

const displayBadgeLabels: Record<ErrorDisplayMode, string> = {
  'full-screen': 'Page',
  toast: 'Toast',
  banner: 'Banner',
}

function ErrorNode({ data, selected }: NodeProps) {
  const nodeData = data as FlowNodeData
  const errorDisplay = nodeData.errorDisplay ?? 'full-screen'

  return (
    <div
      className={`
        w-[200px] rounded-[12px] border overflow-hidden
        transition-all duration-[var(--token-transition-fast)]
        ${selected
          ? 'border-[#F87171]/60'
          : 'border-white/[0.08]'
        }
        bg-[#301E1E]
      `}
      style={{
        boxShadow: selected
          ? '0 0 0 1px rgba(248,113,113,0.2), 0 4px 12px rgba(0,0,0,0.4)'
          : '0 2px 8px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.04)',
      }}
    >
      <Handle type="target" position={Position.Top} id="top" className="!bg-[#F87171] !w-[8px] !h-[8px] !border-[1.5px] !border-[#301E1E]" />
      <Handle type="target" position={Position.Left} id="left-target" className="!bg-[#F87171] !w-[8px] !h-[8px] !border-[1.5px] !border-[#301E1E]" />
      <Handle type="source" position={Position.Left} id="left-source" className="!bg-[#F87171] !w-[8px] !h-[8px] !border-[1.5px] !border-[#301E1E]" />
      <Handle type="target" position={Position.Right} id="right-target" className="!bg-[#F87171] !w-[8px] !h-[8px] !border-[1.5px] !border-[#301E1E]" />
      <Handle type="source" position={Position.Right} id="right-source" className="!bg-[#F87171] !w-[8px] !h-[8px] !border-[1.5px] !border-[#301E1E]" />
      <div className="flex items-center gap-[var(--token-spacing-8)] px-[var(--token-spacing-12)] py-[var(--token-spacing-8)]">
        <RiErrorWarningLine size={14} className="text-[#F87171] shrink-0" />
        <span className="text-[length:var(--token-font-size-body-sm)] font-medium text-[#e0e0e0] truncate flex-1">
          {nodeData.label}
        </span>
        <span className="text-[length:10px] text-[#F87171]/80 bg-[#F87171]/10 px-[6px] py-[1px] rounded-full shrink-0">
          {displayBadgeLabels[errorDisplay]}
        </span>
      </div>
      <div className="px-[var(--token-spacing-12)] py-[var(--token-spacing-8)] border-t border-white/[0.06]">
        <p className={`text-[length:var(--token-font-size-caption)] line-clamp-2 ${nodeData.description ? 'text-[#888]' : 'text-[#555] italic'}`}>
          {nodeData.description || 'Error description...'}
        </p>
      </div>
      <Handle type="source" position={Position.Bottom} id="bottom" className="!bg-[#F87171] !w-[8px] !h-[8px] !border-[1.5px] !border-[#301E1E]" />
    </div>
  )
}

export default memo(ErrorNode)
