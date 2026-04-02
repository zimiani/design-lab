import { useState, useMemo } from 'react'
import type { FlowScreenProps } from '@/pages/simulator/flowRegistry'
import BaseLayout from '@/library/layout/BaseLayout'
import Header from '@/library/navigation/Header'
import Stack from '@/library/layout/Stack'
import Text from '@/library/foundations/Text'
import GroupHeader from '@/library/navigation/GroupHeader'
import SegmentedControl from '@/library/navigation/SegmentedControl'
import SearchBar from '@/library/inputs/SearchBar'
import Select from '@/library/inputs/Select'
import {
  ASSETS, getAssetsByCategory, getPopularAssets, getTrendingAssets,
  getFavoriteAssets,
  type AssetCategory,
} from './shared/data'
import { AssetRow, DiscoveryCard } from './Screen2_Explore.parts'

const CATEGORIES: { key: AssetCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'crypto', label: 'Cripto' },
  { key: 'commodity', label: 'Commodities' },
  { key: 'fixed-income', label: 'Renda Fixa' },
  { key: 'stablecoin', label: 'Stablecoins' },
]

const SORT_OPTIONS = [
  { label: 'Nome (A-Z)', value: 'name-asc' },
  { label: 'Preço (maior)', value: 'price-desc' },
  { label: 'Variação 24h', value: 'change-desc' },
]

export default function Screen2_Explore({ onNext, onBack, onElementTap }: FlowScreenProps) {
  const [categoryIndex, setCategoryIndex] = useState(0)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('name-asc')

  const selectedCategory = CATEGORIES[categoryIndex].key
  const popular = getPopularAssets()
  const trending = getTrendingAssets()
  const favorites = getFavoriteAssets()

  const filteredAssets = useMemo(() => {
    let list = selectedCategory === 'all' ? ASSETS : getAssetsByCategory(selectedCategory)
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(a => a.name.toLowerCase().includes(q) || a.ticker.toLowerCase().includes(q))
    }
    // Sort
    const sorted = [...list]
    if (sortBy === 'name-asc') sorted.sort((a, b) => a.name.localeCompare(b.name))
    else if (sortBy === 'price-desc') sorted.sort((a, b) => (b.price ?? 0) - (a.price ?? 0))
    else if (sortBy === 'change-desc') sorted.sort((a, b) => (b.change24h ?? 0) - (a.change24h ?? 0))
    return sorted
  }, [selectedCategory, search, sortBy])

  const showDiscovery = !search && selectedCategory === 'all'

  const handleAssetTap = (label: string) => {
    const handled = onElementTap?.(label)
    if (!handled) onNext()
  }

  return (
    <BaseLayout>
      <Header title="Investimentos" onClose={onBack} />

      <SearchBar
        placeholder="Buscar ativos..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <SegmentedControl
        segments={CATEGORIES.map(c => c.label)}
        activeIndex={categoryIndex}
        onChange={setCategoryIndex}
      />

      {/* Discovery sections — only on "Todos" without search */}
      {showDiscovery && (
        <>
          {/* Favorites horizontal scroll */}
          {favorites.length > 0 && (
            <Stack gap="sm">
              <GroupHeader text="Favoritos" />
              <div className="flex gap-3 overflow-x-auto pb-1 -mx-6 px-6">
                {favorites.map(asset => (
                  <DiscoveryCard
                    key={asset.ticker}
                    asset={asset}
                    onPress={() => handleAssetTap(`ListItem: ${asset.name}`)}
                  />
                ))}
              </div>
            </Stack>
          )}

          {/* Trending carousel */}
          <Stack gap="sm">
            <GroupHeader text="Maiores altas" subtitle="Maior variação nas últimas 24h" />
            <div className="flex gap-3 overflow-x-auto pb-1 -mx-6 px-6">
              {trending.map(asset => (
                <DiscoveryCard
                  key={asset.ticker}
                  asset={asset}
                  onPress={() => handleAssetTap(`ListItem: ${asset.name}`)}
                />
              ))}
            </div>
          </Stack>

          {/* Most traded (popular) section */}
          <Stack gap="none">
            <GroupHeader text="Mais negociados" subtitle="Os mais investidos na Picnic" />
            {popular.map(asset => (
              <AssetRow
                key={asset.ticker}
                asset={asset}
                showFavorite
                onPress={() => handleAssetTap(`ListItem: ${asset.name}`)}
              />
            ))}
          </Stack>
        </>
      )}

      {/* Filtered list — when searching or category selected */}
      {!showDiscovery && (
        <Stack gap="sm">
          {/* Sort dropdown */}
          <Stack direction="row" align="center" gap="sm">
            <Text variant="caption" color="content-secondary" className="flex-1">
              {filteredAssets.length} {filteredAssets.length === 1 ? 'ativo' : 'ativos'}
            </Text>
            <div className="w-40">
              <Select
                options={SORT_OPTIONS}
                value={sortBy}
                onChange={setSortBy}
                placeholder="Ordenar"
              />
            </div>
          </Stack>

          <Stack gap="none">
            {selectedCategory !== 'all' && !search && (
              <GroupHeader text={CATEGORIES[categoryIndex].label} />
            )}
            {filteredAssets.length > 0 ? (
              filteredAssets.map(asset => (
                <AssetRow
                  key={asset.ticker}
                  asset={asset}
                  showFavorite
                  onPress={() => handleAssetTap(`ListItem: ${asset.name}`)}
                />
              ))
            ) : (
              <Stack gap="sm" align="center" className="py-12">
                <Text variant="body-md" color="content-secondary" align="center">
                  Nenhum ativo encontrado
                </Text>
              </Stack>
            )}
          </Stack>
        </Stack>
      )}

      {/* All assets — below discovery when on "Todos" */}
      {showDiscovery && (
        <Stack gap="sm">
          <Stack direction="row" align="center" gap="sm">
            <GroupHeader text="Todos os ativos" className="flex-1" />
            <div className="w-40">
              <Select
                options={SORT_OPTIONS}
                value={sortBy}
                onChange={setSortBy}
                placeholder="Ordenar"
              />
            </div>
          </Stack>
          <Stack gap="none">
            {filteredAssets.map(asset => (
              <AssetRow
                key={asset.ticker}
                asset={asset}
                showFavorite
                onPress={() => handleAssetTap(`ListItem: ${asset.name}`)}
              />
            ))}
          </Stack>
        </Stack>
      )}
    </BaseLayout>
  )
}
