/**
 * Screen3b_TpSlConfig.parts — Shared TP/SL sub-components (Neo-Brutalist).
 * Flat surfaces, hard borders, no rounded corners on containers, rounded-full on pills only.
 */
import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BG, BG_CARD, BORDER, BORDER_LIGHT, TEXT_PRIMARY, TEXT_SECONDARY, TEXT_TERTIARY, TEXT_MUTED,
  GREEN, RED, SAFE_BOTTOM,
} from './shared/theme'
import { formatBRL } from './shared/data'

// ═══════════════════════════════════════════════
// 1. PriceLine — Absolute overlay on chart
// ═══════════════════════════════════════════════

interface PriceLineProps {
  price: number
  label: string // "TP" or "SL"
  color: string
  y: number // percentage from top (0-100)
}

export function PriceLine({ price, label, color, y }: PriceLineProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      exit={{ opacity: 0, scaleX: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className="absolute left-0 right-0 flex items-center pointer-events-none"
      style={{
        top: `${y}%`,
        transformOrigin: 'left center',
      }}
    >
      {/* Label badge (left) — hard edge */}
      <span
        className="flex-shrink-0 px-1.5 py-0.5 z-10"
        style={{
          background: `${color}30`,
          border: `1px solid ${color}`,
          color,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 0.5,
        }}
      >
        {label}
      </span>

      {/* Dashed line */}
      <div
        className="flex-1 mx-1"
        style={{
          height: 1,
          background: `repeating-linear-gradient(to right, ${color} 0px, ${color} 4px, transparent 4px, transparent 8px)`,
        }}
      />

      {/* Price badge (right) — hard edge */}
      <span
        className="flex-shrink-0 px-1.5 py-0.5 z-10"
        style={{
          background: `${color}20`,
          border: `1px solid ${color}`,
          color,
          fontSize: 10,
          fontWeight: 600,
        }}
      >
        {formatBRL(price)}
      </span>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════
// 2. PriceSheet — Custom bottom panel
// ═══════════════════════════════════════════════

interface PriceSheetProps {
  open: boolean
  onClose: () => void
  title: string
  currentPrice: number
  direction: 'up' | 'down'
  onConfirm: (price: number) => void
}

// Mini keypad key — hard edge
function MiniKey({ label, onPress }: { label: string; onPress: () => void }) {
  const isDelete = label === 'del'
  return (
    <motion.button
      whileTap={{ scale: 0.92, backgroundColor: 'rgba(0,0,0,0.06)' }}
      onClick={onPress}
      className="flex items-center justify-center cursor-pointer"
      style={{
        height: 52,
        borderRadius: 0,
        background: BG_CARD,
        border: `1px solid ${BORDER_LIGHT}`,
        fontSize: 20,
        fontWeight: 500,
        color: TEXT_PRIMARY,
      }}
    >
      {isDelete ? (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
          <path
            d="M21 4H8l-7 8 7 8h13a2 2 0 002-2V6a2 2 0 00-2-2z"
            stroke={TEXT_PRIMARY} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          />
          <path d="M18 9l-6 6M12 9l6 6" stroke={TEXT_PRIMARY} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : label}
    </motion.button>
  )
}

// Percent quick-pill inside sheet — rounded-full kept for pills
function SheetPill({ label, active, onPress }: {
  label: string; active: boolean; onPress: () => void
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      onClick={onPress}
      className="flex-1 flex items-center justify-center rounded-full cursor-pointer py-2"
      style={{
        background: active ? TEXT_PRIMARY : 'transparent',
        border: `1px solid ${BORDER}`,
        fontSize: 12,
        fontWeight: 600,
        color: active ? '#FFFFFF' : TEXT_TERTIARY,
      }}
    >
      {label}
    </motion.button>
  )
}

export function PriceSheet({ open, onClose, title, currentPrice, direction, onConfirm }: PriceSheetProps) {
  const isUp = direction === 'up'
  const accentColor = isUp ? GREEN : RED
  const pctOptions = [5, 10, 15, 20]

  const [digits, setDigits] = useState('')
  const [activePct, setActivePct] = useState<number | null>(null)

  const amount = digits ? parseInt(digits, 10) / 100 : 0
  const isValid = amount > 0

  const appendDigit = useCallback((d: string) => {
    setDigits(prev => (prev.length >= 12 ? prev : prev + d))
    setActivePct(null)
  }, [])

  const deleteLast = useCallback(() => {
    setDigits(prev => prev.slice(0, -1))
    setActivePct(null)
  }, [])

  const applyPercent = useCallback((pct: number) => {
    const multiplier = isUp ? (1 + pct / 100) : (1 - pct / 100)
    const targetPrice = Math.round(currentPrice * multiplier * 100)
    setDigits(targetPrice.toString())
    setActivePct(pct)
  }, [currentPrice, isUp])

  // Distance from current price
  const distance = amount > 0
    ? (((amount - currentPrice) / currentPrice) * 100)
    : 0

  const formatDisplay = (d: string): string => {
    const val = d ? parseInt(d, 10) / 100 : 0
    if (val <= 0) return '0,00'
    return val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const handleConfirm = useCallback(() => {
    if (isValid) {
      onConfirm(amount)
      setDigits('')
      setActivePct(null)
    }
  }, [isValid, amount, onConfirm])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.20)' }}
          />

          {/* Panel — hard top edge, no rounded corners */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute bottom-0 left-0 right-0 z-50 flex flex-col"
            style={{
              background: BG,
              borderTop: `2px solid ${BORDER}`,
            }}
          >
            {/* Handle — hard edge bar */}
            <div className="flex justify-center pt-3 pb-2">
              <div style={{ width: 36, height: 4, background: BORDER_LIGHT }} />
            </div>

            {/* Title + Current price */}
            <div className="flex items-center justify-between px-5 mb-4">
              <span style={{ color: TEXT_PRIMARY, fontSize: 16, fontWeight: 700 }}>{title}</span>
              <span style={{ color: TEXT_TERTIARY, fontSize: 12 }}>
                Atual: {formatBRL(currentPrice)}
              </span>
            </div>

            {/* Percent pills */}
            <div className="flex items-center gap-2 px-5 mb-4">
              {pctOptions.map(pct => (
                <SheetPill
                  key={pct}
                  label={`${isUp ? '+' : '-'}${pct}%`}
                  active={activePct === pct}
                  onPress={() => applyPercent(pct)}
                />
              ))}
            </div>

            {/* Amount display */}
            <div className="flex flex-col items-center py-3">
              <div className="flex items-baseline gap-1">
                <span style={{ color: TEXT_TERTIARY, fontSize: 20, fontWeight: 600 }}>R$</span>
                <span style={{
                  color: TEXT_PRIMARY,
                  fontSize: 36,
                  fontWeight: 800,
                  lineHeight: 1,
                  letterSpacing: -1.5,
                }}>
                  {formatDisplay(digits)}
                </span>
              </div>
              {/* Distance indicator */}
              {isValid && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-1"
                  style={{
                    color: accentColor,
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {distance >= 0 ? '+' : ''}{distance.toFixed(1)}% do preco atual
                </motion.span>
              )}
            </div>

            {/* Mini keypad */}
            <div className="grid grid-cols-3 gap-1.5 px-5 mb-3">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'del'].map(key => (
                <MiniKey
                  key={key}
                  label={key}
                  onPress={() => {
                    if (key === 'del') deleteLast()
                    else if (key === '.') { /* cents-based — no decimal */ }
                    else appendDigit(key)
                  }}
                />
              ))}
            </div>

            {/* Confirm button — black pill CTA */}
            <div className="px-5" style={{ paddingBottom: `calc(${SAFE_BOTTOM} + 4px)` }}>
              <motion.button
                whileTap={isValid ? { scale: 0.97 } : undefined}
                onClick={handleConfirm}
                className="w-full flex items-center justify-center rounded-full cursor-pointer"
                style={{
                  height: 48,
                  background: isValid ? '#000000' : BG_CARD,
                  border: isValid ? 'none' : `1px solid ${BORDER_LIGHT}`,
                  fontSize: 15,
                  fontWeight: 700,
                  color: isValid ? '#FFFFFF' : TEXT_MUTED,
                  transition: 'background 0.2s',
                }}
              >
                Confirmar
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ═══════════════════════════════════════════════
// 3. ToggleRow — Custom toggle with hard-edge track, rounded-full knob
// ═══════════════════════════════════════════════

interface ToggleRowProps {
  label: string
  sublabel?: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function ToggleRow({ label, sublabel, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex flex-col">
        <span style={{ color: TEXT_PRIMARY, fontSize: 14, fontWeight: 600 }}>
          {label}
        </span>
        {sublabel && (
          <span style={{ color: TEXT_SECONDARY, fontSize: 12, marginTop: 2 }}>
            {sublabel}
          </span>
        )}
      </div>

      {/* Toggle switch — hard-edge track, rounded-full knob */}
      <motion.button
        onClick={() => onChange(!checked)}
        className="relative flex-shrink-0 border-none cursor-pointer p-0"
        style={{
          width: 44,
          height: 24,
          borderRadius: 4,
          background: checked ? TEXT_PRIMARY : BG_CARD,
          border: `1px solid ${BORDER}`,
          transition: 'background 0.2s',
        }}
      >
        <motion.div
          animate={{
            x: checked ? 22 : 2,
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-1 rounded-full"
          style={{
            width: 16,
            height: 16,
            background: checked ? '#FFFFFF' : TEXT_TERTIARY,
          }}
        />
      </motion.button>
    </div>
  )
}
