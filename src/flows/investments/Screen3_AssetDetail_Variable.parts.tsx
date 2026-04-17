import Avatar from '@/library/display/Avatar'
import Badge from '@/library/display/Chip'
import Text from '@/library/foundations/Text'
import Stack from '@/library/layout/Stack'
import type { Asset } from './shared/data'
import { formatBRL, formatPercentChange, getCategoryBadgeVariant, getCategoryLabel } from './shared/data'

export function PriceHeader({ asset }: { asset: Asset }) {
  return (
    <Stack gap="sm" align="center">
      <Avatar src={asset.icon} size="lg" />
      <Badge variant={getCategoryBadgeVariant(asset.category)}>
        {getCategoryLabel(asset.category)}
      </Badge>
      <Stack gap="none" align="center">
        <Text variant="display">{formatBRL(asset.price!)}</Text>
        <Badge
          variant={asset.change24h! >= 0 ? 'positive' : 'critical'}
         
        >
          {formatPercentChange(asset.change24h!)}
        </Badge>
      </Stack>
    </Stack>
  )
}
