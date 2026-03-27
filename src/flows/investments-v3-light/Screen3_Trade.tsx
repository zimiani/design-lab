/**
 * Trade screen — light theme keypad amount entry.
 */
import { useState } from 'react'
import { motion } from 'framer-motion'
import { RiArrowLeftLine, RiDeleteBack2Line } from '@remixicon/react'
import type { FlowScreenProps } from '@/pages/simulator/flowRegistry'
import { useScreenData } from '@/lib/ScreenDataContext'
import type { AssetTicker } from './shared/data'
import { getAsset } from './shared/data'

interface ScreenData extends Record<string, unknown> {
  assetTicker?: AssetTicker
  mode?: 'buy' | 'sell'
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'del']

export default function Screen3_Trade({ onNext, onBack, onElementTap }: FlowScreenProps) {
  const data = useScreenData<ScreenData>()
  const ticker = data.assetTicker ?? 'BTC'
  const asset = getAsset(ticker)
  const mode = data.mode ?? 'buy'
  const isFixed = asset.category === 'fixed-income'
  const isBuy = mode === 'buy'

  const [rawValue, setRawValue] = useState('')

  const handleKey = (key: string) => {
    if (key === 'del') {
      setRawValue(prev => prev.slice(0, -1))
      return
    }
    if (key === '.' && rawValue.includes('.')) return
    if (rawValue.length >= 10) return
    setRawValue(prev => prev + key)
  }

  const numericValue = parseFloat(rawValue || '0')
  const isValid = numericValue >= 10
  const estimatedQty = asset.price ? numericValue / asset.price : 0

  const displayValue = rawValue ? `R$ ${rawValue}` : 'R$ 0'

  return (
    <div className="flex flex-col" style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <div className="h-[var(--safe-area-top)]" />

      <div className="px-5 pt-3 pb-2 flex items-center justify-between">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600"
        >
          <RiArrowLeftLine size={20} />
        </button>
        <span className="text-[15px] font-semibold text-gray-400">
          {isBuy ? (isFixed ? 'Investir' : 'Comprar') : 'Vender'} {asset.name}
        </span>
        <div className="w-10" />
      </div>

      <div className="px-5 pt-4 flex justify-center">
        <div
          className="flex items-center gap-2 rounded-full px-4 py-2"
          style={{ background: `${asset.color}10`, border: `1px solid ${asset.color}20` }}
        >
          <img src={asset.icon} alt="" className="w-5 h-5 rounded-full" />
          <span className="text-[13px] font-semibold" style={{ color: asset.color }}>
            {asset.name}
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-5 py-6 min-h-[160px]">
        <motion.div
          className="text-[48px] font-extrabold tracking-tight leading-none text-center"
          key={rawValue}
          initial={{ scale: 1.02, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.15 }}
          style={{ color: isValid ? '#111827' : 'rgba(0,0,0,0.2)' }}
        >
          {displayValue}
        </motion.div>

        {numericValue > 0 && !isFixed && asset.price && (
          <motion.div
            className="mt-2 text-[14px] text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            ≈ {estimatedQty.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 8 })} {ticker}
          </motion.div>
        )}

        {numericValue > 0 && numericValue < 10 && (
          <motion.div
            className="mt-2 text-[13px] text-red-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Mínimo R$ 10,00
          </motion.div>
        )}
      </div>

      {isValid && (
        <motion.div
          className="mx-5 mb-3 rounded-xl px-4 py-3 flex items-center justify-between bg-gray-50 border border-gray-100"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-[12px] text-gray-400">Taxa</span>
          <span className="text-[13px] font-semibold text-emerald-600">Grátis</span>
        </motion.div>
      )}

      <div className="px-8 pb-4">
        <div className="grid grid-cols-3 gap-y-1 gap-x-4">
          {KEYS.map(key => (
            <button
              key={key}
              onClick={() => handleKey(key)}
              className="h-14 flex items-center justify-center rounded-xl text-[22px] font-semibold text-gray-900 active:bg-gray-100 transition-colors"
            >
              {key === 'del' ? <RiDeleteBack2Line size={24} className="text-gray-400" /> : key}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pb-[max(var(--safe-area-bottom),20px)]">
        <motion.button
          onClick={() => {
            const handled = onElementTap?.('Button: Continuar')
            if (!handled) onNext()
          }}
          disabled={!isValid}
          className="w-full py-4 rounded-2xl font-bold text-[16px] transition-all"
          style={{
            background: isValid ? asset.color : '#F3F4F6',
            color: isValid ? '#fff' : 'rgba(0,0,0,0.2)',
          }}
          whileTap={isValid ? { scale: 0.97 } : undefined}
        >
          Continuar
        </motion.button>
      </div>
    </div>
  )
}
