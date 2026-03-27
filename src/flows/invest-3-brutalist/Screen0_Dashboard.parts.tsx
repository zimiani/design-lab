/**
 * Dashboard parts — Neo-brutalist sub-components.
 * Bauhaus-inspired: oversized typography, B&W, hard edges, no decoration.
 */
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { RiShieldCheckLine } from '@remixicon/react'
import {
  BG_CARD, BORDER, BORDER_LIGHT, TEXT_PRIMARY, TEXT_SECONDARY, TEXT_TERTIARY, TEXT_MUTED, GREEN, RED, ACCENT,
} from './shared/theme'
import { formatBRL, formatPercentChange, formatQuantity, isVolatile, getAsset } from './shared/data'
import type { AssetTicker } from './shared/data'

// ── Sparkline (monochrome) ──

interface SparklineProps {
  data: number[]
  color?: string
  width?: number
  height?: number
}

export function Sparkline({ data, color = TEXT_TERTIARY, width = 60, height = 24 }: SparklineProps) {
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
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
      <polyline
        points={points}
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

// ── BrutalistValue — oversized portfolio display ──

interface BrutalistValueProps {
  value: number
  change: number
}

export function BrutalistValue({ value, change }: BrutalistValueProps) {
  const formatted = value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const isPositive = change >= 0

  return (
    <div className="flex flex-col gap-1">
      <span style={{
        color: TEXT_SECONDARY,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 2,
        textTransform: 'uppercase' as const,
      }}>
        PATRIMÔNIO
      </span>
      <span style={{
        color: TEXT_PRIMARY,
        fontSize: 48,
        fontWeight: 800,
        lineHeight: 1,
        letterSpacing: -2,
        fontFeatureSettings: "'tnum' 1",
      }}>
        R$ {formatted}
      </span>
      <span style={{
        color: isPositive ? GREEN : RED,
        fontSize: 14,
        fontWeight: 600,
        letterSpacing: -0.3,
      }}>
        {formatPercentChange(change)} hoje
      </span>
    </div>
  )
}

// ── BrutalistAssetRow — clean holding row with 1px divider ──

interface BrutalistAssetRowProps {
  icon: string
  name: string
  ticker: AssetTicker
  value: number
  quantity: number
  sparkline: number[]
  onPress?: () => void
}

export function BrutalistAssetRow({ icon, name, ticker, value, quantity, sparkline, onPress }: BrutalistAssetRowProps) {
  const asset = getAsset(ticker)
  const volatile = isVolatile(asset)

  return (
    <motion.button
      onClick={onPress}
      whileTap={{ scale: 0.98 }}
      className="flex items-center gap-3 w-full px-5 py-3.5 text-left cursor-pointer border-none"
      style={{
        background: 'transparent',
        borderBottom: `1px solid ${BORDER_LIGHT}`,
      }}
    >
      <div
        className="flex-shrink-0 rounded-full overflow-hidden"
        style={{ width: 24, height: 24 }}
      >
        <img src={icon} alt={ticker} className="w-full h-full object-cover" />
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        <span className="truncate" style={{ color: TEXT_PRIMARY, fontSize: 14, fontWeight: 600 }}>
          {name}
        </span>
        <span style={{ color: TEXT_TERTIARY, fontSize: 11, fontWeight: 500, letterSpacing: 0.5 }}>
          {ticker}
        </span>
      </div>

      <Sparkline data={sparkline} width={48} height={20} />

      <div className="flex flex-col items-end flex-shrink-0 ml-2">
        <span style={{ color: TEXT_PRIMARY, fontSize: 14, fontWeight: 700, fontFeatureSettings: "'tnum' 1" }}>
          {formatBRL(value)}
        </span>
        <span style={{ color: TEXT_TERTIARY, fontSize: 11 }}>
          {volatile ? formatQuantity(quantity, ticker) : asset.apyDisplay ?? ''}
        </span>
      </div>
    </motion.button>
  )
}

// ── BrutalistPillButton — black-outlined pill shortcut ──

interface BrutalistPillButtonProps {
  label: string
  onPress?: () => void
}

export function BrutalistPillButton({ label, onPress }: BrutalistPillButtonProps) {
  return (
    <motion.button
      onClick={onPress}
      whileTap={{ scale: 0.95 }}
      className="flex items-center justify-center border-none cursor-pointer"
      style={{
        padding: '8px 18px',
        borderRadius: 9999,
        background: 'transparent',
        border: `1.5px solid ${BORDER}`,
        color: TEXT_PRIMARY,
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: -0.2,
      }}
    >
      {label}
    </motion.button>
  )
}

// ── BrutalistGridCard — flat card for empty state asset grid ──

interface BrutalistGridCardProps {
  icon: string
  name: string
  detail: string
  badge?: string
  highlight?: boolean
  onPress?: () => void
}

export function BrutalistGridCard({ icon, name, detail, badge, highlight, onPress }: BrutalistGridCardProps) {
  return (
    <motion.button
      onClick={onPress}
      whileTap={{ scale: 0.97 }}
      className="flex flex-col gap-3 p-4 text-left cursor-pointer"
      style={{
        background: highlight ? ACCENT : BG_CARD,
        border: `1px solid ${BORDER}`,
        borderRadius: 0,
        minHeight: 120,
      }}
    >
      {badge && (
        <span style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 1,
          textTransform: 'uppercase' as const,
          color: highlight ? TEXT_PRIMARY : TEXT_SECONDARY,
        }}>
          {badge}
        </span>
      )}
      <div className="flex items-center gap-2">
        <img src={icon} alt={name} className="rounded-full" style={{ width: 24, height: 24 }} />
        <span style={{ color: highlight ? TEXT_PRIMARY : TEXT_PRIMARY, fontSize: 15, fontWeight: 700 }}>
          {name}
        </span>
      </div>
      <span style={{
        color: highlight ? 'rgba(0,0,0,0.6)' : TEXT_SECONDARY,
        fontSize: 12,
        lineHeight: 1.4,
      }}>
        {detail}
      </span>
    </motion.button>
  )
}

