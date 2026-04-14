/**
 * Favorites — shows the user's favorited assets.
 */
import type { FlowScreenProps } from '@/pages/simulator/flowRegistry'
import BaseLayout from '@/library/layout/BaseLayout'
import Header from '@/library/navigation/Header'
import Stack from '@/library/layout/Stack'
import GroupHeader from '@/library/navigation/GroupHeader'
import ListItem from '@/library/display/ListItem'
import Avatar from '@/library/display/Avatar'
import Badge from '@/library/display/Badge'
import Text from '@/library/foundations/Text'
import EmptyState from '@/library/feedback/EmptyState'
import { RiStarLine } from '@remixicon/react'
import {
  getFavoriteAssets, formatBRL, formatPercentChange, isVolatile,
  CATEGORY_INFO,
} from './shared/data'

export default function Screen5_Favorites({ onBack, onNext, onElementTap }: FlowScreenProps) {
  const favorites = getFavoriteAssets()

  return (
    <BaseLayout>
      <Header title="Favoritos" onBack={onBack} />

      {favorites.length === 0 ? (
        <EmptyState
          icon={<RiStarLine size={40} />}
          title="Nenhum favorito ainda"
          description="Toque na estrela de um ativo para adicioná-lo aqui."
        />
      ) : (
        <Stack gap="none">
          <GroupHeader text="Seus favoritos" subtitle={`${favorites.length} ativos`} />
          {favorites.map((asset) => {
            const volatile = isVolatile(asset)
            const isFixed = asset.category === 'fixed-income'

            return (
              <ListItem
                key={asset.ticker}
                title={asset.name}
                subtitle={isFixed ? CATEGORY_INFO[asset.category].label : asset.ticker}
                left={<Avatar src={asset.icon} size="md" />}
                right={
                  volatile ? (
                    <Stack gap="none" align="end">
                      <Text variant="body-sm">{formatBRL(asset.price!)}</Text>
                      <Badge
                        variant={asset.change24h! >= 0 ? 'positive' : 'critical'}
                        size="sm"
                      >
                        {formatPercentChange(asset.change24h!)}
                      </Badge>
                    </Stack>
                  ) : isFixed ? (
                    <Badge variant="positive" size="sm">{asset.apyDisplay}</Badge>
                  ) : (
                    <Text variant="body-sm">{formatBRL(asset.price!)}</Text>
                  )
                }
                onPress={() => {
                  const handled = onElementTap?.(`ListItem: ${asset.name}`)
                  if (!handled) onNext()
                }}
              />
            )
          })}
        </Stack>
      )}
    </BaseLayout>
  )
}
