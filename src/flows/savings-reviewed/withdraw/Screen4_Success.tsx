import type { FlowScreenProps } from '../../../pages/simulator/flowRegistry'
import { useScreenData } from '../../../lib/ScreenDataContext'
import savingsAnimation from '../../../assets/lottie/savings-success.json'
import FeedbackLayout from '../../../library/layout/FeedbackLayout'
import StickyFooter from '../../../library/layout/StickyFooter'
import Stack from '../../../library/layout/Stack'
import GroupHeader from '../../../library/navigation/GroupHeader'
import Button from '../../../library/inputs/Button'
import DataList from '../../../library/display/DataList'
import Banner from '../../../library/display/Banner'
import Text from '../../../library/foundations/Text'
import { type CaixinhaCurrency, CURRENCIES } from '../shared/data'

export default function Screen4_Success({ onBack, onElementTap }: FlowScreenProps) {
  const { currency: dataCurrency, isZeroBalance } = useScreenData<{ currency?: CaixinhaCurrency; isZeroBalance?: boolean }>()
  const currency = dataCurrency ?? 'USD'
  const curr = CURRENCIES[currency]

  return (
    <FeedbackLayout onClose={onBack} animation={savingsAnimation}>
      <Stack gap="sm">
        <Text variant="display">Resgate concluído</Text>
        <Text variant="body-md" color="content-secondary">
          O valor foi creditado no saldo do seu cartão.
        </Text>
      </Stack>

      <Stack gap="none">
        <GroupHeader text="Detalhes do resgate" />
        <DataList data={[
          { label: 'Valor resgatado', value: `${curr.symbol} 100,00` },
          { label: 'Destino', value: 'Saldo do Cartão' },
          { label: 'Taxa', value: 'Grátis' },
        ]} />
      </Stack>

      {isZeroBalance && (
        <Banner
          variant="warning"
          title="Saldo zerado"
          description="Esta caixinha está sem fundos. Você pode excluí-la se quiser."
        />
      )}

      <StickyFooter>
        <Stack gap="sm">
          {isZeroBalance && (
            <Button fullWidth variant="destructive" onPress={() => {
              const handled = onElementTap?.('Button: Excluir caixinha')
              if (!handled) onBack()
            }}>
              Excluir caixinha
            </Button>
          )}
          <Button fullWidth variant={isZeroBalance ? 'secondary' : 'primary'} onPress={onBack}>
            Concluir
          </Button>
        </Stack>
      </StickyFooter>
    </FeedbackLayout>
  )
}
