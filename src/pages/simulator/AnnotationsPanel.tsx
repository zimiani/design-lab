import { useState, useEffect } from 'react'
import type { FlowScreen, Flow } from './flowRegistry'

interface AnnotationsPanelProps {
  flow: Flow
  currentScreen: FlowScreen
  screenIndex: number
}

export default function AnnotationsPanel({
  flow,
  currentScreen,
  screenIndex,
}: AnnotationsPanelProps) {
  const [specContent, setSpecContent] = useState<string | null>(null)

  useEffect(() => {
    if (flow.specPath) {
      fetch(flow.specPath)
        .then((r) => r.text())
        .then(setSpecContent)
        .catch(() => setSpecContent(null))
    }
  }, [flow.specPath])

  const handleExport = () => {
    const lines = [
      `# ${flow.name} — Flow Handoff`,
      '',
      `## Spec`,
      specContent ?? '_No spec available_',
      '',
      `## Screens (${flow.screens.length})`,
      ...flow.screens.map(
        (s, i) => `${i + 1}. **${s.title}** — ${s.description}`,
      ),
      '',
      `## Components Used`,
      ...Array.from(
        new Set(flow.screens.flatMap((s) => s.componentsUsed)),
      ).map((c) => `- ${c}`),
      '',
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${flow.id}-handoff.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <aside className="w-[300px] h-full shrink-0 overflow-y-auto border-l border-border-default bg-surface-primary">
      <div className="p-[var(--token-spacing-md)] border-b border-border-default flex items-center justify-between">
        <h2 className="text-[length:var(--token-font-size-caption)] leading-[var(--token-line-height-caption)] font-semibold text-text-tertiary uppercase tracking-wider">
          Annotations
        </h2>
        <button
          type="button"
          onClick={handleExport}
          className="text-[length:var(--token-font-size-caption)] text-interactive-default hover:text-interactive-hover font-medium cursor-pointer"
        >
          Export Flow
        </button>
      </div>

      <div className="p-[var(--token-spacing-md)]">
        {/* Current screen info */}
        <div className="mb-[var(--token-spacing-lg)]">
          <p className="text-[length:var(--token-font-size-caption)] text-text-tertiary uppercase tracking-wider mb-[var(--token-spacing-1)]">
            Screen {screenIndex + 1} of {flow.screens.length}
          </p>
          <h3 className="text-[length:var(--token-font-size-heading-sm)] font-medium text-text-primary">
            {currentScreen.title}
          </h3>
          <p className="text-[length:var(--token-font-size-body-sm)] text-text-secondary mt-[var(--token-spacing-1)]">
            {currentScreen.description}
          </p>
        </div>

        {/* Components used */}
        <div className="mb-[var(--token-spacing-lg)]">
          <p className="text-[length:var(--token-font-size-caption)] text-text-tertiary uppercase tracking-wider mb-[var(--token-spacing-2)]">
            Components
          </p>
          <div className="flex flex-wrap gap-[var(--token-spacing-1)]">
            {currentScreen.componentsUsed.map((c) => (
              <span
                key={c}
                className="px-[var(--token-spacing-2)] py-[1px] bg-surface-secondary rounded-[var(--token-radius-full)] text-[length:var(--token-font-size-caption)] text-text-secondary"
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* Flow metadata */}
        <div className="mb-[var(--token-spacing-lg)]">
          <p className="text-[length:var(--token-font-size-caption)] text-text-tertiary uppercase tracking-wider mb-[var(--token-spacing-2)]">
            Flow Info
          </p>
          <div className="flex flex-col gap-[var(--token-spacing-1)]">
            <div className="flex justify-between text-[length:var(--token-font-size-body-sm)]">
              <span className="text-text-secondary">Area</span>
              <span className="text-text-primary">{flow.area}</span>
            </div>
            <div className="flex justify-between text-[length:var(--token-font-size-body-sm)]">
              <span className="text-text-secondary">Total screens</span>
              <span className="text-text-primary">{flow.screens.length}</span>
            </div>
          </div>
        </div>

        {/* Spec content */}
        {specContent && (
          <div>
            <p className="text-[length:var(--token-font-size-caption)] text-text-tertiary uppercase tracking-wider mb-[var(--token-spacing-2)]">
              Spec
            </p>
            <pre className="text-[length:var(--token-font-size-caption)] text-text-secondary whitespace-pre-wrap bg-surface-secondary p-[var(--token-spacing-3)] rounded-[var(--token-radius-md)] max-h-[300px] overflow-y-auto">
              {specContent}
            </pre>
          </div>
        )}
      </div>
    </aside>
  )
}
