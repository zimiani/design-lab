/**
 * Hub parts — inspired by savings-manage/Screen2_Hub.parts.tsx
 */
import { RiArrowDownLine, RiArrowUpLine, RiPercentLine } from '@remixicon/react'
import Stack from '@/library/layout/Stack'
import DataList from '@/library/display/DataList'
import Banner from '@/library/display/Banner'
import ListItem from '@/library/display/ListItem'
import Avatar from '@/library/display/Avatar'
import Badge from '@/library/display/Badge'
import Text from '@/library/foundations/Text'
import type { Asset, Position, Transaction } from './shared/data'
import {
  formatBRL, formatPercentChange, formatQuantity,
  CATEGORY_INFO, isVolatile, getMockTransactions,
} from './shared/data'

// ── Balance Display (from savings hub) ──

const symbolFeatures = "'salt' 1, 'ordn' 1, 'kern' 0, 'calt' 0"
const digitFeatures = "'ss01' 1, 'cv05' 1, 'lnum' 1, 'pnum' 1"

interface BalanceDisplayProps {
  value: number
  symbol: string
  inverted?: boolean
}

export function BalanceDisplay({ value, symbol, inverted }: BalanceDisplayProps) {
  const formatted = value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const textColor = inverted ? 'text-white' : 'text-content-primary'
  return (
    <Stack direction="row" gap="none" align="center">
      <span
        className={`text-[28px] font-medium leading-[40px] tracking-[-0.56px] uppercase ${textColor}`}
        style={{ fontFamily: "'Barlow Condensed', sans-serif", fontFeatureSettings: symbolFeatures }}
      >
        {symbol}
      </span>
      <span
        className={`text-[40px] font-bold leading-[40px] ${textColor} ml-1`}
        style={{ fontFeatureSettings: digitFeatures }}
      >
        {formatted}
      </span>
    </Stack>
  )
}

// ── Details Tab (invested) ──

interface DetailsTabInvestedProps {
  asset: Asset
  position: Position
}

export function DetailsTabInvested({ asset, position }: DetailsTabInvestedProps) {
  const pnl = position.currentValue - (position.avgCost * position.quantity)
  const pnlPct = (pnl / (position.avgCost * position.quantity)) * 100

  if (isVolatile(asset)) {
    return (
      <Stack gap="default">
        <Stack gap="none">
          <DataList data={[
            { label: 'Quantidade', value: formatQuantity(position.quantity, asset.ticker) },
            { label: 'Preço médio', value: formatBRL(position.avgCost) },
            {
              label: 'Lucro/Prejuízo',
              value: (
                <span className={pnl >= 0 ? 'text-[var(--color-feedback-success)] font-medium' : 'text-[var(--color-feedback-error)] font-medium'}>
                  {formatBRL(Math.abs(pnl))} ({formatPercentChange(pnlPct)})
                </span>
              ),
            },
            { label: 'Investindo desde', value: position.investedSince },
          ]} />
        </Stack>

        <Banner
          variant="neutral"
          title="Ativos de renda variável podem valorizar ou desvalorizar"
          description="Rentabilidade passada não garante retorno futuro."
        />
      </Stack>
    )
  }

  // Fixed income
  const mockYield = position.currentValue * (asset.apy ?? 0) * (45 / 365)
  return (
    <Stack gap="default">
      <Stack gap="none">
        <DataList data={[
          { label: 'Rendimento', value: asset.apyDisplay ?? '—' },
          { label: 'Rendeu até agora', value: formatBRL(Math.round(mockYield * 100) / 100) },
          { label: 'Investindo desde', value: position.investedSince },
          {
            label: 'Resgate',
            value: <span className="text-[var(--color-feedback-success)] font-medium">Imediato</span>,
          },
        ]} />
      </Stack>

      <Banner
        variant="neutral"
        title="Investimento protegido"
        description="Seu rendimento é coberto contra falhas técnicas — sem custo adicional."
      />
    </Stack>
  )
}

// ── Details Tab (not invested) ──

interface DetailsTabInfoProps {
  asset: Asset
}

