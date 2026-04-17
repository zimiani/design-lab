/**
 * Asset Detail — light theme variant with chart, stats, action buttons.
 */
import { useState, useMemo, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { createChart, type UTCTimestamp } from 'lightweight-charts'
import { RiArrowLeftLine, RiArrowDownLine, RiArrowUpLine } from '@remixicon/react'
import type { FlowScreenProps } from '@/pages/simulator/flowRegistry'
import { useScreenData } from '@/lib/ScreenDataContext'
import type { AssetTicker } from './shared/data'
import { getAsset, formatBRL, formatPct, generateChartData } from './shared/data'

const TIME_RANGES = [
  { key: '1D', days: 1, vol: 0.015 },
  { key: '1S', days: 7, vol: 0.025 },
  { key: '1M', days: 30, vol: 0.04 },
  { key: '1A', days: 365, vol: 0.06 },
  { key: 'MAX', days: 1825, vol: 0.08 },
]

function LightChart({ data, color, height }: {
  data: { time: string; value: number }[]
  color: string
  height: number
}) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !data.length) return

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height,
      layout: { backgroundColor: 'transparent', textColor: 'rgba(0,0,0,0.3)' },
      grid: { vertLines: { visible: false }, horzLines: { visible: false } },
      rightPriceScale: { visible: false, borderVisible: false },
      timeScale: { visible: false, borderVisible: false },
      handleScroll: false,
      handleScale: false,
      crosshair: {
        vertLine: { visible: true, color: 'rgba(0,0,0,0.1)', width: 1, style: 0, labelVisible: false },
        horzLine: { visible: false },
      },
    })

    const rgba = (hex: string, a: number) => {
      const r = parseInt(hex.slice(1, 3), 16)
      const g = parseInt(hex.slice(3, 5), 16)
      const b = parseInt(hex.slice(5, 7), 16)
      return `rgba(${r},${g},${b},${a})`
    }

    const series = chart.addAreaSeries({
      lineColor: color,
      topColor: rgba(color, 0.15),
      bottomColor: rgba(color, 0.0),
      lineWidth: 2,
      lastValueVisible: false,
      priceLineVisible: false,
      crosshairMarkerVisible: true,
      crosshairMarkerRadius: 5,
      crosshairMarkerBackgroundColor: color,
      crosshairMarkerBorderColor: '#FFFFFF',
    })

    series.setData(data.map(d => ({
      time: (new Date(d.time).getTime() / 1000) as UTCTimestamp,
      value: d.value,
    })))

    chart.timeScale().fitContent()

    const onResize = () => {
      if (containerRef.current) chart.applyOptions({ width: containerRef.current.clientWidth })
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      chart.remove()
    }
  }, [data, color, height])

  return <div ref={containerRef} />
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl px-4 py-3 flex-1 bg-gray-50 border border-gray-100">
      <div className="text-[11px] text-gray-400 mb-0.5">{label}</div>
      <div className={`text-[14px] font-semibold ${accent ? 'text-emerald-600' : 'text-gray-900'}`}>
        {value}
      </div>
    </div>
  )
}

interface ScreenData extends Record<string, unknown> {
  assetTicker?: AssetTicker
}

