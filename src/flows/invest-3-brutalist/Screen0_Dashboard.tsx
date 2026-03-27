/**
 * Dashboard — Neo-brutalist investments portfolio overview.
 * States: portfolio (default), empty, first-access.
 * Bauhaus-inspired: oversized type, B&W, hard edges, no decoration.
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RiFileListLine, RiHistoryLine, RiArrowRightLine, RiCloseLine,
} from '@remixicon/react'
import type { FlowScreenProps } from '@/pages/simulator/flowRegistry'
import { useScreenData } from '@/lib/ScreenDataContext'
import {
  MOCK_POSITIONS, getAsset, getPortfolioTotal, formatBRL, isVolatile,
  getAssetColor, getSparkline,
} from './shared/data'
import type { AssetTicker } from './shared/data'
import {
  BG, BG_CARD, BORDER, BORDER_LIGHT, TEXT_PRIMARY, TEXT_SECONDARY,
  TEXT_TERTIARY, GREEN, ACCENT, fadeUp,
} from './shared/theme'
import {
  BrutalistValue, BrutalistAssetRow, BrutalistPillButton, BrutalistGridCard,
  BrutalistStepBlock, GeometricIllustration, BrutalistSocialProof, BrutalistTrustBar,
} from './Screen0_Dashboard.parts'

interface DashboardState {
  dashboard?: 'portfolio' | 'empty' | 'first-access'
}

// ── More Actions Modal (brutalist flat sheet) ──

function MoreModal({ open, onClose, onAction }: {
  open: boolean
  onClose: () => void
  onAction: (action: string) => void
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.15)' }}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 35 }}
            className="fixed bottom-0 left-0 right-0 z-50 px-5 pt-4 pb-6"
            style={{
              background: BG,
              borderTop: `2px solid ${BORDER}`,
              borderRadius: 0,
            }}
          >
            <div className="flex flex-col gap-1">
              {[
                { id: 'orders', icon: <RiFileListLine size={18} color={TEXT_PRIMARY} />, label: 'Ordens abertas' },
                { id: 'statement', icon: <RiHistoryLine size={18} color={TEXT_PRIMARY} />, label: 'Extrato' },
              ].map(item => (
                <motion.button
                  key={item.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onAction(item.id)}
                  className="flex items-center gap-3 w-full px-4 py-3.5 border-none cursor-pointer text-left"
                  style={{
                    background: 'transparent',
                    borderBottom: `1px solid ${BORDER_LIGHT}`,
                  }}
                >
                  {item.icon}
                  <span style={{ color: TEXT_PRIMARY, fontSize: 15, fontWeight: 600 }}>
                    {item.label}
                  </span>
                </motion.button>
              ))}
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
              className="flex items-center justify-center w-full mt-3 py-3 border-none cursor-pointer"
              style={{ background: BG_CARD, borderRadius: 0 }}
            >
              <RiCloseLine size={16} color={TEXT_SECONDARY} />
              <span className="ml-2" style={{ color: TEXT_SECONDARY, fontSize: 13, fontWeight: 600 }}>
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
    const handled = onElementTap?.('Button: Explorar ativos')
    if (!handled) onNext()
  }

  // ── First Access State — Black/White split ──
  if (stateId === 'first-access') {
    const benefits = [
      { num: '01', title: 'Regulado e protegido', desc: 'Custódia em instituições reguladas, com cobertura automática.' },
      { num: '02', title: 'Sem comissões', desc: 'Invista sem taxas ocultas. Comece com apenas R$ 10.' },
      { num: '03', title: 'Diversificação global', desc: 'Bitcoin, ouro, dólar digital e rendimentos automáticos.' },
      { num: '04', title: 'Cobertura inclusa', desc: 'Proteção contra falhas técnicas — sem custo adicional.' },
    ]

    return (
      <div className="flex flex-col min-h-screen" style={{ background: BG }}>
        {/* Black top block */}
        <div className="relative" style={{ background: TEXT_PRIMARY, minHeight: '42vh' }}>
          <div style={{ height: 'var(--safe-area-top)' }} />
          <div className="px-6 pt-8 pb-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                color: '#FFFFFF',
                fontSize: 32,
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: -1,
                margin: 0,
              }}
            >
              Uma nova forma de construir patrimônio
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              style={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: 14,
                lineHeight: 1.5,
                margin: 0,
                marginTop: 12,
              }}
            >
              Invista em ativos globais com proteção automática e taxa zero.
            </motion.p>
          </div>
        </div>

        {/* White bottom — numbered benefits */}
        <div className="flex-1 px-6 pt-6 pb-4">
          <div className="flex flex-col">
            {benefits.map((b, i) => (
              <motion.div
                key={b.num}
                className="flex items-start gap-4 py-4"
                style={{ borderBottom: i < benefits.length - 1 ? `1px solid ${BORDER_LIGHT}` : undefined }}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.5 + i * 0.1 }}
              >
                <span style={{
                  color: TEXT_TERTIARY,
                  fontSize: 12,
                  fontWeight: 700,
                  fontFeatureSettings: "'tnum' 1",
                  minWidth: 20,
                }}>
                  {b.num}
                </span>
                <div className="flex flex-col gap-0.5">
                  <span style={{ color: TEXT_PRIMARY, fontSize: 15, fontWeight: 700 }}>{b.title}</span>
                  <span style={{ color: TEXT_SECONDARY, fontSize: 13, lineHeight: 1.45 }}>{b.desc}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA — black pill */}
        <div className="px-6 pb-[max(var(--safe-area-bottom),20px)]">
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.9 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              const handled = onElementTap?.('Button: Começar a investir')
              if (!handled) onNext()
            }}
            className="w-full py-4 border-none cursor-pointer"
            style={{
              background: TEXT_PRIMARY,
              color: '#FFFFFF',
              fontSize: 16,
              fontWeight: 700,
              borderRadius: 9999,
            }}
          >
            Começar a investir
          </motion.button>
        </div>
      </div>
    )
  }

  // ── Empty State — Typography-driven onboarding ──
  if (stateId === 'empty') {
    const featuredCards: { ticker: AssetTicker; badge?: string; highlight?: boolean }[] = [
      { ticker: 'RENDA-BRL', badge: 'Renda fixa' },
      { ticker: 'BTC', badge: 'Popular', highlight: true },
      { ticker: 'PAXG', badge: 'Proteção' },
    ]

    return (
      <div className="flex flex-col min-h-screen" style={{ background: BG }}>
        <div style={{ height: 'var(--safe-area-top)' }} />

        <div className="flex-1 overflow-y-auto relative">
          {/* Hero — giant headline */}
          <motion.div {...fadeUp(0)} className="px-6 pt-8 pb-2">
            <h1 style={{
              color: TEXT_PRIMARY,
              fontSize: 56,
              fontWeight: 900,
              lineHeight: 0.95,
              letterSpacing: -3,
              margin: 0,
            }}>
              INVISTA
            </h1>
            <p style={{
              color: TEXT_SECONDARY,
              fontSize: 16,
              lineHeight: 1.5,
              margin: 0,
              marginTop: 8,
            }}>
              Seu dinheiro pode fazer mais
            </p>
          </motion.div>

          {/* Geometric illustration */}
          <motion.div {...fadeUp(0.05)} className="flex justify-center py-4">
            <GeometricIllustration />
          </motion.div>

          {/* Social proof — plain text */}
          <motion.div {...fadeUp(0.1)} className="px-6 pb-6">
            <BrutalistSocialProof />
          </motion.div>

          {/* Asset grid — 2 columns */}
          <motion.div {...fadeUp(0.15)} className="px-6 mb-6">
            <span style={{
              color: TEXT_TERTIARY,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: 'uppercase' as const,
              display: 'block',
              marginBottom: 12,
            }}>
              DESTAQUE
            </span>
            <div className="grid grid-cols-2 gap-0" style={{ border: `1px solid ${BORDER}` }}>
              {featuredCards.map(({ ticker, badge, highlight }, i) => {
                const asset = getAsset(ticker)
                return (
                  <div
                    key={ticker}
                    style={{
                      borderRight: i === 0 ? `1px solid ${BORDER}` : undefined,
                      borderBottom: i < 2 ? `1px solid ${BORDER}` : undefined,
                      gridColumn: i === 2 ? 'span 2' : undefined,
                    }}
                  >
                    <BrutalistGridCard
                      icon={asset.icon}
                      name={asset.name}
                      detail={isVolatile(asset) ? formatBRL(asset.price!) : (asset.apyDisplay ?? '')}
                      badge={badge}
                      highlight={highlight}
                      onPress={() => handleAssetTap(ticker)}
                    />
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Steps */}
          <motion.div {...fadeUp(0.2)} className="px-6 mb-6">
            <span style={{
              color: TEXT_TERTIARY,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: 'uppercase' as const,
              display: 'block',
              marginBottom: 8,
            }}>
              COMO FUNCIONA
            </span>
            <BrutalistStepBlock />
          </motion.div>

          {/* Trust bar — plain text */}
          <motion.div {...fadeUp(0.25)} className="px-6 mb-6">
            <BrutalistTrustBar />
          </motion.div>

          {/* CTAs */}
          <motion.div {...fadeUp(0.3)} className="px-6 flex flex-col items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleExplore}
              className="w-full py-4 border-none cursor-pointer"
              style={{
                background: TEXT_PRIMARY,
                color: '#FFFFFF',
                fontSize: 16,
                fontWeight: 700,
                borderRadius: 9999,
              }}
            >
              Explorar ativos
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                const handled = onElementTap?.('Button: Simular investimento')
                if (!handled) onNext()
              }}
              className="border-none cursor-pointer bg-transparent"
              style={{
                color: TEXT_SECONDARY,
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'underline',
                textUnderlineOffset: 3,
              }}
            >
              Simular investimento
            </motion.button>
          </motion.div>

          <div style={{ paddingBottom: 'max(var(--safe-area-bottom), 20px)' }} />
        </div>
      </div>
    )
  }

  // ── Portfolio State (default) ──
  return (
    <div className="flex flex-col min-h-screen" style={{ background: BG }}>
      <div style={{ height: 'var(--safe-area-top)' }} />

      <div className="flex-1 overflow-y-auto relative">
        {/* Portfolio Value — oversized */}
        <motion.div {...fadeUp(0)} className="px-6 pt-6 pb-4">
          <BrutalistValue value={portfolioTotal} change={change24h} />
        </motion.div>

        {/* Shortcut Pills */}
        <motion.div {...fadeUp(0.05)} className="flex gap-2 px-6 mb-8">
          <BrutalistPillButton label="Negociar" onPress={() => handleShortcut('Negociar')} />
          <BrutalistPillButton label="Receber" onPress={() => handleShortcut('Receber')} />
          <BrutalistPillButton label="Enviar" onPress={() => handleShortcut('Enviar')} />
          <BrutalistPillButton label="Mais" onPress={() => setMoreOpen(true)} />
        </motion.div>

        {/* Holdings */}
        <motion.div {...fadeUp(0.1)} className="mb-4">
          <div className="px-6 mb-2">
            <span style={{
              color: TEXT_TERTIARY,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: 'uppercase' as const,
            }}>
              PORTFÓLIO
            </span>
          </div>
          <div className="flex flex-col">
            {MOCK_POSITIONS.map((pos, i) => {
              const asset = getAsset(pos.asset)
              return (
                <motion.div key={pos.asset} {...fadeUp(0.12 + i * 0.03)}>
                  <BrutalistAssetRow
                    icon={asset.icon}
                    name={asset.name}
                    ticker={pos.asset}
                    value={pos.currentValue}
                    quantity={pos.quantity}
                    sparkline={getSparkline(pos.asset)}
                    onPress={() => handleAssetTap(pos.asset)}
                  />
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Explore More — plain text link */}
        <motion.div {...fadeUp(0.3)} className="px-6 mb-6">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleExplore}
            className="flex items-center gap-2 border-none cursor-pointer bg-transparent p-0"
          >
            <span style={{ color: TEXT_PRIMARY, fontSize: 14, fontWeight: 600 }}>
              Explorar ativos
            </span>
            <RiArrowRightLine size={16} color={TEXT_PRIMARY} />
          </motion.button>
        </motion.div>

        <div style={{ paddingBottom: 'max(var(--safe-area-bottom), 20px)' }} />
      </div>

      <MoreModal
        open={moreOpen}
        onClose={() => setMoreOpen(false)}
        onAction={handleModalAction}
      />
    </div>
  )
}
