/**
 * Receive Crypto — dark-themed screen with network selector, QR placeholder, address copy.
 * Custom dropdown, glass cards, warning bar.
 * Pure custom Tailwind + inline styles + Framer Motion. NO library components.
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RiArrowLeftLine, RiArrowDownSLine, RiFileCopyLine,
  RiAlertLine, RiCheckLine,
} from '@remixicon/react'
import type { FlowScreenProps } from '@/pages/simulator/flowRegistry'
import {
  BG, BG_CARD, BG_GLASS, BORDER, TEXT_PRIMARY, TEXT_SECONDARY, TEXT_TERTIARY,
  TEXT_MUTED, GREEN, SAFE_TOP, SAFE_BOTTOM, fadeUp, glass,
} from '../shared/theme'
import { dropdownContainer, dropdownItem, stagger } from '../shared/animations'
import { playTap } from '../shared/sounds'
import { NetworkLogo } from '../shared/TokenLogo'
import { ASSET_COLORS } from '../shared/data'

// ── Networks ──

interface Network {
  id: string
  name: string
  icon: string
  address: string
}

const NETWORKS: Network[] = [
  { id: 'eth', name: 'Ethereum', icon: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png', address: '0x1a2b3c4d5e6f7890abcdef1234567890abcd9f0e' },
  { id: 'sol', name: 'Solana', icon: 'https://assets.coingecko.com/coins/images/4128/small/solana.png', address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU' },
  { id: 'btc', name: 'Bitcoin', icon: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png', address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' },
]

const NETWORK_COLORS: Record<string, string> = {
  eth: ASSET_COLORS.ETH,
  sol: ASSET_COLORS.SOL,
  btc: ASSET_COLORS.BTC,
}

function truncateAddress(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

// ── Main Screen ──

export default function Screen1_Receive({ onBack }: FlowScreenProps) {
  const [selectedNetwork, setSelectedNetwork] = useState<Network>(NETWORKS[0])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    playTap()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col min-h-screen relative" style={{ background: BG }}>
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
          Receber
        </span>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-5">
        {/* Heading */}
        <motion.div {...fadeUp(0)} className="mb-1">
          <span style={{ color: TEXT_PRIMARY, fontSize: 20, fontWeight: 600 }}>
            Receba ativos
          </span>
        </motion.div>
        <motion.div {...fadeUp(0.03)} className="mb-5">
          <span style={{ color: TEXT_SECONDARY, fontSize: 14, lineHeight: 1.5 }}>
            Compartilhe seu endereço ou QR Code para receber ativos de outra carteira.
          </span>
        </motion.div>

        {/* Network Selector */}
        <motion.div {...fadeUp(0.06)} className="mb-5 relative z-20">
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
            <NetworkLogo networkId={selectedNetwork.id} fallbackUrl={selectedNetwork.icon} size={20} color={NETWORK_COLORS[selectedNetwork.id]} className="rounded-full" />
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
                  background: '#FFFFFF', boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
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
                      background: selectedNetwork.id === network.id ? 'rgba(0,0,0,0.05)' : 'transparent',
                      borderBottom: `1px solid rgba(0,0,0,0.03)`,
                    }}
                  >
                    <NetworkLogo networkId={network.id} fallbackUrl={network.icon} size={20} color={NETWORK_COLORS[network.id]} />
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

        {/* QR Code Placeholder */}
        <motion.div
          {...stagger(0, 2)}
          animate={{
            opacity: 1,
            y: 0,
            boxShadow: [
              '0 0 0 0 rgba(255,255,255,0)',
              '0 0 0 4px rgba(0,0,0,0.05)',
              '0 0 0 0 rgba(255,255,255,0)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex items-center justify-center mx-auto mb-5 rounded-2xl"
          style={{
            width: 200,
            height: 200,
            background: BG_CARD,
            border: `2px dashed rgba(0,0,0,0.08)`,
          }}
        >
          <span style={{ color: TEXT_MUTED, fontSize: 14, fontWeight: 500 }}>
            QR Code
          </span>
        </motion.div>

        {/* Address Pill */}
        <motion.div
          {...stagger(0, 2)}
          className="flex items-center gap-3 mx-auto mb-5 rounded-full px-4 py-2.5"
          style={{
            background: BG_CARD,
            border: `1px solid ${BORDER}`,
            maxWidth: 280,
          }}
        >
          <span className="flex-1 truncate text-center" style={{ color: TEXT_SECONDARY, fontSize: 13, fontFamily: 'monospace' }}>
            {truncateAddress(selectedNetwork.address)}
          </span>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleCopy}
            className="flex items-center justify-center rounded-full border-none cursor-pointer flex-shrink-0"
            style={{ width: 28, height: 28, background: 'rgba(0,0,0,0.06)' }}
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.span
                  key="check"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center justify-center"
                >
                  <RiCheckLine size={14} color={GREEN} />
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center justify-center"
                >
                  <RiFileCopyLine size={14} color={TEXT_SECONDARY} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>

        {/* Details Card */}
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
            { label: 'Ativo', value: 'Todos' },
            { label: 'Taxa', value: 'Grátis', valueColor: GREEN },
          ].map((row, idx) => (
            <div
              key={row.label}
              className="flex items-center justify-between px-4 py-3"
              style={{
                borderBottom: idx < 2 ? `1px solid rgba(0,0,0,0.03)` : undefined,
              }}
            >
              <span style={{ color: TEXT_TERTIARY, fontSize: 13 }}>
                {row.label}
              </span>
              <span style={{
                color: row.valueColor ?? TEXT_PRIMARY,
                fontSize: 13,
                fontWeight: 500,
              }}>
                {row.value}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Warning Bar */}
        <motion.div
          {...stagger(0, 4)}
          className="flex items-start gap-3 rounded-2xl px-4 py-3.5 mb-5"
          style={{
            background: 'rgba(251,191,36,0.06)',
            border: '1px solid rgba(251,191,36,0.15)',
          }}
        >
          <RiAlertLine size={18} color="#FBBF24" className="flex-shrink-0 mt-0.5" />
          <span style={{ color: 'rgba(251,191,36,0.85)', fontSize: 13, lineHeight: 1.5 }}>
            Envie apenas ativos compatíveis com a rede selecionada. Envios em redes incompatíveis podem resultar em perda permanente.
          </span>
        </motion.div>

        <div style={{ paddingBottom: SAFE_BOTTOM }} />
      </div>
    </div>
  )
}
