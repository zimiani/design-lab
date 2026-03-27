/**
 * Discover screen — dark theme, bold visual design.
 * Horizontal featured cards, category pills, sparkline rows.
 */
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { RiSearchLine, RiCloseLine } from '@remixicon/react'
import type { FlowScreenProps } from '@/pages/simulator/flowRegistry'
import { ASSETS, type AssetCategory } from './shared/data'
import { FeaturedCard, AssetListRow, CategoryPill, SectionTitle } from './Screen1_Discover.parts'

const CATEGORIES: { key: AssetCategory | 'all'; label: string; icon: string }[] = [
  { key: 'all', label: 'Todos', icon: '✦' },
  { key: 'crypto', label: 'Cripto', icon: '₿' },
  { key: 'commodity', label: 'Commodities', icon: '🥇' },
  { key: 'fixed-income', label: 'Renda Fixa', icon: '📈' },
]

const TRENDING = ASSETS.filter(a => (a.change24h ?? 0) > 2 || a.ticker === 'RENDA-BRL')
const TOP_MOVERS = [...ASSETS].filter(a => a.category !== 'fixed-income').sort((a, b) => Math.abs(b.change24h ?? 0) - Math.abs(a.change24h ?? 0)).slice(0, 4)

export default function Screen1_Discover({ onNext, onElementTap }: FlowScreenProps) {
  const [category, setCategory] = useState<AssetCategory | 'all'>('all')
  const [search, setSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)

  const filtered = useMemo(() => {
    let list = category === 'all' ? ASSETS : ASSETS.filter(a => a.category === category)
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(a => a.name.toLowerCase().includes(q) || a.ticker.toLowerCase().includes(q))
    }
    return list
  }, [category, search])

  const handleTap = (name: string) => {
    const handled = onElementTap?.(`ListItem: ${name}`)
    if (!handled) onNext()
  }

  const showDiscovery = !search && category === 'all'

  return (
    <div className="flex flex-col text-white" style={{ background: '#0a0a0f', minHeight: '100vh' }}>
      {/* ── Status bar spacer ── */}
      <div className="h-[var(--safe-area-top)]" />

      {/* ── Header ── */}
      <div className="px-5 pt-3 pb-2">
        <div className="flex items-center justify-between">
          <motion.h1
            className="text-[28px] font-extrabold tracking-tight"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Investimentos
          </motion.h1>

          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="w-10 h-10 rounded-full bg-white/[0.06] flex items-center justify-center"
          >
            {searchOpen ? <RiCloseLine size={20} /> : <RiSearchLine size={20} />}
          </button>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <motion.div
            className="mt-3"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
          >
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nome ou ticker..."
              autoFocus
              className="w-full bg-white/[0.06] rounded-xl px-4 py-3 text-[14px] text-white placeholder:text-white/30 outline-none border border-white/[0.08] focus:border-white/20 transition-colors"
            />
          </motion.div>
        )}
      </div>

      {/* ── Category pills ── */}
      <div className="flex gap-2 px-5 py-3 overflow-x-auto no-scrollbar flex-shrink-0">
        {CATEGORIES.map(c => (
          <CategoryPill
            key={c.key}
            label={c.label}
            icon={c.icon}
            active={category === c.key}
            onPress={() => setCategory(c.key)}
          />
        ))}
      </div>

      <div className="px-5 pb-8 flex flex-col gap-8 flex-1 overflow-y-auto">
        {/* ── Featured Trending (horizontal scroll) ── */}
        {showDiscovery && (
          <div>
            <SectionTitle title="Em alta" subtitle="7 dias" />
            <div className="flex gap-3 mt-3 overflow-x-auto no-scrollbar -mx-5 px-5 pb-1">
              {TRENDING.map((asset, i) => (
                <FeaturedCard
                  key={asset.ticker}
                  asset={asset}
                  index={i}
                  onPress={() => handleTap(asset.name)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Top Movers ── */}
        {showDiscovery && (
          <div>
            <SectionTitle title="Maiores movimentações" subtitle="24h" />
            <div className="grid grid-cols-2 gap-3 mt-3">
              {TOP_MOVERS.map((asset, i) => {
                const isPositive = (asset.change24h ?? 0) >= 0
                return (
                  <motion.button
                    key={asset.ticker}
                    onClick={() => handleTap(asset.name)}
                    className="rounded-xl p-3 text-left relative overflow-hidden"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.06 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <img src={asset.icon} alt="" className="w-7 h-7 rounded-full" />
                      <span className="text-[13px] font-semibold text-white">{asset.ticker}</span>
                    </div>
                    <div className="text-[16px] font-bold text-white">
                      {formatCompact(asset.price!)}
                    </div>
                    <div className={`text-[13px] font-semibold mt-0.5 ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                      {isPositive ? '↑' : '↓'} {Math.abs(asset.change24h!).toLocaleString('pt-BR', { minimumFractionDigits: 1 })}%
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Renda Fixa Digital highlight ── */}
        {showDiscovery && (
          <motion.div
            className="rounded-2xl p-5 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(16,185,129,0.03) 100%)',
              border: '1px solid rgba(16,185,129,0.15)',
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="absolute -top-8 -right-8 w-20 h-20 rounded-full opacity-25 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.6) 0%, transparent 70%)' }} />
            <div className="relative">
              <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider mb-1">
                Renda Fixa Digital
              </div>
              <div className="text-[20px] font-bold text-white mb-1">
                Até 10% a.a.
              </div>
              <div className="text-[13px] text-white/50 mb-4">
                Rendimento automático. Resgate quando quiser.
              </div>
              <div className="flex gap-2">
                {ASSETS.filter(a => a.category === 'fixed-income').map(a => (
                  <button
                    key={a.ticker}
                    onClick={() => handleTap(a.name)}
                    className="flex items-center gap-2 bg-white/[0.06] rounded-lg px-3 py-2"
                  >
                    <img src={a.icon} alt="" className="w-5 h-5 rounded-full" />
                    <span className="text-[12px] font-medium text-white">{a.apyDisplay}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Full list ── */}
        <div>
          {showDiscovery && <SectionTitle title="Todos os ativos" subtitle={`${ASSETS.length} disponíveis`} />}
          <div className="mt-2">
            {filtered.length > 0 ? (
              filtered.map((asset, i) => (
                <AssetListRow
                  key={asset.ticker}
                  asset={asset}
                  index={i}
                  onPress={() => handleTap(asset.name)}
                />
              ))
            ) : (
              <div className="py-12 text-center text-white/30 text-[14px]">
                Nenhum ativo encontrado
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function formatCompact(n: number): string {
  if (n >= 1000) return `R$ ${(n / 1000).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 1 })} mil`
  return `R$ ${n.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
}
