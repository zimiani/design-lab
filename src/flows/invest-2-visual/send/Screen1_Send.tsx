/**
 * Send Crypto — dark-themed screen with address input, amount display, network selector, summary.
 * Custom dropdown, glass cards, warning, CTA button.
 * Pure custom Tailwind + inline styles + Framer Motion. NO library components.
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RiArrowLeftLine, RiArrowDownSLine, RiCheckLine, RiAlertLine,
} from '@remixicon/react'
import type { FlowScreenProps } from '@/pages/simulator/flowRegistry'
import {
  BG, BG_CARD, BORDER, TEXT_PRIMARY, TEXT_SECONDARY, TEXT_TERTIARY,
  TEXT_MUTED, GREEN, SAFE_TOP, SAFE_BOTTOM, fadeUp, glass,
} from '../shared/theme'
import { stagger, dropdownContainer, dropdownItem } from '../shared/animations'
import { playTap } from '../shared/sounds'

// ── Networks ──

interface Network {
  id: string
  name: string
  icon: string
}

const NETWORKS: Network[] = [
  { id: 'eth', name: 'Ethereum', icon: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
  { id: 'sol', name: 'Solana', icon: 'https://assets.coingecko.com/coins/images/4128/small/solana.png' },
  { id: 'btc', name: 'Bitcoin', icon: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png' },
]

// USDC blue for the active CTA
const USDC_BLUE = '#2775CA'

// ── Main Screen ──

export default function Screen1_Send({ onBack, onElementTap, onNext }: FlowScreenProps) {
  const [address, setAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [selectedNetwork, setSelectedNetwork] = useState<Network>(NETWORKS[0])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [addressFocused, setAddressFocused] = useState(false)

  const isValid = address.length > 5 && amount.length > 0 && parseFloat(amount) > 0

  const handleSend = () => {
    playTap()
    const handled = onElementTap?.('Button: Enviar')
    if (!handled) onNext()
  }

  // Parse display amount
  const displayAmount = amount || '0'

  return (
    <div className="flex flex-col min-h-screen" style={{ background: BG }}>
      <div style={{ height: SAFE_TOP }} />

      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-3 pb-4">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="flex items-center justify-center rounded-full border-none cursor-pointer"
          style={{ width: 36, height: 36, background: BG_CARD }}
        >
          <RiArrowLeftLine size={20} color={TEXT_PRIMARY} />
        </motion.button>
        <span style={{ color: TEXT_PRIMARY, fontSize: 17, fontWeight: 600 }}>
          Enviar
        </span>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-5">
        {/* Address Input */}
        <motion.div {...stagger(0, 0)} className="mb-5">
          <div
            className="rounded-2xl px-4 py-3.5"
            style={{
              background: BG_CARD,
              border: `1px solid ${BORDER}`,
              borderColor: addressFocused ? 'rgba(255,255,255,0.18)' : undefined,
              boxShadow: addressFocused ? '0 0 0 2px rgba(255,255,255,0.1)' : 'none',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
          >
            <span
              className="block mb-1.5"
              style={{ color: TEXT_TERTIARY, fontSize: 12, fontWeight: 500 }}
            >
              Endereço de destino
            </span>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              onFocus={() => setAddressFocused(true)}
              onBlur={() => setAddressFocused(false)}
              placeholder="0x..."
              className="w-full bg-transparent border-none outline-none"
              style={{
                color: TEXT_PRIMARY,
                fontSize: 15,
                fontFamily: 'monospace',
                padding: 0,
                caretColor: GREEN,
              }}
            />
            {/* Placeholder color via inline style on input */}
            <style>{`
              input::placeholder { color: rgba(255,255,255,0.20) !important; }
            `}</style>
          </div>
        </motion.div>

        {/* Amount Display */}
        <motion.div {...stagger(0, 1)} className="flex flex-col items-center mb-6">
          <div className="flex items-baseline gap-1.5 mb-2">
            <span style={{ color: TEXT_SECONDARY, fontSize: 20, fontWeight: 500 }}>
              US$
            </span>
            <input
              type="text"
              inputMode="decimal"
              value={displayAmount}
              onChange={e => {
                const val = e.target.value.replace(/[^0-9.,]/g, '')
                setAmount(val)
              }}
              className="bg-transparent border-none outline-none text-center"
              style={{
                color: TEXT_PRIMARY,
                fontSize: 36,
                fontWeight: 700,
                letterSpacing: -1,
                width: `${Math.max(2, displayAmount.length) * 22}px`,
                maxWidth: 240,
                caretColor: GREEN,
                padding: 0,
              }}
            />
          </div>
          <span style={{ color: TEXT_MUTED, fontSize: 13 }}>
            Saldo: US$ 1.144,00
          </span>
        </motion.div>

        {/* Network Selector */}
        <motion.div {...stagger(0, 2)} className="mb-5 relative z-20">
          <span
            className="block mb-2"
            style={{ color: TEXT_TERTIARY, fontSize: 12, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' as const }}
          >
            Rede
          </span>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 w-full rounded-xl px-4 py-3 border-none cursor-pointer"
            style={{
              background: BG_CARD,
              border: `1px solid ${BORDER}`,
            }}
          >
            <img
              src={selectedNetwork.icon}
              alt={selectedNetwork.name}
              className="rounded-full"
              style={{ width: 20, height: 20 }}
            />
            <span className="flex-1 text-left" style={{ color: TEXT_PRIMARY, fontSize: 14, fontWeight: 500 }}>
              {selectedNetwork.name}
            </span>
            <motion.div animate={{ rotate: dropdownOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <RiArrowDownSLine size={18} color={TEXT_TERTIARY} />
            </motion.div>
          </motion.button>

          {/* Dropdown */}
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                variants={dropdownContainer}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute left-0 right-0 mt-1.5 rounded-xl overflow-hidden z-30"
                style={{
                  ...glass,
                  background: 'rgba(20,20,30,0.95)',
                  border: `1px solid ${BORDER}`,
                  transformOrigin: 'top',
                }}
              >
                {NETWORKS.map(network => (
                  <motion.button
                    key={network.id}
                    variants={dropdownItem}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setSelectedNetwork(network)
                      setDropdownOpen(false)
                    }}
                    className="flex items-center gap-2.5 w-full px-4 py-3 border-none cursor-pointer text-left"
                    style={{
                      background: selectedNetwork.id === network.id ? 'rgba(255,255,255,0.06)' : 'transparent',
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                    }}
                  >
                    <img
                      src={network.icon}
                      alt={network.name}
                      className="rounded-full"
                      style={{ width: 20, height: 20 }}
                    />
                    <span className="flex-1" style={{ color: TEXT_PRIMARY, fontSize: 14, fontWeight: 500 }}>
                      {network.name}
                    </span>
                    {selectedNetwork.id === network.id && (
                      <RiCheckLine size={16} color={GREEN} />
                    )}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Summary Card */}
        <motion.div
          {...stagger(0, 3)}
          className="rounded-2xl mb-5 overflow-hidden"
          style={{
            background: BG_CARD,
            border: `1px solid ${BORDER}`,
          }}
        >
          {[
            { label: 'Rede', value: selectedNetwork.name },
            { label: 'Taxa estimada', value: 'US$ 2,50' },
            { label: 'Tempo estimado', value: '~5 min' },
          ].map((row, idx) => (
            <div
              key={row.label}
              className="flex items-center justify-between px-4 py-3"
              style={{
                borderBottom: idx < 2 ? '1px solid rgba(255,255,255,0.04)' : undefined,
              }}
            >
              <span style={{ color: TEXT_TERTIARY, fontSize: 13 }}>
                {row.label}
              </span>
              <span style={{ color: TEXT_PRIMARY, fontSize: 13, fontWeight: 500 }}>
                {row.value}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Warning */}
        <motion.div
          {...stagger(0, 4)}
          className="flex items-start gap-3 rounded-2xl px-4 py-3.5 mb-6"
          style={{
            background: 'rgba(251,191,36,0.06)',
            border: '1px solid rgba(251,191,36,0.15)',
          }}
        >
          <RiAlertLine size={18} color="#FBBF24" className="flex-shrink-0 mt-0.5" />
          <span style={{ color: 'rgba(251,191,36,0.85)', fontSize: 13, lineHeight: 1.5 }}>
            Verifique o endereço antes de enviar. Transações não podem ser revertidas.
          </span>
        </motion.div>
      </div>

      {/* Bottom CTA */}
      <div className="px-5" style={{ paddingBottom: SAFE_BOTTOM }}>
        <motion.button
          {...fadeUp(0.2)}
          whileTap={isValid ? { scale: 0.97 } : undefined}
          animate={{ scale: isValid ? [1, 1.02, 1] : 1 }}
          transition={{ duration: 0.3 }}
          onClick={isValid ? handleSend : undefined}
          className="w-full py-4 rounded-2xl border-none cursor-pointer transition-colors"
          style={{
            background: isValid
              ? `linear-gradient(135deg, ${USDC_BLUE} 0%, ${USDC_BLUE}cc 100%)`
              : BG_CARD,
            color: isValid ? '#ffffff' : TEXT_MUTED,
            fontSize: 16,
            fontWeight: 700,
            border: isValid ? 'none' : `1px solid ${BORDER}`,
            opacity: isValid ? 1 : 0.6,
          }}
        >
          Enviar
        </motion.button>
      </div>
    </div>
  )
}
