import type { FlowScreenProps } from '@/pages/simulator/flowRegistry'
import FeedbackLayout from '@/library/layout/FeedbackLayout'
import StickyFooter from '@/library/layout/StickyFooter'
import Stack from '@/library/layout/Stack'
import Button from '@/library/inputs/Button'
import DataList from '@/library/display/DataList'
import GroupHeader from '@/library/navigation/GroupHeader'
import Text from '@/library/foundations/Text'

export default function Screen12_SellSuccess({ onBack, onElementTap }: FlowScreenProps) {
  return (
    <FeedbackLayout onClose={onBack}>
      <Stack gap="sm">
        <Text variant="display">Venda confirmada</Text>
        <Text variant="body-md" color="content-secondary">
          O valor foi adicionado ao seu saldo Picnic.
        </Text>
      </Stack>

      <Stack gap="none">
        <GroupHeader text="Dados da venda" />
        <DataList
          data={[
            { label: 'Ativo', value: 'Bitcoin (BTC)' },
            { label: 'Quantidade', value: '0,00017 BTC' },
            { label: 'Valor total', value: 'R$ 100,00' },
          ]}
        />
      </Stack>

      <StickyFooter>
        <Button fullWidth onPress={() => {
          const handled = onElementTap?.('Button: Ver portfólio')
          if (!handled) onBack()
        }}>
          Ver portfólio
        </Button>
      </StickyFooter>
    </FeedbackLayout>
  )
}
