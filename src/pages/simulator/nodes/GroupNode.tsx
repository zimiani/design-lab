import { memo } from 'react'
import { type NodeProps, NodeResizer } from '@xyflow/react'
import type { FlowNodeData } from '../flowGraph.types'

function GroupNode({ data, selected }: NodeProps) {
  const nodeData = data as FlowNodeData

  return (
    <>
      <NodeResizer
        isVisible={selected}
        minWidth={240}
        minHeight={160}
        lineStyle={{ borderColor: 'rgba(255,255,255,0.3)', borderWidth: 1 }}
        handleStyle={{ width: 8, height: 8, backgroundColor: '#fff', borderRadius: 2, border: '1px solid rgba(255,255,255,0.4)' }}
      />
      <div
        className="rounded-[16px] w-full h-full"
        style={{
          border: selected ? '2px solid rgba(255,255,255,0.9)' : '2px solid rgba(255,255,255,0.8)',
          backgroundColor: 'transparent',
        }}
      >
        <div className="px-3 py-[6px] flex items-center gap-2">
          <span className="text-[12px] font-medium tracking-wide uppercase text-[rgba(255,255,255,0.45)]">
            {nodeData.label}
          </span>
        </div>
      </div>
    </>
  )
}

export default memo(GroupNode)
