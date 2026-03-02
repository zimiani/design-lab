import type { FlowScreenProps } from '../../pages/simulator/flowRegistry'
import FeedbackLayout from '../../library/layout/FeedbackLayout'
import StickyFooter from '../../library/layout/StickyFooter'
import Stack from '../../library/layout/Stack'
import Button from '../../library/inputs/Button'
import Text from '../../library/foundations/Text'
import DataList from '../../library/display/DataList'
import Banner from '../../library/display/Banner'
import GroupHeader from '../../library/navigation/GroupHeader'

export default function Screen5_Success({ onBack }: FlowScreenProps) {
  return (
    <FeedbackLayout onClose={onBack}>
      <Stack gap="sm">
        <Text variant="display">You're earning!</Text>
        <Text variant="body-md" color="content-secondary">
          Your deposit is now earning 5% APY. Interest accrues daily and is added to your balance automatically.
        </Text>
      </Stack>

      <Banner
        variant="success"
        title="You'll earn ~US$ 25.00 this year"
        description="Based on your current deposit of US$ 500.00"
      />

      <Stack gap="none">
        <GroupHeader text="Deposit summary" />
        <DataList
          data={[
            { label: 'Deposited', value: 'US$ 500.00' },
            { label: 'Yield', value: '5.00% APY' },
            { label: 'Monthly earnings (est.)', value: 'US$ 2.08' },
            { label: 'Next payout', value: 'Tomorrow' },
          ]}
        />
      </Stack>

      <StickyFooter>
        <Stack gap="sm">
          <Button fullWidth onPress={onBack}>
            View my earnings
          </Button>
          <Button fullWidth variant="ghost" onPress={onBack}>
            Back to home
          </Button>
        </Stack>
      </StickyFooter>
    </FeedbackLayout>
  )
}
