import { useState, useCallback, useEffect, useRef } from 'react'
import { tokenCategories, semanticCategories, type TokenMeta, type SemanticTokenMeta } from '../../tokens/tokenMeta'
import { setTokenVar, resetTokenVar } from '../../tokens'
import {
  getLocalTokenOverrides,
  setTokenOverride,
  resetTokenOverride,
  resetTokenCategory,
  hydrateTokensFromSupabase,
  subscribeToTokenChanges,
  getSemanticOverrides,
  setSemanticOverride,
  resetSemanticOverride,
  applySemanticOverrides,
} from '../../lib/tokenStore'
import { isSupabaseConnected } from '../../lib/supabase'

/* ── Base color tokens flat list (for the semantic picker) ── */

const baseColorTokens = tokenCategories
  .filter((c) => c.group === 'Base Colors')
  .flatMap((c) =>
    c.tokens.map((t) => ({ cssVar: t.cssVar, label: `${c.label} · ${t.label}`, hex: t.defaultValue }))
  )

function getBaseHex(baseCssVar: string): string {
  // Try computed first, fall back to defaultValue from metadata
  const computed = getComputedStyle(document.documentElement)
    .getPropertyValue(`--token-${baseCssVar}`)
    .trim()
  if (computed) return computed
  return baseColorTokens.find((t) => t.cssVar === baseCssVar)?.hex ?? '#000000'
}

/* ── Semantic token input ── */

