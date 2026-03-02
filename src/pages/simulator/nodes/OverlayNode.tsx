import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { RiStackLine } from '@remixicon/react'
import type { FlowNodeData, OverlayType } from '../flowGraph.types'

const overlayLabels: Record<OverlayType, string> = {
  'bottom-sheet': 'Bottom Sheet',
  modal: 'Modal',
  dialog: 'Dialog',
  popover: 'Popover',
  toast: 'Toast',
}

function OverlayNode({ data, selected }: NodeProps) {
  const nodeData = data as FlowNodeData
  const overlayType = nodeData.overlayType ?? 'bottom-sheet'

  return (
    <div
      className={`
        w-[200px] rounded-[var(--token-radius-md)] border-2 overflow-hidden
        transition-colors duration-[var(--token-transition-fast)]
        ${selected
          ? 'border-[#2DD4BF] shadow-[0_0_0_2px_rgba(45,212,191,0.3)]'
          : 'border-[#78716C]'
        }
        bg-[#1A3038]
      `}
      style={{
        boxShadow: selected
          ? '0 0 0 2px rgba(45,212,191,0.3), 4px 4px 0 0 rgba(45,212,191,0.15)'
          : '4px 4px 0 0 rgba(45,212,191,0.15)',
      }}
    >
      <Handle type="target" position={Position.Top} id="top" className="!bg-[#2DD4BF] !w-[10px] !h-[10px] !border-2 !border-[#1A3038]" />
      <Handle type="target" position={Position.Left} id="left-target" className="!bg-[#2DD4BF] !w-[10px] !h-[10px] !border-2 !border-[#1A3038]" />
      <Handle type="source" position={Position.Left} id="left-source" className="!bg-[#2DD4BF] !w-[10px] !h-[10px] !border-2 !border-[#1A3038]" />
      <Handle type="target" position={Position.Right} id="right-target" className="!bg-[#2DD4BF] !w-[10px] !h-[10px] !border-2 !border-[#1A3038]" />
      <Handle type="source" position={Position.Right} id="right-source" className="!bg-[#2DD4BF] !w-[10px] !h-[10px] !border-2 !border-[#1A3038]" />
      {/* Header bar */}
      <div className="flex items-center gap-[var(--token-spacing-2)] px-[var(--token-spacing-3)] py-[var(--token-spacing-2)] bg-[#1E3A42]">
        <RiStackLine size={14} className="text-[#2DD4BF] shrink-0" />
        <span className="text-[length:var(--token-font-size-body-sm)] font-medium text-shell-text truncate flex-1">
          {nodeData.label}
        </span>
        <span className="text-[length:10px] text-[#2DD4BF]/70 bg-[#2DD4BF]/10 px-[6px] py-[1px] rounded-[var(--token-radius-full)] shrink-0">
          {overlayLabels[overlayType]}
        </span>
      </div>
      {/* Description */}
      {nodeData.description && (
        <div className="px-[var(--token-spacing-3)] py-[var(--token-spacing-2)]">
          <p className="text-[length:var(--token-font-size-caption)] text-shell-text-tertiary line-clamp-2">
            {nodeData.description}
          </p>
        </div>
      )}
      <Handle type="source" position={Position.Bottom} id="bottom" className="!bg-[#2DD4BF] !w-[10px] !h-[10px] !border-2 !border-[#1A3038]" />
    </div>
  )
}

export default memo(OverlayNode)
