/**
 * Dashboard — investments portfolio overview.
 * States:
 *   - portfolio (default): user has investments, shows holdings + chart
 *   - empty: no investments, shows onboarding + featured assets
 */
import { useState } from 'react'
import {
  RiExchangeLine, RiDownloadLine, RiUploadLine, RiMoreLine,
  RiFileListLine, RiHistoryLine, RiCoinLine,
} from '@remixicon/react'
import type { FlowScreenProps } from '@/pages/simulator/flowRegistry'
import { useScreenData } from '@/lib/ScreenDataContext'
import BaseLayout from '@/library/layout/BaseLayout'
import StickyFooter from '@/library/layout/StickyFooter'
import Stack from '@/library/layout/Stack'
import Header from '@/library/navigation/Header'
import GroupHeader from '@/library/navigation/GroupHeader'
import ShortcutButton from '@/library/inputs/ShortcutButton'
import Button from '@/library/inputs/Button'
import ListItem from '@/library/display/ListItem'
import Avatar from '@/library/display/Avatar'
import Text from '@/library/foundations/Text'
import LineChart from '@/library/display/LineChart'
import BottomSheet from '@/library/layout/BottomSheet'
import {
  getAsset, getPortfolioTotal, MOCK_POSITIONS,
  getFavoriteAssets, formatBRL, formatPercentChange,
  generatePortfolioChartData, isVolatile,
} from './shared/data'
import { PortfolioHeader, HoldingRow, FeaturedAssetCard } from './Screen0_Dashboard.parts'

interface ScreenData extends Record<string, unknown> {
  dashboard?: 'portfolio' | 'empty'
}

