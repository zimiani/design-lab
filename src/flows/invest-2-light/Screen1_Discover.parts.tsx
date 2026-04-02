/**
 * Discover parts — dark-themed sub-components for the asset discovery screen.
 * Pure custom Tailwind + inline styles + Framer Motion. NO library components.
 */
import { motion } from 'framer-motion'
import { RiHeartFill, RiHeartLine } from '@remixicon/react'
import {
  BORDER_LIGHT, TEXT_PRIMARY, TEXT_SECONDARY, TEXT_TERTIARY,
  GREEN, RED,
} from './shared/theme'
import { listItem, starMorph } from './shared/animations'
import { formatBRL, formatPercentChange, isVolatile } from './shared/data'
import type { Asset } from './shared/data'
import { Sparkline } from './Screen0_Dashboard.parts'
import { TokenLogo, TokenLogoCircle } from './shared/TokenLogo'

// ── Asset Row ──

interface AssetRowProps {
  asset: Asset
  color: string
  sparkline: number[]
  sparklineColor?: string
  showFav?: boolean
  isFav?: boolean
  onPress?: () => void
  onFavToggle?: () => void
}

export function AssetRow({ asset, color, sparkline, sparklineColor, showFav, isFav, onPress, onFavToggle }: AssetRowProps) {
  const volatile = isVolatile(asset)
  const change = asset.change24h ?? 0
  const isPositive = change >= 0

  return (
    <motion.div
      variants={listItem}
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: 1.01, backgroundColor: 'rgba(0,0,0,0.05)' }}
      className="flex items-center gap-3 w-full px-4 py-3"
      style={{ borderBottom: `1px solid ${BORDER_LIGHT}` }}
    >
      {/* Tappable main area */}
      <button
        onClick={onPress}
        className="flex items-center gap-3 flex-1 min-w-0 bg-transparent border-none cursor-pointer p-0 text-left"
      >
        {/* Icon */}
        <TokenLogoCircle ticker={asset.ticker} fallbackUrl={asset.icon} size={32} color={color} className="flex-shrink-0" />

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
        <Sparkline data={sparkline} color={sparklineColor ?? color} width={50} height={20} />

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
            ? <RiHeartFill size={18} color="#F43F5E" />
            : <RiHeartLine size={18} color={TEXT_TERTIARY} />
          }
        </motion.button>
      )}
    </motion.div>
  )
}

// ── Featured Card ──

interface FeaturedCardProps {
  asset: Asset
  color: string
  sparkline: number[]
  iconColor?: string
  onPress?: () => void
}

export function FeaturedCard({ asset, color, sparkline, iconColor, onPress }: FeaturedCardProps) {
  const volatile = isVolatile(asset)
  const change = asset.change24h ?? 0
  const isPositive = change >= 0

  return (
    <motion.button
      onClick={onPress}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      className="flex-shrink-0 rounded-2xl p-4 border-none cursor-pointer text-left relative overflow-hidden"
      style={{
        width: 180,
        background: `linear-gradient(135deg, ${color}18 0%, ${color}08 100%)`,
        border: `1px solid ${color}20`,
      }}
    >
      {/* Glow dot */}
      <div
        className="absolute top-0 right-0 pointer-events-none"
        style={{
          width: 70,
          height: 70,
          background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
        }}
      />

      <div className="flex flex-col gap-3 relative">
        {/* Icon */}
        <TokenLogo ticker={asset.ticker} fallbackUrl={asset.icon} size={28} color={iconColor ?? color} className="rounded-full" />

        {/* Name */}
        <div className="flex flex-col gap-0.5">
          <span style={{ color: TEXT_PRIMARY, fontSize: 14, fontWeight: 600 }}>
            {asset.name}
          </span>
          <span style={{ color: TEXT_SECONDARY, fontSize: 12 }}>
            {asset.ticker}
          </span>
        </div>

        {/* Sparkline */}
        <Sparkline data={sparkline} color={color} width={100} height={28} />

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

// ── Category Pill ──

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
      className="flex-shrink-0 rounded-full px-4 py-1.5 border-none cursor-pointer relative"
      style={{
        background: 'transparent',
        color: active ? '#FFFFFF' : TEXT_PRIMARY,
        fontSize: 16,
        fontWeight: 600,
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
