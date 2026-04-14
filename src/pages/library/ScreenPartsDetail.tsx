import { useMemo } from 'react'
import { getScreenParts, type ScreenPart } from '../../library/screen-parts-catalog'

export default function ScreenPartsDetail() {
  const parts = useMemo(() => getScreenParts(), [])

  // Group by flow → screen
  const grouped = useMemo(() => {
    const map = new Map<string, Map<string, ScreenPart[]>>()
    for (const part of parts) {
      if (!map.has(part.flow)) map.set(part.flow, new Map())
      const flowMap = map.get(part.flow)!
      if (!flowMap.has(part.screen)) flowMap.set(part.screen, [])
      flowMap.get(part.screen)!.push(part)
    }
    return map
  }, [parts])

  if (parts.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-[var(--token-spacing-32)]">
        <div className="text-center max-w-[400px]">
          <p className="text-shell-text-tertiary text-[length:var(--token-font-size-body-md)] leading-[var(--token-line-height-body-md)]">
            No screen parts found. As you create <code className="text-shell-text-secondary bg-shell-surface px-1 py-0.5 rounded text-[length:var(--token-font-size-body-sm)]">.parts.tsx</code> files in <code className="text-shell-text-secondary bg-shell-surface px-1 py-0.5 rounded text-[length:var(--token-font-size-body-sm)]">src/flows/</code>, they'll appear here automatically.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-[var(--token-spacing-32)]">
      <div className="max-w-[720px]">
        <h1 className="text-[length:var(--token-font-size-h1)] leading-[var(--token-line-height-h1)] font-semibold text-shell-text mb-[var(--token-spacing-8)]">
          Screen Parts
        </h1>
        <p className="text-[length:var(--token-font-size-body-md)] leading-[var(--token-line-height-body-md)] text-shell-text-secondary mb-[var(--token-spacing-32)]">
          One-time UI elements co-located with their parent screen. These are <strong>not reusable</strong> — if you need similar UI in another screen, extract it to <code className="bg-shell-surface px-1 py-0.5 rounded text-[length:var(--token-font-size-body-sm)]">src/library/</code>.
        </p>

        <div className="flex flex-col gap-[var(--token-spacing-32)]">
          {Array.from(grouped.entries()).map(([flow, screens]) => (
            <div key={flow}>
              <h2 className="text-[length:var(--token-font-size-h3)] leading-[var(--token-line-height-h3)] font-semibold text-shell-text mb-[var(--token-spacing-16)] capitalize">
                {flow}
              </h2>

              <div className="flex flex-col gap-[var(--token-spacing-16)]">
                {Array.from(screens.entries()).map(([screen, screenParts]) => (
                  <div key={screen} className="border border-shell-border rounded-[var(--token-radius-md)] overflow-hidden">
                    <div className="bg-shell-surface px-[var(--token-spacing-16)] py-[var(--token-spacing-12)] border-b border-shell-border">
                      <p className="text-[length:var(--token-font-size-body-sm)] leading-[var(--token-line-height-body-sm)] font-medium text-shell-text">
                        {screen}
                      </p>
                    </div>
                    <div className="divide-y divide-shell-border">
                      {screenParts.map((part) => (
                        <div
                          key={part.name}
                          className="px-[var(--token-spacing-16)] py-[var(--token-spacing-12)] flex items-center justify-between"
                        >
                          <code className="text-[length:var(--token-font-size-body-sm)] text-shell-text">
                            {part.name}
                          </code>
                          <span className="text-[length:var(--token-font-size-caption)] leading-[var(--token-line-height-caption)] text-shell-text-tertiary bg-shell-surface px-[var(--token-spacing-8)] py-[var(--token-spacing-4)] rounded-[var(--token-radius-sm)]">
                            screen-only · do not reuse
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
