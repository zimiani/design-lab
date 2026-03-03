import { memo } from 'react'
import type { NodeProps } from '@xyflow/react'
import { RiStickyNoteLine } from '@remixicon/react'
import type { FlowNodeData } from '../flowGraph.types'

function NoteNode({ data, selected }: NodeProps) {
  const nodeData = data as FlowNodeData

  return (
    <div
      className={`
        w-[200px] rounded-[var(--token-radius-md)] border-2 border-dashed overflow-hidden
        transition-colors duration-[var(--token-transition-fast)]
        ${selected
          ? 'border-[#A8A29E] shadow-[0_0_0_2px_rgba(168,162,158,0.3)]'
          : 'border-[#57534E]'
        }
        bg-[#2A2A2A]
      `}
    >
      <div className="flex items-start gap-[var(--token-spacing-2)] px-[var(--token-spacing-3)] py-[var(--token-spacing-2)]">
        <RiStickyNoteLine size={14} className="text-[#78716C] shrink-0 mt-[1px]" />
        <div className="flex-1 min-w-0">
          <span className="text-[length:var(--token-font-size-body-sm)] font-medium text-[#A8A29E] truncate block">
            {nodeData.label}
          </span>
          {nodeData.description && (
            <p className="text-[length:var(--token-font-size-caption)] text-[#78716C] line-clamp-4 mt-[2px]">
              {nodeData.description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default memo(NoteNode)
