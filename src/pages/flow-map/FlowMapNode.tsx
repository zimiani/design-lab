import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'

export interface FlowMapNodeData {
  flowId: string
  label: string
  domain: string
  screenCount: number
  entryPoints?: string[]
  [key: string]: unknown
}

const domainColors: Record<string, { bg: string; text: string }> = {
  'authentication': { bg: 'bg-[#3B82F6]/20', text: 'text-[#60A5FA]' },
  'onboarding': { bg: 'bg-[#8B5CF6]/20', text: 'text-[#A78BFA]' },
  'dashboard': { bg: 'bg-[#06B6D4]/20', text: 'text-[#22D3EE]' },
  'cards': { bg: 'bg-[#F59E0B]/20', text: 'text-[#FBBF24]' },
  'add-funds': { bg: 'bg-[#10B981]/20', text: 'text-[#34D399]' },
  'send-funds': { bg: 'bg-[#EF4444]/20', text: 'text-[#F87171]' },
  'perks': { bg: 'bg-[#EC4899]/20', text: 'text-[#F472B6]' },
  'earn': { bg: 'bg-[#14B8A6]/20', text: 'text-[#2DD4BF]' },
  'transaction-history': { bg: 'bg-[#6366F1]/20', text: 'text-[#818CF8]' },
  'settings': { bg: 'bg-[#78716C]/20', text: 'text-[#A8A29E]' },
}

const defaultDomainColor = { bg: 'bg-shell-hover', text: 'text-shell-text-secondary' }

function FlowMapNode({ data }: NodeProps) {
  const nodeData = data as FlowMapNodeData
  const colors = domainColors[nodeData.domain] ?? defaultDomainColor

  return (
    <>
      <Handle type="target" position={Position.Top} className="!bg-shell-border !w-[8px] !h-[8px]" />
      <Handle type="target" position={Position.Left} className="!bg-shell-border !w-[8px] !h-[8px]" />

      <div className="w-[240px] rounded-[var(--token-radius-md)] bg-shell-surface border border-shell-border cursor-pointer hover:border-shell-selected-text transition-colors p-[var(--token-spacing-3)]">
        {/* Flow name */}
        <p className="text-[length:var(--token-font-size-body-sm)] font-semibold text-shell-text truncate mb-[var(--token-spacing-1)]">
          {nodeData.label}
        </p>

        {/* Domain badge + screen count */}
        <div className="flex items-center gap-[var(--token-spacing-2)] mb-[var(--token-spacing-2)]">
          <span className={`px-[var(--token-spacing-2)] py-[1px] rounded-[var(--token-radius-full)] text-[length:10px] font-medium ${colors.bg} ${colors.text}`}>
            {nodeData.domain}
          </span>
          <span className="text-[length:10px] text-shell-text-tertiary">
            {nodeData.screenCount} screen{nodeData.screenCount !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Entry point pills */}
        {nodeData.entryPoints && nodeData.entryPoints.length > 0 && (
          <div className="flex flex-wrap gap-[4px]">
            {nodeData.entryPoints.map((ep) => (
              <span
                key={ep}
                className="px-[var(--token-spacing-1)] py-[1px] rounded-[var(--token-radius-sm)] bg-shell-hover text-[length:9px] font-mono text-shell-text-tertiary"
              >
                {ep}
              </span>
            ))}
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-shell-border !w-[8px] !h-[8px]" />
      <Handle type="source" position={Position.Right} className="!bg-shell-border !w-[8px] !h-[8px]" />
    </>
  )
}

export default memo(FlowMapNode)
