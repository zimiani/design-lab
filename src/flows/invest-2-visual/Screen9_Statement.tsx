/**
 * Statement (Extrato) — dark-themed transaction history with filter dropdowns.
 * Three custom filter pills, colored transaction rows, PDF export CTA.
 * Pure custom Tailwind + inline styles + Framer Motion. NO library components.
 */
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RiArrowLeftLine, RiArrowDownSLine, RiFileDownloadLine,
} from '@remixicon/react'
import type { FlowScreenProps } from '@/pages/simulator/flowRegistry'
import {
  getMockTransactions, ASSETS, getAsset,
} from './shared/data'
import type { AssetTicker, Transaction } from './shared/data'
import {
  BG, BG_CARD, BORDER, TEXT_PRIMARY, TEXT_SECONDARY, TEXT_TERTIARY,
  GREEN, RED, SAFE_TOP, SAFE_BOTTOM, fadeUp, glass,
} from './shared/theme'
import { listContainer, listItemY, dropdownContainer, dropdownItem } from './shared/animations'
import { playTap } from './shared/sounds'

// ── Color mapping for transaction types ──

const TYPE_COLORS: Record<string, string> = {
  buy: GREEN,
  sell: RED,
  yield: '#60A5FA', // blue for yield
}

const TYPE_LABELS: Record<string, string> = {
  buy: 'Compra',
  sell: 'Venda',
  yield: 'Rendimento',
}

// ── Filter options ──

const PERIOD_OPTIONS = ['Últimos 7 dias', 'Últimos 30 dias', 'Últimos 90 dias', 'Tudo']
const TYPE_OPTIONS = ['Todos', 'Compras', 'Vendas', 'Rendimentos']

const TYPE_FILTER_MAP: Record<string, string | null> = {
  'Todos': null,
  'Compras': 'buy',
  'Vendas': 'sell',
  'Rendimentos': 'yield',
}

// Assets that have transactions
const TX_TICKERS: AssetTicker[] = ['BTC', 'ETH', 'SOL', 'RENDA-USD', 'PAXG']
const ASSET_OPTIONS = ['Todos', ...TX_TICKERS.map(t => getAsset(t).name)]

const ASSET_NAME_TO_TICKER: Record<string, AssetTicker> = {}
TX_TICKERS.forEach(t => { ASSET_NAME_TO_TICKER[getAsset(t).name] = t })

// ── Dropdown Pill Component ──

