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
import { RiArrowUpLine, RiArrowDownLine, RiEditLine, RiDeleteBinLine } from '@remixicon/react'
import { BalanceDisplay, DetailsTab, HistoryTab } from './Screen2_Hub.parts'
import {
  type CaixinhaCurrency,
  CURRENCIES,
  formatBrlEquivalent,
  generateYieldChartData,
} from '../shared/data'
import { ICON_MAP } from '../create/Screen1_NameIcon'

interface ScreenData {
  currency?: CaixinhaCurrency
  balance?: number
  name?: string
  iconId?: string
  isZeroBalance?: boolean
  [key: string]: unknown
}

const DEFAULTS: Record<CaixinhaCurrency, { balance: number; name: string; iconId: string }> = {
  USD: { balance: 2500.00, name: 'Reserva de emergência', iconId: 'shield' },
  BRL: { balance: 5200.00, name: 'Poupança turbinada', iconId: 'money' },
  EUR: { balance: 843.57, name: 'Viagem Europa', iconId: 'plane' },
}

export default function Screen2_Hub({ onNext, onBack, onElementTap }: FlowScreenProps) {
  const data = useScreenData<ScreenData>()
  const currency = data.currency ?? 'USD'
  const isZeroBalance = data.isZeroBalance ?? false
  const defaults = DEFAULTS[currency]
  const balance = isZeroBalance ? 0 : (data.balance ?? defaults.balance)
  const caixinhaName = data.name ?? defaults.name
  const iconId = (data.iconId ?? defaults.iconId) as keyof typeof ICON_MAP
  const currInfo = CURRENCIES[currency]

  const [activeTab, setActiveTab] = useState(0)
  const [crosshairPoint, setCrosshairPoint] = useState<LineChartCrosshairData | null>(null)

  const chartData = generateYieldChartData(30, balance || 100, currInfo.apy)
  const handleCrosshairMove = useCallback((p: LineChartCrosshairData | null) => setCrosshairPoint(p), [])

  const displayValue = crosshairPoint ? crosshairPoint.value : balance

  const IconComp = ICON_MAP[iconId] ?? ICON_MAP.shield
  const brlEquiv = formatBrlEquivalent(displayValue, currency)

  const handleAdicionar = () => {
    const resolved = onElementTap?.('ShortcutButton: Adicionar')
    if (!resolved) onNext()
  }
  const handleResgatar = () => {
    const resolved = onElementTap?.('ShortcutButton: Resgatar')
    if (!resolved) onNext()
  }
  const handleEditName = () => {
    const resolved = onElementTap?.('ShortcutButton: Editar')
    if (!resolved) onNext()
  }
  const handleDelete = () => {
    const resolved = onElementTap?.('ShortcutButton: Excluir')
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
        {/* Colored header area */}
        <div className="rounded-2xl bg-gradient-to-br from-[var(--color-brand-core-500)] to-[var(--color-brand-core-300)] p-5">
          <Stack gap="default">
            <Stack direction="row" gap="default" align="center">
              <Avatar
                icon={<IconComp size={24} />}
                size="lg"
                bgColor="rgba(255,255,255,0.2)"
                iconColor="#ffffff"
              />
              <Stack gap="none" className="flex-1">
                <Text variant="heading-md" className="text-white">{caixinhaName}</Text>
                <Stack direction="row" gap="sm" align="center" className="mt-1">
                  <Badge variant="lime" size="md">{currInfo.apyDisplay}</Badge>
                  <Badge variant="success" size="md">Resgate imediato</Badge>
                </Stack>
              </Stack>
            </Stack>

            {!isZeroBalance && (
              <Stack gap="none">
                <Text variant="body-sm" className="text-white/70">Saldo atual</Text>
                <BalanceDisplay value={displayValue} symbol={currInfo.symbol} inverted />
                {brlEquiv && (
                  <Text variant="body-sm" className="text-white/60">{brlEquiv}</Text>
                )}
              </Stack>
            )}

            {isZeroBalance && (
              <Stack gap="sm">
                <Text variant="heading-sm" className="text-white/70">Saldo zerado</Text>
                <Text variant="body-sm" className="text-white/50">
                  Adicione fundos ou exclua esta caixinha.
                </Text>
              </Stack>
            )}
          </Stack>
        </div>

        {/* Chart */}
        {!isZeroBalance && (
          <LineChart data={chartData} height={160} onCrosshairMove={handleCrosshairMove} />
        )}

        {/* Shortcut buttons */}
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
            disabled={isZeroBalance}
          />
          <ShortcutButton
            icon={<RiEditLine size={22} />}
            label="Editar"
            variant="secondary"
            onPress={handleEditName}
          />
          {isZeroBalance && (
            <ShortcutButton
              icon={<RiDeleteBinLine size={22} />}
              label="Excluir"
              variant="secondary"
              onPress={handleDelete}
            />
          )}
        </Stack>

        {/* Tabs */}
        <SegmentedControl
          segments={['Detalhes', 'Histórico']}
          activeIndex={activeTab}
          onChange={setActiveTab}
        />

        {activeTab === 0 && (
          <DetailsTab
            currency={currency}
            balance={balance}
            onViewPolicy={handleViewPolicy}
          />
        )}
        {activeTab === 1 && <HistoryTab currency={currency} />}
      </Stack>
    </BaseLayout>
  )
}
