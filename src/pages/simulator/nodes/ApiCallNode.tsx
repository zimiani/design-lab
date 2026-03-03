import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { RiServerLine } from '@remixicon/react'
import type { FlowNodeData, ApiMethod } from '../flowGraph.types'

const methodColors: Record<ApiMethod, string> = {
  GET: 'bg-[#4ADE80] text-[#1A3A4A]',
  POST: 'bg-[#22D3EE] text-[#1A3A4A]',
  PUT: 'bg-[#FBBF24] text-[#1A3A4A]',
  DELETE: 'bg-[#F87171] text-[#1A3A4A]',
}

function ApiCallNode({ data, selected }: NodeProps) {
  const nodeData = data as FlowNodeData
  const method = nodeData.apiMethod ?? 'GET'

  return (
    <div
      className={`
        w-[200px] rounded-[var(--token-radius-md)] border-2 overflow-hidden
        transition-colors duration-[var(--token-transition-fast)]
        ${selected
          ? 'border-[#22D3EE] shadow-[0_0_0_2px_rgba(34,211,238,0.3)]'
          : 'border-[#78716C]'
        }
        bg-[#1A3A4A]
      `}
    >
      <Handle type="target" position={Position.Top} id="top" className="!bg-[#22D3EE] !w-[10px] !h-[10px] !border-2 !border-[#1A3A4A]" />
      <Handle type="target" position={Position.Left} id="left-target" className="!bg-[#22D3EE] !w-[10px] !h-[10px] !border-2 !border-[#1A3A4A]" />
      <Handle type="source" position={Position.Left} id="left-source" className="!bg-[#22D3EE] !w-[10px] !h-[10px] !border-2 !border-[#1A3A4A]" />
      <Handle type="target" position={Position.Right} id="right-target" className="!bg-[#22D3EE] !w-[10px] !h-[10px] !border-2 !border-[#1A3A4A]" />
      <Handle type="source" position={Position.Right} id="right-source" className="!bg-[#22D3EE] !w-[10px] !h-[10px] !border-2 !border-[#1A3A4A]" />
      <div className="flex items-center gap-[var(--token-spacing-2)] px-[var(--token-spacing-3)] py-[var(--token-spacing-2)]">
        <RiServerLine size={14} className="text-[#22D3EE] shrink-0" />
        <span className="text-[length:var(--token-font-size-body-sm)] font-medium text-shell-text truncate">
          {nodeData.label}
        </span>
      </div>
      {(nodeData.apiEndpoint || nodeData.apiMethod) && (
        <div className="flex items-center gap-[var(--token-spacing-1)] px-[var(--token-spacing-3)] pb-[var(--token-spacing-2)]">
          <span className={`text-[length:10px] font-bold px-[4px] py-[1px] rounded-[2px] leading-tight ${methodColors[method]}`}>
            {method}
          </span>
          {nodeData.apiEndpoint && (
            <span className="text-[length:var(--token-font-size-caption)] text-shell-text-tertiary truncate">
              {nodeData.apiEndpoint}
            </span>
          )}
        </div>
      )}
      <Handle type="source" position={Position.Bottom} id="bottom" className="!bg-[#22D3EE] !w-[10px] !h-[10px] !border-2 !border-[#1A3A4A]" />
    </div>
  )
}

export default memo(ApiCallNode)
