/**
 * Dashboard — light-themed investments portfolio overview.
 * States: first-access, empty, portfolio.
 * Mixes custom Tailwind + Framer Motion with design system components (Summary, Button, ShortcutButton).
 */
import { useState, useMemo, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RiArrowLeftRightLine, RiHeartFill, RiFileListLine, RiMoreFill,
  RiDownloadLine, RiUploadLine, RiFileTextLine, RiBarChartBoxLine,
  RiCloseLine, RiLineChartLine,
  RiShieldCheckFill, RiFlashlightFill, RiPieChartFill, RiTimerFlashFill,
} from '@remixicon/react'
import type { FlowScreenProps } from '@/pages/simulator/flowRegistry'
import { useScreenData } from '@/lib/ScreenDataContext'
import Summary from '@/library/display/Summary'
import ListItem from '@/library/display/ListItem'
import Button from '@/library/inputs/Button'
import ShortcutButton from '@/library/inputs/ShortcutButton'
import {
  MOCK_POSITIONS, getAsset, getPortfolioTotal, getFavoriteAssets,
  formatBRL, isVolatile, getSparkline,
} from './shared/data'
import type { AssetTicker } from './shared/data'
import { getAssetPalette } from './shared/assetPalette'
import {
  BG, BG_CARD, BORDER, TEXT_PRIMARY, TEXT_SECONDARY,
  TEXT_TERTIARY, GREEN, RED, fadeUp, glowBg, glass,
} from './shared/theme'
import { buildSmoothPath, formatChartDate } from './shared/chartUtils'
import type { ChartDataPoint } from './shared/chartUtils'
import investHeroBg from '@/assets/images/invest-header-bg.jpg'
import {
  FavoriteCard, Sparkline,
  GrowthAnimation, SocialProofCounter, MiniSimulator, StepTracker, TrustBar,
} from './Screen0_Dashboard.parts'
import AssetListItem from './shared/AssetListItem'
import Subheader from '@/library/navigation/Subheader'
import { TokenLogo } from './shared/TokenLogo'

interface DashboardState {
  dashboard?: 'portfolio' | 'empty' | 'first-access'
}

// Generate 30-day portfolio chart — 3 data points per day = 90 points
// Includes a dip to ~-6% around day 8-12, then recovery and growth

function generateChartPoints(): ChartDataPoint[] {
  const pts: ChartDataPoint[] = []
  const start = 28000
  const now = new Date()
  // Start 30 days ago at 00:00
  const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29, 0, 0, 0)

  for (let i = 0; i < 90; i++) {
    // 3 points per day → each point is 8 hours apart
    const timestamp = new Date(startDate.getTime() + i * 8 * 60 * 60 * 1000)

    // Dip envelope: pulls value down around indices 24-36 (days 8-12)
    const dipCenter = 30
    const dipWidth = 12
    const dipStrength = -1800 // ~-6.4% from start
    const dip = dipStrength * Math.exp(-0.5 * ((i - dipCenter) / dipWidth) ** 2)

    // Base trend: slight upward after recovery
    const trend = i * 18

    // Noise
    const noise = Math.sin(i * 0.45) * 200 + Math.cos(i * 1.7) * 120 + Math.sin(i * 7.3) * 60

    const v = start + trend + dip + noise
    pts.push({ value: v, timestamp })
  }
  return pts
}

// ── More Actions Modal ──

