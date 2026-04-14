import { useState, useCallback } from 'react'
import { colors, typography, radii } from '../../tokens'
import { semanticCategories } from '../../tokens/tokenMeta'
import { getSemanticOverrides } from '../../lib/tokenStore'
import {
  RiHomeLine, RiSearchLine, RiSettingsLine, RiUserLine, RiNotificationLine,
  RiArrowLeftLine, RiArrowRightLine, RiCheckLine, RiCloseLine, RiAddLine,
  RiDeleteBinLine, RiEditLine, RiShareLine, RiHeartLine, RiStarLine,
  RiFileCopyLine, RiDownloadLine, RiUploadLine, RiRefreshLine, RiMoreLine,
  RiEyeLine, RiEyeOffLine, RiLockLine, RiLockUnlockLine, RiInformationLine,
  RiAlertLine, RiQuestionLine, RiTimeLine, RiCalendarLine, RiMapPinLine,
  RiPhoneLine, RiMailLine, RiCameraLine, RiImageLine, RiFileLine,
  RiFolderLine, RiLinksLine, RiExternalLinkLine, RiFilterLine, RiSortAsc,
  RiMenuLine, RiGridLine, RiListUnordered, RiWalletLine, RiSwapLine,
  RiSendPlaneLine, RiQrCodeLine,
} from '@remixicon/react'
import type { RemixiconComponentType } from '@remixicon/react'
import VoiceAndTonePage from './VoiceAndTonePage'

interface FoundationDetailProps {
  foundation: string
}

export default function FoundationDetail({ foundation }: FoundationDetailProps) {
  switch (foundation) {
    case 'Colors':
      return <ColorsPage />
    case 'Typography':
      return <TypographyPage />
    case 'Spacing':
      return <SpacingPage />
    case 'Radii':
      return <RadiiPage />
    case 'Icons':
      return <IconsPage />
    case 'VoiceAndTone':
      return <VoiceAndTonePage />
    default:
      return (
        <div className="flex-1 flex items-center justify-center text-shell-text-tertiary">
          Unknown foundation
        </div>
      )
  }
}

/* ─── Shared ─── */

function SectionTitle({ children, description }: { children: string; description?: string }) {
  return (
    <div className="mb-[var(--token-spacing-16)]">
      <h3 className="text-[length:var(--token-font-size-h3)] font-semibold text-shell-text">
        {children}
      </h3>
      {description && (
        <p className="text-[length:var(--token-font-size-body-sm)] text-shell-text-tertiary mt-[var(--token-spacing-4)]">
          {description}
        </p>
      )}
    </div>
  )
}

function PageTitle({ children, description }: { children: string; description?: string }) {
  return (
    <div className="mb-[var(--token-spacing-32)]">
      <h2 className="text-[length:var(--token-font-size-h1)] font-semibold text-shell-text">
        {children}
      </h2>
      {description && (
        <p className="text-[length:var(--token-font-size-body-md)] text-shell-text-tertiary mt-[var(--token-spacing-8)]">
          {description}
        </p>
      )}
    </div>
  )
}

function CopyIndicator({ copied }: { copied: string | null }) {
  if (!copied) return null
  return (
    <div className="fixed bottom-[var(--token-spacing-24)] left-1/2 -translate-x-1/2 z-50 px-[var(--token-spacing-16)] py-[var(--token-spacing-8)] bg-shell-surface border border-shell-border rounded-[var(--token-radius-md)] text-[length:var(--token-font-size-body-sm)] text-shell-text shadow-lg animate-fade-in">
      Copied: <span className="font-mono">{copied}</span>
    </div>
  )
}

function useCopy() {
  const [copied, setCopied] = useState<string | null>(null)
  const copy = useCallback((text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(text)
    setTimeout(() => setCopied(null), 1500)
  }, [])
  return { copied, copy }
}

/* ─── Colors ─── */