function FilterPill({ label, value, options, open, onToggle, onSelect }: {
  label: string
  value: string
  options: string[]
  open: boolean
  onToggle: () => void
  onSelect: (option: string) => void
}) {
  return (
    <div className="relative flex-1 min-w-0">
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={onToggle}
        className="flex items-center gap-1 w-full rounded-lg px-2.5 py-2 border-none cursor-pointer"
        style={{
          background: BG_CARD,
          border: `1px solid ${open ? 'rgba(255,255,255,0.12)' : BORDER}`,
        }}
      >
        <span className="truncate flex-1 text-left" style={{ color: TEXT_PRIMARY, fontSize: 12, fontWeight: 500 }}>
          {value}
        </span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.15 }} className="flex-shrink-0">
          <RiArrowDownSLine size={14} color={TEXT_TERTIARY} />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            variants={dropdownContainer}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute left-0 right-0 mt-1 rounded-lg overflow-hidden z-30"
            style={{
              ...glass,
              background: 'rgba(20,20,30,0.95)',
              border: `1px solid ${BORDER}`,
              transformOrigin: 'top',
              minWidth: 140,
            }}
          >
            {options.map(option => (
              <motion.button
                key={option}
                variants={dropdownItem}
                whileTap={{ scale: 0.97 }}
                onClick={() => onSelect(option)}
                className="flex items-center w-full px-3 py-2.5 border-none cursor-pointer text-left"
                style={{
                  background: value === option ? 'rgba(255,255,255,0.06)' : 'transparent',
                  borderBottom: '1px solid rgba(255,255,255,0.03)',
                }}
              >
                <span style={{
                  color: value === option ? GREEN : TEXT_PRIMARY,
                  fontSize: 12,
                  fontWeight: value === option ? 600 : 400,
                }}>
                  {option}
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Aggregate all transactions with asset context ──

interface AggregatedTransaction extends Transaction {
  assetTicker: AssetTicker
  assetName: string
  assetIcon: string
}

function getAllTransactions(): AggregatedTransaction[] {
  const all: AggregatedTransaction[] = []
  for (const ticker of TX_TICKERS) {
    const asset = getAsset(ticker)
    const txs = getMockTransactions(ticker)
    for (const tx of txs) {
      all.push({
        ...tx,
        assetTicker: ticker,
        assetName: asset.name,
        assetIcon: asset.icon,
      })
    }
  }
  return all
}

// ── Main Screen ──

export default function Screen9_Statement({ onBack, onElementTap, onNext }: FlowScreenProps) {
  const [period, setPeriod] = useState('Últimos 30 dias')
  const [typeFilter, setTypeFilter] = useState('Todos')
  const [assetFilter, setAssetFilter] = useState('Todos')
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const allTransactions = useMemo(() => getAllTransactions(), [])

  // Apply filters
  const filtered = useMemo(() => {
    let txs = allTransactions

    // Type filter
    const typeVal = TYPE_FILTER_MAP[typeFilter]
    if (typeVal) {
      txs = txs.filter(t => t.type === typeVal)
    }

    // Asset filter
    if (assetFilter !== 'Todos') {
      const ticker = ASSET_NAME_TO_TICKER[assetFilter]
      if (ticker) {
        txs = txs.filter(t => t.assetTicker === ticker)
      }
    }

    return txs
  }, [allTransactions, typeFilter, assetFilter])

  const toggleDropdown = (id: string) => {
    setOpenDropdown(prev => prev === id ? null : id)
  }

  const handleGeneratePDF = () => {
    playTap()
    const handled = onElementTap?.('Button: Gerar PDF')
    if (!handled) onNext()
  }

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
          Extrato
        </span>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Filter Row */}
        <motion.div
          {...fadeUp(0)}
          className="flex gap-2 px-5 mb-4 relative z-20"
          onClick={e => {
            // Close dropdowns when clicking outside pills
            if ((e.target as HTMLElement).closest('[data-pill]') === null) {
              setOpenDropdown(null)
            }
          }}
        >
          <div data-pill>
            <FilterPill
              label="Período"
              value={period}
              options={PERIOD_OPTIONS}
              open={openDropdown === 'period'}
              onToggle={() => toggleDropdown('period')}
              onSelect={v => { setPeriod(v); setOpenDropdown(null) }}
            />
          </div>
          <div data-pill>
            <FilterPill
              label="Tipo"
              value={typeFilter}
              options={TYPE_OPTIONS}
              open={openDropdown === 'type'}
              onToggle={() => toggleDropdown('type')}
              onSelect={v => { setTypeFilter(v); setOpenDropdown(null) }}
            />
          </div>
          <div data-pill>
            <FilterPill
              label="Ativo"
              value={assetFilter}
              options={ASSET_OPTIONS}
              open={openDropdown === 'asset'}
              onToggle={() => toggleDropdown('asset')}
              onSelect={v => { setAssetFilter(v); setOpenDropdown(null) }}
            />
          </div>
        </motion.div>

        {/* Section header */}
        <motion.div {...fadeUp(0.04)} className="flex items-center gap-2.5 px-5 mb-3">
          <span style={{
            color: TEXT_TERTIARY,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: 0.5,
            textTransform: 'uppercase' as const,
          }}>
            Transações
          </span>
          <span
            className="inline-flex items-center justify-center rounded-full"
            style={{
              minWidth: 20,
              height: 20,
              padding: '0 6px',
              fontSize: 11,
              fontWeight: 700,
              color: TEXT_PRIMARY,
              background: 'rgba(255,255,255,0.10)',
            }}
          >
            {filtered.length}
          </span>
        </motion.div>

        {/* Transaction rows */}
        {filtered.length === 0 ? (
          <motion.div {...fadeUp(0.08)} className="flex flex-col items-center py-12 px-8">
            <span style={{ color: TEXT_SECONDARY, fontSize: 14 }}>
              Nenhuma transação encontrada
            </span>
            <span className="mt-1" style={{ color: TEXT_TERTIARY, fontSize: 12 }}>
              Ajuste os filtros para ver mais resultados.
            </span>
          </motion.div>
        ) : (
          <motion.div variants={listContainer} initial="hidden" animate="visible" className="flex flex-col">
            {filtered.map((tx, i) => {
              const color = TYPE_COLORS[tx.type] ?? TEXT_SECONDARY
              const typeLabel = TYPE_LABELS[tx.type] ?? tx.type

              return (
                <motion.div
                  key={`${tx.assetTicker}-${tx.id}`}
                  variants={listItemY}
                  className="flex items-center gap-3 px-5 py-3.5"
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                  }}
                >
                  {/* Color dot */}
                  <div
                    className="flex-shrink-0 rounded-full"
                    style={{
                      width: 8,
                      height: 8,
                      background: color,
                      boxShadow: `0 0 6px ${color}50`,
                    }}
                  />

                  {/* Icon */}
                  <div
                    className="flex-shrink-0 rounded-full overflow-hidden"
                    style={{ width: 24, height: 24 }}
                  >
                    <img
                      src={tx.assetIcon}
                      alt={tx.assetTicker}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Title + Date */}
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="truncate" style={{ color: TEXT_PRIMARY, fontSize: 14, fontWeight: 500 }}>
                      {typeLabel} — {tx.assetName}
                    </span>
                    <span style={{ color: TEXT_TERTIARY, fontSize: 12 }}>
                      {tx.date}
                    </span>
                  </div>

                  {/* Amount */}
                  <span className="flex-shrink-0" style={{
                    color,
                    fontSize: 13,
                    fontWeight: 600,
                  }}>
                    {tx.amount}
                  </span>
                </motion.div>
              )
            })}
          </motion.div>
        )}

        {/* Generate PDF button */}
        <motion.div {...fadeUp(0.3)} className="px-5 mt-4 mb-6">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleGeneratePDF}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl border-none cursor-pointer"
            style={{
              background: BG_CARD,
              border: `1px solid ${BORDER}`,
            }}
          >
            <RiFileDownloadLine size={18} color={TEXT_SECONDARY} />
            <span style={{ color: TEXT_SECONDARY, fontSize: 14, fontWeight: 600 }}>
              Gerar PDF
            </span>
          </motion.button>
        </motion.div>

        <div style={{ paddingBottom: SAFE_BOTTOM }} />
      </div>
    </div>
  )
}
