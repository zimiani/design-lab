import type { FlowScreenProps } from '../../../pages/simulator/flowRegistry'
import { useScreenData } from '../../../lib/ScreenDataContext'
import FeatureLayout from '../../../library/layout/FeatureLayout'
import Stack from '../../../library/layout/Stack'
import Text from '../../../library/foundations/Text'
import Badge from '../../../library/display/Badge'
import GroupHeader from '../../../library/navigation/GroupHeader'
import Banner from '../../../library/display/Banner'

import { CurrencyCard } from './Screen1_Dashboard.parts'
import { BalanceDisplay } from '../../savings-reviewed/manage/Screen2_Hub.parts'
import { MOCK_FX_TO_BRL, formatBrlEquivalent, formatCurrency } from '../../savings-reviewed/shared/data'

import savingsPiggyHero from '@/assets/images/savings-piggy-hero.png'

interface ScreenData {
  hasBalance?: boolean
  [key: string]: unknown
}

export default function Screen1_Dashboard({ onNext, onElementTap }: FlowScreenProps) {
  const data = useScreenData<ScreenData>()
  const hasBalance = data.hasBalance ?? true

  // USD is the only active currency
  const usdBalance = hasBalance ? 2500.00 : 0
  const usdYield = hasBalance ? 0.34 : 0

  const totalBrl = usdBalance * MOCK_FX_TO_BRL.USD

  const handleTapDolar = () => {
    const resolved = onElementTap?.('CurrencyCard: Dólar americano')
    if (!resolved) onNext()
  }

  return (
    <FeatureLayout
      imageSrc={savingsPiggyHero}
      imageAlt="Savings illustration"
      imageMaxHeight={200}
      imageOverlay={
        <Badge variant="lime" size="md">Seguro incluso</Badge>
      }
    >
      <Stack gap="lg">
        {/* Total balance */}
        <Stack gap="none">
          <Text variant="body-sm" color="content-secondary">Saldo total</Text>
          <BalanceDisplay value={usdBalance} symbol="US$" />
          {totalBrl > 0 && (
            <Text variant="body-sm" color="content-secondary">
              {formatBrlEquivalent(usdBalance, 'USD')}
            </Text>
          )}
          {usdYield > 0 && (
            <Text variant="caption" className="text-[var(--color-feedback-success)] mt-1">
              +{formatCurrency(usdYield, 'USD')} rendendo hoje
            </Text>
          )}
        </Stack>

        {/* Currency cards */}
        <Stack gap="none">
          <GroupHeader text="Suas caixinhas" />
          <Stack gap="sm">
            <CurrencyCard
              currency="USD"
              balance={usdBalance}
              yieldToday={usdYield}
              onPress={handleTapDolar}
            />
            <CurrencyCard currency="EUR" balance={0} yieldToday={0} disabled />
            <CurrencyCard currency="BRL" balance={0} yieldToday={0} disabled />
          </Stack>
        </Stack>

        {/* Insurance callout */}
        <Banner
          variant="neutral"
          title="Investimento assegurado"
          description="Todos os seus investimentos são protegidos contra riscos operacionais de smart contracts. Sem custo adicional."
        />
      </Stack>
    </FeatureLayout>
  )
}
