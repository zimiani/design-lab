export interface ScreenPart {
  /** Named export identifier */
  name: string
  /** Parent screen file (without .parts.tsx) */
  screen: string
  /** Flow domain (e.g. "deposit-v2", "withdrawal") */
  flow: string
  /** Full import path */
  path: string
}

/**
 * Auto-discovers all .parts.tsx files under src/flows/.
 * Uses Vite's import.meta.glob for zero-config discovery.
 */
export function getScreenParts(): ScreenPart[] {
  const modules = import.meta.glob('/src/flows/**/*.parts.tsx', { eager: true })
  const parts: ScreenPart[] = []

  for (const [path, mod] of Object.entries(modules)) {
    const module = mod as Record<string, unknown>
    // Extract flow name from path: /src/flows/{flow}/...
    const flowMatch = path.match(/\/src\/flows\/([^/]+)\//)
    const flow = flowMatch?.[1] ?? 'unknown'

    // Extract screen name: remove .parts.tsx, take filename
    const screenMatch = path.match(/\/([^/]+)\.parts\.tsx$/)
    const screen = screenMatch?.[1] ?? 'unknown'

    // Collect all named exports that look like components (PascalCase functions)
    for (const [exportName, exportValue] of Object.entries(module)) {
      if (
        exportName === 'default' ||
        typeof exportValue !== 'function' ||
        exportName[0] !== exportName[0].toUpperCase()
      ) continue

      parts.push({ name: exportName, screen, flow, path })
    }
  }

  return parts.sort((a, b) => a.flow.localeCompare(b.flow) || a.screen.localeCompare(b.screen))
}