// ── BrutalistStepBlock — numbered step squares ──

export function BrutalistStepBlock() {
  const steps = [
    { num: '01', label: 'Explorar', desc: 'Conheça os ativos disponíveis' },
    { num: '02', label: 'Escolher', desc: 'Selecione o que faz sentido para você' },
    { num: '03', label: 'Investir', desc: 'Comece com qualquer valor' },
  ]

  return (
    <div className="flex flex-col gap-0">
      {steps.map((step, i) => (
        <motion.div
          key={step.num}
          className="flex items-start gap-4 py-3"
          style={{ borderBottom: i < steps.length - 1 ? `1px solid ${BORDER_LIGHT}` : undefined }}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
        >
          <div
            className="flex-shrink-0 flex items-center justify-center"
            style={{
              width: 36,
              height: 36,
              background: i === 0 ? TEXT_PRIMARY : 'transparent',
              border: i === 0 ? 'none' : `1.5px solid ${BORDER}`,
              borderRadius: 0,
            }}
          >
            <span style={{
              color: i === 0 ? '#FFFFFF' : TEXT_SECONDARY,
              fontSize: 13,
              fontWeight: 700,
              fontFeatureSettings: "'tnum' 1",
            }}>
              {step.num}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span style={{ color: TEXT_PRIMARY, fontSize: 14, fontWeight: 700 }}>{step.label}</span>
            <span style={{ color: TEXT_SECONDARY, fontSize: 12 }}>{step.desc}</span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// ── GeometricIllustration — Bauhaus-inspired SVG ──

export function GeometricIllustration() {
  return (
    <div className="flex items-center justify-center" style={{ width: 160, height: 160 }}>
      <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
        {/* Large circle — primary form */}
        <motion.circle
          cx="80" cy="70" r="45"
          stroke={TEXT_PRIMARY}
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
        {/* Triangle — secondary form */}
        <motion.polygon
          points="80,30 110,90 50,90"
          stroke={TEXT_PRIMARY}
          strokeWidth="2"
          fill="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        />
        {/* Green accent circle — data highlight */}
        <motion.circle
          cx="80" cy="70" r="12"
          fill={GREEN}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.9 }}
        />
        {/* Horizontal line — structural */}
        <motion.line
          x1="20" y1="130" x2="140" y2="130"
          stroke={TEXT_PRIMARY}
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 1.1 }}
        />
        {/* Small square */}
        <motion.rect
          x="120" y="40" width="16" height="16"
          stroke={TEXT_PRIMARY}
          strokeWidth="1.5"
          fill="none"
          initial={{ opacity: 0, rotate: 45 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ duration: 0.4, delay: 1.3 }}
          style={{ transformOrigin: '128px 48px' }}
        />
      </svg>
    </div>
  )
}

// ── BrutalistSocialProof — plain text, no avatars ──

export function BrutalistSocialProof() {
  const target = 12847
  const [count, setCount] = useState(0)
  const ref = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const duration = 1500
    const steps = 40
    const increment = target / steps
    let current = 0
    ref.current = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        if (ref.current) clearInterval(ref.current)
      } else {
        setCount(Math.round(current))
      }
    }, duration / steps)
    return () => { if (ref.current) clearInterval(ref.current) }
  }, [])

  const formatted = count.toLocaleString('pt-BR')

  return (
    <div className="flex items-center gap-1.5">
      <span style={{
        color: TEXT_PRIMARY,
        fontSize: 14,
        fontWeight: 800,
        fontFeatureSettings: "'tnum' 1",
      }}>
        {formatted}
      </span>
      <span style={{ color: TEXT_SECONDARY, fontSize: 14 }}>
        pessoas esta semana
      </span>
    </div>
  )
}

// ── BrutalistTrustBar — plain text + shield icon ──

export function BrutalistTrustBar() {
  return (
    <div className="flex items-center gap-2.5">
      <RiShieldCheckLine size={16} color={TEXT_PRIMARY} />
      <span style={{ color: TEXT_SECONDARY, fontSize: 12, lineHeight: 1.4 }}>
        Investimentos protegidos — cobertura automática inclusa
      </span>
    </div>
  )
}
