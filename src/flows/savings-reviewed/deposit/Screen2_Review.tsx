/**
 * @screen Deposit Review
 * @description Review deposit with instant redemption callout and insurance mention.
 */
import type { FlowScreenProps } from '../../../pages/simulator/flowRegistry'
import { useScreenData } from '../../../lib/ScreenDataContext'
import Header from '../../../library/navigation/Header'
import BaseLayout from '../../../library/layout/BaseLayout'
import StickyFooter from '../../../library/layout/StickyFooter'
import Stack from '../../../library/layout/Stack'
import Button from '../../../library/inputs/Button'
import DataList from '../../../library/display/DataList'
import GroupHeader from '../../../library/navigation/GroupHeader'
import Alert from '../../../library/display/Alert'
import { type CaixinhaCurrency, CURRENCIES } from '../shared/data'

export default function Screen2_Review({ onNext, onBack, onElementTap }: FlowScreenProps) {
  const { currency: dataCurrency } = useScreenData<{ currency?: CaixinhaCurrency }>()
  const currency = dataCurrency ?? 'USD'
  const isEurMode = currency === 'EUR'
  const usdCurr = CURRENCIES.USD
  const eurCurr = CURRENCIES.EUR

  return (
    <BaseLayout>
      <Header title="Revise os dados" onBack={onBack} />

      <Stack gap="default">
        <Stack gap="none">
          <GroupHeader text="Detalhes da operação" />
          <DataList data={[
            ...(isEurMode
              ? [
                  { label: 'Você envia', value: `${eurCurr.symbol} 92,23` },
                  { label: 'Você está guardando', value: `${usdCurr.symbol} 100,00` },
                  { label: 'Prazo de conversão', value: 'Até 3 minutos' },
                ]
              : [
                  { label: 'Você está guardando', value: `${usdCurr.symbol} 100,00` },
                  { label: 'Prazo', value: 'Instantâneo' },
                ]
            ),
            {
              label: 'Nossa taxa',
              value: <span className="text-[var(--color-feedback-success)] font-medium">Grátis</span>,
            },
          ]} />
        </Stack>

        <Stack gap="none">
          <GroupHeader text="Sobre o rendimento" />
          <DataList data={[
            { label: 'Rendimento atual', value: usdCurr.apyDisplay },
            { label: 'Rendimento a partir de', value: isEurMode ? 'Após conversão' : 'Hoje' },
            {
              label: 'Resgate',
              value: <span className="text-[var(--color-feedback-success)] font-medium">Imediato</span>,
            },
            { label: 'Proteção', value: 'Cobertura inclusa' },
          ]} />
        </Stack>

        <Alert
          variant="neutral"
          title="Resgate imediato"
          description="Você pode resgatar a qualquer momento, sem carência e sem penalidade."
        />
      </Stack>

      <StickyFooter>
        <Button fullWidth onPress={() => {
          const handled = onElementTap?.('Button: Confirmar depósito')
          if (!handled) onNext()
        }}>
          Confirmar depósito
        </Button>
      </StickyFooter>
    </BaseLayout>
  )
}
