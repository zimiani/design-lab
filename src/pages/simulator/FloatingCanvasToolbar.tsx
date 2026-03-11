import { RiArrowGoBackLine, RiArrowGoForwardLine } from '@remixicon/react'
import type { CreatableNodeType } from './flowGraph.types'
import { NODE_TYPE_CONFIG } from './nodeTypeConfig'

interface FloatingCanvasToolbarProps {
  onAddNode: (type: CreatableNodeType) => void
  onUndo?: () => void
  onRedo?: () => void
  canUndo?: boolean
  canRedo?: boolean
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
        flex items-center justify-center w-[32px] h-[32px] rounded-[var(--token-radius-sm)]
        transition-colors cursor-pointer
        ${disabled
          ? 'text-shell-text-tertiary/40 cursor-not-allowed'
          : 'text-shell-text-secondary hover:bg-shell-hover hover:text-shell-text'
        }
      `}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <div className="w-[1px] h-[20px] bg-shell-border mx-[2px]" />
}

// Group node types for the toolbar layout
const UI_TYPES: CreatableNodeType[] = ['screen', 'overlay']
const LOGIC_TYPES: CreatableNodeType[] = ['decision', 'error', 'api-call', 'delay']
const META_TYPES: CreatableNodeType[] = ['action', 'flow-reference', 'note', 'entry-point']

const configMap = new Map(NODE_TYPE_CONFIG.map((e) => [e.type, e]))

function NodeTypeButtons({ types, onAddNode }: { types: CreatableNodeType[]; onAddNode: (type: CreatableNodeType) => void }) {
  return (
    <>
      {types.map((type) => {
        const cfg = configMap.get(type)!
        const Icon = cfg.icon
        // Build tooltip with extra context for ambiguous types
        let tooltip = `Add ${cfg.label} (${cfg.shortcut.toUpperCase()})`
        if (type === 'api-call') tooltip += ' — Synchronous request the app makes'
        if (type === 'delay') tooltip += ' — Async wait (webhook, polling, timer)'
        return (
          <ToolbarButton key={type} onClick={() => onAddNode(type)} title={tooltip}>
            <Icon size={14} />
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
}: FloatingCanvasToolbarProps) {
  return (
    <div className="absolute bottom-[16px] left-1/2 -translate-x-1/2 z-10 flex items-center gap-[2px] px-[var(--token-spacing-2)] py-[var(--token-spacing-1)] bg-shell-surface border border-shell-border rounded-[var(--token-radius-full)] shadow-lg">
      <NodeTypeButtons types={UI_TYPES} onAddNode={onAddNode} />
      <Divider />
      <NodeTypeButtons types={LOGIC_TYPES} onAddNode={onAddNode} />
      <Divider />
      <NodeTypeButtons types={META_TYPES} onAddNode={onAddNode} />
      <Divider />
      <ToolbarButton onClick={() => onUndo?.()} title="Undo (Ctrl+Z)" disabled={!canUndo}>
        <RiArrowGoBackLine size={14} />
      </ToolbarButton>
      <ToolbarButton onClick={() => onRedo?.()} title="Redo (Ctrl+Y)" disabled={!canRedo}>
        <RiArrowGoForwardLine size={14} />
      </ToolbarButton>
    </div>
  )
}
