/**
 * Dashboard parts — screen-local sub-components for the investments dashboard.
 */
import Avatar from '@/library/display/Avatar'
import Badge from '@/library/display/Badge'
import Text from '@/library/foundations/Text'
import Stack from '@/library/layout/Stack'
import { cn } from '@/lib/cn'
import type { Asset, Position } from './shared/data'
import {
  formatBRL, formatPercentChange, formatQuantity,
  isVolatile, CATEGORY_BADGE_VARIANT,
} from './shared/data'

// ── Balance Display (portfolio total) ──

const symbolFeatures = "'salt' 1, 'ordn' 1, 'kern' 0, 'calt' 0"
const digitFeatures = "'ss01' 1, 'cv05' 1, 'lnum' 1, 'pnum' 1"

interface PortfolioHeaderProps {
  totalValue: number
  change24h: number
}

export function PortfolioHeader({ totalValue, change24h }: PortfolioHeaderProps) {
  const formatted = totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const isPositive = change24h >= 0

  return (
    <Stack gap="sm">
      <Text variant="body-sm" color="content-secondary">Patrimônio total</Text>
      <Stack direction="row" gap="none" align="center">
        <span
          className="text-[28px] font-medium leading-[40px] tracking-[-0.56px] uppercase text-content-primary"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontFeatureSettings: symbolFeatures }}
        >
          R$
        </span>
        <span
          className="text-[40px] font-bold leading-[40px] text-content-primary ml-1"
          style={{ fontFeatureSettings: digitFeatures }}
        >
          {formatted}
        </span>
      </Stack>
      <Badge variant={isPositive ? 'success' : 'error'} size="sm">
        {formatPercentChange(change24h)} (24h)
      </Badge>
    </Stack>
  )
}

// ── Holding Row (portfolio position) ──

interface HoldingRowProps {
  asset: Asset
  position: Position
  onPress?: () => void
}

export function HoldingRow({ asset, position, onPress }: HoldingRowProps) {
  const volatile = isVolatile(asset)

  return (
    <button
      onClick={onPress}
      className={cn(
        'flex items-center gap-3 w-full px-4 py-3 text-left',
        'bg-transparent border-none cursor-pointer',
        'hover:bg-[var(--token-bg-secondary)] transition-colors rounded-xl',
      )}
    >
      <Avatar src={asset.icon} size="md" />

      <div className="flex-1 min-w-0">
        <Text variant="body-md" className="font-semibold truncate">{asset.name}</Text>
        <Text variant="caption" color="content-secondary">{asset.ticker}</Text>
      </div>

      <Stack gap="none" align="end">
        <Text variant="body-sm" className="font-medium">{formatBRL(position.currentValue)}</Text>
        <Text variant="caption" color="content-secondary">
          {volatile
            ? formatQuantity(position.quantity, asset.ticker)
            : asset.apyDisplay ?? ''
          }
        </Text>
      </Stack>
    </button>
  )
}

// ── Featured Asset Card (empty state) ──

interface FeaturedAssetCardProps {
  asset: Asset
  onPress?: () => void
}

export function FeaturedAssetCard({ asset, onPress }: FeaturedAssetCardProps) {
  const volatile = isVolatile(asset)

  return (
    <button
      onClick={onPress}
      className={cn(
        'flex-shrink-0 w-[150px] rounded-xl p-3 text-left',
        'bg-[var(--token-bg-secondary)] border-none cursor-pointer',
        'hover:opacity-80 transition-opacity',
      )}
    >
      <Stack gap="sm">
        <Avatar src={asset.icon} size="md" />
        <Stack gap="none">
          <Text variant="body-sm" className="font-medium">{asset.name}</Text>
          <Text variant="caption" color="content-secondary">
            {volatile ? formatBRL(asset.price!) : asset.apyDisplay}
          </Text>
        </Stack>
        <Badge variant={CATEGORY_BADGE_VARIANT[asset.category]} size="sm">
          {volatile
            ? formatPercentChange(asset.change24h!)
            : asset.apyDisplay ?? ''
          }
        </Badge>
      </Stack>
    </button>
  )
}
