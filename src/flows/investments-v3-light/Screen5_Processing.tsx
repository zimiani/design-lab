/**
 * Processing — light theme orbital loading animation.
 */
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { FlowScreenProps } from '@/pages/simulator/flowRegistry'
import { useScreenData } from '@/lib/ScreenDataContext'
import type { AssetTicker } from './shared/data'
import { getAsset } from './shared/data'

interface ScreenData extends Record<string, unknown> {
  assetTicker?: AssetTicker
  mode?: 'buy' | 'sell'
}

const STEPS = [
  { text: 'Verificando dados...', progress: 25 },
  { text: 'Executando ordem...', progress: 55 },
  { text: 'Atualizando portfólio...', progress: 85 },
  { text: 'Concluído', progress: 100 },
]

export default function Screen5_Processing({ onNext }: FlowScreenProps) {
  const data = useScreenData<ScreenData>()
  const ticker = data.assetTicker ?? 'BTC'
  const asset = getAsset(ticker)

  const [step, setStep] = useState(0)

  useEffect(() => {
    if (step < STEPS.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 1500)
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(onNext, 800)
      return () => clearTimeout(timer)
    }
  }, [step, onNext])

  const current = STEPS[step]

  return (
    <div className="flex flex-col items-center justify-center px-8 overflow-hidden" style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      {/* Orbital animation */}
      <div className="relative w-32 h-32 mb-10">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-gray-100"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />

        <motion.div
          className="absolute inset-3 rounded-full"
          style={{ border: `2px solid ${asset.color}25` }}
          animate={{ rotate: -360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        />

        <motion.div
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full"
            style={{ background: asset.color, boxShadow: `0 0 12px ${asset.color}60` }}
          />
        </motion.div>

        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: `${asset.color}15` }}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <img src={asset.icon} alt="" className="w-7 h-7 rounded-full" />
          </motion.div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-[18px] font-bold text-gray-900 mb-1">{current.text}</div>
        </motion.div>
      </AnimatePresence>

      <div className="w-48 h-1 rounded-full bg-gray-100 mt-6 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: asset.color }}
          animate={{ width: `${current.progress}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>

      <div className="mt-3 text-[12px] text-gray-400">
        {step + 1} / {STEPS.length}
      </div>
    </div>
  )
}
