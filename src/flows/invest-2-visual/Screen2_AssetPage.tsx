/**
 * Screen2_AssetPage — Dark-themed asset detail page.
 * Pure custom Tailwind + inline styles + Framer Motion.
 * The ONLY library component used is LineChart (for real charting).
 */
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScreenData } from '@/lib/ScreenDataContext'
import type { FlowScreenProps } from '@/pages/simulator/flowRegistry'
import LineChart from '@/library/display/LineChart'
import {
  BG, BG_CARD, BORDER, TEXT_PRIMARY, TEXT_SECONDARY, TEXT_TERTIARY, TEXT_MUTED,
  GREEN, RED, SAFE_TOP, SAFE_BOTTOM,
  fadeUp, glowBg, glass,
} from './shared/theme'
import { listContainer, listItemY } from './shared/animations'
import { playTap, playSlide } from './shared/sounds'
import {
  getAsset, getAssetColor, getPosition, isVolatile, isFavorite,
  formatBRL, formatPercentChange, formatQuantity,
  generatePriceChartData, generateYieldChartData,
  getMockTransactions, CATEGORY_INFO,
} from './shared/data'
import type { AssetTicker } from './shared/data'

// ── Time ranges ──

const TIME_RANGES = [
  { label: '24h', days: 1 },
  { label: '1S', days: 7 },
  { label: '1M', days: 30 },
  { label: '1A', days: 365 },
  { label: '5A', days: 1825 },
] as const

// ── Shortcut button ──

function ShortcutBtn({ icon, label, color, onPress }: {
  icon: React.ReactNode
  label: string
  color?: string
  onPress?: () => void
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      onClick={onPress}
      className="flex flex-col items-center gap-1.5 border-none cursor-pointer bg-transparent"
    >
      <div
        className="flex items-center justify-center rounded-full"
        style={{
          width: 48, height: 48,
          background: color ?? 'rgba(255,255,255,0.06)',
          border: color ? 'none' : `1px solid ${BORDER}`,
        }}
      >
        {icon}
      </div>
      <span style={{ color: TEXT_SECONDARY, fontSize: 12, fontWeight: 500 }}>{label}</span>
    </motion.button>
  )
}

// ── Glass card row ──

function DetailRow({ label, value, valueColor }: {
  label: string
  value: string
  valueColor?: string
}) {
  return (
    <div
      className="flex items-center justify-between py-3"
      style={{ borderBottom: `1px solid ${BORDER}` }}
    >
      <span style={{ color: TEXT_TERTIARY, fontSize: 13 }}>{label}</span>
      <span style={{ color: valueColor ?? TEXT_PRIMARY, fontSize: 13, fontWeight: 600 }}>
        {value}
      </span>
    </div>
  )
}

// ── Transaction row ──

function TxRow({ type, title, amount, date }: {
  type: 'buy' | 'sell' | 'yield'
  title: string
  amount: string
  date: string
}) {
  const dotColor = type === 'buy' ? GREEN : type === 'sell' ? RED : '#818CF8'
  return (
    <div
      className="flex items-center gap-3 py-3"
      style={{ borderBottom: `1px solid ${BORDER}` }}
    >
      <div className="rounded-full" style={{ width: 8, height: 8, background: dotColor, flexShrink: 0 }} />
      <div className="flex flex-col flex-1 min-w-0">
        <span style={{ color: TEXT_PRIMARY, fontSize: 13, fontWeight: 500 }}>{title}</span>
        <span style={{ color: TEXT_MUTED, fontSize: 11 }}>{date}</span>
      </div>
      <span style={{
        color: type === 'sell' ? RED : TEXT_PRIMARY,
        fontSize: 13,
        fontWeight: 600,
      }}>
        {amount}
      </span>
    </div>
  )
}

// ── Main screen ──

