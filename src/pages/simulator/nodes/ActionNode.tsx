import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { ComponentType } from 'react'
import {
  RiDragMoveLine,
  RiInputMethodLine,
  RiCollapseVerticalLine,
  RiTapeLine,
  RiUserLine,
} from '@remixicon/react'
import { PiHandTap } from 'react-icons/pi'
import { cn } from '@/lib/cn'
import type { FlowNodeData, ActionType } from '../flowGraph.types'

const actionIcons: Record<ActionType, ComponentType<{ size?: number; className?: string }>> = {
  tap: PiHandTap,
  swipe: RiDragMoveLine,
  input: RiInputMethodLine,
  scroll: RiCollapseVerticalLine,
  'long-press': RiTapeLine,
  external: RiUserLine,
}

function ActionNode({ data, selected }: NodeProps) {
  const nodeData = data as FlowNodeData
  const actionType = nodeData.actionType ?? 'tap'
  const isExternal = actionType === 'external'
  const Icon = actionIcons[actionType] ?? PiHandTap

  // Display: strip "Component: " prefix from actionTarget, or fall back to label
  const rawLabel = nodeData.actionTarget || nodeData.label || 'Action'
  const displayLabel = rawLabel.replace(/^[A-Za-z]+:\s*/, '')

  return (
    <div
      className={cn(
        'w-[100px] rounded-full border pl-3 pr-4 py-1 flex items-center gap-1.5 transition-all duration-[var(--token-transition-fast)]',
        isExternal
          ? 'bg-[#2A2520] text-[#FBBF24]'
          : 'bg-[#1B2E1E] text-[#86EFAC]',
        isExternal
          ? (selected ? 'border-[#FBBF24]/60' : 'border-[#FBBF24]/30')
          : (selected ? 'border-[#4ADE80]/60' : 'border-[#4ADE80]/30'),
      )}
      style={{
        boxShadow: selected
          ? `0 0 0 1px ${isExternal ? 'rgba(251,191,36,0.2)' : 'rgba(74,222,128,0.2)'}, 0 4px 12px rgba(0,0,0,0.4)`
          : '0 2px 8px rgba(0,0,0,0.3)',
      }}
    >
      <Handle type="target" position={Position.Top} id="top" className={cn('!w-[6px] !h-[6px] !border-[1px]', isExternal ? '!bg-[#FBBF24] !border-[#2A2520]' : '!bg-[#4ADE80] !border-[#1B2E1E]')} />
      <Handle type="target" position={Position.Left} id="left-target" className={cn('!w-[6px] !h-[6px] !border-[1px]', isExternal ? '!bg-[#FBBF24] !border-[#2A2520]' : '!bg-[#4ADE80] !border-[#1B2E1E]')} />
      <Handle type="source" position={Position.Left} id="left-source" className={cn('!w-[6px] !h-[6px] !border-[1px]', isExternal ? '!bg-[#FBBF24] !border-[#2A2520]' : '!bg-[#4ADE80] !border-[#1B2E1E]')} />
      <Handle type="target" position={Position.Right} id="right-target" className={cn('!w-[6px] !h-[6px] !border-[1px]', isExternal ? '!bg-[#FBBF24] !border-[#2A2520]' : '!bg-[#4ADE80] !border-[#1B2E1E]')} />
      <Handle type="source" position={Position.Right} id="right-source" className={cn('!w-[6px] !h-[6px] !border-[1px]', isExternal ? '!bg-[#FBBF24] !border-[#2A2520]' : '!bg-[#4ADE80] !border-[#1B2E1E]')} />
      <Icon size={15} className="shrink-0" />
      <span className="text-[12px] font-medium truncate">{displayLabel}</span>
      <Handle type="source" position={Position.Bottom} id="bottom" className={cn('!w-[6px] !h-[6px] !border-[1px]', isExternal ? '!bg-[#FBBF24] !border-[#2A2520]' : '!bg-[#4ADE80] !border-[#1B2E1E]')} />
    </div>
  )
}

export default memo(ActionNode)
