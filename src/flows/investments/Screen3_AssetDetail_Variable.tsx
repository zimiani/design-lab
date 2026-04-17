import { useState, useMemo } from 'react'
import type { FlowScreenProps } from '@/pages/simulator/flowRegistry'
import { useScreenData } from '@/lib/ScreenDataContext'
import BaseLayout from '@/library/layout/BaseLayout'
import Header from '@/library/navigation/Header'
import StickyFooter from '@/library/layout/StickyFooter'
import Stack from '@/library/layout/Stack'
import Button from '@/library/inputs/Button'
import Alert from '@/library/display/Alert'
import DataList from '@/library/display/DataList'
import GroupHeader from '@/library/navigation/GroupHeader'
import SegmentedControl from '@/library/navigation/SegmentedControl'
import LineChart from '@/library/display/LineChart'
import type { AssetTicker } from './shared/data'
import { getAsset, generatePriceChartData, getCategoryLabel } from './shared/data'
import { PriceHeader } from './Screen3_AssetDetail_Variable.parts'

const TIME_RANGES = ['24h', '1S', '1M', '1A', '5A']
const DAYS_MAP: Record<string, number> = { '24h': 1, '1S': 7, '1M': 30, '1A': 365, '5A': 1825 }

export default function Screen3_AssetDetail_Variable({ onNext, onBack, onElementTap }: FlowScreenProps) {
  const { assetTicker } = useScreenData<{ assetTicker?: AssetTicker }>()
  const asset = getAsset(assetTicker ?? 'BTC')

  const [rangeIndex, setRangeIndex] = useState(2) // default 1M
  const selectedRange = TIME_RANGES[rangeIndex]
  const days = DAYS_MAP[selectedRange]

  const chartData = useMemo(
    () => generatePriceChartData(days, asset.price!, selectedRange === '24h' ? 0.02 : 0.05),
    [days, asset.price, selectedRange],
  )

  const infoData = [
    { label: 'Capitalização', value: asset.marketCap ?? '—' },
    { label: 'Volume 24h', value: asset.volume24h ?? '—' },
    { label: 'Categoria', value: getCategoryLabel(asset.category) },
    ...(asset.network ? [{ label: 'Rede', value: asset.network }] : []),
  ]

  return (
    <BaseLayout>
      <Header title={asset.name} onBack={onBack} />

      <PriceHeader asset={asset} />

      <SegmentedControl
        segments={TIME_RANGES}
        activeIndex={rangeIndex}
        onChange={setRangeIndex}
      />

      <LineChart data={chartData} variant="line" height={200} />

      <Alert
        variant="neutral"
        title="Ativos de renda variável podem valorizar ou desvalorizar"
        description="Rentabilidade passada não garante retorno futuro."
      />

      <Stack gap="none">
        <GroupHeader text="Informações" />
        <DataList data={infoData} />
      </Stack>

      <StickyFooter>
        <Stack direction="row" gap="sm">
          <Button fullWidth onPress={() => {
            const handled = onElementTap?.('Button: Comprar')
            if (!handled) onNext()
          }}>
            Comprar
          </Button>
          <Button fullWidth variant="minimal" onPress={() => {
            const handled = onElementTap?.('Button: Vender')
            if (!handled) onNext()
          }}>
            Vender
          </Button>
        </Stack>
      </StickyFooter>
    </BaseLayout>
  )
}
