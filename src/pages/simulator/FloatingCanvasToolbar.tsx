import { RiArrowGoBackLine, RiArrowGoForwardLine, RiNodeTree } from '@remixicon/react'
import type { CreatableNodeType } from './flowGraph.types'
import { NODE_TYPE_CONFIG } from './nodeTypeConfig'

interface FloatingCanvasToolbarProps {
  onAddNode: (type: CreatableNodeType) => void
  onUndo?: () => void
  onRedo?: () => void
  canUndo?: boolean
  canRedo?: boolean
  onAlignNodes?: () => void
}

function ToolbarButton({
  onClick,
  title,
  disabled,
  children,
}: {
  onClick: () => void
  title: string
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`
        flex items-center justify-center w-[28px] h-[28px] rounded-[6px]
        transition-colors cursor-pointer
        ${disabled
          ? 'text-[#555] cursor-not-allowed'
          : 'text-[#aaa] hover:bg-[#3a3a3a] hover:text-white'
        }
      `}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <div className="w-[1px] h-[20px] bg-[#444] mx-[4px]" />
}

function ToolbarShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-[2px] h-[40px] px-[6px] bg-[#2c2c2c] border border-[#3a3a3a] rounded-[12px] shadow-2xl">
      {children}
    </div>
  )
}

// Group node types for the toolbar layout:
// Screens & overlays | Connectors (action, decision) | Infrastructure (api, delay, error) | References (flow-ref, entry, note)
const SCREEN_TYPES: CreatableNodeType[] = ['screen', 'overlay']
const CONNECTOR_TYPES: CreatableNodeType[] = ['action', 'decision']
const INFRA_TYPES: CreatableNodeType[] = ['api-call', 'delay', 'error']
const REF_TYPES: CreatableNodeType[] = ['flow-reference', 'entry-point', 'note']

const configMap = new Map(NODE_TYPE_CONFIG.map((e) => [e.type, e]))

function NodeTypeButtons({ types, onAddNode }: { types: CreatableNodeType[]; onAddNode: (type: CreatableNodeType) => void }) {
  return (
    <>
      {types.map((type) => {
        const cfg = configMap.get(type)!
        const Icon = cfg.icon
        let tooltip = `Add ${cfg.label} (${cfg.shortcut.toUpperCase()})`
        if (type === 'api-call') tooltip += ' — Synchronous request'
        if (type === 'delay') tooltip += ' — Async wait'
        return (
          <ToolbarButton key={type} onClick={() => onAddNode(type)} title={tooltip}>
            <Icon size={16} />
          </ToolbarButton>
        )
      })}
    </>
  )
}

export default function FloatingCanvasToolbar({
  onAddNode,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  onAlignNodes,
}: FloatingCanvasToolbarProps) {
  return (
    <div className="absolute bottom-[16px] left-1/2 -translate-x-1/2 z-10 flex items-center gap-[8px]">
      {/* Node types */}
      <ToolbarShell>
        <NodeTypeButtons types={SCREEN_TYPES} onAddNode={onAddNode} />
        <Divider />
        <NodeTypeButtons types={CONNECTOR_TYPES} onAddNode={onAddNode} />
        <Divider />
        <NodeTypeButtons types={INFRA_TYPES} onAddNode={onAddNode} />
        <Divider />
        <NodeTypeButtons types={REF_TYPES} onAddNode={onAddNode} />
      </ToolbarShell>

      {/* Actions */}
      <ToolbarShell>
        <ToolbarButton onClick={() => onUndo?.()} title="Undo (Ctrl+Z)" disabled={!canUndo}>
          <RiArrowGoBackLine size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={() => onRedo?.()} title="Redo (Ctrl+Y)" disabled={!canRedo}>
          <RiArrowGoForwardLine size={14} />
        </ToolbarButton>
        <Divider />
        <ToolbarButton onClick={() => onAlignNodes?.()} title="Align nodes">
          <RiNodeTree size={14} />
        </ToolbarButton>
      </ToolbarShell>
    </div>
  )
}
