import type { FlowScreenProps } from '../../pages/simulator/flowRegistry'
import Header from '../../library/navigation/Header'
import BaseLayout from '../../library/layout/BaseLayout'
import StickyFooter from '../../library/layout/StickyFooter'
import Stack from '../../library/layout/Stack'
import Button from '../../library/inputs/Button'
import Text from '../../library/foundations/Text'
import DataList from '../../library/display/DataList'
import Alert from '../../library/display/Alert'
import GroupHeader from '../../library/navigation/GroupHeader'
import Amount from '../../library/display/Amount'

export default function Screen3_Review({ onNext, onBack }: FlowScreenProps) {
  return (
    <BaseLayout>
      <Header title="Review" onBack={onBack} />

      <Stack gap="default">
        <Stack gap="sm" align="center">
          <Text variant="body-sm" color="content-secondary">You are depositing</Text>
          <Amount value={500} currency="US$" size="display" />
          <Text variant="body-sm" color="content-secondary">into USD Savings at 5% APY</Text>
        </Stack>

        <Stack gap="none">
          <GroupHeader text="Deposit details" />
          <DataList
            data={[
              { label: 'From', value: 'USD Balance' },
              { label: 'To', value: 'USD Savings (5% APY)' },
              { label: 'Amount', value: 'US$ 500.00' },
              { label: 'Fee', value: 'Free' },
            ]}
          />
        </Stack>

        <Stack gap="none">
          <GroupHeader text="Earnings projection" />
          <DataList
            data={[
              { label: 'Monthly (est.)', value: 'US$ 2.08' },
              { label: 'Yearly (est.)', value: 'US$ 25.00' },
              { label: 'Accrual', value: 'Daily compounding' },
            ]}
          />
        </Stack>

        <Alert
          variant="neutral"
          title="You can withdraw anytime"
          description="There is no lock-up period. Your funds and accrued interest are always available."
        />
      </Stack>

      <StickyFooter>
        <Button fullWidth onPress={onNext}>
          Confirm deposit
        </Button>
      </StickyFooter>
    </BaseLayout>
  )
}