function getLuminance(hex: string): number {
  const rgb = hex.replace('#', '').match(/.{2}/g)
  if (!rgb) return 0
  const [r, g, b] = rgb.map((c) => {
    const v = parseInt(c, 16) / 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function getContrastText(hex: string): string {
  return getLuminance(hex) > 0.4 ? '#171717' : '#FFFFFF'
}

function SwatchStrip({ label, swatches, onCopy }: { label: string; swatches: { name: string; value: string }[]; onCopy: (v: string) => void }) {
  return (
    <div className="mb-[var(--token-spacing-24)]">
      <SectionTitle>{label}</SectionTitle>
      <div className="flex gap-[var(--token-spacing-4)] rounded-[var(--token-radius-md)] overflow-hidden">
        {swatches.map((s) => (
          <button
            key={s.name}
            type="button"
            onClick={() => onCopy(s.value)}
            className="flex-1 h-[80px] flex flex-col items-center justify-end pb-[var(--token-spacing-8)] cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{ backgroundColor: s.value }}
            title={`${s.name} — ${s.value} (click to copy)`}
          >
            <span className="text-[length:10px] font-mono font-medium leading-none" style={{ color: getContrastText(s.value) }}>
              {s.name}
            </span>
            <span className="text-[length:10px] font-mono leading-none mt-[2px] opacity-70" style={{ color: getContrastText(s.value) }}>
              {s.value}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

function SwatchGrid({ label, description, swatches, onCopy }: { label: string; description?: string; swatches: { name: string; value: string; displayLabel?: string }[]; onCopy: (v: string) => void }) {
  return (
    <div className="mb-[var(--token-spacing-32)]">
      <SectionTitle description={description}>{label}</SectionTitle>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-[var(--token-spacing-12)]">
        {swatches.map((s) => (
          <button
            key={s.name}
            type="button"
            onClick={() => onCopy(s.displayLabel ?? s.value)}
            className="flex flex-col gap-[var(--token-spacing-4)] cursor-pointer group text-left"
            title={`Click to copy · ${s.displayLabel ?? s.value}`}
          >
            <div
              className="h-[80px] rounded-[var(--token-radius-md)] border border-shell-border flex items-end px-[var(--token-spacing-8)] pb-[var(--token-spacing-8)] transition-transform group-hover:scale-[1.02] group-active:scale-[0.98]"
              style={{ backgroundColor: s.value }}
            >
              <span className="text-[length:10px] font-mono opacity-80" style={{ color: getContrastText(s.value) }}>
                {s.displayLabel ?? s.value}
              </span>
            </div>
            <span className="text-[length:var(--token-font-size-caption)] text-shell-text font-medium">{s.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function objectToSwatches(obj: Record<string, string>, prefix = '') {
  return Object.entries(obj).map(([key, value]) => ({
    name: prefix ? `${prefix}-${key}` : key,
    value,
  }))
}

function resolveSemanticHex(cssVar: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(`--color-${cssVar}`).trim()
}

function ColorsPage() {
  const { copied, copy } = useCopy()
  const semanticOverrides = getSemanticOverrides()

  return (
    <div className="flex-1 overflow-y-auto bg-shell-bg">
      <div className="py-[32px] px-[120px]">
        <PageTitle description="Color tokens for brand identity, semantics, and UI surfaces.">Colors</PageTitle>

        {/* Semantic tokens — grouped by category, showing base reference */}
        <div className="mb-[var(--token-spacing-8)]">
          <SectionTitle description="Use these tokens in all components and flows. Each swatch shows which base token it references.">
            Semantic Colors
          </SectionTitle>
        </div>
        {semanticCategories.map((cat) => (
          <SwatchGrid
            key={cat.label}
            label={cat.label}
            swatches={cat.tokens.map((t) => {
              const base = semanticOverrides[t.cssVar] ?? t.defaultBase
              return {
                name: `--color-${t.cssVar}`,
                value: resolveSemanticHex(t.cssVar),
                displayLabel: `--token-${base}`,
              }
            })}
            onCopy={copy}
          />
        ))}

        {/* Base palettes — internal reference only */}
        <SectionTitle description="Internal palette. Use only to define semantic tokens — never reference these directly in components.">
          Base Colors
        </SectionTitle>
        <SwatchStrip label="Brand Primary" swatches={objectToSwatches(colors.brand, 'brand')} onCopy={copy} />
        <SwatchStrip label="Neutral" swatches={objectToSwatches(colors.neutral, 'neutral')} onCopy={copy} />
        <SwatchStrip label="Avocado (success)" swatches={objectToSwatches(colors.avocado, 'avocado')} onCopy={copy} />
        <SwatchStrip label="Banana (warning)" swatches={objectToSwatches(colors.banana, 'banana')} onCopy={copy} />
        <SwatchStrip label="Apple (error)" swatches={objectToSwatches(colors.apple, 'apple')} onCopy={copy} />
        <SwatchStrip label="Grape" swatches={objectToSwatches(colors.grape, 'grape')} onCopy={copy} />
        <SwatchStrip label="Guava" swatches={objectToSwatches(colors.guava, 'guava')} onCopy={copy} />
      </div>
      <CopyIndicator copied={copied} />
    </div>
  )
}

/* ─── Typography ─── */

type TypoSpec = { fontSize: string; lineHeight: string; fontWeight: number; letterSpacing?: string; textTransform?: string }

const figmaLabel: Record<string, string> = {
  display: 'Display',
  h1: 'H1',
  h2: 'H2',
  h3: 'H3',
  h4: 'H4',
  overline: 'Overline',
  'body-lg': 'LG',
  'body-md': 'Base',
  'body-sm': 'SM',
  caption: 'XS',
}

const figmaDescription: Record<string, string> = {
  display: 'High-impact marketing calls',
  h1: 'Primary heading for pages/screens',
  h2: 'Large content blocks defining a subject',
  h3: 'Smaller blocks within same subject',
  h4: 'Organizing content at most granular level',
  overline: 'Inverted hierarchy, primarily for lists',
  'body-lg': 'Prominent content and large components',
  'body-md': 'Core interface content',
  'body-sm': 'Secondary and supplementary information',
  caption: 'Low-level metadata and micro-copy',
}

const typeGroups: { title: string; description: string; keys: string[] }[] = [
  { title: 'Headings', description: 'Display and heading styles for titles and section headers.', keys: ['display', 'h1', 'h2', 'h3', 'h4', 'overline'] },
  { title: 'Body', description: 'Body copy for paragraphs, descriptions, and labels.', keys: ['body-lg', 'body-md', 'body-sm', 'caption'] },
]

const specimens: Record<string, string> = {
  display: 'Suas finanças no modo Picnic.',
  h1: 'Zero taxa de verdade.',
  h2: 'Abre o olho pro custo total.',
  h3: 'Viajar sem susto no extrato.',
  h4: 'Câmbio competitivo',
  overline: 'Conta Internacional',
  'body-lg': 'A conta digital internacional mais inteligente do Brasil. Sem IOF, sem taxa escondida.',
  'body-md': 'Pagar tudo em outro país sem travar: café, metrô, mercado. Seu dinheiro, seu de verdade.',
  'body-sm': 'IOF: zero. Taxa Picnic: zero. Anuidade: zero. Pegadinha: zero.',
  caption: '5–10% mais barato que Wise. Faz a conta.',
}

function TypographyPage() {
  return (
    <div className="flex-1 overflow-y-auto bg-shell-bg">
      <div className="py-[32px] px-[120px]">
        <PageTitle description="Type scale for all text styles. Uses the system font stack.">Typography</PageTitle>

        {typeGroups.map((group) => (
          <div key={group.title} className="mb-[var(--token-spacing-40)]">
            <SectionTitle description={group.description}>{group.title}</SectionTitle>
            <div className="flex flex-col">
              {group.keys.map((key) => {
                const spec = typography[key as keyof typeof typography] as TypoSpec
                return (
                  <div
                    key={key}
                    className="grid grid-cols-[160px_200px_1fr] gap-[var(--token-spacing-32)] py-[var(--token-spacing-24)] border-b border-shell-border items-start"
                  >
                    {/* Col 1 — name */}
                    <div>
                      <span className="text-[length:var(--token-font-size-h3)] font-semibold text-shell-text leading-tight">
                        {figmaLabel[key] ?? key}
                      </span>
                      <div className="text-[length:var(--token-font-size-caption)] font-mono text-shell-text-tertiary mt-[var(--token-spacing-4)]">
                        {key}
                      </div>
                      {figmaDescription[key] && (
                        <div className="text-[length:var(--token-font-size-caption)] text-shell-text-secondary mt-[var(--token-spacing-8)] leading-[1.5]">
                          {figmaDescription[key]}
                        </div>
                      )}
                    </div>

                    {/* Col 2 — specs */}
                    <div className="flex flex-col gap-[var(--token-spacing-4)]">
                      {[
                        { label: 'Size',        value: spec.fontSize },
                        { label: 'Weight',      value: `${spec.fontWeight} / ${spec.fontWeight >= 600 ? 'Semibold' : 'Regular'}` },
                        { label: 'Line height', value: spec.lineHeight },
                        ...(spec.letterSpacing ? [{ label: 'Tracking', value: spec.letterSpacing }] : []),
                        ...(spec.textTransform  ? [{ label: 'Transform', value: spec.textTransform }] : []),
                      ].map(({ label, value }) => (
                        <div key={label} className="flex items-baseline gap-[var(--token-spacing-8)]">
                          <span className="text-[length:var(--token-font-size-caption)] text-shell-text-tertiary w-[80px] shrink-0">{label}</span>
                          <span className="text-[length:var(--token-font-size-caption)] font-mono text-shell-text">{value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Col 3 — specimen */}
                    <div
                      style={{
                        fontSize: spec.fontSize,
                        lineHeight: spec.lineHeight,
                        fontWeight: spec.fontWeight,
                        letterSpacing: spec.letterSpacing,
                        textTransform: spec.textTransform as 'uppercase' | undefined,
                      }}
                      className="text-shell-text"
                    >
                      {specimens[key] || 'The quick brown fox jumps over the lazy dog'}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Spacing ─── */

const spacingUsage: { value: string; token: string; semantic?: string; usage: string }[] = [
  { value: '0px',  token: 'spacing-0',  usage: 'No gap' },
  { value: '2px',  token: 'spacing-2',  semantic: 'gap-xs',      usage: 'Hairline dividers, micro gaps' },
  { value: '4px',  token: 'spacing-4',  semantic: 'gap-sm',      usage: 'Icon to label, tight inner padding' },
  { value: '8px',  token: 'spacing-8',  semantic: 'gap-md',      usage: 'Between closely related items' },
  { value: '12px', token: 'spacing-12', semantic: 'padding-md',  usage: 'Card inner padding, list item gaps' },
  { value: '16px', token: 'spacing-16', semantic: 'gap-lg',      usage: 'Standard gap, Stack default' },
  { value: '20px', token: 'spacing-20', usage: 'Medium spacing' },
  { value: '24px', token: 'spacing-24', semantic: 'padding-lg',  usage: 'Screen margins, section gaps' },
  { value: '32px', token: 'spacing-32', semantic: 'gap-xl',      usage: 'Between major sections' },
  { value: '40px', token: 'spacing-40', usage: 'Large vertical spacing' },
  { value: '48px', token: 'spacing-48', usage: 'Extra large spacing' },
  { value: '64px', token: 'spacing-64', usage: 'Page-level padding' },
  { value: '80px', token: 'spacing-80', usage: 'Maximum spacing' },
  { value: '96px', token: 'spacing-96', usage: 'Hero / full-bleed padding' },
]

const layoutRules = [
  { label: 'BaseLayout gap', value: '24px', token: 'padding-lg', description: 'Vertical gap between top-level children (Sections). Also horizontal margins.' },
  { label: 'Section gap', value: '12px', token: 'padding-md', description: 'Gap between Section title and its content.' },
  { label: 'Stack default', value: '16px', token: 'gap-lg', description: 'Default gap for Stack children. Overridable via gap prop.' },
  { label: 'Stack sm', value: '8px', token: 'gap-md', description: 'Tight vertical grouping — related items.' },
  { label: 'Stack none', value: '0px', token: 'spacing-0', description: 'Flush grouping — GroupHeader + content.' },
  { label: 'Stack lg', value: '24px', token: 'padding-lg', description: 'Loose vertical grouping — distinct blocks.' },
]

function SpacingPage() {
  return (
    <div className="flex-1 overflow-y-auto bg-shell-bg">
      <div className="py-[32px] px-[120px]">
        <PageTitle description="Spacing scale for margins, paddings, and gaps. Only use values from this scale — no magic numbers.">Spacing</PageTitle>

        {/* Scale with real-size visual representation */}
        <SectionTitle description="Each bar represents the actual pixel size of the token.">Scale</SectionTitle>
        <div className="flex flex-col mb-[var(--token-spacing-40)]">
          {spacingUsage.map((s) => {
            const px = parseInt(s.value)
            return (
              <div key={s.token} className="grid grid-cols-[120px_36px_100px_1fr] items-center gap-[var(--token-spacing-16)] py-[6px] border-b border-shell-border">
                <span className="text-[length:var(--token-font-size-caption)] font-mono text-shell-text">
                  {s.token}
                </span>
                <span className="text-[length:var(--token-font-size-caption)] font-mono text-shell-text-tertiary text-right">
                  {s.value}
                </span>
                <span className="text-[length:var(--token-font-size-caption)] font-mono text-[#28D278]">
                  {s.semantic ?? ''}
                </span>
                <div className="flex items-center gap-[var(--token-spacing-8)]">
                  <div
                    className="h-[12px] rounded-[2px] bg-[#28D278] shrink-0"
                    style={{ width: px === 0 ? '1px' : `${px}px` }}
                  />
                  <span className="text-[length:var(--token-font-size-caption)] text-shell-text-tertiary truncate">
                    {s.usage}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Layout rules */}
        <SectionTitle description="How spacing is applied through layout components.">Layout Rules</SectionTitle>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-[var(--token-spacing-16)] mb-[var(--token-spacing-40)]">
          {layoutRules.map((rule) => (
            <div key={rule.label} className="bg-shell-surface border border-shell-border rounded-[var(--token-radius-md)] p-[var(--token-spacing-16)]">
              <div className="flex items-center justify-between mb-[var(--token-spacing-8)]">
                <span className="text-[length:var(--token-font-size-body-sm)] font-semibold text-shell-text">{rule.label}</span>
                <div className="flex items-center gap-[var(--token-spacing-4)]">
                  <span className="text-[length:var(--token-font-size-caption)] font-mono text-[#28D278]">{rule.token}</span>
                  <span className="text-[length:var(--token-font-size-caption)] text-shell-text-tertiary">= {rule.value}</span>
                </div>
              </div>
              <p className="text-[length:var(--token-font-size-caption)] text-shell-text-secondary leading-relaxed">{rule.description}</p>
              {/* Visual preview */}
              <div className="mt-[var(--token-spacing-12)] flex items-center gap-[var(--token-spacing-8)]">
                <div className="h-[8px] bg-[#28D278] rounded-[2px]" style={{ width: `${parseInt(rule.value)}px` }} />
                <span className="text-[length:10px] font-mono text-shell-text-tertiary">{rule.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Composition example */}
        <SectionTitle description="Screen → BaseLayout (24px gap) → Section (12px gap) → Stack (configurable gap).">Composition</SectionTitle>
        <div className="bg-shell-surface border border-shell-border rounded-[var(--token-radius-md)] p-[var(--token-spacing-20)]">
          <code className="text-[length:var(--token-font-size-caption)] font-mono text-shell-text-secondary leading-relaxed whitespace-pre">{`BaseLayout               ← 24px horizontal margins
  ├── Section              ← 24px gap between sections (from BaseLayout)
  │   ├── GroupHeader      ← 12px gap to content (from Section)
  │   └── Stack gap="sm"   ← 8px between items
  │       ├── ListItem
  │       └── ListItem
  ├── Section
  │   └── Stack            ← 16px default gap
  │       ├── Card
  │       └── Card
  └── StickyFooter`}</code>
        </div>
      </div>
    </div>
  )
}

/* ─── Radii ─── */

function RadiiPage() {
  const entries = Object.entries(radii) as [string, string][]

  return (
    <div className="flex-1 overflow-y-auto bg-shell-bg">
      <div className="py-[32px] px-[120px]">
        <PageTitle description="Border radius tokens for corners and shapes.">Radius</PageTitle>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-[var(--token-spacing-24)]">
          {entries.map(([name, value]) => (
            <div key={name} className="bg-shell-surface border border-shell-border rounded-[var(--token-radius-md)] p-[var(--token-spacing-20)] flex flex-col items-center">
              <div
                className="w-[100px] h-[100px] bg-interactive-default mb-[var(--token-spacing-16)]"
                style={{ borderRadius: value }}
              />
              <span className="text-[length:var(--token-font-size-body-sm)] font-semibold text-shell-text">{name}</span>
              <span className="text-[length:var(--token-font-size-caption)] text-shell-text-tertiary mt-[2px]">{value}</span>
              <span className="text-[length:var(--token-font-size-caption)] font-mono text-shell-text-tertiary mt-[var(--token-spacing-4)]">
                --token-radius-{name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Icons ─── */

const iconGroups: { label: string; icons: { name: string; importName: string; Icon: RemixiconComponentType }[] }[] = [
  {
    label: 'Navigation',
    icons: [
      { name: 'Home', importName: 'RiHomeLine', Icon: RiHomeLine },
      { name: 'Search', importName: 'RiSearchLine', Icon: RiSearchLine },
      { name: 'Menu', importName: 'RiMenuLine', Icon: RiMenuLine },
      { name: 'Arrow Left', importName: 'RiArrowLeftLine', Icon: RiArrowLeftLine },
      { name: 'Arrow Right', importName: 'RiArrowRightLine', Icon: RiArrowRightLine },
      { name: 'External Link', importName: 'RiExternalLinkLine', Icon: RiExternalLinkLine },
      { name: 'Link', importName: 'RiLinksLine', Icon: RiLinksLine },
    ],
  },
  {
    label: 'Actions',
    icons: [
      { name: 'Add', importName: 'RiAddLine', Icon: RiAddLine },
      { name: 'Edit', importName: 'RiEditLine', Icon: RiEditLine },
      { name: 'Delete', importName: 'RiDeleteBinLine', Icon: RiDeleteBinLine },
      { name: 'Copy', importName: 'RiFileCopyLine', Icon: RiFileCopyLine },
      { name: 'Share', importName: 'RiShareLine', Icon: RiShareLine },
      { name: 'Download', importName: 'RiDownloadLine', Icon: RiDownloadLine },
      { name: 'Upload', importName: 'RiUploadLine', Icon: RiUploadLine },
      { name: 'Refresh', importName: 'RiRefreshLine', Icon: RiRefreshLine },
      { name: 'Filter', importName: 'RiFilterLine', Icon: RiFilterLine },
      { name: 'Sort', importName: 'RiSortAsc', Icon: RiSortAsc },
      { name: 'Send', importName: 'RiSendPlaneLine', Icon: RiSendPlaneLine },
      { name: 'Close', importName: 'RiCloseLine', Icon: RiCloseLine },
      { name: 'Check', importName: 'RiCheckLine', Icon: RiCheckLine },
      { name: 'More', importName: 'RiMoreLine', Icon: RiMoreLine },
    ],
  },
  {
    label: 'Status',
    icons: [
      { name: 'Info', importName: 'RiInformationLine', Icon: RiInformationLine },
      { name: 'Alert', importName: 'RiAlertLine', Icon: RiAlertLine },
      { name: 'Question', importName: 'RiQuestionLine', Icon: RiQuestionLine },
      { name: 'Eye', importName: 'RiEyeLine', Icon: RiEyeLine },
      { name: 'Eye Off', importName: 'RiEyeOffLine', Icon: RiEyeOffLine },
      { name: 'Lock', importName: 'RiLockLine', Icon: RiLockLine },
      { name: 'Unlock', importName: 'RiLockUnlockLine', Icon: RiLockUnlockLine },
      { name: 'Notification', importName: 'RiNotificationLine', Icon: RiNotificationLine },
    ],
  },
  {
    label: 'Content',
    icons: [
      { name: 'Heart', importName: 'RiHeartLine', Icon: RiHeartLine },
      { name: 'Star', importName: 'RiStarLine', Icon: RiStarLine },
      { name: 'User', importName: 'RiUserLine', Icon: RiUserLine },
      { name: 'Settings', importName: 'RiSettingsLine', Icon: RiSettingsLine },
      { name: 'Time', importName: 'RiTimeLine', Icon: RiTimeLine },
      { name: 'Calendar', importName: 'RiCalendarLine', Icon: RiCalendarLine },
      { name: 'Map Pin', importName: 'RiMapPinLine', Icon: RiMapPinLine },
      { name: 'Phone', importName: 'RiPhoneLine', Icon: RiPhoneLine },
      { name: 'Mail', importName: 'RiMailLine', Icon: RiMailLine },
      { name: 'Camera', importName: 'RiCameraLine', Icon: RiCameraLine },
      { name: 'Image', importName: 'RiImageLine', Icon: RiImageLine },
      { name: 'File', importName: 'RiFileLine', Icon: RiFileLine },
      { name: 'Folder', importName: 'RiFolderLine', Icon: RiFolderLine },
      { name: 'Grid', importName: 'RiGridLine', Icon: RiGridLine },
      { name: 'List', importName: 'RiListUnordered', Icon: RiListUnordered },
    ],
  },
  {
    label: 'Commerce',
    icons: [
      { name: 'Wallet', importName: 'RiWalletLine', Icon: RiWalletLine },
      { name: 'Swap', importName: 'RiSwapLine', Icon: RiSwapLine },
      { name: 'QR Code', importName: 'RiQrCodeLine', Icon: RiQrCodeLine },
    ],
  },
]

function IconsPage() {
  const [search, setSearch] = useState('')
  const { copied, copy } = useCopy()
  const query = search.toLowerCase()

  const filteredGroups = iconGroups.map((g) => ({
    ...g,
    icons: g.icons.filter((i) => i.name.toLowerCase().includes(query) || i.importName.toLowerCase().includes(query)),
  })).filter((g) => g.icons.length > 0)

  return (
    <div className="flex-1 overflow-y-auto bg-shell-bg">
      <div className="py-[32px] px-[120px]">
        <PageTitle description="Remix Icon (line style). Click any icon to copy its import name.">Icons</PageTitle>

        {/* Search */}
        <div className="mb-[var(--token-spacing-24)]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search icons..."
            className="w-full max-w-[320px] px-[var(--token-spacing-12)] py-[var(--token-spacing-8)] bg-shell-surface border border-shell-border rounded-[var(--token-radius-sm)] text-[length:var(--token-font-size-body-sm)] text-shell-text placeholder:text-shell-text-tertiary outline-none focus:border-shell-selected-text transition-colors"
          />
        </div>

        {filteredGroups.map((group) => (
          <div key={group.label} className="mb-[var(--token-spacing-32)]">
            <SectionTitle>{group.label}</SectionTitle>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-[var(--token-spacing-8)]">
              {group.icons.map(({ name, importName, Icon }) => (
                <button
                  key={importName}
                  type="button"
                  onClick={() => copy(importName)}
                  title={`import { ${importName} } from '@remixicon/react'`}
                  className="flex flex-col items-center justify-center gap-[var(--token-spacing-4)] p-[var(--token-spacing-16)] aspect-square bg-shell-surface border border-shell-border rounded-[var(--token-radius-md)] hover:border-shell-selected-text transition-colors cursor-pointer group"
                >
                  <Icon size={24} className="text-shell-text group-hover:text-shell-selected-text transition-colors shrink-0" />
                  <span className="text-[length:var(--token-font-size-caption)] text-shell-text-tertiary text-center leading-tight">{name}</span>
                  <span className="text-[length:9px] font-mono text-shell-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity text-center leading-tight">
                    {importName}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}

        {filteredGroups.length === 0 && (
          <p className="text-[length:var(--token-font-size-body-sm)] text-shell-text-tertiary">No icons match "{search}"</p>
        )}
      </div>
      <CopyIndicator copied={copied} />
    </div>
  )
}
