import type { FlowScreenProps } from '../../pages/simulator/flowRegistry'
import { useScreenData } from '../../lib/ScreenDataContext'
import Header from '../../library/navigation/Header'
import BaseLayout from '../../library/layout/BaseLayout'
import StickyFooter from '../../library/layout/StickyFooter'
import Stack from '../../library/layout/Stack'
import Card from '../../library/display/Card'
import Button from '../../library/inputs/Button'
import Text from '../../library/foundations/Text'
import Amount from '../../library/display/Amount'
import Alert from '../../library/display/Alert'
import DataList from '../../library/display/DataList'
import Badge from '../../library/display/Badge'
import LineChart from '../../library/display/LineChart'

// 12-month projected balance at 5% APY compounded monthly, starting at $500
const projectedData = Array.from({ length: 13 }, (_, i) => ({
  time: new Date(2026, i, 1).toISOString(),
  value: Math.round(500 * Math.pow(1 + 0.05 / 12, i) * 100) / 100,
}))

export default function Screen1_Offer({ onNext, onBack }: FlowScreenProps) {
  const { currentBalance = 0 } = useScreenData<{ currentBalance?: number }>()

  return (
    <BaseLayout>
      <Header title="Earn" onBack={onBack} />

      <Stack gap="default">
        {/* Hero card */}
        <Card variant="flat">
          <Stack gap="sm">
            <Stack direction="row" align="between">
              <Text variant="h3">USD Savings</Text>
              <Badge variant="positive">5% APY</Badge>
            </Stack>
            <Text variant="body-sm" color="content-secondary">
              Earn 5% annual yield on your dollar balance. No lock-up, withdraw anytime.
            </Text>
            <Amount value={currentBalance} currency="US$" size="lg" />
          </Stack>
        </Card>

        {/* Yield projection chart */}
        <Card variant="flat">
          <Stack gap="sm">
            <Text variant="caption" color="content-secondary">Projected balance (12 months)</Text>
            <LineChart data={projectedData} variant="area" height={140} />
          </Stack>
        </Card>

        {/* How it works */}
        <Stack gap="sm">
          <Text variant="h3">How it works</Text>
          <DataList
            data={[
              { label: 'Annual yield', value: '5.00% APY' },
              { label: 'Minimum deposit', value: 'US$ 1.00' },
              { label: 'Lock-up period', value: 'None' },
              { label: 'Interest accrual', value: 'Daily' },
              { label: 'Withdrawals', value: 'Instant' },
            ]}
          />
        </Stack>

        <Alert
          variant="neutral"
          title="Your funds are protected"
          description="Deposits are held by our regulated partner and backed by US Treasury bonds."
        />
      </Stack>

      <StickyFooter>
        <Button fullWidth onPress={onNext}>
          Start earning
        </Button>
      </StickyFooter>
    </BaseLayout>
  )
}
