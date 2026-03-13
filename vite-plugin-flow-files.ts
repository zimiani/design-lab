/**
 * Vite dev plugin: creates new screen .tsx files on the fly.
 *
 * POST /__flow-api/create-screen
 * Body: { flowId: string, screenIndex: number, title: string }
 * Response: { filePath: string }
 *
 * The scaffold follows PATTERNS.md (BaseLayout + Header + Text + StickyFooter + Button).
 * Vite's file watcher detects the new file and triggers HMR.
 */

import { writeFileSync, readFileSync, mkdirSync, existsSync, unlinkSync, readdirSync, rmdirSync, copyFileSync } from 'node:fs'
import { resolve, dirname, basename, extname, relative } from 'node:path'
import type { Plugin, Connect } from 'vite'

function toPascalCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('')
}

function formatScreenMetaComment(title: string, description: string): string {
  let block = `/**\n * @screen ${title}`
  if (description) {
    // Word-wrap description at ~80 chars with " *   " continuation
    const words = description.split(/\s+/)
    let line = ''
    const lines: string[] = []
    for (const word of words) {
      if (line && (line + ' ' + word).length > 72) {
        lines.push(line)
        line = word
      } else {
        line = line ? line + ' ' + word : word
      }
    }
    if (line) lines.push(line)
    block += `\n * @description ${lines[0]}`
    for (let i = 1; i < lines.length; i++) {
      block += `\n *   ${lines[i]}`
    }
  }
  block += '\n */\n'
  return block
}

const SCREEN_META_REGEX = /^\/\*\*\s*\n(?:\s*\*[^\n]*\n)*?\s*\*\s*@screen\s[^\n]*\n(?:\s*\*[^\n]*\n)*?\s*\*\/\n/

function updateScreenMetaInSource(source: string, title: string, description: string): string {
  const comment = formatScreenMetaComment(title, description)
  if (SCREEN_META_REGEX.test(source)) {
    return source.replace(SCREEN_META_REGEX, comment)
  }
  return comment + source
}

function createScreenScaffold(title?: string, description?: string): string {
  const metaBlock = title ? formatScreenMetaComment(title, description ?? '') : ''
  return `${metaBlock}import type { FlowScreenProps } from '@/pages/simulator/flowRegistry'
import BaseLayout from '@/library/layout/BaseLayout'
import StickyFooter from '@/library/layout/StickyFooter'
import Header from '@/library/navigation/Header'
import Button from '@/library/inputs/Button'
import Text from '@/library/foundations/Text'
import Stack from '@/library/layout/Stack'

export default function Screen({ onNext, onBack, screenTitle, screenDescription }: FlowScreenProps) {
  return (
    <BaseLayout>
      <Header title={screenTitle ?? 'New Screen'} onBack={onBack} />
      <Stack>
        {screenDescription ? (
          <Text variant="body">{screenDescription}</Text>
        ) : (
          <Text variant="body" color="content-tertiary">No description yet. Edit this screen or update the description in the flow canvas sidebar.</Text>
        )}
      </Stack>
      <StickyFooter>
        <Button variant="primary" size="lg" onPress={onNext} fullWidth>
          Continuar
        </Button>
      </StickyFooter>
    </BaseLayout>
  )
}
`
}

function createErrorScreenScaffold(title?: string, description?: string): string {
  const metaBlock = title ? formatScreenMetaComment(title, description ?? '') : ''
  return `${metaBlock}import type { FlowScreenProps } from '@/pages/simulator/flowRegistry'
import FeedbackLayout from '@/library/layout/FeedbackLayout'
import StickyFooter from '@/library/layout/StickyFooter'
import Button from '@/library/inputs/Button'
import Text from '@/library/foundations/Text'
import Stack from '@/library/layout/Stack'

export default function Screen({ onNext, onBack, screenTitle, screenDescription }: FlowScreenProps) {
  return (
    <FeedbackLayout animation={null} onClose={onBack}>
      <Stack>
        <Text variant="heading-lg">{screenTitle ?? 'Error'}</Text>
        <Text variant="body-md" color="content-secondary">
          {screenDescription ?? 'Something went wrong. Please try again.'}
        </Text>
      </Stack>
      <StickyFooter>
        <Button variant="primary" size="lg" onPress={onNext} fullWidth>
          Tentar novamente
        </Button>
      </StickyFooter>
    </FeedbackLayout>
  )
}
`
}

