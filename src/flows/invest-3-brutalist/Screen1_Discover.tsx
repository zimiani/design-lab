/**
 * Discover — Neo-brutalist asset discovery/explore screen.
 * Filterable by category + search. Grid layout for featured, uppercase headers, hard edges.
 * Pure custom Tailwind + inline styles + Framer Motion. NO library components.
 */
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RiArrowLeftLine, RiSearchLine, RiArrowUpDownLine,
} from '@remixicon/react'
import { listContainer, dropdownContainer, dropdownItem, stagger } from './shared/animations'
import type { FlowScreenProps } from '@/pages/simulator/flowRegistry'
import {
  ASSETS, getFavoriteAssets, isFavorite,
  getAssetColor, getSparkline,
} from './shared/data'
import type { AssetCategory } from './shared/data'
import {
  BG, BG_CARD, BORDER, TEXT_PRIMARY, TEXT_SECONDARY, TEXT_TERTIARY,
  fadeUp,
} from './shared/theme'
import { AssetRow, FeaturedCard, CategoryPill, FavChip } from './Screen1_Discover.parts'

type SortOption = 'name' | 'price-desc' | 'price-asc' | 'change-desc'

const SORT_LABELS: Record<SortOption, string> = {
  'name': 'Nome',
  'price-desc': 'Maior preço',
  'price-asc': 'Menor preço',
  'change-desc': 'Maior alta',
}

const CATEGORIES: { id: 'all' | AssetCategory; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'crypto', label: 'Cripto' },
  { id: 'commodity', label: 'Commodities' },
  { id: 'fixed-income', label: 'Renda Fixa' },
  { id: 'stablecoin', label: 'Stablecoins' },
]

// Custom dropdown for sort (brutalist: hard border, no rounded corners, no shadow)
function SortDropdown({ value, onChange }: { value: SortOption; onChange: (v: SortOption) => void }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-none border-none cursor-pointer"
        style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
      >
        <RiArrowUpDownLine size={14} color={TEXT_SECONDARY} />
        <span style={{ color: TEXT_SECONDARY, fontSize: 12, fontWeight: 500 }}>
          {SORT_LABELS[value]}
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <motion.div
            variants={dropdownContainer}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute right-0 top-full mt-1 z-40 rounded-none overflow-hidden min-w-[140px]"
            style={{
              background: '#FFFFFF',
              border: `1px solid ${BORDER}`,
              transformOrigin: 'top right',
            }}
          >
            {(Object.keys(SORT_LABELS) as SortOption[]).map(opt => (
              <motion.button
                key={opt}
                variants={dropdownItem}
                onClick={() => { onChange(opt); setOpen(false) }}
                className="block w-full text-left px-4 py-2.5 border-none cursor-pointer"
                style={{
                  background: opt === value ? 'rgba(0,0,0,0.05)' : 'transparent',
                  color: opt === value ? TEXT_PRIMARY : TEXT_SECONDARY,
                  fontSize: 13,
                  fontWeight: opt === value ? 600 : 400,
                }}
              >
                {SORT_LABELS[opt]}
              </motion.button>
            ))}
          </motion.div>
        </>
      )}
      </AnimatePresence>
    </div>
  )
}

