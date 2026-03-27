/**
 * Screen6_Success — Clean success screen (Neo-Brutalist).
 * No confetti, large black circle checkmark, clean summary with borders, black CTA pill.
 * NO library components.
 */
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import type { FlowScreenProps } from '@/pages/simulator/flowRegistry'
import { useScreenData } from '@/lib/ScreenDataContext'
import {
  getAsset,
  getAssetColor,
  isVolatile,
  formatBRL,
  formatQuantity,
} from './shared/data'
import type { AssetTicker } from './shared/data'
import {
  BG,
  BORDER,
  BORDER_LIGHT,
  BG_CARD,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  SAFE_TOP,
  SAFE_BOTTOM,
  fadeUp,
} from './shared/theme'
import { stagger } from './shared/animations'
import { playSuccess } from './shared/sounds'

// ── Types ──

interface ScreenData {
  assetTicker?: string
  mode?: 'buy' | 'sell'
}

// ── Component ──

export default function Screen6_Success({
  onNext,
  onElementTap,
}: FlowScreenProps) {
  const { assetTicker = 'BTC', mode = 'buy' } = useScreenData<ScreenData>()
  const asset = getAsset(assetTicker as AssetTicker)
  const _color = getAssetColor(assetTicker)
  const volatile = isVolatile(asset)
  const isBuy = mode === 'buy'

  // Play success sound after checkmark entrance
  useEffect(() => {
    const timeout = setTimeout(() => playSuccess(), 300)
    return () => clearTimeout(timeout)
  }, [])

  const now = new Date()
  const dateStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

  const summaryRows = [
    { label: 'Ativo', value: asset.name },
    { label: 'Valor', value: formatBRL(100) },
    ...(volatile
      ? [
          {
            label: 'Quantidade',
            value: formatQuantity(
              asset.price ? 100 / asset.price : 0,
              asset.ticker,
            ),
          },
        ]
      : []),
    { label: 'Data/Hora', value: `${dateStr} as ${timeStr}` },
  ]

  const handleEntendi = () => {
    const handled = onElementTap?.('Button: Entendi')
    if (!handled) onNext()
  }

  return (
    <div
      className="relative flex flex-col h-full w-full overflow-hidden"
      style={{ background: BG }}
    >
      {/* Safe area spacer */}
      <div className="flex-shrink-0" style={{ paddingTop: SAFE_TOP }} />

      {/* Scrollable content */}
      <div className="relative z-10 flex-1 flex flex-col items-center overflow-y-auto px-5">
        {/* Spacer */}
        <div className="flex-1 min-h-12" />

        {/* Checkmark circle — solid black circle, white check */}
        <motion.div
          className="relative flex items-center justify-center"
          style={{ width: 96, height: 96 }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
            delay: 0.3,
          }}
        >
          {/* Solid black circle */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: TEXT_PRIMARY,
            }}
          />
          {/* White check */}
          <motion.svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="relative z-10"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 20,
              delay: 0.6,
            }}
          >
            <motion.polyline
              points="20 6 9 17 4 12"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              style={{ strokeDasharray: 1, strokeDashoffset: 0 }}
            />
          </motion.svg>
        </motion.div>

        {/* Heading */}
        <motion.h1
          className="mt-6 text-center"
          style={{
            color: TEXT_PRIMARY,
            fontSize: 24,
            fontWeight: 700,
            lineHeight: 1.2,
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.5 }}
        >
          Operacao realizada!
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="mt-2 text-center"
          style={{ color: TEXT_SECONDARY, fontSize: 14 }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.65 }}
        >
          Sua {isBuy ? 'compra' : 'venda'} de {asset.name} foi executada
        </motion.p>

        {/* Summary card — rounded-none + 1px border */}
        <motion.div
          className="w-full rounded-none overflow-hidden mt-8"
          style={{
            background: BG_CARD,
            border: `1px solid ${BORDER}`,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
        >
          {summaryRows.map((row, i) => (
            <motion.div
              key={row.label}
              {...stagger(0.8, i)}
              className="flex items-center justify-between px-4 py-3.5"
              style={{
                borderBottom:
                  i < summaryRows.length - 1
                    ? `1px solid ${BORDER_LIGHT}`
                    : undefined,
              }}
            >
              <span style={{ color: TEXT_SECONDARY, fontSize: 14 }}>
                {row.label}
              </span>
              <span
                style={{
                  color: TEXT_PRIMARY,
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                {row.value}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Spacer */}
        <div className="flex-1 min-h-6" />
      </div>

      {/* Bottom CTA — black pill */}
      <div
        className="relative z-10 flex-shrink-0 px-5"
        style={{ paddingBottom: SAFE_BOTTOM }}
      >
        <motion.button
          onClick={handleEntendi}
          whileTap={{ scale: 0.97 }}
          className="w-full rounded-full border-none cursor-pointer"
          style={{
            height: 52,
            background: '#000000',
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: 600,
          }}
          {...fadeUp(1.0)}
        >
          Entendi
        </motion.button>
      </div>
    </div>
  )
}
