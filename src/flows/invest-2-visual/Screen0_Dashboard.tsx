/**
 * Dashboard — dark-themed investments portfolio overview.
 * States: portfolio (default), empty.
 * Pure custom Tailwind + inline styles + Framer Motion. NO library components.
 */
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RiExchangeLine, RiDownloadLine, RiUploadLine, RiMoreLine,
  RiFileListLine, RiHistoryLine, RiArrowRightLine,
  RiCloseLine, RiLineChartLine,
} from '@remixicon/react'
import type { FlowScreenProps } from '@/pages/simulator/flowRegistry'
import { useScreenData } from '@/lib/ScreenDataContext'
import {
  MOCK_POSITIONS, getAsset, getPortfolioTotal, getFavoriteAssets,
  formatBRL, isVolatile, getAssetColor, getSparkline,
} from './shared/data'
import type { AssetTicker } from './shared/data'
import {
  BG, BG_CARD, BORDER, TEXT_PRIMARY, TEXT_SECONDARY,
  TEXT_TERTIARY, GREEN, fadeUp, glowBg, glass,
} from './shared/theme'
import investHeroBg from '@/assets/images/invest-header-bg.jpg'
import {
  PortfolioValue, HoldingRow, FavChip, Sparkline,
  GrowthAnimation, SocialProofCounter, MiniSimulator, StepTracker, TrustBar,
} from './Screen0_Dashboard.parts'

interface DashboardState {
  dashboard?: 'portfolio' | 'empty' | 'first-access'
  [key: string]: unknown
}

// Generate deterministic portfolio chart points
function generateChartPoints(count: number): number[] {
  const pts: number[] = []
  let v = 28000
  for (let i = 0; i < count; i++) {
    v += Math.sin(i * 0.3) * 800 + Math.cos(i * 0.7) * 400 + (Math.sin(i * 13.7) * 200)
    pts.push(v)
  }
  return pts
}

// Build SVG area path for portfolio chart
function buildAreaPath(data: number[], width: number, height: number): { linePath: string; areaPath: string } {
  const min = Math.min(...data) * 0.98
  const max = Math.max(...data) * 1.02
  const range = max - min || 1

  const points = data.map((v, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - ((v - min) / range) * height,
  }))

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const areaPath = `${linePath} L${width},${height} L0,${height} Z`

  return { linePath, areaPath }
}

// ── Shortcut circle button ──

function ShortcutCircle({ icon, label, accent, onPress }: {
  icon: React.ReactNode
  label: string
  accent?: boolean
  onPress?: () => void
}) {
  return (
    <motion.button
      onClick={onPress}
      whileTap={{ scale: 0.93 }}
      className="flex flex-col items-center gap-1.5 border-none cursor-pointer bg-transparent"
    >
      <div
        className="flex items-center justify-center rounded-full"
        style={{
          width: 52,
          height: 52,
          background: BG_CARD,
          border: accent ? `1.5px solid ${GREEN}` : `1px solid ${BORDER}`,
        }}
      >
        {icon}
      </div>
      <span style={{ color: TEXT_SECONDARY, fontSize: 11, fontWeight: 500 }}>
        {label}
      </span>
    </motion.button>
  )
}

// ── More Actions Modal ──

function MoreModal({ open, onClose, onAction }: {
  open: boolean
  onClose: () => void
  onAction: (action: string) => void
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.5)' }}
          />
          {/* Panel */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 35 }}
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl px-5 pt-4 pb-6"
            style={{
              ...glass,
              background: 'rgba(20,20,30,0.95)',
              borderTop: `1px solid ${BORDER}`,
            }}
          >
            {/* Drag handle */}
            <div className="w-9 h-1 rounded-full mx-auto mb-4" style={{ background: TEXT_TERTIARY }} />

            <div className="flex flex-col gap-1">
              {[
                { id: 'orders', icon: <RiFileListLine size={20} color={TEXT_PRIMARY} />, label: 'Ordens abertas' },
                { id: 'statement', icon: <RiHistoryLine size={20} color={TEXT_PRIMARY} />, label: 'Extrato' },
              ].map(item => (
                <motion.button
                  key={item.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onAction(item.id)}
                  className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl border-none cursor-pointer text-left"
                  style={{ background: 'transparent' }}
                >
                  {item.icon}
                  <span style={{ color: TEXT_PRIMARY, fontSize: 15, fontWeight: 500 }}>
                    {item.label}
                  </span>
                </motion.button>
              ))}
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
              className="flex items-center justify-center w-full mt-3 py-3 rounded-xl border-none cursor-pointer"
              style={{ background: BG_CARD }}
            >
              <RiCloseLine size={18} color={TEXT_SECONDARY} />
              <span className="ml-2" style={{ color: TEXT_SECONDARY, fontSize: 14, fontWeight: 500 }}>
                Fechar
              </span>
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ── Main Dashboard ──

