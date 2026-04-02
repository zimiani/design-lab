/**
 * Asset Detail — immersive dark page with TradingView area chart, glass stats cards,
 * animated price display, and full-bleed gradient.
 * Uses lightweight-charts via LineChart component with crosshair tracking.
 */
import { useState, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { RiArrowLeftLine, RiArrowDownLine, RiArrowUpLine } from '@remixicon/react'
import type { FlowScreenProps } from '@/pages/simulator/flowRegistry'
import { useScreenData } from '@/lib/ScreenDataContext'
import type { AssetTicker } from './shared/data'
import { getAsset, formatBRL, generateChartData } from './shared/data'
import LineChart from '@/library/display/LineChart'
import type { LineChartCrosshairData } from '@/library/display/LineChart'
import DataList from '@/library/display/DataList'
import ListItem from '@/library/display/ListItem'
import Avatar from '@/library/display/Avatar'
import GroupHeader from '@/library/navigation/GroupHeader'
import Stack from '@/library/layout/Stack'

const TIME_RANGES = [
  { key: '1D', days: 1, vol: 0.015 },
  { key: '1S', days: 7, vol: 0.025 },
  { key: '1M', days: 30, vol: 0.04 },
  { key: '1A', days: 365, vol: 0.06 },
  { key: 'MAX', days: 1825, vol: 0.08 },
]

// ── Stat Card (glassmorphism) ──

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div
      className="rounded-xl px-4 py-3 flex-1"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="text-[11px] text-white/40 mb-0.5">{label}</div>
      <div className={`text-[14px] font-semibold ${accent ? 'text-emerald-400' : 'text-white'}`}>
        {value}
      </div>
    </div>
  )
}

// ── Main Screen ──

interface TransactionEntry {
  type: 'buy' | 'sell'
  title: string
  value: string
  date: string
}

interface ScreenData extends Record<string, unknown> {
  assetTicker?: AssetTicker
  transactions?: TransactionEntry[]
}

function formatCrosshairDate(isoDate: string): string {
  const d = new Date(isoDate + 'T12:00:00')
  const day = d.getDate()
  const month = d.toLocaleString('pt-BR', { month: 'long' })
  const monthCap = month.charAt(0).toUpperCase() + month.slice(1)
  return `em ${day} de ${monthCap}`
}

