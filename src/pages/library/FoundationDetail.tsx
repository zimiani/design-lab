import { colors, spacing, spacingNamed, typography, radii } from '../../tokens'
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
    default:
      return (
        <div className="flex-1 flex items-center justify-center text-shell-text-tertiary">
          Unknown foundation
        </div>
      )
  }
}

/* ─── Shared ─── */

function SectionTitle({ children }: { children: string }) {
  return (
    <h3 className="text-[length:var(--token-font-size-heading-sm)] font-semibold text-shell-text mb-[var(--token-spacing-3)]">
      {children}
    </h3>
  )
}

function PageTitle({ children }: { children: string }) {
  return (
    <h2 className="text-[length:var(--token-font-size-heading-lg)] font-semibold text-shell-text mb-[var(--token-spacing-6)]">
      {children}
    </h2>
  )
}

/* ─── Colors ─── */

function SwatchGrid({ label, swatches }: { label: string; swatches: { name: string; value: string }[] }) {
  return (
    <div className="mb-[var(--token-spacing-6)]">
      <SectionTitle>{label}</SectionTitle>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-[var(--token-spacing-3)]">
        {swatches.map((s) => (
          <div key={s.name} className="flex flex-col gap-[var(--token-spacing-1)]">
            <div
              className="h-[56px] rounded-[var(--token-radius-sm)] border border-shell-border"
              style={{ backgroundColor: s.value }}
            />
            <span className="text-[length:var(--token-font-size-caption)] text-shell-text font-medium">{s.name}</span>
            <span className="text-[length:var(--token-font-size-caption)] text-shell-text-tertiary">{s.value}</span>
          </div>
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

function ColorsPage() {
  return (
    <div className="flex-1 overflow-y-auto bg-shell-bg">
      <div className="p-[var(--token-spacing-lg)] max-w-[960px]">
        <PageTitle>Colors</PageTitle>

        <SwatchGrid label="Brand" swatches={objectToSwatches(colors.brand, 'brand')} />
        <SwatchGrid label="Brand Core" swatches={objectToSwatches(colors.brandCore, 'core')} />
        <SwatchGrid label="Brand Lime" swatches={objectToSwatches(colors.brandLime, 'lime')} />
        <SwatchGrid label="Brand Grape" swatches={objectToSwatches(colors.brandGrape, 'grape')} />
        <SwatchGrid label="Brand Guava" swatches={objectToSwatches(colors.brandGuava, 'guava')} />
        <SwatchGrid label="Semantic" swatches={objectToSwatches(colors.semantic)} />
        <SwatchGrid label="Feedback" swatches={objectToSwatches(colors.feedback)} />
        <SwatchGrid label="Neutral" swatches={objectToSwatches(colors.neutral, 'neutral')} />
        <SwatchGrid label="Surface" swatches={objectToSwatches(colors.surface)} />
        <SwatchGrid label="Content" swatches={objectToSwatches(colors.content)} />
        <SwatchGrid label="Interactive" swatches={objectToSwatches(colors.interactive)} />
        <SwatchGrid label="Border" swatches={objectToSwatches(colors.border)} />
      </div>
    </div>
  )
}

/* ─── Typography ─── */

function TypographyPage() {
  const variants = Object.entries(typography) as [string, { fontSize: string; lineHeight: string; fontWeight: number }][]

  return (
    <div className="flex-1 overflow-y-auto bg-shell-bg">
      <div className="p-[var(--token-spacing-lg)] max-w-[960px]">
        <PageTitle>Typography</PageTitle>
        <div className="flex flex-col gap-[var(--token-spacing-4)]">
          {variants.map(([name, spec]) => (
            <div key={name} className="flex items-baseline gap-[var(--token-spacing-6)] py-[var(--token-spacing-3)] border-b border-shell-border">
              <div className="w-[160px] shrink-0">
                <span className="text-[length:var(--token-font-size-body-sm)] font-medium text-shell-text">{name}</span>
                <div className="text-[length:var(--token-font-size-caption)] text-shell-text-tertiary mt-[var(--token-spacing-0-5)]">
                  {spec.fontSize} / {spec.lineHeight} / {spec.fontWeight}
                </div>
              </div>
              <span
                style={{
                  fontSize: spec.fontSize,
                  lineHeight: spec.lineHeight,
                  fontWeight: spec.fontWeight,
                }}
                className="text-shell-text"
              >
                The quick brown fox jumps over the lazy dog
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Spacing ─── */

function SpacingPage() {
  const spacingEntries = Object.entries(spacing) as [string, string][]
  const namedEntries = Object.entries(spacingNamed) as [string, string][]

  return (
    <div className="flex-1 overflow-y-auto bg-shell-bg">
      <div className="p-[var(--token-spacing-lg)] max-w-[960px]">
        <PageTitle>Spacing</PageTitle>

        <SectionTitle>Scale</SectionTitle>
        <div className="flex flex-col gap-[var(--token-spacing-2)] mb-[var(--token-spacing-8)]">
          {spacingEntries.map(([key, value]) => (
            <div key={key} className="flex items-center gap-[var(--token-spacing-4)]">
              <span className="w-[60px] text-right text-[length:var(--token-font-size-body-sm)] text-shell-text-tertiary font-mono">
                {value}
              </span>
              <span className="w-[40px] text-[length:var(--token-font-size-body-sm)] text-shell-text font-medium">
                {key}
              </span>
              <div
                className="h-[16px] rounded-[var(--token-radius-sm)] bg-interactive-default"
                style={{ width: value === '0px' ? '1px' : value }}
              />
            </div>
          ))}
        </div>

        <SectionTitle>Named Aliases</SectionTitle>
        <div className="flex flex-col gap-[var(--token-spacing-2)]">
          {namedEntries.map(([key, value]) => (
            <div key={key} className="flex items-center gap-[var(--token-spacing-4)]">
              <span className="w-[60px] text-right text-[length:var(--token-font-size-body-sm)] text-shell-text-tertiary font-mono">
                {value}
              </span>
              <span className="w-[40px] text-[length:var(--token-font-size-body-sm)] text-shell-text font-medium">
                {key}
              </span>
              <div
                className="h-[16px] rounded-[var(--token-radius-sm)] bg-interactive-default"
                style={{ width: value }}
              />
            </div>
          ))}
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
      <div className="p-[var(--token-spacing-lg)] max-w-[960px]">
        <PageTitle>Radii</PageTitle>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-[var(--token-spacing-6)]">
          {entries.map(([name, value]) => (
            <div key={name} className="flex flex-col items-center gap-[var(--token-spacing-2)]">
              <div
                className="w-[80px] h-[80px] bg-interactive-default border border-shell-border"
                style={{ borderRadius: value }}
              />
              <span className="text-[length:var(--token-font-size-body-sm)] font-medium text-shell-text">{name}</span>
              <span className="text-[length:var(--token-font-size-caption)] text-shell-text-tertiary">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Icons ─── */

const iconSet: { name: string; Icon: RemixiconComponentType }[] = [
  { name: 'Home', Icon: RiHomeLine },
  { name: 'Search', Icon: RiSearchLine },
  { name: 'Settings', Icon: RiSettingsLine },
  { name: 'User', Icon: RiUserLine },
  { name: 'Notification', Icon: RiNotificationLine },
  { name: 'Arrow Left', Icon: RiArrowLeftLine },
  { name: 'Arrow Right', Icon: RiArrowRightLine },
  { name: 'Check', Icon: RiCheckLine },
  { name: 'Close', Icon: RiCloseLine },
  { name: 'Add', Icon: RiAddLine },
  { name: 'Delete', Icon: RiDeleteBinLine },
  { name: 'Edit', Icon: RiEditLine },
  { name: 'Share', Icon: RiShareLine },
  { name: 'Heart', Icon: RiHeartLine },
  { name: 'Star', Icon: RiStarLine },
  { name: 'Copy', Icon: RiFileCopyLine },
  { name: 'Download', Icon: RiDownloadLine },
  { name: 'Upload', Icon: RiUploadLine },
  { name: 'Refresh', Icon: RiRefreshLine },
  { name: 'More', Icon: RiMoreLine },
  { name: 'Eye', Icon: RiEyeLine },
  { name: 'Eye Off', Icon: RiEyeOffLine },
  { name: 'Lock', Icon: RiLockLine },
  { name: 'Unlock', Icon: RiLockUnlockLine },
  { name: 'Info', Icon: RiInformationLine },
  { name: 'Alert', Icon: RiAlertLine },
  { name: 'Question', Icon: RiQuestionLine },
  { name: 'Time', Icon: RiTimeLine },
  { name: 'Calendar', Icon: RiCalendarLine },
  { name: 'Map Pin', Icon: RiMapPinLine },
  { name: 'Phone', Icon: RiPhoneLine },
  { name: 'Mail', Icon: RiMailLine },
  { name: 'Camera', Icon: RiCameraLine },
  { name: 'Image', Icon: RiImageLine },
  { name: 'File', Icon: RiFileLine },
  { name: 'Folder', Icon: RiFolderLine },
  { name: 'Link', Icon: RiLinksLine },
  { name: 'External Link', Icon: RiExternalLinkLine },
  { name: 'Filter', Icon: RiFilterLine },
  { name: 'Sort', Icon: RiSortAsc },
  { name: 'Menu', Icon: RiMenuLine },
  { name: 'Grid', Icon: RiGridLine },
  { name: 'List', Icon: RiListUnordered },
  { name: 'Wallet', Icon: RiWalletLine },
  { name: 'Swap', Icon: RiSwapLine },
  { name: 'Send', Icon: RiSendPlaneLine },
  { name: 'QR Code', Icon: RiQrCodeLine },
]

function IconsPage() {
  return (
    <div className="flex-1 overflow-y-auto bg-shell-bg">
      <div className="p-[var(--token-spacing-lg)] max-w-[960px]">
        <PageTitle>Icons</PageTitle>
        <p className="text-[length:var(--token-font-size-body-sm)] text-shell-text-tertiary mb-[var(--token-spacing-6)]">
          Remix Icon (line style). Import from <code className="bg-shell-surface px-[4px] py-[2px] rounded-[var(--token-radius-sm)]">@remixicon/react</code>.
        </p>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-[var(--token-spacing-4)]">
          {iconSet.map(({ name, Icon }) => (
            <div key={name} className="flex flex-col items-center gap-[var(--token-spacing-2)] p-[var(--token-spacing-3)] rounded-[var(--token-radius-sm)] hover:bg-shell-hover transition-colors">
              <Icon size={24} className="text-shell-text" />
              <span className="text-[length:var(--token-font-size-caption)] text-shell-text-tertiary text-center">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