export default function Screen2_AssetPage({ onNext, onBack, onElementTap }: FlowScreenProps) {
  const { assetTicker = 'BTC', invested = false } = useScreenData<{
    assetTicker?: AssetTicker
    invested?: boolean
  }>()

  const asset = getAsset(assetTicker)
  const color = getAssetColor(assetTicker)
  const position = invested ? getPosition(assetTicker) : undefined
  const volatile = isVolatile(asset)
  const [isFav, setIsFav] = useState(() => isFavorite(assetTicker))
  const [activeRange, setActiveRange] = useState(2) // default 1M
  const catInfo = CATEGORY_INFO[asset.category]

  // Chart data
  const chartData = useMemo(() => {
    const days = TIME_RANGES[activeRange].days
    if (volatile) {
      return generatePriceChartData(days, asset.price ?? 100, 0.03)
    }
    return generateYieldChartData(days, position?.currentValue ?? 1000, asset.apy ?? 0.04)
  }, [activeRange, volatile, asset.price, asset.apy, position?.currentValue])

  // P&L calculation
  const pnl = position
    ? position.currentValue - (position.quantity * position.avgCost)
    : 0
  const pnlPercent = position
    ? ((position.currentValue / (position.quantity * position.avgCost)) - 1) * 100
    : 0

  const transactions = invested ? getMockTransactions(assetTicker) : []

  return (
    <div className="relative flex flex-col h-full overflow-hidden" style={{ background: BG }}>
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: glowBg(color, 0.15) }}
      />

      {/* Scrollable content */}
      <div className="relative flex-1 overflow-y-auto" style={{ paddingTop: `calc(${SAFE_TOP} + 8px)` }}>

        {/* Top bar */}
        <motion.div
          className="flex items-center justify-between px-4 mb-6"
          {...fadeUp(0)}
        >
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={onBack}
            className="flex items-center justify-center border-none cursor-pointer bg-transparent"
            style={{ width: 40, height: 40 }}
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => { playTap(); setIsFav(!isFav) }}
            className="flex items-center justify-center border-none cursor-pointer bg-transparent"
            style={{ width: 40, height: 40 }}
          >
            <svg width="24" height="24" fill={isFav ? '#FBBF24' : 'none'} viewBox="0 0 24 24">
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                stroke={isFav ? '#FBBF24' : 'rgba(255,255,255,0.4)'}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>
        </motion.div>

        {/* Asset header */}
        <motion.div className="flex flex-col items-center gap-2 px-4 mb-6" {...fadeUp(0.05)}>
          <div className="flex items-center gap-2 mb-1">
            <img
              src={asset.icon}
              alt={asset.ticker}
              className="rounded-full"
              style={{ width: 40, height: 40 }}
            />
            <span style={{ color: TEXT_PRIMARY, fontSize: 20, fontWeight: 700 }}>{asset.name}</span>
          </div>

          {/* Category badge */}
          <span
            className="rounded-full px-3 py-1"
            style={{
              ...glass,
              fontSize: 11,
              fontWeight: 600,
              color: TEXT_SECONDARY,
            }}
          >
            {catInfo.emoji} {catInfo.label}
          </span>
        </motion.div>

        {/* Price or APY display */}
        <motion.div className="flex flex-col items-center gap-1 px-4 mb-4" {...fadeUp(0.1)}>
          {volatile ? (
            <>
              <AnimatePresence mode="wait">
                <motion.span
                  key={`price-${activeRange}`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    color: TEXT_PRIMARY,
                    fontSize: 42,
                    fontWeight: 800,
                    lineHeight: 1,
                    letterSpacing: -1.5,
                  }}
                >
                  {formatBRL(asset.price ?? 0)}
                </motion.span>
              </AnimatePresence>
              <span
                className="inline-flex items-center rounded-full px-2.5 py-0.5 mt-2"
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: (asset.change24h ?? 0) >= 0 ? GREEN : RED,
                  background: `${(asset.change24h ?? 0) >= 0 ? GREEN : RED}18`,
                }}
              >
                {formatPercentChange(asset.change24h ?? 0)} (24h)
              </span>
            </>
          ) : (
            <>
              <span style={{
                color: GREEN,
                fontSize: 42,
                fontWeight: 800,
                lineHeight: 1,
                letterSpacing: -1.5,
              }}>
                {asset.apyDisplay}
              </span>
              <span style={{ color: TEXT_TERTIARY, fontSize: 13, marginTop: 4 }}>
                Rendimento anual
              </span>
            </>
          )}
        </motion.div>

        {/* Chart */}
        <motion.div className="px-4 mb-2" {...fadeUp(0.15)}>
          <LineChart
            data={chartData}
            height={200}
            variant="area"
            color={color}
            smooth
            lineWidth={2}
            showPriceScale={false}
            showTimeScale={false}
          />
        </motion.div>

        {/* Time range pills */}
        <motion.div className="flex items-center justify-center gap-2 px-4 mb-6" {...fadeUp(0.2)}>
          {TIME_RANGES.map((range, i) => (
            <button
              key={range.label}
              onClick={() => setActiveRange(i)}
              className="relative border-none cursor-pointer rounded-full px-3.5 py-1.5"
              style={{
                background: 'transparent',
                color: i === activeRange ? '#0a0a0f' : TEXT_TERTIARY,
                fontSize: 12,
                fontWeight: 600,
                zIndex: i === activeRange ? 1 : 0,
              }}
            >
              {i === activeRange && (
                <motion.div
                  layoutId="timeRange"
                  className="absolute inset-0 rounded-full"
                  style={{ background: '#fff', zIndex: -1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              {range.label}
            </button>
          ))}
        </motion.div>

        {/* ── Invested state ── */}
        {invested && position ? (
          <>
            {/* Shortcut buttons */}
            <motion.div className="flex items-center justify-center gap-8 px-4 mb-8" {...fadeUp(0.25)}>
              <ShortcutBtn
                icon={
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                }
                label="Comprar"
                color={color}
                onPress={() => {
                  const handled = onElementTap?.('ShortcutButton: Comprar')
                  if (!handled) onNext()
                }}
              />
              <ShortcutBtn
                icon={
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <path d="M5 12h14" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                }
                label="Vender"
                onPress={() => {
                  const handled = onElementTap?.('ShortcutButton: Vender')
                  if (!handled) onNext()
                }}
              />
              <ShortcutBtn
                icon={
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="6" r="1.5" fill="white" />
                    <circle cx="12" cy="12" r="1.5" fill="white" />
                    <circle cx="12" cy="18" r="1.5" fill="white" />
                  </svg>
                }
                label="Mais"
                onPress={() => {
                  playSlide()
                  onElementTap?.('ShortcutButton: Mais')
                }}
              />
            </motion.div>

            {/* Detalhes section */}
            <motion.div className="px-4 mb-6" {...fadeUp(0.3)}>
              <span style={{ color: TEXT_SECONDARY, fontSize: 13, fontWeight: 600, marginBottom: 8, display: 'block' }}>
                Detalhes
              </span>
              <div
                className="rounded-2xl p-4"
                style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
              >
                <DetailRow
                  label="Quantidade"
                  value={formatQuantity(position.quantity, assetTicker)}
                />
                <DetailRow
                  label="Preco medio"
                  value={formatBRL(position.avgCost)}
                />
                <DetailRow
                  label="P&L"
                  value={`${pnl >= 0 ? '+' : ''}${formatBRL(pnl)} (${pnlPercent >= 0 ? '+' : ''}${pnlPercent.toFixed(1)}%)`}
                  valueColor={pnl >= 0 ? GREEN : RED}
                />
                <div className="flex items-center justify-between py-3">
                  <span style={{ color: TEXT_TERTIARY, fontSize: 13 }}>Investindo desde</span>
                  <span style={{ color: TEXT_PRIMARY, fontSize: 13, fontWeight: 600 }}>
                    {position.investedSince}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Historico section */}
            <motion.div className="px-4 mb-8" {...fadeUp(0.35)}>
              <span style={{ color: TEXT_SECONDARY, fontSize: 13, fontWeight: 600, marginBottom: 8, display: 'block' }}>
                Historico
              </span>
              <motion.div
                className="rounded-2xl p-4"
                style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
                variants={listContainer}
                initial="hidden"
                animate="visible"
              >
                {transactions.map((tx) => (
                  <motion.div key={tx.id} variants={listItemY}>
                    <TxRow type={tx.type} title={tx.title} amount={tx.amount} date={tx.date} />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </>
        ) : (
          /* ── Not invested state ── */
          <>
            {/* Sobre section */}
            <motion.div className="px-4 mb-6" {...fadeUp(0.25)}>
              <span style={{ color: TEXT_SECONDARY, fontSize: 13, fontWeight: 600, marginBottom: 8, display: 'block' }}>
                Sobre
              </span>
              <p style={{ color: TEXT_TERTIARY, fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                {asset.description}
              </p>
            </motion.div>

            {/* Info card */}
            <motion.div className="px-4 mb-8" {...fadeUp(0.3)}>
              <div
                className="rounded-2xl p-4"
                style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
              >
                {volatile ? (
                  <>
                    <DetailRow label="Capitalizacao" value={asset.marketCap ?? '-'} />
                    <DetailRow label="Volume (24h)" value={asset.volume24h ?? '-'} />
                    {asset.network && (
                      <div className="flex items-center justify-between py-3">
                        <span style={{ color: TEXT_TERTIARY, fontSize: 13 }}>Rede</span>
                        <span style={{ color: TEXT_PRIMARY, fontSize: 13, fontWeight: 600 }}>
                          {asset.network}
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <DetailRow label="Rendimento" value={asset.apyDisplay ?? '-'} valueColor={GREEN} />
                    <DetailRow label="Resgate" value="Imediato" />
                    <div className="flex items-center justify-between py-3">
                      <span style={{ color: TEXT_TERTIARY, fontSize: 13 }}>Protecao</span>
                      <span style={{ color: TEXT_PRIMARY, fontSize: 13, fontWeight: 600 }}>
                        Cobertura automatica
                      </span>
                    </div>
                  </>
                )}
              </div>
            </motion.div>

            {/* Bottom spacer for fixed bar */}
            <div style={{ height: 100 }} />
          </>
        )}

        {/* Bottom safe area spacer */}
        <div style={{ height: `calc(${SAFE_BOTTOM} + 16px)` }} />
      </div>

      {/* ── Fixed bottom bar (not invested) ── */}
      <AnimatePresence>
        {!invested && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute bottom-0 left-0 right-0 flex items-center gap-3 px-4"
            style={{
              ...glass,
              paddingTop: 12,
              paddingBottom: `calc(${SAFE_BOTTOM} + 4px)`,
              borderTop: `1px solid ${BORDER}`,
            }}
          >
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                const handled = onElementTap?.(`Button: ${volatile ? 'Comprar' : 'Investir'}`)
                if (!handled) onNext()
              }}
              className="flex-1 flex items-center justify-center rounded-xl border-none cursor-pointer"
              style={{
                height: 52,
                background: color,
                fontSize: 15,
                fontWeight: 700,
                color: '#fff',
              }}
            >
              {volatile ? 'Comprar' : 'Investir'}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                const handled = onElementTap?.('Button: Depositar')
                if (!handled) onNext()
              }}
              className="flex-1 flex items-center justify-center rounded-xl border-none cursor-pointer"
              style={{
                height: 52,
                ...glass,
                border: `1px solid ${BORDER}`,
                fontSize: 15,
                fontWeight: 700,
                color: TEXT_PRIMARY,
              }}
            >
              Depositar
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
