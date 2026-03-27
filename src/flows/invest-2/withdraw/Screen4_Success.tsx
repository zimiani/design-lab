/**
 * Investment Withdraw — Success
 * Follows savings-reviewed withdraw/Screen4_Success pattern.
 */
import type { FlowScreenProps } from '@/pages/simulator/flowRegistry'
import { useScreenData } from '@/lib/ScreenDataContext'
import FeedbackLayout from '@/library/layout/FeedbackLayout'
import StickyFooter from '@/library/layout/StickyFooter'
import Stack from '@/library/layout/Stack'
import GroupHeader from '@/library/navigation/GroupHeader'
import Button from '@/library/inputs/Button'
import DataList from '@/library/display/DataList'
import Text from '@/library/foundations/Text'
import type { AssetTicker } from '../shared/data'
import { getAsset, isVolatile } from '../shared/data'

export default function Screen4_Success({ onBack, onElementTap }: FlowScreenProps) {
  const { assetTicker } = useScreenData<{ assetTicker?: AssetTicker }>()
  const ticker = assetTicker ?? 'BTC'
  const asset = getAsset(ticker)
  const volatile = isVolatile(asset)

  return (
    <FeedbackLayout onClose={onBack}>
      <Stack gap="sm">
        <Text variant="display">
          {volatile ? 'Venda confirmada' : 'Resgate concluído'}
        </Text>
        <Text variant="body-md" color="content-secondary">
          {volatile
            ? 'O valor foi adicionado ao seu saldo Picnic.'
            : 'O valor foi creditado no saldo do seu cartão.'
          }
        </Text>
      </Stack>

      <Stack gap="default">
        <Stack gap="none">
          <GroupHeader text={volatile ? 'Resumo da venda' : 'Resumo do resgate'} />
          <DataList data={[
            { label: 'Ativo', value: asset.name },
            ...(volatile
              ? [{ label: 'Quantidade', value: `0,00017 ${ticker}` }]
              : []
            ),
            { label: volatile ? 'Valor recebido' : 'Valor resgatado', value: 'R$ 100,00' },
            { label: 'Destino', value: volatile ? 'Saldo Picnic' : 'Saldo do Cartão' },
            {
              label: 'Nossa taxa',
              value: <span className="text-[var(--color-feedback-success)] font-medium">Grátis</span>,
            },
          ]} />
        </Stack>
      </Stack>

      <StickyFooter>
        <Button fullWidth onPress={() => {
          const handled = onElementTap?.('Button: Entendi')
          if (!handled) onBack()
        }}>
          Entendi
        </Button>
      </StickyFooter>
    </FeedbackLayout>
  )
}