export function DetailsTabInfo({ asset }: DetailsTabInfoProps) {
  if (isVolatile(asset)) {
    return (
      <Stack gap="default">
        <Stack gap="none">
          <DataList data={[
            { label: 'Capitalização', value: asset.marketCap ?? '—' },
            { label: 'Volume 24h', value: asset.volume24h ?? '—' },
            { label: 'Categoria', value: CATEGORY_INFO[asset.category].label },
            ...(asset.network ? [{ label: 'Rede', value: asset.network }] : []),
          ]} />
        </Stack>

        <Banner
          variant="neutral"
          title="Ativos de renda variável podem valorizar ou desvalorizar"
          description="Rentabilidade passada não garante retorno futuro."
        />
      </Stack>
    )
  }

  // Fixed income
  return (
    <Stack gap="default">
      <Stack gap="none">
        <DataList data={[
          { label: 'Rendimento', value: asset.apyDisplay ?? '—' },
          {
            label: 'Resgate',
            value: <span className="text-[var(--color-feedback-success)] font-medium">Imediato</span>,
          },
          { label: 'Proteção', value: 'Cobertura automática' },
          { label: 'Provedor', value: asset.ticker === 'RENDA-USD' ? 'Aave V3 (USDC)' : asset.ticker === 'RENDA-BRL' ? 'Aave V3 (BRZ)' : 'Aave V3 (EURe)' },
        ]} />
      </Stack>

      <Banner
        variant="neutral"
        title="Seu investimento é protegido por cobertura automática"
        description="Em caso de falha técnica, você é reembolsado integralmente."
      />
    </Stack>
  )
}

// ── History Tab ──

const TX_COLOR = {
  buy: 'text-[var(--color-feedback-success)]',
  sell: 'text-[var(--color-feedback-error)]',
  yield: 'text-[var(--color-feedback-info)]',
}

const TX_DOT_BG = {
  buy: 'bg-[var(--color-feedback-success)]',
  sell: 'bg-[var(--color-feedback-error)]',
  yield: 'bg-[var(--color-feedback-info)]',
}

export function HistoryTab({ asset }: { asset: Asset }) {
  const transactions = getMockTransactions(asset.ticker)

  const ICON_MAP = {
    buy: RiArrowDownLine,
    sell: RiArrowUpLine,
    yield: RiPercentLine,
  }

  // Group transactions by month
  const groups = transactions.reduce<Record<string, Transaction[]>>((acc, tx) => {
    // Extract month from date string like "10 mar 2026"
    const parts = tx.date.split(' ')
    const monthKey = parts.length >= 3 ? `${parts[1]} ${parts[2]}` : tx.date
    if (!acc[monthKey]) acc[monthKey] = []
    acc[monthKey].push(tx)
    return acc
  }, {})

  return (
    <Stack gap="default">
      {Object.entries(groups).map(([month, txs]) => (
        <Stack key={month} gap="none">
          <Text variant="caption" color="content-tertiary" className="uppercase px-1 pb-2">{month}</Text>
          {txs.map((tx: Transaction) => {
            const Icon = ICON_MAP[tx.type]
            return (
              <ListItem
                key={tx.id}
                title={
                  <Stack direction="row" gap="sm" align="center">
                    <span className={`inline-block w-2 h-2 rounded-full ${TX_DOT_BG[tx.type]}`} />
                    <span>{tx.title}</span>
                  </Stack>
                }
                subtitle={tx.status === 'processing' ? 'Processando...' : tx.date}
                left={<Avatar icon={<Icon size={20} />} size="md" />}
                right={
                  <Stack gap="none" align="end">
                    <Text variant="body-sm" className={tx.status === 'processing' ? 'text-content-tertiary' : TX_COLOR[tx.type]}>
                      {tx.amount}
                    </Text>
                    {tx.status === 'processing' && (
                      <Badge variant="warning" size="sm">Processando</Badge>
                    )}
                  </Stack>
                }
                trailing={null}
              />
            )
          })}
        </Stack>
      ))}
    </Stack>
  )
}
