/**
 * Custom visual components — no library constraints.
 * Inspired by Public, Revolut, and modern fintech aesthetics.
 */
import { motion } from 'framer-motion'
import type { Asset } from './shared/data'
import { formatBRL, formatPct } from './shared/data'

// ── Mini Sparkline (SVG) ──

export function Sparkline({ data, color, width = 60, height = 24 }: {
  data: number[]
  color: string
  width?: number
  height?: number
}) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((v - min) / range) * height
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="flex-shrink-0">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ── Featured Asset Card (large, for trending carousel) ──

export function FeaturedCard({ asset, onPress, index }: {
  asset: Asset
  onPress?: () => void
  index: number
}) {
  const isFixed = asset.category === 'fixed-income'
  const isPositive = (asset.change24h ?? 0) >= 0

  return (
    <motion.button
      onClick={onPress}
      className="flex-shrink-0 w-[200px] rounded-2xl p-4 text-left relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${asset.color}18 0%, ${asset.color}08 100%)`,
        border: `1px solid ${asset.color}25`,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileTap={{ scale: 0.97 }}
    >
      {/* Glow effect */}
      <div
        className="absolute -top-12 -right-12 w-24 h-24 rounded-full opacity-25 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${asset.color}80 0%, transparent 70%)` }}
      />

      <div className="relative flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <img src={asset.icon} alt="" className="w-8 h-8 rounded-full" />
          <div>
            <div className="text-[13px] font-semibold text-white">{asset.name}</div>
            <div className="text-[11px] text-white/50">{asset.ticker}</div>
          </div>
        </div>

        <Sparkline data={asset.sparkline} color={asset.color} width={168} height={32} />

        <div className="flex items-end justify-between">
          <div className="text-[15px] font-bold text-white">
            {isFixed ? asset.apyDisplay : formatBRL(asset.price!)}
          </div>
          {!isFixed && (
            <div className={`text-[12px] font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
              {formatPct(asset.change24h!)}
            </div>
          )}
        </div>
      </div>
    </motion.button>
  )
}

// ── Asset List Row (compact, with sparkline) ──

export function AssetListRow({ asset, onPress, index }: {
  asset: Asset
  onPress?: () => void
  index: number
}) {
  const isFixed = asset.category === 'fixed-income'
  const isPositive = (asset.change24h ?? 0) >= 0

  return (
    <motion.button
      onClick={onPress}
      className="flex items-center gap-3 w-full px-1 py-3 text-left border-b border-white/[0.04] last:border-0"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Icon */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: `${asset.color}20` }}
      >
        <img src={asset.icon} alt="" className="w-6 h-6 rounded-full" />
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-semibold text-white truncate">{asset.name}</div>
        <div className="text-[12px] text-white/40">
          {isFixed ? 'Renda Fixa' : asset.ticker}
        </div>
      </div>

      {/* Sparkline */}
      <Sparkline
        data={asset.sparkline}
        color={isFixed ? '#10B981' : (isPositive ? '#10B981' : '#F87171')}
        width={48}
        height={20}
      />

      {/* Price / APY */}
      <div className="text-right flex-shrink-0 w-[90px]">
        <div className="text-[13px] font-semibold text-white">
          {isFixed ? asset.apyDisplay : formatBRL(asset.price!)}
        </div>
        {!isFixed && (
          <div className={`text-[11px] font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
            {formatPct(asset.change24h!)}
          </div>
        )}
        {isFixed && (
          <div className="text-[11px] text-emerald-400">Renda Fixa</div>
        )}
      </div>
    </motion.button>
  )
}

// ── Category Pill ──

export function CategoryPill({ label, active, onPress, icon }: {
  label: string
  active: boolean
  onPress: () => void
  icon?: string
}) {
  return (
    <button
      onClick={onPress}
      className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-200 ${
        active
          ? 'bg-white text-black'
          : 'bg-white/[0.06] text-white/60 hover:bg-white/[0.1]'
      }`}
    >
      {icon && <span className="text-[14px]">{icon}</span>}
      {label}
    </button>
  )
}

// ── Section Header ──

export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <h3 className="text-[16px] font-bold text-white">{title}</h3>
      {subtitle && <span className="text-[12px] text-white/40">{subtitle}</span>}
    </div>
  )
}
