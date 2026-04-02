/**
 * Investment Deposit — Review
 * Follows savings-reviewed deposit/Screen2_Review pattern.
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
import Banner from '@/library/display/Banner'
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
          <GroupHeader text="Detalhes da operação" />
          <DataList data={[
            { label: 'Ativo', value: asset.name },
            ...(volatile
              ? [
                  { label: 'Valor', value: 'R$ 100,00' },
                  { label: 'Quantidade estimada', value: `0,00017 ${ticker}` },
                ]
              : [
                  { label: 'Valor', value: 'R$ 100,00' },
                  { label: 'Prazo', value: 'Instantâneo' },
                ]
            ),
            {
              label: 'Nossa taxa',
              value: <span className="text-[var(--color-feedback-success)] font-medium">Grátis</span>,
            },
          ]} />
        </Stack>

        {!volatile && (
          <Stack gap="none">
            <GroupHeader text="Sobre o rendimento" />
            <DataList data={[
              { label: 'Rendimento atual', value: asset.apyDisplay ?? '—' },
              {
                label: 'Resgate',
                value: <span className="text-[var(--color-feedback-success)] font-medium">Imediato</span>,
              },
              { label: 'Proteção', value: 'Cobertura inclusa' },
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

        <Banner
          variant="neutral"
          title={volatile ? 'Preço pode variar' : 'Resgate imediato'}
          description={volatile
            ? 'O valor final depende da cotação no momento da execução da ordem.'
            : 'Você pode resgatar a qualquer momento, sem carência e sem penalidade.'
          }
        />
      </Stack>

      <StickyFooter>
        <Button fullWidth onPress={() => {
          const handled = onElementTap?.('Button: Confirmar compra')
          if (!handled) onNext()
        }}>
          Confirmar compra
        </Button>
      </StickyFooter>
    </BaseLayout>
  )
}
