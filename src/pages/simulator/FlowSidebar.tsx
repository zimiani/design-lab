import { getFlowsByArea, type Flow } from './flowRegistry'

interface FlowSidebarProps {
  selectedFlowId: string | null
  onSelect: (flowId: string) => void
}

export default function FlowSidebar({ selectedFlowId, onSelect }: FlowSidebarProps) {
  const grouped = getFlowsByArea()
  const areas = Object.keys(grouped)

  return (
    <aside className="w-[240px] h-full shrink-0 overflow-y-auto border-r border-border-default bg-surface-primary">
      <div className="p-[var(--token-spacing-md)]">
        <h2 className="text-[length:var(--token-font-size-caption)] leading-[var(--token-line-height-caption)] font-semibold text-text-tertiary uppercase tracking-wider mb-[var(--token-spacing-3)]">
          Flows
        </h2>
      </div>

      {areas.length === 0 && (
        <p className="px-[var(--token-spacing-md)] text-[length:var(--token-font-size-body-sm)] text-text-tertiary">
          No flows registered yet
        </p>
      )}

      {areas.map((area) => (
        <div key={area} className="mb-[var(--token-spacing-2)]">
          <p className="px-[var(--token-spacing-md)] py-[var(--token-spacing-1)] text-[length:var(--token-font-size-caption)] font-medium text-text-tertiary uppercase tracking-wider">
            {area}
          </p>
          {grouped[area].map((flow: Flow) => (
            <button
              key={flow.id}
              type="button"
              onClick={() => onSelect(flow.id)}
              className={`
                w-full text-left px-[var(--token-spacing-md)] py-[var(--token-spacing-2)]
                text-[length:var(--token-font-size-body-sm)] leading-[var(--token-line-height-body-sm)]
                transition-colors duration-[var(--token-transition-fast)] cursor-pointer
                ${
                  selectedFlowId === flow.id
                    ? 'bg-brand-50 text-interactive-default font-medium'
                    : 'text-text-primary hover:bg-surface-secondary'
                }
              `}
            >
              {flow.name}
              <span className="block text-[length:var(--token-font-size-caption)] text-text-tertiary">
                {flow.screens.length} screens
              </span>
            </button>
          ))}
        </div>
      ))}
    </aside>
  )
}
