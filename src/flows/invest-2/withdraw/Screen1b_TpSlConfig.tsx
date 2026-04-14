/**
 * Investment Withdraw — TP/SL Config (Sell)
 * Mirrors the buy version but with sell context header.
 */
import { useState, useMemo } from 'react'
import type { FlowScreenProps } from '@/pages/simulator/flowRegistry'
import { useScreenData } from '@/lib/ScreenDataContext'
import Header from '@/library/navigation/Header'
import BaseLayout from '@/library/layout/BaseLayout'
import StickyFooter from '@/library/layout/StickyFooter'
import Stack from '@/library/layout/Stack'
import Button from '@/library/inputs/Button'
import Toggle from '@/library/inputs/Toggle'
import LineChart from '@/library/display/LineChart'
import Text from '@/library/foundations/Text'
import type { AssetTicker } from '../shared/data'
import { getAsset, formatBRL, generatePriceChartData } from '../shared/data'
import { PriceLevelLine, PriceInputSheet, TpSlSummaryCard } from '../deposit/Screen1b_TpSlConfig.parts'

export default function Screen1b_TpSlConfig({ onNext, onBack, onElementTap }: FlowScreenProps) {
  const { assetTicker } = useScreenData<{ assetTicker?: AssetTicker }>()
  const ticker = assetTicker ?? 'BTC'
  const asset = getAsset(ticker)
  const currentPrice = asset.price ?? 565000

  // TP/SL enabled state
  const [tpEnabled, setTpEnabled] = useState(false)
  const [slEnabled, setSlEnabled] = useState(false)

  // TP/SL price values — default to +10% / -10%
  const [tpPrice, setTpPrice] = useState(() => Math.round(currentPrice * 1.10))
  const [slPrice, setSlPrice] = useState(() => Math.round(currentPrice * 0.90))

  // Sheet open states
  const [tpSheetOpen, setTpSheetOpen] = useState(false)
  const [slSheetOpen, setSlSheetOpen] = useState(false)

  // Chart data — 30 days
  const chartData = useMemo(
    () => generatePriceChartData(30, currentPrice, 0.04),
    [currentPrice],
  )

  const canContinue = tpEnabled || slEnabled

  return (
    <BaseLayout>
      <Header title="Configurar TP/SL (Venda)" onBack={onBack} />

      <Stack gap="default">
        {/* Current price display */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[var(--token-spacing-8)]">
            <img
              src={asset.icon}
              alt={asset.name}
              className="w-[24px] h-[24px] rounded-full object-cover"
            />
            <Text variant="body-sm" className="font-medium text-content-primary">
              {asset.name}
            </Text>
          </div>
          <Text variant="body-sm" className="font-semibold text-content-primary">
            {formatBRL(currentPrice)}
          </Text>
        </div>

        {/* Chart with TP/SL overlay lines */}
        <div className="relative">
          <LineChart
            data={chartData}
            height={180}
            variant="area"
            smooth
            lineWidth={2}
          />
          {tpEnabled && (
            <PriceLevelLine
              price={tpPrice}
              label="TP"
              color="#10B981"
              position="above"
            />
          )}
          {slEnabled && (
            <PriceLevelLine
              price={slPrice}
              label="SL"
              color="#EF4444"
              position="below"
            />
          )}
        </div>

        {/* Take Profit toggle row */}
        <div className="flex items-center justify-between py-[var(--token-spacing-8)]">
          <div className="flex flex-col gap-[2px] flex-1 min-w-0">
            <Text variant="body-md" className="font-medium text-content-primary">
              Take Profit
            </Text>
            {tpEnabled && (
              <button
                type="button"
                onClick={() => setTpSheetOpen(true)}
                className="text-left cursor-pointer"
              >
                <Text variant="body-sm" className="text-[var(--color-feedback-success)] font-medium underline decoration-dotted underline-offset-2">
                  {formatBRL(tpPrice)}
                </Text>
              </button>
            )}
          </div>
          <Toggle checked={tpEnabled} onChange={setTpEnabled} />
        </div>

        {/* Stop Loss toggle row */}
        <div className="flex items-center justify-between py-[var(--token-spacing-8)]">
          <div className="flex flex-col gap-[2px] flex-1 min-w-0">
            <Text variant="body-md" className="font-medium text-content-primary">
              Stop Loss
            </Text>
            {slEnabled && (
              <button
                type="button"
                onClick={() => setSlSheetOpen(true)}
                className="text-left cursor-pointer"
              >
                <Text variant="body-sm" className="text-[var(--color-feedback-critical)] font-medium underline decoration-dotted underline-offset-2">
                  {formatBRL(slPrice)}
                </Text>
              </button>
            )}
          </div>
          <Toggle checked={slEnabled} onChange={setSlEnabled} />
        </div>

        {/* Summary card when at least one is active */}
        <TpSlSummaryCard
          tp={tpEnabled ? tpPrice : undefined}
          sl={slEnabled ? slPrice : undefined}
          currentPrice={currentPrice}
        />
      </Stack>

      {/* TP price input sheet */}
      <PriceInputSheet
        open={tpSheetOpen}
        onClose={() => setTpSheetOpen(false)}
        title="Take Profit"
        currentPrice={currentPrice}
        direction="up"
        onConfirm={setTpPrice}
      />

      {/* SL price input sheet */}
      <PriceInputSheet
        open={slSheetOpen}
        onClose={() => setSlSheetOpen(false)}
        title="Stop Loss"
        currentPrice={currentPrice}
        direction="down"
        onConfirm={setSlPrice}
      />

      <StickyFooter>
        <Button
          fullWidth
          disabled={!canContinue}
          onPress={() => {
            const handled = onElementTap?.('Button: Continuar')
            if (!handled) onNext()
          }}
        >
          Continuar
        </Button>
      </StickyFooter>
    </BaseLayout>
  )
}
