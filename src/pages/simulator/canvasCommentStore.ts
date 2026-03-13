/**
 * Canvas comment persistence — localStorage with Supabase sync via Pull/Push.
 */

import { supabase, isSupabaseConnected } from '../../lib/supabase'
import { markUnsynced } from '../../lib/syncStore'

export interface CanvasComment {
  id: string
  flowId: string
  x: number // canvas-space coordinates (pre-transform)
  y: number
  text: string
  createdAt: string
}

const STORAGE_KEY = 'picnic-design-lab:canvas-comments'

// ── localStorage layer ──

function readAll(): Record<string, CanvasComment[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function writeAll(data: Record<string, CanvasComment[]>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

// ── Public API ──

export function getComments(flowId: string): CanvasComment[] {
  return readAll()[flowId] ?? []
}

export function addComment(comment: CanvasComment): void {
  const all = readAll()
  const list = all[comment.flowId] ?? []
  list.push(comment)
  all[comment.flowId] = list
  writeAll(all)
  markUnsynced()
}

export function deleteComment(flowId: string, commentId: string): void {
  const all = readAll()
  const list = all[flowId] ?? []
  all[flowId] = list.filter(c => c.id !== commentId)
  writeAll(all)
  markUnsynced()
}

export function updateCommentText(flowId: string, commentId: string, text: string): void {
  const all = readAll()
  const list = all[flowId] ?? []
  const comment = list.find(c => c.id === commentId)
  if (comment) {
    comment.text = text
    writeAll(all)
    markUnsynced()
  }
}

/** Pull all canvas comments from Supabase into localStorage. */
export async function hydrateCommentsFromSupabase(): Promise<boolean> {
  if (!isSupabaseConnected() || !supabase) return false
  try {
    const { data, error } = await supabase.from('canvas_comments').select('flow_id, comments')
    if (error) { console.error('[canvasCommentStore] hydrate error:', error.message); return false }
    if (!data || data.length === 0) return true

    const all = readAll()
    for (const row of data) {
      try {
        all[row.flow_id] = JSON.parse(row.comments)
      } catch { /* skip malformed */ }
    }
    writeAll(all)
    return true
  } catch {
    return false
  }
}

/** Get all comments for push (used by syncStore). */
export function getAllCommentEntries(): { flowId: string; comments: CanvasComment[] }[] {
  const all = readAll()
  return Object.entries(all).map(([flowId, comments]) => ({ flowId, comments }))
}