const MAX_BODY_SIZE = 512 * 1024 // 512 KB

/** Create a JSON POST endpoint handler with body parsing, size limit, and error handling. */
function createJsonEndpoint(
  path: string,
  handler: (body: Record<string, unknown>) => { status?: number; data: unknown },
): [string, Connect.NextHandleFunction] {
  return [
    path,
    ((req: Connect.IncomingMessage, res: import('node:http').ServerResponse, next: Connect.NextFunction) => {
      if (req.method !== 'POST') { next(); return }

      let body = ''
      let size = 0
      req.on('data', (chunk: Buffer) => {
        size += chunk.length
        if (size > MAX_BODY_SIZE) {
          res.writeHead(413, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Request body too large' }))
          req.destroy()
          return
        }
        body += chunk.toString()
      })
      req.on('error', (err) => {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: String(err) }))
      })
      req.on('end', () => {
        try {
          const parsed = JSON.parse(body)
          const result = handler(parsed)
          res.writeHead(result.status ?? 200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify(result.data))
        } catch (err) {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: String(err) }))
        }
      })
    }) as Connect.NextHandleFunction,
  ]
}

export default function flowFilesPlugin(): Plugin {
  let projectRoot = ''

  return {
    name: 'vite-plugin-flow-files',
    apply: 'serve', // dev only

    configResolved(config) {
      projectRoot = config.root
    },

    configureServer(server) {
      // Create screen
      server.middlewares.use(...createJsonEndpoint('/__flow-api/create-screen', (body) => {
        const { flowId, screenIndex, title, description } = body as {
          flowId: string; screenIndex: number; title: string; description?: string
        }
        const pascal = toPascalCase(title)
        const fileName = `Screen${screenIndex}_${pascal}.tsx`
        const relativePath = `${flowId}/${fileName}`
        const absolutePath = resolve(projectRoot, 'src', 'flows', flowId, fileName)

        const dir = dirname(absolutePath)
        if (!existsSync(dir)) mkdirSync(dir, { recursive: true })

        if (existsSync(absolutePath)) {
          return { data: { filePath: relativePath, existed: true } }
        }

        writeFileSync(absolutePath, createScreenScaffold(title, description), 'utf-8')
        return { data: { filePath: relativePath, existed: false } }
      }))

      // Create error screen (FeedbackLayout scaffold)
      server.middlewares.use(...createJsonEndpoint('/__flow-api/create-error-screen', (body) => {
        const { flowId, screenIndex, title, description } = body as {
          flowId: string; screenIndex: number; title: string; description?: string
        }
        const pascal = toPascalCase(title)
        const fileName = `Screen${screenIndex}_${pascal}.tsx`
        const relativePath = `${flowId}/${fileName}`
        const absolutePath = resolve(projectRoot, 'src', 'flows', flowId, fileName)

        const dir = dirname(absolutePath)
        if (!existsSync(dir)) mkdirSync(dir, { recursive: true })

        if (existsSync(absolutePath)) {
          return { data: { filePath: relativePath, existed: true } }
        }

        writeFileSync(absolutePath, createErrorScreenScaffold(title, description), 'utf-8')
        return { data: { filePath: relativePath, existed: false } }
      }))

      // Delete screen
      server.middlewares.use(...createJsonEndpoint('/__flow-api/delete-screen', (body) => {
        const { filePath } = body as { filePath: string }
        const absolutePath = resolve(projectRoot, 'src', 'flows', filePath)

        if (!existsSync(absolutePath)) {
          return { data: { deleted: false, reason: 'not found' } }
        }

        unlinkSync(absolutePath)
        const dir = dirname(absolutePath)
        try {
          if (readdirSync(dir).length === 0) rmdirSync(dir)
        } catch { /* ignore */ }

        return { data: { deleted: true } }
      }))

      // Write index.ts
      server.middlewares.use(...createJsonEndpoint('/__flow-api/write-index', (body) => {
        const { flowId, content, force } = body as { flowId: string; content: string; force?: boolean }
        const absolutePath = resolve(projectRoot, 'src', 'flows', flowId, 'index.ts')

        if (existsSync(absolutePath) && !force) {
          return { data: { written: false, reason: 'exists' } }
        }

        const dir = dirname(absolutePath)
        if (!existsSync(dir)) mkdirSync(dir, { recursive: true })

        writeFileSync(absolutePath, content, 'utf-8')
        return { data: { written: true } }
      }))

      // Update screen meta
      server.middlewares.use(...createJsonEndpoint('/__flow-api/update-screen-meta', (body) => {
        const { filePath, title, description } = body as { filePath: string; title: string; description: string }
        const absolutePath = resolve(projectRoot, 'src', 'flows', filePath)

        if (!existsSync(absolutePath)) {
          return { status: 404, data: { updated: false, reason: 'not found' } }
        }

        const source = readFileSync(absolutePath, 'utf-8')
        const updated = updateScreenMetaInSource(source, title, description)
        writeFileSync(absolutePath, updated, 'utf-8')
        return { data: { updated: true } }
      }))

      // Copy screen file to a new flow directory
      server.middlewares.use(...createJsonEndpoint('/__flow-api/copy-screen', (body) => {
        const { sourceFilePath, targetFlowId, targetFileName } = body as {
          sourceFilePath: string; targetFlowId: string; targetFileName?: string
        }
        const sourcePath = resolve(projectRoot, 'src', 'flows', sourceFilePath)

        if (!existsSync(sourcePath)) {
          return { status: 404, data: { filePath: null, reason: 'source not found' } }
        }

        const fileName = targetFileName ?? basename(sourceFilePath)
        const relativePath = `${targetFlowId}/${fileName}`
        const targetPath = resolve(projectRoot, 'src', 'flows', targetFlowId, fileName)

        const dir = dirname(targetPath)
        if (!existsSync(dir)) mkdirSync(dir, { recursive: true })

        // Copy .parts.tsx companion file if it exists
        const ext = extname(fileName)
        const baseName = fileName.slice(0, -ext.length)
        const partsFileName = `${baseName}.parts${ext}`
        const sourcePartsPath = resolve(dirname(sourcePath), partsFileName)
        if (existsSync(sourcePartsPath)) {
          copyFileSync(sourcePartsPath, resolve(dir, partsFileName))
        }

        // Read source, rewrite relative imports to use @ alias so they work at any depth
        const srcDir = dirname(sourcePath)
        const srcRoot = resolve(projectRoot, 'src')
        let content = readFileSync(sourcePath, 'utf-8')
        content = content.replace(
          /from\s+['"](\.\.[/\\])+/g,
          (match) => {
            // Count how many ../ segments there are
            const dots = match.match(/\.\./g)!.length
            // Resolve what the relative path points to from the source directory
            const resolvedBase = resolve(srcDir, '../'.repeat(dots))
            // If it resolves to within src/, rewrite to @/
            const rel = relative(srcRoot, resolvedBase)
            if (!rel.startsWith('..')) {
              return `from '@/${rel ? rel + '/' : ''}`
            }
            return match
          },
        )
        writeFileSync(targetPath, content, 'utf-8')

        // Also rewrite .parts.tsx if copied
        const partsTarget = resolve(dir, partsFileName)
        if (existsSync(partsTarget)) {
          let partsContent = readFileSync(partsTarget, 'utf-8')
          partsContent = partsContent.replace(
            /from\s+['"](\.\.[/\\])+/g,
            (match) => {
              const dots = match.match(/\.\./g)!.length
              const resolvedBase = resolve(srcDir, '../'.repeat(dots))
              const rel = relative(srcRoot, resolvedBase)
              if (!rel.startsWith('..')) {
                return `from '@/${rel ? rel + '/' : ''}`
              }
              return match
            },
          )
          writeFileSync(partsTarget, partsContent, 'utf-8')
        }

        return { data: { filePath: relativePath } }
      }))
    },
  }
}
