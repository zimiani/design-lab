import { RiCheckLine } from '@remixicon/react'
import type { FlowScreenProps } from '../../pages/simulator/flowRegistry'
import BaseLayout from '../../library/layout/BaseLayout'
import StickyFooter from '../../library/layout/StickyFooter'
import Stack from '../../library/layout/Stack'
import Text from '../../library/foundations/Text'
import Amount from '../../library/display/Amount'
import Button from '../../library/inputs/Button'

export default function Screen5_Confirmed({ onBack }: FlowScreenProps) {
  return (
    <BaseLayout>
      <Stack className="flex-1 items-center justify-center">
        <div className="w-[80px] h-[80px] rounded-full bg-[var(--token-success-light)] flex items-center justify-center">
          <RiCheckLine size={40} className="text-[var(--token-success)]" />
        </div>
        <Stack gap="sm" className="items-center">
          <Text variant="heading-md" align="center">
            Deposit confirmed!
          </Text>
          <Amount value={150} currency="R$" size="lg" />
          <Text variant="body-md" color="content-secondary" align="center">
            Your balance has been updated
          </Text>
          <Text variant="caption" color="content-tertiary" align="center">
            Balance: $ 1,279.30
          </Text>
        </Stack>
      </Stack>

      <StickyFooter>
        <Stack gap="sm">
          <Button fullWidth onPress={onBack}>
            Done
          </Button>
          <Button variant="ghost" fullWidth>
            Share receipt
          </Button>
        </Stack>
      </StickyFooter>
    </BaseLayout>
  )
}
