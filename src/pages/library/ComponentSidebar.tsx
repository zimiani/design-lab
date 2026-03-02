import { getComponentsByCategory, type ComponentMeta } from '../../library/registry'

interface ComponentSidebarProps {
  selected: string | null
  onSelect: (name: string) => void
}

const foundations = [
  { key: 'Colors', label: 'Colors' },
  { key: 'Typography', label: 'Typography' },
  { key: 'Spacing', label: 'Spacing' },
  { key: 'Radii', label: 'Radii' },
  { key: 'Icons', label: 'Icons' },
] as const

const componentCategories: { key: ComponentMeta['category']; label: string }[] = [
  { key: 'presentation', label: 'Presentation' },
  { key: 'navigation', label: 'Navigation' },
  { key: 'actions', label: 'Actions' },
  { key: 'inputs', label: 'Inputs' },
  { key: 'feedback', label: 'Feedback' },
  { key: 'layout', label: 'Layout' },
]

const patterns = [
  { key: 'FormWithValidation', label: 'Form with Validation' },
  { key: 'ListWithSearch', label: 'List with Search' },
  { key: 'ConfirmationFlow', label: 'Confirmation Flow' },
  { key: 'EmptyToLoaded', label: 'Empty → Loaded' },
  { key: 'SettingsGroup', label: 'Settings Group' },
  { key: 'CurrencyConversion', label: 'Currency Conversion' },
] as const

export default function ComponentSidebar({ selected, onSelect }: ComponentSidebarProps) {
  return (
    <aside className="w-[240px] h-full shrink-0 overflow-y-auto border-r border-shell-border bg-shell-surface">
      <div className="p-[var(--token-spacing-md)]">
        <h2 className="text-[length:var(--token-font-size-caption)] leading-[var(--token-line-height-caption)] font-semibold text-shell-text-tertiary uppercase tracking-wider mb-[var(--token-spacing-3)]">
          Design System
        </h2>
      </div>

      {/* Foundations */}
      <div className="mb-[var(--token-spacing-2)]">
        <p className="px-[var(--token-spacing-md)] py-[var(--token-spacing-1)] text-[length:var(--token-font-size-caption)] font-medium text-shell-text-tertiary uppercase tracking-wider">
          Foundations
        </p>
        {foundations.map((f) => {
          const id = `foundation:${f.key}`
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => onSelect(id)}
              className={`
                w-full text-left px-[var(--token-spacing-md)] py-[var(--token-spacing-2)]
                text-[length:var(--token-font-size-body-sm)] leading-[var(--token-line-height-body-sm)]
                transition-colors duration-[var(--token-transition-fast)] cursor-pointer
                ${
                  selected === id
                    ? 'bg-shell-selected text-shell-selected-text font-medium'
                    : 'text-shell-text hover:bg-shell-hover'
                }
              `}
            >
              {f.label}
            </button>
          )
        })}
      </div>

      {/* Components */}
      {componentCategories.map(({ key, label }) => {
        const components = getComponentsByCategory(key)
        if (components.length === 0) return null
        return (
          <div key={key} className="mb-[var(--token-spacing-2)]">
            <p className="px-[var(--token-spacing-md)] py-[var(--token-spacing-1)] text-[length:var(--token-font-size-caption)] font-medium text-shell-text-tertiary uppercase tracking-wider">
              {label}
            </p>
            {components.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => onSelect(c.name)}
                className={`
                  w-full text-left px-[var(--token-spacing-md)] py-[var(--token-spacing-2)]
                  text-[length:var(--token-font-size-body-sm)] leading-[var(--token-line-height-body-sm)]
                  transition-colors duration-[var(--token-transition-fast)] cursor-pointer
                  ${
                    selected === c.name
                      ? 'bg-shell-selected text-shell-selected-text font-medium'
                      : 'text-shell-text hover:bg-shell-hover'
                  }
                `}
              >
                {c.name}
              </button>
            ))}
          </div>
        )
      })}

      {/* Screen Parts */}
      <div className="mb-[var(--token-spacing-2)]">
        <button
          type="button"
          onClick={() => onSelect('screen-parts')}
          className={`
            w-full text-left px-[var(--token-spacing-md)] py-[var(--token-spacing-1)]
            text-[length:var(--token-font-size-caption)] font-medium uppercase tracking-wider
            transition-colors duration-[var(--token-transition-fast)] cursor-pointer
            ${
              selected === 'screen-parts'
                ? 'text-shell-selected-text'
                : 'text-shell-text-tertiary hover:text-shell-text-secondary'
            }
          `}
        >
          Screen Parts
        </button>
      </div>

      {/* Patterns */}
      <div className="mb-[var(--token-spacing-2)]">
        <p className="px-[var(--token-spacing-md)] py-[var(--token-spacing-1)] text-[length:var(--token-font-size-caption)] font-medium text-shell-text-tertiary uppercase tracking-wider">
          Patterns
        </p>
        {patterns.map((p) => {
          const id = `pattern:${p.key}`
          return (
            <button
              key={p.key}
              type="button"
              onClick={() => onSelect(id)}
              className={`
                w-full text-left px-[var(--token-spacing-md)] py-[var(--token-spacing-2)]
                text-[length:var(--token-font-size-body-sm)] leading-[var(--token-line-height-body-sm)]
                transition-colors duration-[var(--token-transition-fast)] cursor-pointer
                ${
                  selected === id
                    ? 'bg-shell-selected text-shell-selected-text font-medium'
                    : 'text-shell-text hover:bg-shell-hover'
                }
              `}
            >
              {p.label}
            </button>
          )
        })}
      </div>
    </aside>
  )
}