function MoreModal({ open, onClose, onAction }: {
  open: boolean
  onClose: () => void
  onAction: (action: string) => void
}) {
  const items = [
    { id: 'depositar', icon: <RiDownloadLine size={20} color={TEXT_PRIMARY} />, label: 'Depositar criptomoedas' },
    { id: 'enviar', icon: <RiUploadLine size={20} color={TEXT_PRIMARY} />, label: 'Enviar ativos' },
    { id: 'documentos', icon: <RiFileTextLine size={20} color={TEXT_PRIMARY} />, label: 'Documentos' },
    { id: 'relatorio', icon: <RiBarChartBoxLine size={20} color={TEXT_PRIMARY} />, label: 'Relatório de Ganhos' },
  ]

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
            style={{ background: 'rgba(0,0,0,0.20)' }}
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
              background: '#FFFFFF',
              borderTop: `1px solid ${BORDER}`,
              boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
            }}
          >
            {/* Drag handle */}
            <div className="w-9 h-1 rounded-full mx-auto mb-4" style={{ background: TEXT_TERTIARY }} />

            <div className="flex flex-col gap-1">
              {items.map(item => (
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
  const chartData = useMemo(() => generateChartPoints(), [])
  const favorites = getFavoriteAssets()

  // Chart computed
  const chartWidth = 400
  const chartHeight = 140
  const { path: chartPath, points: chartPoints } = useMemo(
    () => buildSmoothPath(chartData, chartWidth, chartHeight),
    [chartData],
  )

  // Interactive chart state — null means "show current"
  const [activePointIndex, setActivePointIndex] = useState<number | null>(null)
  const chartRef = useRef<SVGSVGElement>(null)

  // Displayed value + P&L based on selected point or latest
  const displayValue = activePointIndex !== null ? chartPoints[activePointIndex].value : portfolioTotal
  const firstValue = chartPoints[0].value
  const referenceValue = activePointIndex !== null ? firstValue : firstValue
  const changePct = ((displayValue - referenceValue) / referenceValue) * 100

  // Chart touch/drag handler
  const handleChartInteraction = useCallback((clientX: number) => {
    const svg = chartRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const relX = clientX - rect.left
    const pct = Math.max(0, Math.min(1, relX / rect.width))
    const idx = Math.round(pct * (chartPoints.length - 1))
    setActivePointIndex(idx)
  }, [chartPoints])

  const handleChartPointerDown = useCallback((e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture(e.pointerId)
    handleChartInteraction(e.clientX)
  }, [handleChartInteraction])

  const handleChartPointerMove = useCallback((e: React.PointerEvent) => {
    if (e.buttons > 0) handleChartInteraction(e.clientX)
  }, [handleChartInteraction])

  const handleChartPointerUp = useCallback(() => {
    setActivePointIndex(null)
  }, [])

  const handleShortcut = (label: string) => {
    const handled = onElementTap?.(`ShortcutButton: ${label}`)
    if (!handled) onNext()
  }

  const handleModalAction = (action: string) => {
    setMoreOpen(false)
    const labelMap: Record<string, string> = {
      depositar: 'Depositar ativos',
      enviar: 'Enviar ativos',
      documentos: 'Documentos',
      relatorio: 'Relatório de Ganhos',
    }
    const label = labelMap[action]
    if (label) {
      const handled = onElementTap?.(`ListItem: ${label}`)
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

  // ── First Access State — Hero + Summary ──
  if (stateId === 'first-access') {
    const summaryData = [
      {
        icon: <RiTimerFlashFill size={24} className="text-[var(--color-interactive-accent)]" />,
        title: 'Sem comissões e instantâneo',
        description: 'Invista sem taxas ocultas. Comece com apenas R$ 10, em segundos.',
      },
      {
        icon: <RiPieChartFill size={24} className="text-[var(--color-interactive-accent)]" />,
        title: 'Cripto, commodities e renda fixa',
        description: 'Diversifique entre Bitcoin, ouro, dólar digital e rendimentos automáticos.',
      },
      {
        icon: <RiShieldCheckFill size={24} className="text-[var(--color-interactive-accent)]" />,
        title: 'Regulado e custodiado',
        description: 'Seus investimentos são custodiados por instituições reguladas e autorizadas.',
      },
      {
        icon: <RiFlashlightFill size={24} className="text-[var(--color-interactive-accent)]" />,
        title: 'Operação 24/7',
        description: 'Invista a qualquer hora, todos os dias. Liquidez imediata quando precisar.',
      },
    ]

    return (
      <div className="flex flex-col min-h-screen" style={{ background: BG }}>
        {/* Full-bleed hero image */}
        <div className="relative w-full" style={{ minHeight: '50vh' }}>
          <img
            src={investHeroBg}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.65) 80%, rgba(0,0,0,0.85) 100%)',
            }}
          />
          <div style={{ height: 'var(--safe-area-top)' }} />
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
              Invista em ativos globais com taxa zero.
            </motion.p>
          </div>
        </div>

        {/* Summary benefits */}
        <div className="flex-1 px-5 pt-2 pb-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Summary data={summaryData} />
          </motion.div>
        </div>

        {/* CTA — design system Button */}
        <div className="px-5 pb-[max(var(--safe-area-bottom),20px)]">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.9 }}
          >
            <Button
              variant="primary"
              fullWidth
              onPress={() => {
                const handled = onElementTap?.('Button: Começar a investir')
                if (!handled) onNext()
              }}
            >
              Começar a investir
            </Button>
          </motion.div>
        </div>
      </div>
    )
  }

  // ── Empty State — Psychology-driven onboarding ──
  if (stateId === 'empty') {
    const simResults = [
      { ticker: 'BTC' as AssetTicker, name: 'Bitcoin', icon: getAsset('BTC').icon, returnPct: 127, returnValue: 227, color: getAssetPalette('BTC').iconBg, sparklineColor: getAssetPalette('BTC').accent, sparkline: getSparkline('BTC') },
      { ticker: 'RENDA-BRL' as AssetTicker, name: 'Renda em Real', icon: getAsset('RENDA-BRL').icon, returnPct: 10, returnValue: 110, color: getAssetPalette('RENDA-BRL').iconBg, sparklineColor: getAssetPalette('RENDA-BRL').accent, sparkline: getSparkline('RENDA-BRL') },
      { ticker: 'PAXG' as AssetTicker, name: 'Ouro', icon: getAsset('PAXG').icon, returnPct: 15, returnValue: 115, color: getAssetPalette('PAXG').iconBg, sparklineColor: getAssetPalette('PAXG').accent, sparkline: getSparkline('PAXG') },
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

          <div className="flex flex-col items-center px-5 pt-2 pb-4">
            {/* Section 1: Hero — Growth Animation + Emotional Copy */}
            <motion.div {...fadeUp(0)} className="flex flex-col items-center gap-2 mb-3">
              <GrowthAnimation />
              <div className="flex flex-col items-center gap-1 max-w-[280px]">
                <h2 className="text-center" style={{ color: TEXT_PRIMARY, fontSize: 22, fontWeight: 700, margin: 0, lineHeight: 1.3 }}>
                  Seu dinheiro pode fazer mais
                </h2>
                <p className="text-center" style={{ color: TEXT_SECONDARY, fontSize: 13, lineHeight: 1.5, margin: 0 }}>
                  Março é o mês ideal para começar — taxas zero na primeira operação
                </p>
              </div>
            </motion.div>

            {/* Section 2: Social Proof */}
            <motion.div {...fadeUp(0.1)} className="w-full flex justify-center mb-5">
              <SocialProofCounter />
            </motion.div>

            {/* Section 3: Mini Simulator */}
            <motion.div {...fadeUp(0.15)} className="w-full mb-6">
              <MiniSimulator results={simResults} />
            </motion.div>

            {/* Section 4: Step Tracker */}
            <motion.div {...fadeUp(0.2)} className="w-full mb-6">
              <StepTracker />
            </motion.div>

            {/* Section 5: Featured Assets */}
            <motion.div {...fadeUp(0.25)} className="w-full mb-5">
              <span className="block mb-2" style={{ color: TEXT_TERTIARY, fontSize: 11, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' as const }}>
                Destaque para você
              </span>
              <div className="flex gap-3 overflow-x-auto -mx-5 px-5" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
                {featuredCards.map(({ ticker, badge, badgeColor }) => {
                  const asset = getAsset(ticker)
                  const palette = getAssetPalette(ticker)
                  return (
                    <motion.button
                      key={ticker}
                      whileTap={{ scale: 0.97 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      onClick={() => handleAssetTap(ticker)}
                      className="flex-shrink-0 rounded-2xl p-4 border-none cursor-pointer text-left relative overflow-hidden"
                      style={{
                        width: 170,
                        background: `linear-gradient(135deg, ${palette.accent}15 0%, ${palette.accent}05 100%)`,
                        border: `1px solid ${palette.accent}20`,
                      }}
                    >
                      <div className="absolute top-0 right-0 pointer-events-none" style={{ width: 70, height: 70, background: `radial-gradient(circle, ${palette.accent}30 0%, transparent 70%)` }} />
                      <div className="flex flex-col gap-2.5 relative">
                        <div className="flex items-center justify-between">
                          <TokenLogo ticker={ticker} fallbackUrl={asset.icon} size={28} color={palette.iconBg} className="rounded-full" />
                          <span className="rounded-full px-2 py-0.5" style={{ fontSize: 10, fontWeight: 700, color: badgeColor, background: `${badgeColor}18` }}>{badge}</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span style={{ color: TEXT_PRIMARY, fontSize: 14, fontWeight: 600 }}>{asset.name}</span>
                          <span style={{ color: TEXT_SECONDARY, fontSize: 12 }}>{isVolatile(asset) ? formatBRL(asset.price!) : asset.apyDisplay}</span>
                        </div>
                        <Sparkline data={getSparkline(ticker)} color={palette.accent} width={80} height={20} />
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>

            {/* Section 6: Trust Bar */}
            <motion.div {...fadeUp(0.3)} className="w-full mb-4">
              <TrustBar />
            </motion.div>

            {/* Section 7: Dual CTA */}
            <motion.div {...fadeUp(0.35)} className="w-full flex flex-col gap-2.5">
              <Button
                variant="primary"
                fullWidth
                onPress={handleExplore}
              >
                Explorar ativos
              </Button>
              <Button
                variant="ghost"
                fullWidth
                onPress={() => { const handled = onElementTap?.('Button: Simular investimento'); if (!handled) onNext() }}
              >
                Simular investimento
              </Button>
            </motion.div>

            {/* Bottom safe area padding */}
            <div style={{ paddingBottom: 'max(var(--safe-area-bottom), 20px)' }} />
          </div>
        </div>
      </div>
    )
  }

  // ── Portfolio State (default) ──

  // Active point for cursor indicator
  const activePoint = activePointIndex !== null ? chartPoints[activePointIndex] : null

  return (
    <div className="flex flex-col min-h-screen" style={{ background: BG }}>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto relative">

        {/* ── Header area with grid background (fills safe area too) ── */}
        <div className="relative overflow-hidden">
          {/* Grid pattern — covers safe area + content */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ top: `calc(-1 * var(--safe-area-top))` }} preserveAspectRatio="none">
            <defs>
              <pattern id="grid-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#D8D8DE" strokeWidth="0.5" />
              </pattern>
              <linearGradient id="grid-fade-v" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
                <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
              </linearGradient>
              <linearGradient id="grid-fade-l" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                <stop offset="10%" stopColor="#FFFFFF" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="grid-fade-r" x1="0" y1="0" x2="1" y2="0">
                <stop offset="90%" stopColor="#FFFFFF" stopOpacity="0" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
            <rect width="100%" height="100%" fill="url(#grid-fade-v)" />
            <rect width="100%" height="100%" fill="url(#grid-fade-l)" />
            <rect width="100%" height="100%" fill="url(#grid-fade-r)" />
          </svg>

          {/* Safe area spacer inside the grid */}
          <div style={{ height: 'var(--safe-area-top)' }} />

          {/* Portfolio Value */}
          <motion.div {...fadeUp(0)} className="relative px-5 pt-5 pb-2">
            <div className="flex flex-col">
              <span style={{ color: TEXT_PRIMARY, fontSize: 16, fontWeight: 500, marginBottom: 8 }}>
                Patrimônio total
              </span>
              <div className="flex items-baseline gap-0.5">
                <span style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontFeatureSettings: "'salt' 1, 'ordn' 1, 'kern' 0, 'calt' 0",
                  fontWeight: 600,
                  letterSpacing: -0.5,
                  color: TEXT_PRIMARY,
                  fontSize: 28,
                }}>
                  R$
                </span>
                <span style={{
                  color: TEXT_PRIMARY,
                  fontSize: 42,
                  fontWeight: 800,
                  lineHeight: 1,
                  letterSpacing: -1.5,
                  fontFeatureSettings: "'ss01' 1, 'cv05' 1, 'lnum' 1, 'pnum' 1",
                }}>
                  {displayValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5" style={{ fontSize: 14, fontWeight: 500, marginTop: 1 }}>
                <span className="inline-flex items-center" style={{ color: changePct >= 0 ? GREEN : RED }}>
                  <span style={{ fontSize: 16, lineHeight: 1, verticalAlign: 'text-top', paddingBottom: 2 }}>{changePct >= 0 ? '↗' : '↘'}</span>{'\u2009'}{Math.abs(changePct).toFixed(2)}%
                </span>
                <span style={{ color: TEXT_PRIMARY, fontSize: 14 }}>{activePointIndex !== null ? formatChartDate(chartPoints[activePointIndex].timestamp) : 'no último mês'}</span>
              </span>
            </div>
          </motion.div>

          {/* Interactive Chart — smooth black line, no fill */}
          <motion.div {...fadeUp(0.05)} className="relative px-0 mb-0">
            <svg
              ref={chartRef}
              width="100%"
              height={chartHeight}
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              preserveAspectRatio="none"
              className="cursor-crosshair"
              style={{ touchAction: 'none' }}
              onPointerDown={handleChartPointerDown}
              onPointerMove={handleChartPointerMove}
              onPointerUp={handleChartPointerUp}
              onPointerLeave={handleChartPointerUp}
            >
              {/* Chart line — smooth, black, thick */}
              <path
                d={chartPath}
                fill="none"
                stroke={TEXT_PRIMARY}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Active point indicator */}
              {activePoint && (
                <>
                  {/* Vertical line */}
                  <line
                    x1={activePoint.x}
                    y1={0}
                    x2={activePoint.x}
                    y2={chartHeight}
                    stroke={TEXT_TERTIARY}
                    strokeWidth={1}
                    strokeDasharray="4 3"
                  />
                  {/* Dot */}
                  <circle
                    cx={activePoint.x}
                    cy={activePoint.y}
                    r={5}
                    fill={TEXT_PRIMARY}
                    stroke="#FFFFFF"
                    strokeWidth={2}
                  />
                </>
              )}
            </svg>
          </motion.div>
        </div>

        {/* Shortcut Buttons */}
        <motion.div {...fadeUp(0.1)} className="flex justify-between px-8 mt-6 mb-8">
          <ShortcutButton
            icon={<RiArrowLeftRightLine size={22} className="text-[var(--color-interactive-primary)]" />}
            label="Negociar"
            variant="primary"
            onPress={() => handleShortcut('Negociar')}
          />
          <ShortcutButton
            icon={<RiHeartFill size={22} className="text-[var(--color-interactive-primary)]" />}
            label="Favoritos"
            variant="secondary"
            onPress={() => handleShortcut('Favoritos')}
          />
          <ShortcutButton
            icon={<RiFileListLine size={22} className="text-[var(--color-interactive-primary)]" />}
            label="Ordens"
            variant="secondary"
            onPress={() => handleShortcut('Ordens')}
          />
          <ShortcutButton
            icon={<RiMoreFill size={22} className="text-[var(--color-interactive-primary)]" />}
            label="Mais"
            variant="secondary"
            onPress={() => setMoreOpen(true)}
          />
        </motion.div>

        {/* Holdings */}
        <motion.div {...fadeUp(0.15)} className="mb-4">
          <Subheader text="Minha carteira" />
          <div className="flex flex-col">
            {MOCK_POSITIONS.map((pos, i) => (
              <motion.div key={pos.asset} {...fadeUp(0.17 + i * 0.03)}>
                <AssetListItem
                  ticker={pos.asset}
                  variant="holding"
                  onPress={() => handleAssetTap(pos.asset)}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Favorites — Card style */}
        {favorites.length > 0 && (
          <motion.div {...fadeUp(0.3)} className="mb-6">
            <Subheader text="Favoritos" actionLabel="Ver todos" onAction={() => handleShortcut('Favoritos')} />
            <div className="flex gap-2 px-5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
              {favorites.map(asset => (
                <FavoriteCard
                  key={asset.ticker}
                  ticker={asset.ticker}
                  onPress={() => handleAssetTap(asset.ticker)}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Explore More */}
        <motion.div {...fadeUp(0.4)} className="px-5 mb-6">
          <ListItem
            title="Explorar ativos"
            subtitle="Descubra cripto, ouro, renda fixa e mais"
            left={<RiLineChartLine size={22} color={GREEN} />}
            onPress={handleExplore}
          />
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
