/**
 * @screen Investment Discovery
 * @description Category browse with search and horizontally scrollable asset cards
 */
import { useState, useMemo } from 'react'
import type { FlowScreenProps } from '@/pages/simulator/flowRegistry'
import BaseLayout from '@/library/layout/BaseLayout'
import Stack from '@/library/layout/Stack'
import Header from '@/library/navigation/Header'
import SearchBar from '@/library/inputs/SearchBar'
import Avatar from '@/library/display/Avatar'
import Text from '@/library/foundations/Text'

import {
  type AssetCategory,
  type Asset,
  ASSETS,
  CATEGORY_INFO,
  isVolatile,
  formatPercentChange,
} from './shared/data'

const CATEGORIES: AssetCategory[] = ['crypto', 'commodity', 'fixed-income']

function AssetCard({ asset, onPress }: { asset: Asset; onPress: () => void }) {
  return (
    <button
      onClick={onPress}
      className="flex flex-col items-start gap-3 min-w-[120px] w-[120px] p-3 rounded-2xl bg-[var(--color-surface-secondary)] active:scale-95 transition-transform"
    >
      <Avatar src={asset.icon} size="md" />
      <Stack gap="none">
        <Text variant="body-sm" className="font-semibold">{asset.name}</Text>
        <Text variant="body-sm" color="content-secondary">
          {isVolatile(asset)
            ? formatPercentChange(asset.change24h!)
            : asset.apyDisplay}
        </Text>
      </Stack>
    </button>
  )
}

export default function Screen3_Discovery({ onNext, onBack, onElementTap }: FlowScreenProps) {
  const [search, setSearch] = useState('')

  const filteredAssets = useMemo(() => {
    if (!search.trim()) return ASSETS
    const q = search.toLowerCase()
    return ASSETS.filter(
      (a) => a.name.toLowerCase().includes(q) || a.ticker.toLowerCase().includes(q)
    )
  }, [search])

  const handleTapAsset = (ticker: string) => {
    const resolved = onElementTap?.(`ListItem: ${ticker}`)
    if (!resolved) onNext()
  }

  return (
    <BaseLayout>
      <Header title="" onBack={onBack} />

      <Stack gap="default" className="-mt-2">
        <SearchBar
          placeholder="Buscar ativo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {CATEGORIES.map((cat) => {
          const assetsInCat = filteredAssets.filter((a) => a.category === cat)
          if (assetsInCat.length === 0) return null
          return (
            <Stack key={cat} gap="sm">
              <div className="flex items-center justify-between">
                <Text variant="h3">{CATEGORY_INFO[cat].label}</Text>
                <button className="text-[var(--color-interactive-primary)] text-[length:var(--token-font-size-body-sm)] font-medium">
                  Ver tudo
                </button>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-1 -mx-[var(--token-spacing-24)] px-[var(--token-spacing-24)] scrollbar-hide">
                {assetsInCat.map((asset) => (
                  <AssetCard
                    key={asset.ticker}
                    asset={asset}
                    onPress={() => handleTapAsset(asset.ticker)}
                  />
                ))}
              </div>
            </Stack>
          )
        })}

        {filteredAssets.length === 0 && (
          <Stack gap="sm" className="items-center py-8">
            <Text variant="body-md" color="content-tertiary">
              Nenhum ativo encontrado
            </Text>
          </Stack>
        )}
      </Stack>
    </BaseLayout>
  )
}
