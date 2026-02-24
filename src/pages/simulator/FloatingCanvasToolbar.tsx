import { Monitor, GitBranch, AlertTriangle, Undo2, Redo2 } from 'lucide-react'
import type { FlowNodeType } from './flowGraph.types'

interface FloatingCanvasToolbarProps {
  onAddNode: (type: FlowNodeType) => void
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

export default function FloatingCanvasToolbar({
  onAddNode,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
}: FloatingCanvasToolbarProps) {
  return (
    <div className="absolute bottom-[16px] left-1/2 -translate-x-1/2 z-10 flex items-center gap-[2px] px-[var(--token-spacing-2)] py-[var(--token-spacing-1)] bg-shell-surface border border-shell-border rounded-[var(--token-radius-full)] shadow-lg">
      {/* Node creation tools */}
      <ToolbarButton onClick={() => onAddNode('screen')} title="Add Screen (S)">
        <Monitor size={14} />
      </ToolbarButton>
      <ToolbarButton onClick={() => onAddNode('decision')} title="Add Decision (D)">
        <GitBranch size={14} />
      </ToolbarButton>
      <ToolbarButton onClick={() => onAddNode('error')} title="Add Error State (E)">
        <AlertTriangle size={14} />
      </ToolbarButton>

      <Divider />

      {/* Undo / Redo */}
      <ToolbarButton onClick={() => onUndo?.()} title="Undo (Ctrl+Z)" disabled={!canUndo}>
        <Undo2 size={14} />
      </ToolbarButton>
      <ToolbarButton onClick={() => onRedo?.()} title="Redo (Ctrl+Y)" disabled={!canRedo}>
        <Redo2 size={14} />
      </ToolbarButton>
    </div>
  )
}
