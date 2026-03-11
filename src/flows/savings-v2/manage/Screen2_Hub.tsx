import { useState, useCallback } from 'react'
import type { FlowScreenProps } from '../../../pages/simulator/flowRegistry'
import { useScreenData } from '../../../lib/ScreenDataContext'
import type { LineChartCrosshairData } from '../../../library/display/LineChart'
import BaseLayout from '../../../library/layout/BaseLayout'
import Stack from '../../../library/layout/Stack'
import Header from '../../../library/navigation/Header'
import SegmentedControl from '../../../library/navigation/SegmentedControl'
import ShortcutButton from '../../../library/inputs/ShortcutButton'
import Badge from '../../../library/display/Badge'
import Avatar from '../../../library/display/Avatar'
import LineChart from '../../../library/display/LineChart'
import Text from '../../../library/foundations/Text'
import { RiArrowUpLine, RiArrowDownLine, RiShieldCheckLine } from '@remixicon/react'

import { BalanceDisplay, DetailsTab, HistoryTab } from '../../savings-reviewed/manage/Screen2_Hub.parts'
import {
  CURRENCIES,
  formatBrlEquivalent,
  generateYieldChartData,
} from '../../savings-reviewed/shared/data'

interface ScreenData {
  hasBalance?: boolean
  [key: string]: unknown
}

export default function Screen2_Hub({ onNext, onBack, onElementTap }: FlowScreenProps) {
  const data = useScreenData<ScreenData>()
  const hasBalance = data.hasBalance ?? true
  const balance = hasBalance ? 2500.00 : 0

  const currInfo = CURRENCIES.USD
  const [activeTab, setActiveTab] = useState(0)
  const [crosshairPoint, setCrosshairPoint] = useState<LineChartCrosshairData | null>(null)

  const chartData = generateYieldChartData(30, balance || 100, currInfo.apy)
  const handleCrosshairMove = useCallback((p: LineChartCrosshairData | null) => setCrosshairPoint(p), [])

  const displayValue = crosshairPoint ? crosshairPoint.value : balance
  const brlEquiv = formatBrlEquivalent(displayValue, 'USD')

  const handleAdicionar = () => {
    const resolved = onElementTap?.('ShortcutButton: Adicionar')
    if (!resolved) onNext()
  }
  const handleResgatar = () => {
    const resolved = onElementTap?.('ShortcutButton: Resgatar')
    if (!resolved) onNext()
  }
  const handleViewPolicy = () => {
    const resolved = onElementTap?.('Button: Ver apólice')
    if (!resolved) onNext()
  }

  return (
    <BaseLayout>
      <Header title="" onBack={onBack} />

      <Stack gap="lg">
        {/* Colored header */}
        <div className="rounded-2xl bg-gradient-to-br from-[var(--color-brand-core-500)] to-[var(--color-brand-core-300)] p-5">
          <Stack gap="default">
            <Stack direction="row" gap="default" align="center">
              <Avatar
                icon={<img src={currInfo.flagIcon} alt="" className="w-6 h-6 rounded-full object-cover" />}
                size="lg"
                bgColor="rgba(255,255,255,0.2)"
                iconColor="#ffffff"
              />
              <Stack gap="none" className="flex-1">
                <Text variant="heading-md" className="text-white">Caixinha do dólar</Text>
                <Stack direction="row" gap="sm" align="center" className="mt-1">
                  <Badge variant="lime" size="md">{currInfo.apyDisplay}</Badge>
                  <Badge variant="success" size="md">Resgate imediato</Badge>
                </Stack>
              </Stack>
            </Stack>

            {balance > 0 ? (
              <Stack gap="none">
                <Text variant="body-sm" className="text-white/70">Saldo atual</Text>
                <BalanceDisplay value={displayValue} symbol={currInfo.symbol} inverted />
                {brlEquiv && (
                  <Text variant="body-sm" className="text-white/60">{brlEquiv}</Text>
                )}
              </Stack>
            ) : (
              <Stack gap="sm">
                <Text variant="heading-sm" className="text-white/70">Saldo zerado</Text>
                <Text variant="body-sm" className="text-white/50">
                  Adicione fundos para começar a render.
                </Text>
              </Stack>
            )}

            {/* Insurance callout */}
            <div className="flex items-center gap-2 pt-3 border-t border-white/15">
              <RiShieldCheckLine size={16} className="text-white/60 shrink-0" />
              <Text variant="caption" className="text-white/60">
                Investimento assegurado — sem custo adicional
              </Text>
            </div>
          </Stack>
        </div>

        {/* Chart */}
        {balance > 0 && (
          <LineChart data={chartData} height={160} onCrosshairMove={handleCrosshairMove} />
        )}

        {/* Shortcut buttons — only deposit + withdraw */}
        <Stack direction="row" gap="default" align="center">
          <ShortcutButton
            icon={<RiArrowDownLine size={22} />}
            label="Adicionar"
            variant="primary"
            onPress={handleAdicionar}
          />
          <ShortcutButton
            icon={<RiArrowUpLine size={22} />}
            label="Resgatar"
            variant="secondary"
            onPress={handleResgatar}
            disabled={balance === 0}
          />
        </Stack>

        {/* Tabs */}
        <SegmentedControl
          segments={['Detalhes', 'Histórico']}
          activeIndex={activeTab}
          onChange={setActiveTab}
        />

        {activeTab === 0 && (
          <DetailsTab
            currency="USD"
            balance={balance}
            onViewPolicy={handleViewPolicy}
          />
        )}
        {activeTab === 1 && <HistoryTab currency="USD" />}
      </Stack>
    </BaseLayout>
  )
}
