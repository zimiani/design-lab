import { RiStarLine, RiStarFill } from '@remixicon/react'
import Avatar from '@/library/display/Avatar'
import Badge from '@/library/display/Badge'
import ListItem from '@/library/display/ListItem'
import Text from '@/library/foundations/Text'
import Stack from '@/library/layout/Stack'
import type { Asset } from './shared/data'
import { formatBRL, formatPercentChange, CATEGORY_BADGE_VARIANT, CATEGORY_INFO, isFavorite } from './shared/data'

// ── Asset row for lists ──

interface AssetRowProps {
  asset: Asset
  onPress?: () => void
  showFavorite?: boolean
  onToggleFavorite?: () => void
}

export function AssetRow({ asset, onPress, showFavorite, onToggleFavorite }: AssetRowProps) {
  const isFixed = asset.category === 'fixed-income'
  const fav = isFavorite(asset.ticker)

  return (
    <ListItem
      title={asset.name}
      subtitle={isFixed ? CATEGORY_INFO[asset.category].label : asset.ticker}
      left={<Avatar src={asset.icon} size="md" />}
      right={
        <Stack direction="row" gap="sm" align="center">
          {isFixed ? (
            <Badge variant="lime" size="sm">{asset.apyDisplay}</Badge>
          ) : (
            <Stack gap="none" align="end">
              <Text variant="body-sm">{formatBRL(asset.price!)}</Text>
              <Badge
                variant={asset.change24h! >= 0 ? 'success' : 'error'}
                size="sm"
              >
                {formatPercentChange(asset.change24h!)}
              </Badge>
            </Stack>
          )}
          {showFavorite && (
            <button
              onClick={(e) => { e.stopPropagation(); onToggleFavorite?.() }}
              className="p-1 text-content-tertiary"
            >
              {fav
                ? <RiStarFill size={18} className="text-[var(--color-feedback-warning)]" />
                : <RiStarLine size={18} />
              }
            </button>
          )}
        </Stack>
      }
      onPress={onPress}
    />
  )
}

// ── Horizontal discovery card ──

export function DiscoveryCard({ asset, onPress }: { asset: Asset; onPress?: () => void }) {
  const isFixed = asset.category === 'fixed-income'

  return (
    <button
      onClick={onPress}
      className="flex-shrink-0 w-[140px] rounded-xl bg-[var(--token-bg-secondary)] p-3 text-left"
    >
      <Stack gap="sm">
        <Avatar src={asset.icon} size="md" />
        <Stack gap="none">
          <Text variant="body-sm">{asset.name}</Text>
          <Text variant="caption" color="content-secondary">
            {isFixed ? asset.apyDisplay : formatBRL(asset.price!)}
          </Text>
        </Stack>
        {!isFixed && asset.change24h !== undefined && (
          <Badge
            variant={asset.change24h >= 0 ? 'success' : 'error'}
            size="sm"
          >
            {formatPercentChange(asset.change24h)}
          </Badge>
        )}
        {isFixed && (
          <Badge variant={CATEGORY_BADGE_VARIANT[asset.category]} size="sm">
            Renda Fixa
          </Badge>
        )}
      </Stack>
    </button>
  )
}
