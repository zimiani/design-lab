/**
 * Investment Withdraw — Review
 * Follows savings-reviewed withdraw/Screen2_Review pattern.
 */
import type { FlowScreenProps } from '@/pages/simulator/flowRegistry'
import { useScreenData } from '@/lib/ScreenDataContext'
import Header from '@/library/navigation/Header'
import BaseLayout from '@/library/layout/BaseLayout'
import StickyFooter from '@/library/layout/StickyFooter'
import Stack from '@/library/layout/Stack'
import Button from '@/library/inputs/Button'
import DataList from '@/library/display/DataList'
import GroupHeader from '@/library/navigation/GroupHeader'
import Alert from '@/library/display/Alert'
import type { AssetTicker } from '../shared/data'
import { getAsset, isVolatile } from '../shared/data'

export default function Screen2_Review({ onNext, onBack, onElementTap }: FlowScreenProps) {
  const { assetTicker } = useScreenData<{ assetTicker?: AssetTicker }>()
  const ticker = assetTicker ?? 'BTC'
  const asset = getAsset(ticker)
  const volatile = isVolatile(asset)

  return (
    <BaseLayout>
      <Header title="Revise os dados" onBack={onBack} />

      <Stack gap="default">
        <Stack gap="none">
          <GroupHeader text={volatile ? 'Detalhes da venda' : 'Detalhes do resgate'} />
          <DataList data={[
            { label: 'Ativo', value: asset.name },
            ...(volatile
              ? [{ label: 'Quantidade estimada', value: `0,00017 ${ticker}` }]
              : []
            ),
            { label: volatile ? 'Valor estimado' : 'Você está resgatando', value: 'R$ 100,00' },
            { label: 'Destino', value: volatile ? 'Saldo Picnic' : 'Saldo do Cartão' },
            {
              label: 'Prazo',
              value: <span className="text-[var(--color-feedback-success)] font-medium">Imediato</span>,
            },
            {
              label: 'Nossa taxa',
              value: <span className="text-[var(--color-feedback-success)] font-medium">Grátis</span>,
            },
          ]} />
        </Stack>

        {!volatile && (
          <Stack gap="none">
            <GroupHeader text="Sobre o investimento" />
            <DataList data={[
              { label: 'Saldo após resgate', value: 'R$ 972,40' },
            ]} />
          </Stack>
        )}

        {/* TP/SL summary (conditional — shown when TP or SL was configured) */}
        {volatile && (
          <Stack gap="none">
            <GroupHeader text="Ordens automáticas" />
            <DataList data={[
              {
                label: 'Take Profit',
                value: <span className="text-[var(--color-feedback-success)] font-medium">R$ 620.000,00 (+10%)</span>,
              },
              {
                label: 'Stop Loss',
                value: <span className="text-[var(--color-feedback-error)] font-medium">R$ 480.000,00 (-15%)</span>,
              },
            ]} />
          </Stack>
        )}

        <Alert
          variant="neutral"
          title={volatile ? 'Preço pode variar' : 'Resgate imediato'}
          description={volatile
            ? 'O valor final depende da cotação no momento da execução da ordem.'
            : 'O valor é creditado direto no saldo do seu cartão, sem carência.'
          }
        />
      </Stack>

      <StickyFooter>
        <Button fullWidth onPress={() => {
          const label = volatile ? 'Button: Confirmar venda' : 'Button: Confirmar resgate'
          const handled = onElementTap?.(label)
          if (!handled) onNext()
        }}>
          {volatile ? 'Confirmar venda' : 'Confirmar resgate'}
        </Button>
      </StickyFooter>
    </BaseLayout>
  )
}
