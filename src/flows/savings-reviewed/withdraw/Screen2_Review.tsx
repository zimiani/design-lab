import type { FlowScreenProps } from '../../../pages/simulator/flowRegistry'
import { useScreenData } from '../../../lib/ScreenDataContext'
import BaseLayout from '../../../library/layout/BaseLayout'
import StickyFooter from '../../../library/layout/StickyFooter'
import Stack from '../../../library/layout/Stack'
import Header from '../../../library/navigation/Header'
import GroupHeader from '../../../library/navigation/GroupHeader'
import Button from '../../../library/inputs/Button'
import DataList from '../../../library/display/DataList'
import Text from '../../../library/foundations/Text'
import { type CaixinhaCurrency, CURRENCIES } from '../shared/data'

export default function Screen2_Review({ onNext, onBack, onElementTap }: FlowScreenProps) {
  const { currency: dataCurrency } = useScreenData<{ currency?: CaixinhaCurrency }>()
  const currency = dataCurrency ?? 'USD'
  const curr = CURRENCIES[currency]

  return (
    <BaseLayout>
      <Header title="" onBack={onBack} />

      <Text variant="heading-lg">Confirme o resgate</Text>

      <Stack gap="none">
        <GroupHeader text="Detalhes do resgate" />
        <DataList data={[
          { label: 'Valor', value: `${curr.symbol} 100,00` },
          { label: 'Caixinha', value: 'Reserva de emergência' },
          { label: 'Destino', value: 'Saldo do Cartão' },
          { label: 'Taxa', value: 'Grátis' },
          {
            label: 'Prazo',
            value: <span className="text-[var(--color-feedback-success)] font-medium">Imediato</span>,
          },
        ]} />
      </Stack>

      <StickyFooter>
        <Button fullWidth onPress={() => {
          const handled = onElementTap?.('Button: Confirmar resgate')
          if (!handled) onNext()
        }}>
          Confirmar resgate
        </Button>
      </StickyFooter>
    </BaseLayout>
  )
}
