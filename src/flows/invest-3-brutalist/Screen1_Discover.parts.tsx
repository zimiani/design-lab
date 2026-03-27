/**
 * Discover parts — Neo-brutalist sub-components for the asset discovery screen.
 * Hard edges, 1px borders, no gradients, no glow. Typography-first.
 * Pure custom Tailwind + inline styles + Framer Motion. NO library components.
 */
import { motion } from 'framer-motion'
import { RiStarFill, RiStarLine } from '@remixicon/react'
import {
  BG_CARD, BORDER, BORDER_LIGHT, TEXT_PRIMARY, TEXT_SECONDARY, TEXT_TERTIARY,
  GREEN, RED,
} from './shared/theme'
import { listItem, starMorph } from './shared/animations'
import { formatBRL, formatPercentChange, isVolatile } from './shared/data'
import type { Asset } from '../../invest-2/shared/data'
import { Sparkline } from './Screen0_Dashboard.parts'

// ── Asset Row ──

interface AssetRowProps {
  asset: Asset
  color: string
  sparkline: number[]
  showFav?: boolean
  isFav?: boolean
  onPress?: () => void
  onFavToggle?: () => void
}

export function AssetRow({ asset, color, sparkline, showFav, isFav, onPress, onFavToggle }: AssetRowProps) {
  const volatile = isVolatile(asset)
  const change = asset.change24h ?? 0
  const isPositive = change >= 0

  return (
    <motion.div
      variants={listItem}
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: 1.01, backgroundColor: 'rgba(0,0,0,0.03)' }}
      className="flex items-center gap-3 w-full px-4 py-3"
      style={{ borderBottom: `1px solid ${BORDER_LIGHT}` }}
    >
      {/* Tappable main area */}
      <button
        onClick={onPress}
        className="flex items-center gap-3 flex-1 min-w-0 bg-transparent border-none cursor-pointer p-0 text-left"
      >
        {/* Icon */}
        <div className="flex-shrink-0 rounded-full overflow-hidden" style={{ width: 32, height: 32 }}>
          <img src={asset.icon} alt={asset.ticker} className="w-full h-full object-cover" />
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

        {/* Sparkline (monochrome in brutalist — uses TEXT_TERTIARY default) */}
        <Sparkline data={sparkline} width={50} height={20} />

        {/* Price / APY + Change */}
        <div className="flex flex-col items-end flex-shrink-0 ml-2">
          {volatile ? (
            <>
              <span style={{ color: TEXT_PRIMARY, fontSize: 14, fontWeight: 600 }}>
                {formatBRL(asset.price!)}
              </span>
              <span style={{
                color: isPositive ? GREEN : RED,
                fontSize: 11,
                fontWeight: 600,
              }}>
                {formatPercentChange(change)}
              </span>
            </>
          ) : (
            <>
              <span
                className="rounded-full px-2 py-0.5"
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: GREEN,
                  background: `${GREEN}18`,
                }}
              >
                {asset.apyDisplay}
              </span>
            </>
          )}
        </div>
      </button>

      {/* Favorite star */}
      {showFav && (
        <motion.button
          onClick={onFavToggle}
          {...starMorph}
          className="flex-shrink-0 bg-transparent border-none cursor-pointer p-1"
        >
          {isFav
            ? <RiStarFill size={18} color="#FBBF24" />
            : <RiStarLine size={18} color={TEXT_TERTIARY} />
          }
        </motion.button>
      )}
    </motion.div>
  )
}

// ── Featured Card (brutalist: hard edges, 1px border, no gradient/glow) ──

interface FeaturedCardProps {
  asset: Asset
  color: string
  sparkline: number[]
  onPress?: () => void
}

export function FeaturedCard({ asset, sparkline, onPress }: FeaturedCardProps) {
  const volatile = isVolatile(asset)
  const change = asset.change24h ?? 0
  const isPositive = change >= 0

  return (
    <motion.button
      onClick={onPress}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      className="flex-shrink-0 rounded-none p-4 border-none cursor-pointer text-left relative overflow-hidden"
      style={{
        width: 180,
        background: BG_CARD,
        border: `1px solid ${BORDER}`,
      }}
    >
      {/* No glow dot — brutalist */}

      <div className="flex flex-col gap-3 relative">
        {/* Icon */}
        <img
          src={asset.icon}
          alt={asset.ticker}
          className="rounded-full"
          style={{ width: 28, height: 28 }}
        />

        {/* Name */}
        <div className="flex flex-col gap-0.5">
          <span style={{ color: TEXT_PRIMARY, fontSize: 14, fontWeight: 600 }}>
            {asset.name}
          </span>
          <span style={{ color: TEXT_SECONDARY, fontSize: 12 }}>
            {asset.ticker}
          </span>
        </div>

        {/* Sparkline (monochrome) */}
        <Sparkline data={sparkline} width={100} height={28} />

        {/* Price + Change */}
        <div className="flex items-center justify-between">
          <span style={{ color: TEXT_PRIMARY, fontSize: 13, fontWeight: 600 }}>
            {volatile ? formatBRL(asset.price!) : asset.apyDisplay}
          </span>
          {volatile && (
            <span
              className="rounded-full px-2 py-0.5"
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: isPositive ? GREEN : RED,
                background: `${isPositive ? GREEN : RED}18`,
              }}
            >
              {formatPercentChange(change)}
            </span>
          )}
        </div>
      </div>
    </motion.button>
  )
}

// ── Category Pill (keeps rounded-full — pills stay round in brutalist) ──

interface CategoryPillProps {
  label: string
  active: boolean
  onPress?: () => void
}

export function CategoryPill({ label, active, onPress }: CategoryPillProps) {
  return (
    <motion.button
      onClick={onPress}
      whileTap={{ scale: 0.95 }}
      className="flex-shrink-0 rounded-full px-4 py-1.5 border-none cursor-pointer transition-colors relative"
      style={{
        background: 'transparent',
        color: active ? '#FFFFFF' : TEXT_TERTIARY,
        fontSize: 13,
        fontWeight: active ? 600 : 500,
        border: active ? 'none' : `1px solid ${BORDER_LIGHT}`,
      }}
    >
      {active && (
        <motion.div
          layoutId="categoryBg"
          className="absolute inset-0 rounded-full"
          style={{ background: TEXT_PRIMARY, zIndex: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
      <span className="relative" style={{ zIndex: 1 }}>{label}</span>
    </motion.button>
  )
}

// ── FavChip (brutalist: hard border, no soft bg) ──

interface FavChipProps {
  icon: string
  ticker: string
  change: number
  color: string
  onPress?: () => void
}

export function FavChip({ icon, ticker, change, onPress }: FavChipProps) {
  const isPositive = change >= 0

  return (
    <motion.button
      onClick={onPress}
      whileTap={{ scale: 0.95 }}
      className="flex-shrink-0 flex items-center gap-2 rounded-full px-3 py-1.5 border-none cursor-pointer"
      style={{
        background: BG_CARD,
        border: `1px solid ${BORDER}`,
      }}
    >
      <img src={icon} alt={ticker} className="rounded-full" style={{ width: 18, height: 18 }} />
      <span style={{ color: TEXT_PRIMARY, fontSize: 12, fontWeight: 600 }}>{ticker}</span>
      <span style={{
        color: isPositive ? GREEN : RED,
        fontSize: 11,
        fontWeight: 600,
      }}>
        {formatPercentChange(change)}
      </span>
    </motion.button>
  )
}