export default function Screen2_AssetPage({ onNext, onBack, onElementTap }: FlowScreenProps) {
  const data = useScreenData<ScreenData>()
  const ticker = data.assetTicker ?? 'BTC'
  const asset = getAsset(ticker)
  const isFixed = asset.category === 'fixed-income'
  const isPositive = (asset.change24h ?? 0) >= 0

  const [rangeIdx, setRangeIdx] = useState(2)
  const range = TIME_RANGES[rangeIdx]

  const chartData = useMemo(
    () => isFixed
      ? generateChartData(range.days, 1000, 0.002)
      : generateChartData(range.days, asset.price!, range.vol),
    [isFixed, range, asset.price],
  )

  const handleBuy = () => {
    const handled = onElementTap?.('Button: Comprar')
    if (!handled) onNext()
  }
  const handleSell = () => {
    const handled = onElementTap?.('Button: Vender')
    if (!handled) onNext()
  }

  return (
    <div className="relative flex flex-col overflow-hidden" style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <div className="flex-1 overflow-y-auto">

      <div className="h-[var(--safe-area-top)]" />
      <div className="px-5 pt-3 pb-1">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center -ml-1 text-gray-600"
        >
          <RiArrowLeftLine size={20} />
        </button>
      </div>

      {/* Price Header */}
      <div className="px-5 pt-2 pb-4">
        <motion.div
          className="flex items-center gap-3 mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: `${asset.color}15` }}
          >
            <img src={asset.icon} alt="" className="w-8 h-8 rounded-full" />
          </div>
          <div>
            <div className="text-[18px] font-bold text-gray-900">{asset.name}</div>
            <div className="text-[13px] text-gray-400">{isFixed ? 'Renda Fixa Digital' : asset.ticker}</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          {isFixed ? (
            <div>
              <div className="text-[42px] font-extrabold tracking-tight leading-none text-gray-900">
                {asset.apyDisplay}
              </div>
              <div className="text-[14px] text-emerald-600 mt-1">Rendimento automático</div>
            </div>
          ) : (
            <div>
              <div className="text-[42px] font-extrabold tracking-tight leading-none text-gray-900">
                {formatBRL(asset.price!)}
              </div>
              <div className={`flex items-center gap-1.5 mt-1 text-[14px] font-semibold ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center ${isPositive ? 'bg-emerald-100' : 'bg-red-100'}`}>
                  {isPositive ? '↑' : '↓'}
                </span>
                {formatPct(asset.change24h!)} (24h)
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Chart */}
      {!isFixed && (
        <>
          <div className="px-5">
            <LightChart data={chartData} color={asset.color} height={200} />
          </div>

          <div className="flex justify-center gap-1 py-3 px-5">
            {TIME_RANGES.map((r, i) => (
              <button
                key={r.key}
                onClick={() => setRangeIdx(i)}
                className={`px-4 py-1.5 rounded-full text-[12px] font-semibold transition-all duration-200 ${
                  rangeIdx === i
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {r.key}
              </button>
            ))}
          </div>
        </>
      )}

      {isFixed && (
        <div className="px-5 py-4">
          <LightChart data={chartData} color="#10B981" height={140} />
          <div className="flex gap-2 mt-4">
            <StatCard label="Rendimento" value={asset.apyDisplay!} accent />
            <StatCard label="Resgate" value="Imediato" accent />
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="px-5 py-4">
        {!isFixed ? (
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <StatCard label="Market Cap" value={asset.marketCap ?? '—'} />
              <StatCard label="Volume 24h" value={asset.volume24h ?? '—'} />
            </div>
            <div className="flex gap-2">
              <StatCard label="Categoria" value={asset.category === 'crypto' ? 'Cripto' : 'Commodity'} />
              {asset.network && <StatCard label="Rede" value={asset.network} />}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <StatCard label="Proteção" value="Cobertura inclusa" />
              <StatCard label="Provedor" value="Aave V3" />
            </div>
          </div>
        )}
      </div>

      {/* About */}
      <div className="px-5 py-4">
        <div className="text-[14px] text-gray-500 leading-relaxed">
          {asset.description}
        </div>
      </div>

      {/* Risk Alert */}
      <div className="px-5 pb-4">
        <div className="rounded-xl px-4 py-3 text-[12px] text-gray-400 bg-gray-50 border border-gray-100">
          {isFixed
            ? 'Investimento protegido por cobertura automática contra falhas técnicas.'
            : 'Ativos de renda variável podem valorizar ou desvalorizar. Rentabilidade passada não garante retorno futuro.'}
        </div>
      </div>

      </div>{/* end scroll */}

      {/* Action Buttons */}
      <div className="flex-shrink-0 px-5 pt-2 pb-[max(var(--safe-area-bottom),20px)]">
        <div className="rounded-2xl p-1 flex gap-1 bg-gray-100">
          <motion.button
            onClick={handleBuy}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-[15px] text-white"
            style={{ background: asset.color }}
            whileTap={{ scale: 0.97 }}
          >
            <RiArrowDownLine size={18} />
            {isFixed ? 'Investir' : 'Comprar'}
          </motion.button>
          {!isFixed && (
            <motion.button
              onClick={handleSell}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-[15px] text-gray-600 bg-white"
              whileTap={{ scale: 0.97 }}
            >
              <RiArrowUpLine size={18} />
              Vender
            </motion.button>
          )}
        </div>
      </div>
    </div>
  )
}
