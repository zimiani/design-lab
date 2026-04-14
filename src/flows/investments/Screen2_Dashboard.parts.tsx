import Avatar from '@/library/display/Avatar'
import Badge from '@/library/display/Badge'
import ListItem from '@/library/display/ListItem'
import Text from '@/library/foundations/Text'
import Stack from '@/library/layout/Stack'
import type { Asset, Position } from './shared/data'
import { formatBRL, formatPercentChange, getAsset, getCategoryLabel } from './shared/data'

// ── Asset row for Explorar tab ──

export function AssetRow({ asset, onPress }: { asset: Asset; onPress?: () => void }) {
  const isFixed = asset.category === 'fixed-income'

  return (
    <ListItem
      title={asset.name}
      subtitle={isFixed ? getCategoryLabel(asset.category) : asset.ticker}
      left={<Avatar src={asset.icon} size="md" />}
      right={
        isFixed ? (
          <Badge variant="positive" size="sm">{asset.apyDisplay}</Badge>
        ) : (
          <Stack gap="none" align="end">
            <Text variant="body-sm">{formatBRL(asset.price!)}</Text>
            <Badge
              variant={asset.change24h! >= 0 ? 'positive' : 'critical'}
              size="sm"
            >
              {formatPercentChange(asset.change24h!)}
            </Badge>
          </Stack>
        )
      }
      onPress={onPress}
    />
  )
}

// ── Position row for Portfólio tab ──

export function PositionRow({ position, onPress }: { position: Position; onPress?: () => void }) {
  const asset = getAsset(position.asset)
  const pnl = ((position.currentValue - (position.avgCost * position.quantity)) / (position.avgCost * position.quantity)) * 100

  return (
    <ListItem
      title={asset.name}
      subtitle={asset.ticker}
      left={<Avatar src={asset.icon} size="md" />}
      right={
        <Stack gap="none" align="end">
          <Text variant="body-sm">{formatBRL(position.currentValue)}</Text>
          <Badge variant={pnl >= 0 ? 'positive' : 'critical'} size="sm">
            {formatPercentChange(pnl)}
          </Badge>
        </Stack>
      }
      onPress={onPress}
    />
  )
}