export default function Screen1_Discover({ onBack, onElementTap, onNext }: FlowScreenProps) {
  const [search, setSearch] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [activeCategory, setActiveCategory] = useState<'all' | AssetCategory>('all')
  const [sort, setSort] = useState<SortOption>('name')

  const favorites = getFavoriteAssets()

  // Trending = highest 24h change
  const trending = useMemo(() =>
    [...ASSETS]
      .filter(a => a.change24h != null)
      .sort((a, b) => (b.change24h ?? 0) - (a.change24h ?? 0))
      .slice(0, 4), // 4 for a 2x2 grid
    [],
  )

  // Most traded (popular tag)
  const mostTraded = useMemo(() =>
    ASSETS.filter(a => a.tags?.includes('popular')).slice(0, 6),
    [],
  )

  const isSearching = search.trim().length > 0
  const isFiltered = activeCategory !== 'all'

  // Filtered assets
  const filteredAssets = useMemo(() => {
    let list = [...ASSETS]

    // Category filter
    if (isFiltered) {
      list = list.filter(a => a.category === activeCategory)
    }

    // Search filter
    if (isSearching) {
      const q = search.toLowerCase()
      list = list.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.ticker.toLowerCase().includes(q),
      )
    }

    // Sort
    switch (sort) {
      case 'name':
        list.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'price-desc':
        list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0))
        break
      case 'price-asc':
        list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0))
        break
      case 'change-desc':
        list.sort((a, b) => (b.change24h ?? 0) - (a.change24h ?? 0))
        break
    }

    return list
  }, [search, activeCategory, sort, isSearching, isFiltered])

  const handleAssetTap = (name: string) => {
    const handled = onElementTap?.(`ListItem: ${name}`)
    if (!handled) onNext()
  }

  // Show sections when "all" + no search
  const showSections = !isSearching && !isFiltered

  return (
    <div className="flex flex-col min-h-screen" style={{ background: BG }}>
      <div style={{ height: 'var(--safe-area-top)' }} />

      {/* Top bar: back + search (brutalist: hard border, no rounded) */}
      <motion.div {...fadeUp(0)} className="flex items-center gap-3 px-4 pt-3 pb-2">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="flex items-center justify-center rounded-full border-none cursor-pointer flex-shrink-0"
          style={{
            width: 36,
            height: 36,
            background: BG_CARD,
            border: `1px solid ${BORDER}`,
          }}
        >
          <RiArrowLeftLine size={18} color={TEXT_PRIMARY} />
        </motion.button>

        {/* Search input — hard border, no rounded */}
        <div
          className="flex items-center gap-2 flex-1 rounded-none px-3 py-2.5"
          style={{
            background: BG_CARD,
            border: `1px solid ${BORDER}`,
            transition: 'border-color 0.2s',
            borderColor: searchFocused ? TEXT_PRIMARY : BORDER,
          }}
        >
          <RiSearchLine size={16} color={TEXT_TERTIARY} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Buscar ativo..."
            className="flex-1 bg-transparent border-none outline-none"
            style={{
              color: TEXT_PRIMARY,
              fontSize: 14,
              caretColor: TEXT_PRIMARY,
            }}
          />
        </div>
      </motion.div>

      {/* Category pills */}
      <motion.div {...fadeUp(0.05)} className="flex gap-2 px-4 py-3 overflow-x-auto">
        {CATEGORIES.map(cat => (
          <CategoryPill
            key={cat.id}
            label={cat.label}
            active={activeCategory === cat.id}
            onPress={() => setActiveCategory(cat.id)}
          />
        ))}
      </motion.div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {showSections ? (
          <>
            {/* Favoritos */}
            {favorites.length > 0 && (
              <motion.div {...fadeUp(0.1)} className="mb-5">
                <div className="px-4 mb-2">
                  <span style={{
                    color: TEXT_TERTIARY,
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 1.5,
                    textTransform: 'uppercase' as const,
                  }}>
                    FAVORITOS
                  </span>
                </div>
                <div className="flex gap-2 px-4 overflow-x-auto pb-1">
                  {favorites.map(asset => (
                    <FavChip
                      key={asset.ticker}
                      icon={asset.icon}
                      ticker={asset.ticker}
                      change={asset.change24h ?? 0}
                      color={getAssetColor(asset.ticker)}
                      onPress={() => handleAssetTap(asset.name)}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Maiores altas — 2x2 grid instead of horizontal scroll */}
            <motion.div {...fadeUp(0.15)} className="mb-5">
              <div className="px-4 mb-2">
                <span style={{
                  color: TEXT_TERTIARY,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 1.5,
                  textTransform: 'uppercase' as const,
                }}>
                  MAIORES ALTAS
                </span>
              </div>
              <div className="grid grid-cols-2 gap-px px-4" style={{ background: BORDER }}>
                {trending.map((asset, i) => (
                  <motion.div key={asset.ticker} {...fadeUp(0.17 + i * 0.03)}>
                    <FeaturedCard
                      asset={asset}
                      color={getAssetColor(asset.ticker)}
                      sparkline={getSparkline(asset.ticker)}
                      onPress={() => handleAssetTap(asset.name)}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Mais negociados */}
            <motion.div {...fadeUp(0.25)} className="mb-5">
              <div className="px-4 mb-2">
                <span style={{
                  color: TEXT_TERTIARY,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 1.5,
                  textTransform: 'uppercase' as const,
                }}>
                  MAIS NEGOCIADOS
                </span>
              </div>
              <motion.div className="flex flex-col" variants={listContainer} initial="hidden" animate="visible">
                {mostTraded.map(asset => (
                  <AssetRow
                    key={asset.ticker}
                    asset={asset}
                    color={getAssetColor(asset.ticker)}
                    sparkline={getSparkline(asset.ticker)}
                    showFav
                    isFav={isFavorite(asset.ticker)}
                    onPress={() => handleAssetTap(asset.name)}
                  />
                ))}
              </motion.div>
            </motion.div>

            {/* Todos os ativos */}
            <motion.div {...fadeUp(0.35)} className="mb-6">
              <div className="flex items-center justify-between px-4 mb-2">
                <span style={{
                  color: TEXT_TERTIARY,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 1.5,
                  textTransform: 'uppercase' as const,
                }}>
                  TODOS OS ATIVOS
                </span>
                <SortDropdown value={sort} onChange={setSort} />
              </div>
              <motion.div className="flex flex-col" variants={listContainer} initial="hidden" animate="visible">
                {filteredAssets.map(asset => (
                  <AssetRow
                    key={asset.ticker}
                    asset={asset}
                    color={getAssetColor(asset.ticker)}
                    sparkline={getSparkline(asset.ticker)}
                    showFav
                    isFav={isFavorite(asset.ticker)}
                    onPress={() => handleAssetTap(asset.name)}
                  />
                ))}
              </motion.div>
            </motion.div>
          </>
        ) : (
          /* Filtered / Search results */
          <motion.div {...fadeUp(0.1)} className="mb-6">
            {isFiltered && !isSearching && (
              <div className="px-4 mb-3">
                <span style={{ color: TEXT_SECONDARY, fontSize: 13 }}>
                  {CATEGORIES.find(c => c.id === activeCategory)?.label}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between px-4 mb-2">
              <span style={{ color: TEXT_TERTIARY, fontSize: 12 }}>
                {filteredAssets.length} {filteredAssets.length === 1 ? 'ativo' : 'ativos'}
              </span>
              <SortDropdown value={sort} onChange={setSort} />
            </div>

            <motion.div className="flex flex-col" variants={listContainer} initial="hidden" animate="visible">
              {filteredAssets.map(asset => (
                <AssetRow
                  key={asset.ticker}
                  asset={asset}
                  color={getAssetColor(asset.ticker)}
                  sparkline={getSparkline(asset.ticker)}
                  showFav
                  isFav={isFavorite(asset.ticker)}
                  onPress={() => handleAssetTap(asset.name)}
                />
              ))}
              {filteredAssets.length === 0 && (
                <motion.div {...stagger(0, 0)} className="flex flex-col items-center py-12">
                  <RiSearchLine size={32} color={TEXT_TERTIARY} />
                  <span className="mt-3" style={{ color: TEXT_SECONDARY, fontSize: 14 }}>
                    Nenhum ativo encontrado
                  </span>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* Bottom padding */}
        <div style={{ paddingBottom: 'max(var(--safe-area-bottom), 20px)' }} />
      </div>
    </div>
  )
}