export default function Screen0_Dashboard({ onNext, onBack, onElementTap }: FlowScreenProps) {
  const data = useScreenData<ScreenData>()
  const state = data.dashboard ?? 'portfolio'

  const [moreSheetOpen, setMoreSheetOpen] = useState(false)

  const portfolioTotal = getPortfolioTotal()
  const chartData = generatePortfolioChartData(30)
  const favorites = getFavoriteAssets()

  // Weighted 24h change from positions
  const portfolioChange = MOCK_POSITIONS.reduce((acc, pos) => {
    const asset = getAsset(pos.asset)
    const weight = pos.currentValue / portfolioTotal
    return acc + (asset.change24h ?? 0) * weight
  }, 0)

  // Featured assets for empty state
  const featuredAssets = [getAsset('BTC'), getAsset('ETH'), getAsset('RENDA-USD')]

  // ── Handlers ──

  const handleShortcut = (label: string) => {
    const handled = onElementTap?.(label)
    if (!handled) onNext()
  }

  const handleBottomSheetAction = (label: string) => {
    setMoreSheetOpen(false)
    const handled = onElementTap?.(label)
    if (!handled) onNext()
  }

  const handleAssetTap = (name: string) => {
    const handled = onElementTap?.(`ListItem: ${name}`)
    if (!handled) onNext()
  }

  const handleExplore = () => {
    const handled = onElementTap?.('ListItem: Explorar mais ativos')
    if (!handled) onNext()
  }

  const handleExploreButton = () => {
    const handled = onElementTap?.('Button: Explorar ativos')
    if (!handled) onNext()
  }

  // ── Empty State ──

  if (state === 'empty') {
    return (
      <BaseLayout>
        <Header title="Investimentos" onClose={onBack} />

        <Stack gap="lg">
          {/* Empty state illustration placeholder */}
          <Stack gap="default" align="center" className="py-8">
            <div className="w-16 h-16 rounded-full bg-[var(--token-bg-secondary)] flex items-center justify-center">
              <RiCoinLine size={32} className="text-[var(--color-content-tertiary)]" />
            </div>
            <Stack gap="sm" align="center">
              <Text variant="heading-md" align="center">Comece a investir</Text>
              <Text variant="body-md" color="content-secondary" align="center">
                Explore ativos digitais, renda fixa em dólar e commodities — tudo em um só lugar.
              </Text>
            </Stack>
          </Stack>

          {/* Featured assets */}
          <Stack gap="sm">
            <GroupHeader text="Ativos em destaque" />
            <div className="flex gap-3 overflow-x-auto pb-1 -mx-6 px-6">
              {featuredAssets.map(asset => (
                <FeaturedAssetCard
                  key={asset.ticker}
                  asset={asset}
                  onPress={() => handleAssetTap(asset.name)}
                />
              ))}
            </div>
          </Stack>
        </Stack>

        <StickyFooter>
          <Button fullWidth onPress={handleExploreButton}>
            Explorar ativos
          </Button>
        </StickyFooter>
      </BaseLayout>
    )
  }

  // ── Portfolio State ──

  return (
    <BaseLayout>
      <Header title="Investimentos" onClose={onBack} />

      <Stack gap="lg">
        {/* Portfolio value + chart */}
        <Stack gap="default">
          <PortfolioHeader totalValue={portfolioTotal} change24h={portfolioChange} />
          <LineChart data={chartData} height={180} variant="area" />
        </Stack>

        {/* Shortcut buttons */}
        <Stack direction="row" gap="default" align="center">
          <ShortcutButton
            icon={<RiExchangeLine size={22} />}
            label="Negociar"
            variant="primary"
            onPress={() => handleShortcut('ShortcutButton: Negociar')}
          />
          <ShortcutButton
            icon={<RiDownloadLine size={22} />}
            label="Receber"
            variant="secondary"
            onPress={() => handleShortcut('ShortcutButton: Receber')}
          />
          <ShortcutButton
            icon={<RiUploadLine size={22} />}
            label="Enviar"
            variant="secondary"
            onPress={() => handleShortcut('ShortcutButton: Enviar')}
          />
          <ShortcutButton
            icon={<RiMoreLine size={22} />}
            label="Mais"
            variant="secondary"
            onPress={() => setMoreSheetOpen(true)}
          />
        </Stack>

        {/* Favorites horizontal scroll */}
        <Stack gap="sm">
          <GroupHeader text="Favoritos" />
          <div className="flex gap-3 overflow-x-auto pb-1 -mx-6 px-6">
            {favorites.map(asset => {
              const volatile = isVolatile(asset)
              return (
                <button
                  key={asset.ticker}
                  onClick={() => handleAssetTap(asset.name)}
                  className="flex-shrink-0 flex items-center gap-2 rounded-full bg-[var(--token-bg-secondary)] px-3 py-2 border-none cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <Avatar src={asset.icon} size="sm" />
                  <Stack gap="none">
                    <Text variant="caption" className="font-medium whitespace-nowrap">{asset.ticker}</Text>
                    <Text variant="caption" color={
                      volatile && asset.change24h !== undefined
                        ? (asset.change24h >= 0 ? 'content-primary' : 'content-primary')
                        : 'content-secondary'
                    }>
                      {volatile
                        ? formatPercentChange(asset.change24h!)
                        : asset.apyDisplay ?? ''
                      }
                    </Text>
                  </Stack>
                </button>
              )
            })}
          </div>
        </Stack>

        {/* Holdings list */}
        <Stack gap="none">
          <GroupHeader text="Meu portfólio" subtitle={formatBRL(portfolioTotal)} />
          {MOCK_POSITIONS.map(position => {
            const asset = getAsset(position.asset)
            return (
              <HoldingRow
                key={position.asset}
                asset={asset}
                position={position}
                onPress={() => handleAssetTap(asset.name)}
              />
            )
          })}
        </Stack>

        {/* Explore more */}
        <ListItem
          title="Explorar mais ativos"
          left={
            <Avatar
              icon={<RiCoinLine size={20} />}
              size="md"
            />
          }
          onPress={handleExplore}
        />
      </Stack>

      {/* More options BottomSheet */}
      <BottomSheet
        open={moreSheetOpen}
        onClose={() => setMoreSheetOpen(false)}
        title="Mais opções"
      >
        <Stack gap="none" className="pb-6">
          <ListItem
            title="Ordens abertas"
            left={<Avatar icon={<RiFileListLine size={20} />} size="md" />}
            onPress={() => handleBottomSheetAction('ListItem: Ordens abertas')}
          />
          <ListItem
            title="Extrato"
            left={<Avatar icon={<RiHistoryLine size={20} />} size="md" />}
            onPress={() => handleBottomSheetAction('ListItem: Extrato')}
          />
        </Stack>
      </BottomSheet>
    </BaseLayout>
  )
}
