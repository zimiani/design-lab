/**
 * Success — celebratory screen with confetti-like particles,
 * large checkmark animation, and order summary.
 */
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { RiCheckLine } from '@remixicon/react'
import type { FlowScreenProps } from '@/pages/simulator/flowRegistry'
import { useScreenData } from '@/lib/ScreenDataContext'
import type { AssetTicker } from './shared/data'
import { getAsset } from './shared/data'

interface ScreenData extends Record<string, unknown> {
  assetTicker?: AssetTicker
  mode?: 'buy' | 'sell'
}

// Generate random confetti particles
function useParticles(count: number, color: string) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100, // % from left
    delay: Math.random() * 0.5,
    duration: 1.5 + Math.random() * 1,
    size: 3 + Math.random() * 4,
    color: i % 3 === 0 ? color : i % 3 === 1 ? '#10B981' : '#ffffff',
    opacity: 0.3 + Math.random() * 0.5,
  }))
}

function InfoRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-[13px] text-white/40">{label}</span>
      <span className={`text-[14px] font-semibold ${accent ? 'text-emerald-400' : 'text-white'}`}>
        {value}
      </span>
    </div>
  )
}

export default function Screen6_Success({ onBack, onElementTap }: FlowScreenProps) {
  const data = useScreenData<ScreenData>()
  const ticker = data.assetTicker ?? 'BTC'
  const asset = getAsset(ticker)
  const mode = data.mode ?? 'buy'
  const isBuy = mode === 'buy'
  const isFixed = asset.category === 'fixed-income'

  const particles = useParticles(12, asset.color)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShowContent(true), 600)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="relative flex flex-col text-white overflow-hidden" style={{ background: '#0a0a0f', minHeight: '100vh' }}>
      {/* Particles */}
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            opacity: p.opacity,
          }}
          initial={{ top: '40%', scale: 0 }}
          animate={{ top: '-5%', scale: [0, 1, 0.5], opacity: [0, p.opacity, 0] }}
          transition={{ delay: p.delay, duration: p.duration, ease: 'easeOut' }}
        />
      ))}

      {/* Background glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[200px] h-[200px] rounded-full opacity-15 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${asset.color}50 0%, transparent 70%)` }}
      />

      <div className="h-[var(--safe-area-top)]" />

      {/* Check animation */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <motion.div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ background: `${asset.color}20`, border: `2px solid ${asset.color}40` }}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: 'spring' }}
          >
            <RiCheckLine size={36} style={{ color: asset.color }} />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.div
          className="text-center mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-[24px] font-extrabold">
            {isBuy
              ? (isFixed ? 'Investimento confirmado' : 'Compra confirmada')
              : 'Venda confirmada'}
          </div>
        </motion.div>

        <motion.div
          className="text-[14px] text-white/40 text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {isBuy
            ? `Seu investimento em ${asset.name} está no seu portfólio.`
            : `O valor da venda de ${asset.name} foi creditado.`}
        </motion.div>

        {/* Summary card */}
        {showContent && (
          <motion.div
            className="w-full rounded-2xl px-5 py-2"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <InfoRow label="Ativo" value={asset.name} />
            {!isFixed && <InfoRow label="Quantidade" value={`0,00017 ${ticker}`} />}
            <InfoRow label="Valor" value="R$ 100,00" />
            <InfoRow label="Taxa" value="Grátis" accent />
          </motion.div>
        )}
      </div>

      {/* CTA */}
      <div className="px-5 pb-[max(var(--safe-area-bottom),24px)]">
        <motion.button
          onClick={() => {
            const handled = onElementTap?.('Button: Concluir')
            if (!handled) onBack()
          }}
          className="w-full py-4 rounded-2xl font-bold text-[16px] text-white"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          whileTap={{ scale: 0.97 }}
        >
          Concluir
        </motion.button>
      </div>
    </div>
  )
}
