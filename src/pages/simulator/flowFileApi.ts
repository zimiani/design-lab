/**
 * Browser client for the Vite dev plugin that creates/deletes screen .tsx files.
 * Only works in dev mode (the plugin adds middleware endpoints).
 */

/** Generic fetch helper for the flow file API. Returns null in production or on error. */
async function fetchFlowApi<T>(endpoint: string, body: object): Promise<T | null> {
  if (!import.meta.env.DEV) return null
  try {
    const res = await fetch(`/__flow-api/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    console.warn(`[flowFileApi] Failed: ${endpoint}`)
    return null
  }
}

/**
 * Create a new screen .tsx scaffold on disk.
 * Returns the relative filePath (e.g. 'my-flow/Screen1_MyScreen.tsx').
 */
export async function createScreenFile(
  flowId: string,
  screenIndex: number,
  title: string,
): Promise<string | null> {
  const data = await fetchFlowApi<{ filePath: string; existed: boolean }>(
    'create-screen',
    { flowId, screenIndex, title },
  )
  return data?.filePath ?? null
}

/**
 * Update the @screen/@description comment block at the top of a screen .tsx file.
 * Fire-and-forget — returns false in production or on error.
 */
export async function updateScreenMeta(
  filePath: string,
  title: string,
  description: string,
): Promise<boolean> {
  const data = await fetchFlowApi<{ updated: boolean }>(
    'update-screen-meta',
    { filePath, title, description },
  )
  return data?.updated ?? false
}

/**
 * Write an index.ts for a flow.
 * Returns { written: true } on success, { written: false, reason } if file exists (and force=false).
 */
export async function writeFlowIndex(
  flowId: string,
  content: string,
  force = false,
): Promise<{ written: boolean; reason?: string } | null> {
  return fetchFlowApi<{ written: boolean; reason?: string }>(
    'write-index',
    { flowId, content, force },
  )
}

/**
 * Delete a screen .tsx file from disk.
 * filePath is relative, e.g. 'my-flow/Screen1_MyScreen.tsx'.
 */
export async function deleteScreenFile(filePath: string): Promise<boolean> {
  const data = await fetchFlowApi<{ deleted: boolean }>(
    'delete-screen',
    { filePath },
  )
  return data?.deleted ?? false
}

/**
 * Copy a screen .tsx file (and its .parts.tsx companion) to a new flow directory.
 * Returns the new relative filePath, e.g. 'new-flow/Screen1_MyScreen.tsx'.
 */
export async function copyScreenFile(
  sourceFilePath: string,
  targetFlowId: string,
  targetFileName?: string,
): Promise<string | null> {
  const data = await fetchFlowApi<{ filePath: string | null }>(
    'copy-screen',
    { sourceFilePath, targetFlowId, targetFileName },
  )
  return data?.filePath ?? null
}