export default function Screen0_Dashboard({ onNext, onElementTap }: FlowScreenProps) {
  const screenData = useScreenData<DashboardState>()
  const stateId = screenData?.dashboard ?? 'portfolio'
  const [moreOpen, setMoreOpen] = useState(false)

  const portfolioTotal = getPortfolioTotal()
  const chartData = useMemo(() => generateChartPoints(30), [])
  const favorites = getFavoriteAssets()

  // Chart computed
  const chartWidth = 400
  const chartHeight = 120
  const { linePath, areaPath } = useMemo(
    () => buildAreaPath(chartData, chartWidth, chartHeight),
    [chartData],
  )

  // Calculate approximate 24h change from positions
  const change24h = MOCK_POSITIONS.reduce((sum, pos) => {
    const asset = getAsset(pos.asset)
    return sum + (asset.change24h ?? 0) * (pos.currentValue / portfolioTotal)
  }, 0)

  const handleShortcut = (label: string) => {
    const handled = onElementTap?.(`ShortcutButton: ${label}`)
    if (!handled) onNext()
  }

  const handleModalAction = (action: string) => {
    setMoreOpen(false)
    if (action === 'orders') {
      const handled = onElementTap?.('ListItem: Ordens abertas')
      if (!handled) onNext()
    } else if (action === 'statement') {
      const handled = onElementTap?.('ListItem: Extrato')
      if (!handled) onNext()
    }
  }

  const handleAssetTap = (ticker: AssetTicker) => {
    const asset = getAsset(ticker)
    const handled = onElementTap?.(`ListItem: ${asset.name}`)
    if (!handled) onNext()
  }

  const handleExplore = () => {
    const handled = onElementTap?.('Button: Explorar mais')
    if (!handled) onNext()
  }

  // ── First Access State — Hero onboarding ──
  if (stateId === 'first-access') {
    const benefits = [
      {
        emoji: '🏛️',
        title: 'Regulado e protegido',
        desc: 'Seus investimentos são custodiados por instituições reguladas, com proteção automática.',
      },
      {
        emoji: '🎟️',
        title: 'Sem comissões e instantâneo',
        desc: 'Invista sem taxas ocultas. Comece com apenas R$ 10, em segundos.',
      },
      {
        emoji: '📊',
        title: 'Cripto, commodities e renda fixa',
        desc: 'Diversifique entre Bitcoin, ouro, dólar digital e rendimentos automáticos.',
      },
      {
        emoji: '🔒',
        title: 'Cobertura automática',
        desc: 'Proteção inclusa contra falhas técnicas — sem custo adicional.',
      },
    ]

    return (
      <div className="flex flex-col min-h-screen" style={{ background: BG }}>
        {/* Full-bleed hero image */}
        <div className="relative w-full" style={{ minHeight: '55vh' }}>
          <img
            src={investHeroBg}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Gradient overlay for text readability */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.65) 80%, rgba(0,0,0,0.85) 100%)',
            }}
          />

          {/* Safe area spacer */}
          <div style={{ height: 'var(--safe-area-top)' }} />

          {/* Text overlay at bottom of hero */}
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ color: '#fff', fontSize: 32, fontWeight: 800, lineHeight: 1.15, margin: 0, letterSpacing: -0.5 }}
            >
              Uma nova forma de construir patrimônio
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ color: 'rgba(255,255,255,0.80)', fontSize: 15, lineHeight: 1.5, margin: 0, marginTop: 10 }}
            >
              Invista em ativos globais com proteção automática e taxa zero.
            </motion.p>
          </div>
        </div>

        {/* Benefits list */}
        <div className="flex-1 px-5 pt-6 pb-4">
          <div className="flex flex-col gap-5">
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-4"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.5 + i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <span className="flex-shrink-0 text-2xl mt-0.5" role="img">{b.emoji}</span>
                <div className="flex flex-col gap-0.5">
                  <span style={{ color: TEXT_PRIMARY, fontSize: 15, fontWeight: 700 }}>{b.title}</span>
                  <span style={{ color: TEXT_SECONDARY, fontSize: 13, lineHeight: 1.45 }}>{b.desc}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="px-5 pb-[max(var(--safe-area-bottom),20px)]">
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.9 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              const handled = onElementTap?.('Button: Começar a investir')
              if (!handled) onNext()
            }}
            className="w-full py-4 rounded-2xl border-none cursor-pointer"
            style={{
              background: `linear-gradient(135deg, ${GREEN} 0%, #059669 100%)`,
              color: '#000',
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            Começar a investir
          </motion.button>
        </div>
      </div>
    )
  }

  // ── Empty State — Psychology-driven onboarding ──
  if (stateId === 'empty') {
    const simResults = [
      { ticker: 'BTC' as AssetTicker, name: 'Bitcoin', icon: getAsset('BTC').icon, returnPct: 127, returnValue: 227, color: getAssetColor('BTC'), sparkline: getSparkline('BTC') },
      { ticker: 'RENDA-BRL' as AssetTicker, name: 'Renda em Real', icon: getAsset('RENDA-BRL').icon, returnPct: 10, returnValue: 110, color: getAssetColor('RENDA-BRL'), sparkline: getSparkline('RENDA-BRL') },
      { ticker: 'PAXG' as AssetTicker, name: 'Ouro', icon: getAsset('PAXG').icon, returnPct: 15, returnValue: 115, color: getAssetColor('PAXG'), sparkline: getSparkline('PAXG') },
    ]

    const featuredCards: { ticker: AssetTicker; badge: string; badgeColor: string }[] = [
      { ticker: 'RENDA-BRL', badge: 'Vagas limitadas', badgeColor: '#F59E0B' },
      { ticker: 'BTC', badge: 'Popular', badgeColor: '#F7931A' },
      { ticker: 'PAXG', badge: 'Proteção', badgeColor: '#E6B800' },
    ]

    return (
      <div className="flex flex-col min-h-screen" style={{ background: BG }}>
        <div style={{ height: 'var(--safe-area-top)' }} />

        {/* Subtle glow at top */}
        <div
          className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{ height: 250, background: glowBg(GREEN, 0.06) }}
        />

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto relative">
          <div className="px-5 pt-4 pb-2">
            <span style={{ color: TEXT_SECONDARY, fontSize: 13, fontWeight: 500 }}>
              Investimentos
            </span>
          </div>

          <div className="flex flex-col items-center gap-6 px-5 pt-2 pb-6">
            {/* Section 1: Hero — Growth Animation + Emotional Copy */}
            <motion.div {...fadeUp(0)} className="flex flex-col items-center gap-4">
              <GrowthAnimation />
              <div className="flex flex-col items-center gap-1.5 max-w-[280px]">
                <h2 className="text-center" style={{ color: TEXT_PRIMARY, fontSize: 22, fontWeight: 700, margin: 0, lineHeight: 1.3 }}>
                  Seu dinheiro pode fazer mais
                </h2>
                <p className="text-center" style={{ color: TEXT_SECONDARY, fontSize: 13, lineHeight: 1.5, margin: 0 }}>
                  Março é o mês ideal para começar — taxas zero na primeira operação
                </p>
              </div>
            </motion.div>

            {/* Section 2: Social Proof */}
            <motion.div {...fadeUp(0.1)} className="w-full flex justify-center">
              <SocialProofCounter />
            </motion.div>

            {/* Section 3: Mini Simulator — Aha! Moment */}
            <motion.div {...fadeUp(0.15)} className="w-full">
              <MiniSimulator results={simResults} />
            </motion.div>

            {/* Section 4: Step Tracker — Goal Gradient */}
            <motion.div {...fadeUp(0.2)} className="w-full">
              <StepTracker />
            </motion.div>

            {/* Section 5: Featured Assets — Scarcity + Variable Reward */}
            <motion.div {...fadeUp(0.25)} className="w-full">
              <span style={{ color: TEXT_TERTIARY, fontSize: 11, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' as const }}>
                Destaque para você
              </span>
              <div className="flex gap-3 overflow-x-auto pb-2 mt-2 -mx-5 px-5">
                {featuredCards.map(({ ticker, badge, badgeColor }) => {
                  const asset = getAsset(ticker)
                  const color = getAssetColor(ticker)
                  return (
                    <motion.button
                      key={ticker}
                      whileTap={{ scale: 0.97 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      onClick={() => handleAssetTap(ticker)}
                      className="flex-shrink-0 rounded-2xl p-4 border-none cursor-pointer text-left relative overflow-hidden"
                      style={{
                        width: 180,
                        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
                        border: `1px solid ${color}20`,
                      }}
                    >
                      <div className="absolute top-0 right-0 pointer-events-none" style={{ width: 70, height: 70, background: `radial-gradient(circle, ${color}30 0%, transparent 70%)` }} />
                      <div className="flex flex-col gap-2.5 relative">
                        <div className="flex items-center justify-between">
                          <img src={asset.icon} alt={ticker} className="rounded-full" style={{ width: 28, height: 28 }} />
                          <span className="rounded-full px-2 py-0.5" style={{ fontSize: 10, fontWeight: 700, color: badgeColor, background: `${badgeColor}18` }}>{badge}</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span style={{ color: TEXT_PRIMARY, fontSize: 14, fontWeight: 600 }}>{asset.name}</span>
                          <span style={{ color: TEXT_SECONDARY, fontSize: 12 }}>{isVolatile(asset) ? formatBRL(asset.price!) : asset.apyDisplay}</span>
                        </div>
                        <Sparkline data={getSparkline(ticker)} color={color} width={80} height={20} />
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>

            {/* Section 6: Trust Bar */}
            <motion.div {...fadeUp(0.3)} className="w-full">
              <TrustBar />
            </motion.div>
          </div>
        </div>

        {/* Section 7: Dual CTA */}
        <div className="px-5 pb-[max(var(--safe-area-bottom),20px)] flex flex-col gap-2.5">
          <motion.button
            {...fadeUp(0.35)}
            whileTap={{ scale: 0.97 }}
            onClick={handleExplore}
            className="w-full py-4 rounded-2xl border-none cursor-pointer"
            style={{ background: `linear-gradient(135deg, ${GREEN} 0%, #059669 100%)`, color: '#000', fontSize: 16, fontWeight: 700 }}
          >
            Explorar ativos
          </motion.button>
          <motion.button
            {...fadeUp(0.38)}
            whileTap={{ scale: 0.97 }}
            onClick={() => { const handled = onElementTap?.('Button: Simular investimento'); if (!handled) onNext() }}
            className="w-full py-3.5 rounded-2xl cursor-pointer"
            style={{ background: 'transparent', border: `1px solid ${BORDER}`, color: TEXT_SECONDARY, fontSize: 14, fontWeight: 600 }}
          >
            Simular investimento
          </motion.button>
        </div>
      </div>
    )
  }

  // ── Portfolio State (default) ──
  return (
    <div className="flex flex-col min-h-screen" style={{ background: BG }}>
      <div style={{ height: 'var(--safe-area-top)' }} />

      {/* Glow background */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: 300,
          background: glowBg(GREEN, 0.08),
        }}
      />

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto relative">
        {/* Portfolio Value */}
        <motion.div {...fadeUp(0)} className="px-5 pt-5 pb-3">
          <PortfolioValue value={portfolioTotal} change={change24h} />
        </motion.div>

        {/* Area Chart */}
        <motion.div {...fadeUp(0.05)} className="px-0 mb-4">
          <svg
            width="100%"
            height={chartHeight}
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={GREEN} stopOpacity={0.3} />
                <stop offset="100%" stopColor={GREEN} stopOpacity={0} />
              </linearGradient>
            </defs>
            <path d={areaPath} fill="url(#chart-fill)" />
            <path d={linePath} fill="none" stroke={GREEN} strokeWidth={2} />
          </svg>
        </motion.div>

        {/* Shortcut Buttons */}
        <motion.div {...fadeUp(0.1)} className="flex justify-center gap-6 px-5 mb-6">
          <ShortcutCircle
            icon={<RiExchangeLine size={22} color={GREEN} />}
            label="Negociar"
            accent
            onPress={() => handleShortcut('Negociar')}
          />
          <ShortcutCircle
            icon={<RiDownloadLine size={22} color={TEXT_PRIMARY} />}
            label="Receber"
            onPress={() => handleShortcut('Receber')}
          />
          <ShortcutCircle
            icon={<RiUploadLine size={22} color={TEXT_PRIMARY} />}
            label="Enviar"
            onPress={() => handleShortcut('Enviar')}
          />
          <ShortcutCircle
            icon={<RiMoreLine size={22} color={TEXT_PRIMARY} />}
            label="Mais"
            onPress={() => setMoreOpen(true)}
          />
        </motion.div>

        {/* Favorites */}
        {favorites.length > 0 && (
          <motion.div {...fadeUp(0.15)} className="mb-6">
            <div className="px-5 mb-2">
              <span style={{ color: TEXT_TERTIARY, fontSize: 12, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' as const }}>
                Favoritos
              </span>
            </div>
            <div className="flex gap-2 px-5 overflow-x-auto pb-1">
              {favorites.map(asset => (
                <FavChip
                  key={asset.ticker}
                  icon={asset.icon}
                  ticker={asset.ticker}
                  change={asset.change24h ?? 0}
                  color={getAssetColor(asset.ticker)}
                  onPress={() => handleAssetTap(asset.ticker)}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Holdings */}
        <motion.div {...fadeUp(0.2)} className="mb-4">
          <div className="px-5 mb-2">
            <span style={{ color: TEXT_TERTIARY, fontSize: 12, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' as const }}>
              Meu portfólio
            </span>
          </div>
          <div className="flex flex-col">
            {MOCK_POSITIONS.map((pos, i) => {
              const asset = getAsset(pos.asset)
              return (
                <motion.div key={pos.asset} {...fadeUp(0.22 + i * 0.03)}>
                  <HoldingRow
                    icon={asset.icon}
                    name={asset.name}
                    ticker={pos.asset}
                    value={pos.currentValue}
                    quantity={pos.quantity}
                    color={getAssetColor(pos.asset)}
                    sparkline={getSparkline(pos.asset)}
                    onPress={() => handleAssetTap(pos.asset)}
                  />
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Explore More */}
        <motion.div {...fadeUp(0.35)} className="px-5 mb-6">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleExplore}
            className="flex items-center justify-between w-full px-4 py-3.5 rounded-xl border-none cursor-pointer"
            style={{
              background: BG_CARD,
              border: `1px solid ${BORDER}`,
            }}
          >
            <div className="flex items-center gap-3">
              <RiLineChartLine size={18} color={GREEN} />
              <span style={{ color: TEXT_PRIMARY, fontSize: 14, fontWeight: 500 }}>
                Explorar mais
              </span>
            </div>
            <RiArrowRightLine size={16} color={TEXT_TERTIARY} />
          </motion.button>
        </motion.div>

        {/* Bottom padding */}
        <div style={{ paddingBottom: 'max(var(--safe-area-bottom), 20px)' }} />
      </div>

      {/* More Modal */}
      <MoreModal
        open={moreOpen}
        onClose={() => setMoreOpen(false)}
        onAction={handleModalAction}
      />
    </div>
  )
}
