/**
 * Screen5_Processing — Geometric spinner processing screen (Neo-Brutalist).
 * Rotating square, no radial gradient, clean black/white. NO library components.
 */
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { FlowScreenProps } from '@/pages/simulator/flowRegistry'
import { useScreenData } from '@/lib/ScreenDataContext'
import { getAsset, getAssetColor } from './shared/data'
import type { AssetTicker } from './shared/data'
import { BG, TEXT_PRIMARY, TEXT_TERTIARY, BORDER, BORDER_LIGHT } from './shared/theme'
import { playSuccess } from './shared/sounds'

// ── Types ──

interface ScreenData {
  assetTicker?: string
}

// ── Processing steps ──

const STEPS = [
  'Verificando saldo...',
  'Processando ordem...',
  'Atualizando portfolio...',
  'Pronto!',
]

const STEP_INTERVAL = 1500

// ── Component ──

export default function Screen5_Processing({ onNext }: FlowScreenProps) {
  const { assetTicker = 'BTC' } = useScreenData<ScreenData>()
  const asset = getAsset(assetTicker as AssetTicker)
  const color = getAssetColor(assetTicker)
  const [step, setStep] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => {
        if (prev >= STEPS.length - 1) {
          clearInterval(timer)
          return prev
        }
        return prev + 1
      })
    }, STEP_INTERVAL)
    return () => clearInterval(timer)
  }, [])

  // Auto-advance after last step
  useEffect(() => {
    if (step === STEPS.length - 1) {
      playSuccess()
      const timeout = setTimeout(onNext, 800)
      return () => clearTimeout(timeout)
    }
  }, [step, onNext])

  const progress = ((step + 1) / STEPS.length) * 100
  const isComplete = step === STEPS.length - 1

  return (
    <div
      className="relative flex flex-col items-center justify-center h-full w-full"
      style={{ background: BG }}
    >
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >

      {/* Geometric spinner — rotating squares */}
      <div
        className="relative flex items-center justify-center"
        style={{ width: 160, height: 160, marginBottom: 48 }}
      >
        {/* Outer square — slow clockwise */}
        <motion.div
          className="absolute"
          style={{
            width: 140,
            height: 140,
            border: `1px solid ${BORDER_LIGHT}`,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        />

        {/* Middle square — counter-clockwise */}
        <motion.div
          className="absolute"
          style={{
            width: 100,
            height: 100,
            border: `1px solid ${BORDER}`,
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />

        {/* Inner square — faster clockwise */}
        <motion.div
          className="absolute"
          style={{
            width: 60,
            height: 60,
            border: `2px solid ${TEXT_PRIMARY}`,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />

        {/* Orbiting dot — black square on corner */}
        <motion.div
          className="absolute"
          style={{
            width: 140,
            height: 140,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        >
          <div
            style={{
              position: 'absolute',
              top: -4,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 8,
              height: 8,
              background: TEXT_PRIMARY,
            }}
          />
        </motion.div>

        {/* Center icon — square frame */}
        <motion.div
          className="relative overflow-hidden flex items-center justify-center"
          style={{
            width: 40,
            height: 40,
            background: BG,
            border: `2px solid ${BORDER}`,
          }}
        >
          <img
            src={asset.icon}
            alt={asset.ticker}
            style={{ width: 28, height: 28, objectFit: 'cover' }}
          />
        </motion.div>
      </div>

      {/* Step text */}
      <div className="relative h-8 flex items-center justify-center w-full px-8">
        <AnimatePresence mode="wait">
          <motion.span
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            style={{
              color: TEXT_PRIMARY,
              fontSize: 16,
              fontWeight: 600,
              textAlign: 'center',
            }}
          >
            {STEPS[step]}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Progress bar — hard edge */}
      <div className="w-56 mt-6 px-8">
        <div
          className="w-full overflow-hidden"
          style={{
            height: 4,
            background: BORDER_LIGHT,
          }}
        >
          <motion.div
            className="h-full"
            style={{ background: TEXT_PRIMARY }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </div>
      </div>

      {/* Step counter */}
      <div className="mt-3">
        <AnimatePresence mode="wait">
          <motion.span
            key={step}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{ color: TEXT_TERTIARY, fontSize: 12 }}
          >
            {step + 1} / {STEPS.length}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Completion — expanding square outline */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            className="absolute pointer-events-none"
            style={{
              width: 120,
              height: 120,
              top: '50%',
              left: '50%',
              x: '-50%',
              y: '-60%',
              border: `2px solid ${color}`,
            }}
            initial={{ scale: 0.5, opacity: 0.8 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>
      </motion.div>
    </div>
  )
}
