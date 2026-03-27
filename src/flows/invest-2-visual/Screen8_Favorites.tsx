/**
 * Favorites — dark-themed list of favorited assets with inline sparklines.
 * Empty state when no favorites. Staggered entrance animations.
 * Pure custom Tailwind + inline styles + Framer Motion. NO library components.
 */
import { motion } from 'framer-motion'
import { RiArrowLeftLine, RiStarLine } from '@remixicon/react'
import type { FlowScreenProps } from '@/pages/simulator/flowRegistry'
import {
  getFavoriteAssets, getAssetColor, getSparkline, isVolatile,
  formatBRL, formatPercentChange,
} from './shared/data'
import type { AssetTicker } from './shared/data'
import {
  BG, BG_CARD, BORDER_LIGHT, TEXT_PRIMARY, TEXT_SECONDARY, TEXT_TERTIARY,
  GREEN, RED, SAFE_TOP, SAFE_BOTTOM, fadeUp,
} from './shared/theme'
import { listContainer, listItem, idlePulse } from './shared/animations'

// ── Inline Sparkline SVG ──

function Sparkline({ data, color, width = 60, height = 24, index = 0 }: {
  data: number[]
  color: string
  width?: number
  height?: number
  index?: number
}) {
  if (data.length < 2) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const padY = 2

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - padY - ((v - min) / range) * (height - padY * 2)
    return `${x},${y}`
  }).join(' ')

  return (
    <motion.svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <polyline
        points={points}
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </motion.svg>
  )
}

// ── Main Screen ──

export default function Screen8_Favorites({ onBack, onElementTap, onNext }: FlowScreenProps) {
  const favorites = getFavoriteAssets()

  const handleAssetTap = (name: string) => {
    const handled = onElementTap?.(`ListItem: ${name}`)
    if (!handled) onNext()
  }

  // ── Empty State ──
  if (favorites.length === 0) {
    return (
      <div className="flex flex-col min-h-screen" style={{ background: BG }}>
        <div style={{ height: SAFE_TOP }} />

        {/* Header */}
        <div className="flex items-center gap-3 px-5 pt-3 pb-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="flex items-center justify-center rounded-full border-none cursor-pointer"
            style={{ width: 36, height: 36, background: BG_CARD }}
          >
            <RiArrowLeftLine size={20} color={TEXT_PRIMARY} />
          </motion.button>
          <span style={{ color: TEXT_PRIMARY, fontSize: 17, fontWeight: 600 }}>
            Favoritos
          </span>
        </div>

        {/* Empty center */}
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          <motion.div
            {...fadeUp(0)}
            {...idlePulse}
            className="flex items-center justify-center rounded-full mb-5"
            style={{
              width: 72,
              height: 72,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <RiStarLine size={32} color={TEXT_TERTIARY} />
          </motion.div>
          <motion.span
            {...fadeUp(0.05)}
            style={{ color: TEXT_SECONDARY, fontSize: 15, fontWeight: 500 }}
          >
            Nenhum favorito
          </motion.span>
          <motion.span
            {...fadeUp(0.1)}
            className="mt-1.5 text-center max-w-[240px]"
            style={{ color: TEXT_TERTIARY, fontSize: 13, lineHeight: 1.5 }}
          >
            Toque no icone de estrela em qualquer ativo para adicioná-lo aos seus favoritos.
          </motion.span>
        </div>

        <div style={{ paddingBottom: SAFE_BOTTOM }} />
      </div>
    )
  }

  // ── Favorites List ──
  return (
    <div className="flex flex-col min-h-screen" style={{ background: BG }}>
      <div style={{ height: SAFE_TOP }} />

      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-3 pb-4">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="flex items-center justify-center rounded-full border-none cursor-pointer"
          style={{ width: 36, height: 36, background: BG_CARD }}
        >
          <RiArrowLeftLine size={20} color={TEXT_PRIMARY} />
        </motion.button>
        <span style={{ color: TEXT_PRIMARY, fontSize: 17, fontWeight: 600 }}>
          Favoritos
        </span>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Count header */}
        <motion.div {...fadeUp(0)} className="flex items-center gap-2.5 px-5 mb-3">
          <span style={{
            color: TEXT_TERTIARY,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: 0.5,
            textTransform: 'uppercase' as const,
          }}>
            Seus favoritos
          </span>
          <span
            className="inline-flex items-center justify-center rounded-full"
            style={{
              minWidth: 20,
              height: 20,
              padding: '0 6px',
              fontSize: 11,
              fontWeight: 700,
              color: TEXT_PRIMARY,
              background: 'rgba(255,255,255,0.10)',
            }}
          >
            {favorites.length}
          </span>
        </motion.div>

        {/* Asset rows */}
        <motion.div variants={listContainer} initial="hidden" animate="visible" className="flex flex-col">
          {favorites.map((asset, i) => {
            const color = getAssetColor(asset.ticker)
            const sparkline = getSparkline(asset.ticker)
            const volatile = isVolatile(asset)
            const change = asset.change24h ?? 0
            const isPositive = change >= 0

            return (
              <motion.button
                key={asset.ticker}
                variants={listItem}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleAssetTap(asset.name)}
                className="flex items-center gap-3 w-full px-5 py-3.5 border-none cursor-pointer text-left"
                style={{
                  background: 'transparent',
                  borderBottom: `1px solid ${BORDER_LIGHT}`,
                }}
              >
                {/* Icon */}
                <div
                  className="flex-shrink-0 rounded-full overflow-hidden"
                  style={{ width: 28, height: 28 }}
                >
                  <img
                    src={asset.icon}
                    alt={asset.ticker}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Name + Ticker */}
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="truncate" style={{ color: TEXT_PRIMARY, fontSize: 14, fontWeight: 600 }}>
                    {asset.name}
                  </span>
                  <span style={{ color: TEXT_SECONDARY, fontSize: 12 }}>
                    {asset.ticker}
                  </span>
                </div>

                {/* Sparkline */}
                <Sparkline data={sparkline} color={color} width={60} height={24} index={i} />

                {/* Price / APY + Change */}
                <div className="flex flex-col items-end flex-shrink-0 ml-2">
                  <span style={{ color: TEXT_PRIMARY, fontSize: 14, fontWeight: 600 }}>
                    {volatile ? formatBRL(asset.price!) : asset.apyDisplay}
                  </span>
                  {volatile ? (
                    <span style={{
                      color: isPositive ? GREEN : RED,
                      fontSize: 11,
                      fontWeight: 600,
                    }}>
                      {formatPercentChange(change)}
                    </span>
                  ) : (
                    <span style={{ color: TEXT_SECONDARY, fontSize: 11 }}>
                      rendimento
                    </span>
                  )}
                </div>
              </motion.button>
            )
          })}
        </motion.div>

        <div style={{ paddingBottom: SAFE_BOTTOM }} />
      </div>
    </div>
  )
}
