/**
 * Open Orders — lists active Take Profit / Stop Loss orders.
 */
import type { FlowScreenProps } from '@/pages/simulator/flowRegistry'
import BaseLayout from '@/library/layout/BaseLayout'
import Header from '@/library/navigation/Header'
import Stack from '@/library/layout/Stack'
import GroupHeader from '@/library/navigation/GroupHeader'
import ListItem from '@/library/display/ListItem'
import Avatar from '@/library/display/Avatar'
import Text from '@/library/foundations/Text'
import EmptyState from '@/library/feedback/EmptyState'
import { RiFileListLine } from '@remixicon/react'
import {
  getActiveOrders, getAsset, formatBRL, formatQuantity,
  type Order,
} from './shared/data'

export default function Screen4_OpenOrders({ onBack, onNext, onElementTap }: FlowScreenProps) {
  const orders: Order[] = getActiveOrders()

  return (
    <BaseLayout>
      <Header title="Ordens abertas" onBack={onBack} />

      {orders.length === 0 ? (
        <EmptyState
          icon={<RiFileListLine size={40} />}
          title="Nenhuma ordem ativa"
          description="Suas ordens de Take Profit e Stop Loss aparecerão aqui."
        />
      ) : (
        <Stack gap="none">
          <GroupHeader text="Ordens ativas" subtitle={`${orders.length} ${orders.length === 1 ? 'ordem' : 'ordens'}`} />
          {orders.map((order) => {
            const asset = getAsset(order.asset)
            const typeLabel = order.type === 'take-profit' ? 'Take Profit' : 'Stop Loss'

            return (
              <ListItem
                key={order.id}
                title={`${asset.name} — ${typeLabel}`}
                subtitle={`Criada em ${order.createdAt}`}
                left={<Avatar src={asset.icon} size="md" />}
                right={
                  <Stack gap="none" align="end">
                    <Text variant="body-sm">{formatBRL(order.triggerPrice)}</Text>
                    <Text variant="caption" color="content-secondary">
                      {formatQuantity(order.quantity, order.asset)}
                    </Text>
                  </Stack>
                }
                onPress={() => {
                  const handled = onElementTap?.('ListItem: Cancelar ordem')
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
