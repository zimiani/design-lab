/**
 * Screen-only parts for the Asset Page.
 */
import { RiArrowUpLine, RiArrowDownLine, RiLineChartLine } from '@remixicon/react'
import Stack from '@/library/layout/Stack'
import DataList from '@/library/display/DataList'
import Alert from '@/library/display/Alert'
import ListItem from '@/library/display/ListItem'
import Avatar from '@/library/display/Avatar'
import Badge from '@/library/display/Badge'
import Text from '@/library/foundations/Text'
import type { Asset, Position, Transaction } from './shared/data'
import { formatBRL, formatQuantity, formatPercentChange, isVolatile } from './shared/data'

// ── Balance Display (Barlow Condensed) ──

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

// ── Details Tab (Invested) ──

interface DetailsTabProps {
  asset: Asset
  position: Position
}

export function DetailsTab({ asset, position }: DetailsTabProps) {
  const vol = isVolatile(asset)
  const pl = position.currentValue - position.avgCost * position.quantity
  const plPct = (pl / (position.avgCost * position.quantity)) * 100

  return (
    <Stack gap="default">
      <Stack gap="none">
        <DataList
          data={
            vol
              ? [
                  { label: 'Quantidade', value: formatQuantity(position.quantity, position.asset) },
                  { label: 'Custo médio', value: formatBRL(position.avgCost) },
                  {
                    label: 'Resultado',
                    value: (
                      <span className={pl >= 0 ? 'text-[var(--color-feedback-success)]' : 'text-[var(--color-feedback-error)]'}>
                        {formatBRL(pl)} ({formatPercentChange(plPct)})
                      </span>
                    ),
                  },
                  { label: 'Investindo desde', value: position.investedSince },
                ]
              : [
                  { label: 'Rendimento', value: asset.apyDisplay ?? '' },
                  {
                    label: 'Rendeu até agora',
                    value: (
                      <span className="text-[var(--color-feedback-success)]">
                        {formatBRL(position.currentValue - position.avgCost * position.quantity)}
                      </span>
                    ),
                  },
                  { label: 'Investindo desde', value: position.investedSince },
                  {
                    label: 'Resgate',
                    value: <span className="text-[var(--color-feedback-success)] font-medium">Imediato</span>,
                  },
                ]
          }
        />
      </Stack>

      <Alert
        variant="neutral"
        title=""
        description={
          vol
            ? 'Investimentos em ativos voláteis podem resultar em perda parcial ou total do valor investido.'
            : 'Seu investimento é protegido contra riscos operacionais de smart contracts.'
        }
      />
    </Stack>
  )
}

// ── Details Tab (Not Invested) ──

interface InfoTabProps {
  asset: Asset
}

export function InfoTab({ asset }: InfoTabProps) {
  const vol = isVolatile(asset)

  return (
    <Stack gap="default">
      <DataList
        data={
          vol
            ? [
                { label: 'Capitalização', value: asset.marketCap ?? '—' },
                { label: 'Volume 24h', value: asset.volume24h ?? '—' },
                ...(asset.network ? [{ label: 'Rede', value: asset.network }] : []),
              ]
            : [
                { label: 'Rendimento', value: asset.apyDisplay ?? '' },
                {
                  label: 'Resgate',
                  value: <span className="text-[var(--color-feedback-success)] font-medium">Imediato</span>,
                },
              ]
        }
      />

      <Alert
        variant="neutral"
        title=""
        description={
          vol
            ? 'Investimentos em ativos voláteis podem resultar em perda parcial ou total do valor investido.'
            : 'Seu investimento é protegido contra riscos operacionais de smart contracts.'
        }
      />
    </Stack>
  )
}

// ── History Tab ──

interface HistoryTabProps {
  transactions: Transaction[]
}

export function HistoryTab({ transactions }: HistoryTabProps) {
  if (transactions.length === 0) {
    return (
      <Stack gap="sm" className="items-center py-8">
        <Text variant="body-md" color="content-tertiary">Nenhuma transação ainda</Text>
      </Stack>
    )
  }

  return (
    <Stack gap="none">
      {transactions.map((tx) => {
        const Icon = tx.type === 'sell' ? RiArrowUpLine : tx.type === 'yield' ? RiLineChartLine : RiArrowDownLine
        return (
          <ListItem
            key={tx.id}
            title={tx.title}
            subtitle={tx.status === 'processing' ? 'Processando...' : tx.date}
            left={<Avatar icon={<Icon size={20} />} size="md" />}
            right={
              <Stack gap="none" align="end">
                <Text variant="body-sm" className={tx.status === 'processing' ? 'text-content-tertiary' : ''}>
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
  )
}