function SemanticTokenInput({
  token,
  currentBase,
  onChange,
  onReset,
}: {
  token: SemanticTokenMeta
  currentBase: string
  onChange: (base: string) => void
  onReset: () => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isOverridden = currentBase !== token.defaultBase
  const hex = getBaseHex(currentBase)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <div className="flex items-center gap-[var(--token-spacing-8)]">
        {/* Color swatch — click to open picker */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="w-[20px] h-[20px] rounded-[4px] border border-shell-border shrink-0 cursor-pointer hover:scale-110 transition-transform"
          style={{ backgroundColor: hex }}
          title={`--token-${currentBase}`}
        />
        <span className="flex-1 text-[length:var(--token-font-size-caption)] text-shell-text-secondary truncate">
          {token.label}
        </span>
        <span className="text-[length:9px] font-mono text-shell-text-tertiary truncate max-w-[72px]" title={`--token-${currentBase}`}>
          {currentBase}
        </span>
        {isOverridden && (
          <button
            type="button"
            onClick={onReset}
            className="text-[length:var(--token-font-size-caption)] text-shell-text-tertiary hover:text-shell-text-secondary cursor-pointer shrink-0"
          >
            Reset
          </button>
        )}
      </div>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-[4px] w-[248px] bg-shell-surface border border-shell-border rounded-[var(--token-radius-md)] shadow-lg overflow-hidden">
          <div className="max-h-[360px] overflow-y-auto">
            {tokenCategories.filter((c) => c.group === 'Base Colors').map((cat) => (
              <div key={cat.label}>
                <div className="px-[var(--token-spacing-12)] py-[var(--token-spacing-4)] bg-shell-bg sticky top-0">
                  <span className="text-[length:9px] font-semibold text-shell-text-tertiary uppercase tracking-wider">
                    {cat.label}
                  </span>
                </div>
                {cat.tokens.map((t) => {
                  const isSelected = t.cssVar === currentBase
                  return (
                    <button
                      key={t.cssVar}
                      type="button"
                      onClick={() => { onChange(t.cssVar); setOpen(false) }}
                      className={`w-full flex items-center gap-[var(--token-spacing-8)] px-[var(--token-spacing-12)] py-[6px] text-left cursor-pointer transition-colors ${isSelected ? 'bg-shell-hover' : 'hover:bg-shell-hover'}`}
                    >
                      <span
                        className="w-[16px] h-[16px] rounded-[3px] shrink-0 border border-black/10"
                        style={{ backgroundColor: t.defaultValue }}
                      />
                      <span className="flex-1 text-[length:var(--token-font-size-caption)] font-mono text-shell-text truncate">
                        {t.cssVar}
                      </span>
                      <span className="text-[length:9px] font-mono text-shell-text-tertiary shrink-0">
                        {t.defaultValue}
                      </span>
                      {isSelected && (
                        <span className="text-shell-selected-text text-[length:10px]">✓</span>
                      )}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Base token input ── */

function TokenInput({ token, initialValue }: { token: TokenMeta; initialValue: string }) {
  const [value, setValue] = useState(initialValue)

  const handleChange = useCallback(
    (newVal: string) => {
      setValue(newVal)
      setTokenVar(token.cssVar, newVal)
      setTokenOverride(token.cssVar, newVal)
    },
    [token.cssVar],
  )

  const handleReset = useCallback(() => {
    setValue(token.defaultValue)
    resetTokenVar(token.cssVar)
    resetTokenOverride(token.cssVar)
  }, [token.cssVar, token.defaultValue])

  if (token.type === 'color') {
    return (
      <div className="flex items-center gap-[var(--token-spacing-8)]">
        <input
          type="color"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          className="w-[20px] h-[20px] rounded-[4px] border border-shell-border cursor-pointer shrink-0 p-0"
        />
        <span className="flex-1 text-[length:var(--token-font-size-caption)] text-shell-text-secondary font-mono truncate">
          {token.label}
        </span>
        <button
          type="button"
          onClick={handleReset}
          className="text-[length:var(--token-font-size-caption)] text-shell-text-tertiary hover:text-shell-text-secondary cursor-pointer shrink-0"
        >
          Reset
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-[var(--token-spacing-8)]">
      <span className="flex-1 text-[length:var(--token-font-size-caption)] text-shell-text-secondary truncate">
        {token.label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        className="w-[64px] px-[var(--token-spacing-8)] py-[1px] text-[length:var(--token-font-size-caption)] text-shell-text bg-shell-input border border-shell-border rounded-[var(--token-radius-sm)] text-right"
      />
      <button
        type="button"
        onClick={handleReset}
        className="text-[length:var(--token-font-size-caption)] text-shell-text-tertiary hover:text-shell-text-secondary cursor-pointer shrink-0"
      >
        Reset
      </button>
    </div>
  )
}

/* ── Export ── */

function exportTokens() {
  const style = document.documentElement.style
  const cssLines: string[] = [':root {']
  const tsLines: string[] = ['export const tokens = {']

  for (const cat of tokenCategories) {
    for (const t of cat.tokens) {
      const val = style.getPropertyValue(`--token-${t.cssVar}`)?.trim() || t.defaultValue
      cssLines.push(`  --token-${t.cssVar}: ${val};`)
      const key = t.cssVar.replace(/-/g, '_')
      tsLines.push(`  '${key}': '${val}',`)
    }
  }

  cssLines.push('}')
  tsLines.push('} as const')

  const content = `/* CSS Custom Properties */\n${cssLines.join('\n')}\n\n/* TypeScript Constants */\n${tsLines.join('\n')}\n`
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'design-tokens.txt'
  a.click()
  URL.revokeObjectURL(url)
}

/* ── Main component ── */

export default function TokenEditor({ scrollToGroup }: { scrollToGroup?: string }) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [overrides, setOverrides] = useState<Record<string, string>>(getLocalTokenOverrides)
  const [semanticOverrides, setSemanticOverrides] = useState<Record<string, string>>(getSemanticOverrides)
  const asideRef = useRef<HTMLElement>(null)

  useEffect(() => {
    // Apply base token overrides
    const local = getLocalTokenOverrides()
    for (const [cssVar, value] of Object.entries(local)) {
      document.documentElement.style.setProperty(`--token-${cssVar}`, value)
    }

    // Apply semantic overrides
    applySemanticOverrides()

    // Hydrate from Supabase
    hydrateTokensFromSupabase().then((hydrated) => {
      if (hydrated) setOverrides(getLocalTokenOverrides())
    })

    const unsub = subscribeToTokenChanges(() => {
      setOverrides(getLocalTokenOverrides())
    })

    return () => { unsub?.() }
  }, [])

  useEffect(() => {
    if (!scrollToGroup || !asideRef.current) return
    const target = asideRef.current.querySelector(`[data-token-group="${scrollToGroup}"]`)
    if (target) {
      // Small delay so layout is settled
      setTimeout(() => target.scrollIntoView({ block: 'start' }), 50)
    }
  }, [scrollToGroup])

  const handleResetCategory = (label: string) => {
    const cat = tokenCategories.find((c) => c.label === label)
    if (cat) {
      const vars = cat.tokens.map((t) => t.cssVar)
      cat.tokens.forEach((t) => resetTokenVar(t.cssVar))
      resetTokenCategory(vars)
      setOverrides(getLocalTokenOverrides())
    }
  }

  const handleSemanticChange = (cssVar: string, base: string) => {
    setSemanticOverride(cssVar, base)
    setSemanticOverrides(getSemanticOverrides())
  }

  const handleSemanticReset = (cssVar: string) => {
    resetSemanticOverride(cssVar)
    setSemanticOverrides(getSemanticOverrides())
  }

  const supabaseStatus = isSupabaseConnected()
  const groups = Array.from(new Set(tokenCategories.map((c) => c.group)))
  const byGroup = Object.fromEntries(
    groups.map((g) => [g, tokenCategories.filter((c) => c.group === g)])
  )

  return (
    <aside ref={asideRef} className="w-[280px] h-full shrink-0 overflow-y-auto border-l border-shell-border bg-shell-surface">
      <div className="p-[var(--token-gap-lg)] flex items-center justify-between">
        <div className="flex items-center gap-[var(--token-spacing-8)]">
          <h2 className="text-[length:var(--token-font-size-caption)] leading-[var(--token-line-height-caption)] font-semibold text-shell-text-tertiary uppercase tracking-wider">
            Tokens
          </h2>
          <span
            title={supabaseStatus ? 'Syncing with Supabase' : 'Local only'}
            className={`w-[8px] h-[8px] rounded-[var(--token-radius-full)] ${supabaseStatus ? 'bg-[#16A34A]' : 'bg-shell-active'}`}
          />
        </div>
        <button
          type="button"
          onClick={exportTokens}
          className="text-[length:var(--token-font-size-caption)] text-shell-selected-text hover:text-[#6EE7A0] font-medium cursor-pointer"
        >
          Export
        </button>
      </div>

      {/* Semantic section */}
      <div>
        <div data-token-group="Colors" className="px-[var(--token-gap-lg)] py-[var(--token-spacing-8)] border-t border-shell-border bg-shell-bg">
          <span className="text-[length:var(--token-font-size-caption)] font-semibold text-shell-text-tertiary uppercase tracking-wider">
            Semantic Colors
          </span>
        </div>
        {semanticCategories.map((cat) => (
          <div key={cat.label} className="border-t border-shell-border">
            <button
              type="button"
              onClick={() => setExpanded(expanded === `sem:${cat.label}` ? null : `sem:${cat.label}`)}
              className="w-full flex items-center justify-between px-[var(--token-gap-lg)] py-[var(--token-spacing-12)] text-left cursor-pointer hover:bg-shell-hover transition-colors"
            >
              <span className="text-[length:var(--token-font-size-body-sm)] font-medium text-shell-text">
                {cat.label}
              </span>
              <div className="flex items-center gap-[var(--token-spacing-8)]">
                {/* Mini swatch strip */}
                <div className="flex gap-[2px]">
                  {cat.tokens.slice(0, 5).map((t) => (
                    <div
                      key={t.cssVar}
                      className="w-[10px] h-[10px] rounded-[2px]"
                      style={{ backgroundColor: getBaseHex(semanticOverrides[t.cssVar] ?? t.defaultBase) }}
                    />
                  ))}
                </div>
                <span className="text-[length:var(--token-font-size-caption)] text-shell-text-tertiary">
                  {cat.tokens.length}
                </span>
              </div>
            </button>
            {expanded === `sem:${cat.label}` && (
              <div className="px-[var(--token-gap-lg)] pb-[var(--token-spacing-12)] flex flex-col gap-[var(--token-spacing-12)]">
                {cat.tokens.map((t) => (
                  <SemanticTokenInput
                    key={t.cssVar}
                    token={t}
                    currentBase={semanticOverrides[t.cssVar] ?? t.defaultBase}
                    onChange={(base) => handleSemanticChange(t.cssVar, base)}
                    onReset={() => handleSemanticReset(t.cssVar)}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Base token groups */}
      {groups.map((group) => (
        <div key={group}>
          <div data-token-group={group} className="px-[var(--token-gap-lg)] py-[var(--token-spacing-8)] border-t border-shell-border bg-shell-bg">
            <span className="text-[length:var(--token-font-size-caption)] font-semibold text-shell-text-tertiary uppercase tracking-wider">
              {group}
            </span>
          </div>
          {byGroup[group].map((cat) => (
            <div key={cat.label} className="border-t border-shell-border">
              <button
                type="button"
                onClick={() => setExpanded(expanded === cat.label ? null : cat.label)}
                className="w-full flex items-center justify-between px-[var(--token-gap-lg)] py-[var(--token-spacing-12)] text-left cursor-pointer hover:bg-shell-hover transition-colors"
              >
                <span className="text-[length:var(--token-font-size-body-sm)] font-medium text-shell-text">
                  {cat.label}
                </span>
                <span className="text-[length:var(--token-font-size-caption)] text-shell-text-tertiary">
                  {cat.tokens.length}
                </span>
              </button>
              {expanded === cat.label && (
                <div className="px-[var(--token-gap-lg)] pb-[var(--token-spacing-12)]">
                  <div className="flex justify-end mb-[var(--token-spacing-8)]">
                    <button
                      type="button"
                      onClick={() => handleResetCategory(cat.label)}
                      className="text-[length:var(--token-font-size-caption)] text-shell-text-tertiary hover:text-error cursor-pointer"
                    >
                      Reset all
                    </button>
                  </div>
                  <div className="flex flex-col gap-[var(--token-spacing-8)]">
                    {cat.tokens.map((t) => (
                      <TokenInput
                        key={t.cssVar}
                        token={t}
                        initialValue={overrides[t.cssVar] ?? t.defaultValue}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </aside>
  )
}