export default function Screen2_AssetPage({ onNext, onBack, onElementTap }: FlowScreenProps) {
  const data = useScreenData<ScreenData>()
  const ticker = data.assetTicker ?? 'BTC'
  const asset = getAsset(ticker)
  const isFixed = asset.category === 'fixed-income'

  const [rangeIdx, setRangeIdx] = useState(2) // 1M
  const range = TIME_RANGES[rangeIdx]

  // Generate chart data — already returns { time: string; value: number }[]
  const chartData = useMemo(() => {
    return isFixed
      ? generateChartData(range.days, 1000, 0.002)
      : generateChartData(range.days, asset.price!, range.vol)
  }, [isFixed, range, asset.price])

  // Crosshair tracking state
  const [crosshairPoint, setCrosshairPoint] = useState<LineChartCrosshairData | null>(null)

  const handleCrosshairMove = useCallback((point: LineChartCrosshairData | null) => {
    setCrosshairPoint(point)
  }, [])

  // Displayed values based on crosshair position
  const currentPrice = isFixed ? chartData[chartData.length - 1].value : asset.price!
  const displayPrice = crosshairPoint ? crosshairPoint.value : currentPrice
  const firstValue = chartData[0].value
  const changePct = ((displayPrice - firstValue) / firstValue) * 100

  const handleBuy = () => {
    const handled = onElementTap?.('Button: Comprar')
    if (!handled) onNext()
  }
  const handleSell = () => {
    const handled = onElementTap?.('Button: Vender')
    if (!handled) onNext()
  }

  return (
    <div className="relative flex flex-col text-white overflow-hidden" style={{ background: '#0a0a0f', minHeight: '100vh' }}>
      {/* Background glow */}
      <div
        className="absolute top-[-60px] left-1/2 -translate-x-1/2 w-[200px] h-[200px] rounded-full opacity-20 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${asset.color}60 0%, transparent 70%)` }}
      />

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto">

      {/* Safe area + back button */}
      <div className="h-[var(--safe-area-top)]" />
      <div className="px-5 pt-3 pb-1">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/[0.06] flex items-center justify-center -ml-1"
        >
          <RiArrowLeftLine size={20} />
        </button>
      </div>

      {/* ── Price Header ── */}
      <motion.div
        className="flex items-center gap-4 px-5 pt-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
          style={{ background: `${asset.color}25` }}
        >
          <img src={asset.icon} alt="" className="w-7 h-7 rounded-full" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-[15px] font-semibold text-white/50">{asset.name} <span className="font-normal text-white/30">{isFixed ? '' : asset.ticker}</span></div>
          {isFixed ? (
            <>
              <div className="text-[36px] font-extrabold tracking-tight leading-none mt-0.5">
                {crosshairPoint ? formatBRL(displayPrice) : asset.apyDisplay}
              </div>
              <div className="text-[13px] text-emerald-400 mt-0.5">
                {crosshairPoint ? formatCrosshairDate(crosshairPoint.time) : 'Rendimento automático'}
              </div>
            </>
          ) : (
            <>
              <div className="text-[36px] font-extrabold tracking-tight leading-none mt-0.5">
                {formatBRL(displayPrice)}
              </div>
              <div className={`flex items-center gap-1.5 mt-0.5 text-[13px] font-semibold ${changePct >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${changePct >= 0 ? 'bg-emerald-400/15' : 'bg-red-400/15'}`}>
                  {changePct >= 0 ? '↑' : '↓'}
                </span>
                {changePct >= 0 ? '+' : ''}{changePct.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%
                {' '}
                <span className="text-white/40 font-normal">
                  {crosshairPoint ? formatCrosshairDate(crosshairPoint.time) : `(${range.key})`}
                </span>
              </div>
            </>
          )}
        </div>
      </motion.div>

      {/* ── Chart ── */}
      {!isFixed && (
        <>
          <div className="px-5">
            <LineChart
              data={chartData}
              height={200}
              variant="area"
              color={asset.color}
              smooth
              dark
              onCrosshairMove={handleCrosshairMove}
            />
          </div>

          {/* Time range selector */}
          <div className="flex justify-center gap-1 py-3 px-5">
            {TIME_RANGES.map((r, i) => (
              <button
                key={r.key}
                onClick={() => setRangeIdx(i)}
                className={`px-4 py-1.5 rounded-full text-[12px] font-semibold transition-all duration-200 ${
                  rangeIdx === i
                    ? 'bg-white text-black'
                    : 'text-white/40 hover:text-white/60'
                }`}
              >
                {r.key}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Fixed income — yield visualization */}
      {isFixed && (
        <div className="px-5 py-4">
          <LineChart
            data={chartData}
            height={140}
            variant="area"
            color="#10B981"
            smooth
            dark
            onCrosshairMove={handleCrosshairMove}
          />
          <div className="flex gap-2 mt-4">
            <StatCard label="Rendimento" value={asset.apyDisplay!} accent />
            <StatCard label="Resgate" value="Imediato" accent />
          </div>
        </div>
      )}

      {/* ── Details + About (DataList) ── */}
      <div
        className="px-5 py-4"
        style={{
          '--color-content-primary': '#ffffff',
          '--color-content-secondary': 'rgba(255,255,255,0.5)',
          '--color-content-tertiary': 'rgba(255,255,255,0.3)',
          '--color-surface-primary': 'transparent',
          '--color-surface-shade': 'rgba(255,255,255,0.06)',
          '--token-neutral-100': 'rgba(255,255,255,0.08)',
        } as React.CSSProperties}
      >
        {!isFixed ? (
          <DataList
            variant="vertical"
            data={[
              [
                { label: 'Market Cap', value: asset.marketCap ?? '—' },
                { label: 'Volume 24h', value: asset.volume24h ?? '—' },
              ],
              [
                { label: 'Categoria', value: asset.category === 'crypto' ? 'Cripto' : 'Commodity' },
                ...(asset.network ? [{ label: 'Rede', value: asset.network }] : []),
              ],
              { label: 'Sobre', value: <span className="font-normal text-white/50 leading-relaxed text-[14px]">{asset.description}</span> },
            ]}
          />
        ) : (
          <DataList
            variant="vertical"
            data={[
              [
                { label: 'Proteção', value: 'Cobertura inclusa' },
                { label: 'Provedor', value: 'Aave V3' },
              ],
              { label: 'Sobre', value: <span className="font-normal text-white/50 leading-relaxed text-[14px]">{asset.description}</span> },
            ]}
          />
        )}
      </div>

      {/* ── Transaction History ── */}
      {data.transactions && data.transactions.length > 0 && (
        <div
          className="px-5"
          style={{
            '--color-content-primary': '#ffffff',
            '--color-content-secondary': 'rgba(255,255,255,0.5)',
            '--color-content-tertiary': 'rgba(255,255,255,0.3)',
            '--color-surface-primary': 'transparent',
            '--color-surface-shade': 'rgba(255,255,255,0.06)',
            '--token-neutral-100': 'rgba(255,255,255,0.08)',
          } as React.CSSProperties}
        >
          <Stack gap="none">
            <GroupHeader text="Atividade recente" />
            {data.transactions.map((tx, i) => (
              <ListItem
                key={i}
                title={tx.title}
                subtitle={tx.date}
                left={
                  <Avatar
                    icon={tx.type === 'buy' ? <RiArrowDownLine size={20} /> : <RiArrowUpLine size={20} />}
                    size="md"
                    bgColor="rgba(255,255,255,0.06)"
                    iconColor="#ffffff"
                  />
                }
                right={
                  <span className="text-[14px] text-white/60">{tx.value}</span>
                }
                trailing={null}
              />
            ))}
          </Stack>
        </div>
      )}

      {/* ── Risk Banner ── */}
      <div className="px-5 pb-4">
        <div
          className="rounded-xl px-4 py-3 text-[12px] text-white/40"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
        >
          {isFixed
            ? 'Investimento protegido por cobertura automática contra falhas técnicas.'
            : 'Ativos de renda variável podem valorizar ou desvalorizar. Rentabilidade passada não garante retorno futuro.'}
        </div>
      </div>

      </div>{/* end scroll */}

      {/* ── Action Buttons (fixed at bottom) ── */}
      <div className="flex-shrink-0 px-5 pt-2 pb-[max(var(--safe-area-bottom),20px)]">
        <div
          className="rounded-2xl p-1 flex gap-1"
          style={{
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <motion.button
            onClick={handleBuy}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-[15px] text-black"
            style={{ background: asset.color }}
            whileTap={{ scale: 0.97 }}
          >
            <RiArrowDownLine size={18} />
            {isFixed ? 'Investir' : 'Comprar'}
          </motion.button>
          {!isFixed && (
            <motion.button
              onClick={handleSell}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-[15px] text-white/70 bg-white/[0.06]"
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
