/**
 * Investment Deposit — Success
 * Follows savings-reviewed deposit/Screen4_Success pattern.
 */
import type { FlowScreenProps } from '@/pages/simulator/flowRegistry'
import { useScreenData } from '@/lib/ScreenDataContext'
import FeedbackLayout from '@/library/layout/FeedbackLayout'
import StickyFooter from '@/library/layout/StickyFooter'
import Stack from '@/library/layout/Stack'
import Button from '@/library/inputs/Button'
import DataList from '@/library/display/DataList'
import GroupHeader from '@/library/navigation/GroupHeader'
import Alert from '@/library/display/Alert'
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
          {volatile ? 'Compra confirmada' : 'Seu dinheiro começa a render em breve'}
        </Text>
        <Text variant="body-md" color="content-secondary">
          {volatile
            ? `Seu investimento em ${asset.name} já está no seu portfólio.`
            : 'Seu depósito está sendo processado e deve ser concluído em até 3 minutos.'
          }
        </Text>
      </Stack>

      <Stack gap="default">
        <Stack gap="none">
          <GroupHeader text="Resumo da operação" />
          <DataList data={[
            { label: 'Ativo', value: asset.name },
            ...(volatile
              ? [{ label: 'Quantidade', value: `0,00017 ${ticker}` }]
              : []
            ),
            { label: 'Valor', value: 'R$ 100,00' },
            ...(!volatile
              ? [
                  { label: 'Rendimento atual', value: asset.apyDisplay ?? '—' },
                  {
                    label: 'Resgate',
                    value: <span className="text-[var(--color-feedback-success)] font-medium">Imediato</span>,
                  },
                ]
              : []
            ),
            {
              label: 'Nossa taxa',
              value: <span className="text-[var(--color-feedback-success)] font-medium">Grátis</span>,
            },
          ]} />
        </Stack>

        <Alert
          variant="neutral"
          title={volatile ? 'Acompanhe seu investimento' : 'Seu saldo está protegido'}
          description={volatile
            ? 'Acompanhe a performance do seu investimento na página do ativo.'
            : 'Seu rendimento é coberto contra falhas técnicas — sem custo adicional.'
          }
        />
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
