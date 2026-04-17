import { useState, useEffect } from 'react'
import {
  RiUser3Line,
  RiEyeLine,
  RiEyeOffLine,
  RiQuestionLine,
  RiAlertLine,
} from '@remixicon/react'

import type { FlowScreenProps } from '../../pages/simulator/flowRegistry'
import { useScreenData } from '../../lib/ScreenDataContext'
import BaseLayout from '../../library/layout/BaseLayout'
import Stack from '../../library/layout/Stack'
import Text from '../../library/foundations/Text'
import Avatar from '../../library/display/Avatar'
import Badge from '../../library/display/Badge'
import ListItem from '../../library/display/ListItem'
import Button from '../../library/inputs/Button'
import BottomSheet from '../../library/layout/BottomSheet'

import { BalanceCard, QuickActions, EarnStatusCard, PromoCarousel, TransactionList } from './Screen1_Dashboard.parts'

export default function Screen1_Dashboard({
  onElementTap,
  onStateChange,
}: FlowScreenProps) {
  const data = useScreenData<Record<string, unknown>>()
  const valuesHidden = data.valuesHidden as boolean | undefined
  const hasPendingTask = data.hasPendingTask as boolean | undefined
  const balanceUpdating = data.balanceUpdating as boolean | undefined

  const [hidden, setHidden] = useState<boolean>(valuesHidden ?? false)
  const [sheetOpen, setSheetOpen] = useState(false)

  // Report state changes
  useEffect(() => {
    if (!onStateChange) return
    if (balanceUpdating) {
      onStateChange('updating')
    } else if (hasPendingTask) {
      onStateChange('pending-task')
    } else if (hidden) {
      onStateChange('hidden')
    } else {
      onStateChange('default')
    }
  }, [hidden, hasPendingTask, balanceUpdating, onStateChange])

  const handleEyeToggle = () => {
    onElementTap?.('Avatar: Mostrar/Ocultar')
    setHidden((prev) => !prev)
  }

  return (
    <BaseLayout>
      {/* Custom navbar — full width, breaks out of BaseLayout padding */}
      <div className="-mx-[var(--token-spacing-24)] px-[var(--token-spacing-24)] flex items-center">
        <Avatar
          size="md"
          icon={<RiUser3Line size={20} />}
          bgColor="#9747ff"
          iconColor="#fff"
        />
        <Stack direction="row" gap="sm" align="center" className="ml-auto">
          <Badge variant="neutral" size="sm">R$ 5,45</Badge>
          <Avatar
            icon={hidden ? <RiEyeOffLine size={20} /> : <RiEyeLine size={20} />}
            size="md"
            onPress={handleEyeToggle}
          />
          <Avatar
            icon={<RiQuestionLine size={20} />}
            size="md"
          />
        </Stack>
      </div>

      {/* Balance card */}
      <BalanceCard hidden={hidden} updating={balanceUpdating ?? false} />

      {/* Quick actions */}
      <QuickActions onElementTap={onElementTap} />

      {/* Earn status card */}
      <EarnStatusCard onPress={() => onElementTap?.('Card: Caixinha do Dólar')} />

      {/* Promo carousel */}
      <PromoCarousel />

      {/* Pending task */}
      {hasPendingTask && (
        <ListItem
          title="1 Tarefa pendente"
          subtitle="Resgate seu cashback"
          left={
            <Avatar
              size="md"
              icon={<RiAlertLine size={16} />}
              bgColor="#fef3c7"
              iconColor="#f59e0b"
            />
          }
          onPress={() => {
            onElementTap?.('ListItem: Tarefas pendentes')
            setSheetOpen(true)
          }}
        />
      )}

      {/* Transaction history */}
      <TransactionList hidden={hidden} onElementTap={onElementTap} />

      {/* Pending task bottom sheet */}
      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Resgate seu cashback">
        <Stack gap="default">
          <Text variant="body-sm">
            Você tem cashback disponível para resgate. Aproveite e resgate agora para usar na sua próxima compra.
          </Text>
          <Button fullWidth onPress={() => setSheetOpen(false)}>
            Resgatar
          </Button>
        </Stack>
      </BottomSheet>
    </BaseLayout>
  )
}
