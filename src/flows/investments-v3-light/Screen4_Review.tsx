/**
 * Review screen — light theme slide-to-confirm.
 */
import { useState, useRef } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { RiArrowLeftLine, RiArrowRightLine } from '@remixicon/react'
import type { FlowScreenProps } from '@/pages/simulator/flowRegistry'
import { useScreenData } from '@/lib/ScreenDataContext'
import type { AssetTicker } from './shared/data'
import { getAsset } from './shared/data'

interface ScreenData extends Record<string, unknown> {
  assetTicker?: AssetTicker
  mode?: 'buy' | 'sell'
}

function InfoRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <span className="text-[13px] text-gray-400">{label}</span>
      <span className={`text-[14px] font-semibold ${accent ? 'text-emerald-600' : 'text-gray-900'}`}>
        {value}
      </span>
    </div>
  )
}

export default function Screen4_Review({ onNext, onBack, onElementTap }: FlowScreenProps) {
  const data = useScreenData<ScreenData>()
  const ticker = data.assetTicker ?? 'BTC'
  const asset = getAsset(ticker)
  const mode = data.mode ?? 'buy'
  const isBuy = mode === 'buy'
  const isFixed = asset.category === 'fixed-income'

  const [confirmed, setConfirmed] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)
  const dragX = useMotionValue(0)
  const thumbOpacity = useTransform(dragX, [0, 200], [1, 0])
  const checkOpacity = useTransform(dragX, [150, 200], [0, 1])

  const handleDragEnd = () => {
    const trackWidth = trackRef.current?.clientWidth ?? 300
    if (dragX.get() > trackWidth - 80) {
      setConfirmed(true)
      const label = isBuy ? 'Button: Confirmar compra' : 'Button: Confirmar venda'
      const handled = onElementTap?.(label)
      if (!handled) onNext()
    }
  }

  return (
    <div className="flex flex-col overflow-hidden" style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <div className="h-[var(--safe-area-top)]" />

      <div className="px-5 pt-3 pb-6 flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600"
        >
          <RiArrowLeftLine size={20} />
        </button>
        <span className="text-[15px] font-semibold text-gray-400">Confirmar</span>
      </div>

      <div className="px-5 flex-1">
        <motion.div
          className="flex items-center gap-4 mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: `${asset.color}15` }}
          >
            <img src={asset.icon} alt="" className="w-9 h-9 rounded-full" />
          </div>
          <div>
            <div className="text-[14px] text-gray-400">
              {isBuy ? (isFixed ? 'Investindo em' : 'Comprando') : 'Vendendo'}
            </div>
            <div className="text-[22px] font-bold text-gray-900">{asset.name}</div>
          </div>
        </motion.div>

        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="text-[48px] font-extrabold tracking-tight leading-none text-gray-900">
            R$ 100,00
          </div>
        </motion.div>

        <motion.div
          className="rounded-2xl px-5 py-1 bg-gray-50 border border-gray-100"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <InfoRow label="Ativo" value={`${asset.name} (${ticker})`} />
          {!isFixed && (
            <InfoRow label="Quantidade estimada" value={`0,00017 ${ticker}`} />
          )}
          <InfoRow label="Valor" value="R$ 100,00" />
          {isFixed && (
            <InfoRow label="Rendimento" value={asset.apyDisplay ?? '—'} />
          )}
          <InfoRow label="Taxa" value="Grátis" accent />
          {!isBuy && (
            <InfoRow label="Destino" value="Saldo Picnic" />
          )}
        </motion.div>

        <div className="mt-4 text-[12px] text-gray-400 text-center px-4">
          {isFixed
            ? 'Protegido por cobertura automática.'
            : 'O valor final pode variar conforme a cotação.'}
        </div>
      </div>

      <div className="px-5 pb-[max(var(--safe-area-bottom),24px)] pt-6">
        <div
          ref={trackRef}
          className="relative h-[60px] rounded-2xl overflow-hidden"
          style={{
            background: confirmed ? `${asset.color}15` : '#F3F4F6',
            border: `1px solid ${confirmed ? asset.color + '30' : '#E5E7EB'}`,
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              className="text-[14px] font-semibold text-gray-400"
              style={{ opacity: thumbOpacity }}
            >
              Deslize para confirmar
            </motion.span>
            <motion.span
              className="text-[14px] font-semibold absolute"
              style={{ opacity: checkOpacity, color: asset.color }}
            >
              Confirmado ✓
            </motion.span>
          </div>

          {!confirmed && (
            <motion.div
              className="absolute top-1 left-1 w-[52px] h-[52px] rounded-xl flex items-center justify-center cursor-grab active:cursor-grabbing"
              style={{ background: asset.color, x: dragX }}
              drag="x"
              dragConstraints={trackRef}
              dragElastic={0}
              onDragEnd={handleDragEnd}
              whileTap={{ scale: 0.95 }}
            >
              <RiArrowRightLine size={22} className="text-white" />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
