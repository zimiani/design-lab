import { RiQrCodeLine, RiBankLine, RiBitCoinLine } from '@remixicon/react'
import type { FlowScreenProps } from '../../pages/simulator/flowRegistry'
import Header from '../../library/navigation/Header'
import BaseLayout from '../../library/layout/BaseLayout'
import Section from '../../library/layout/Section'
import Stack from '../../library/layout/Stack'
import ListItem from '../../library/display/ListItem'
import Avatar from '../../library/display/Avatar'
import Text from '../../library/foundations/Text'

export default function Screen1_AddFunds({ onNext, onBack }: FlowScreenProps) {
  return (
    <BaseLayout>
      <Header title="Add funds" onBack={onBack} />
      <Section title="Choose a deposit method">
        <Stack gap="none">
          <ListItem
            left={<Avatar icon={<RiQrCodeLine size={18} />} size="md" />}
            title="PIX"
            subtitle="Instant transfer"
            right={<Text variant="body-sm" color="content-secondary">Free</Text>}
            onPress={onNext}
          />
          <ListItem
            left={<Avatar icon={<RiBankLine size={18} />} size="md" />}
            title="TED"
            subtitle="Bank transfer, 1-2 business days"
            right={<Text variant="body-sm" color="content-secondary">R$ 8.50</Text>}
          />
          <ListItem
            left={<Avatar icon={<RiBitCoinLine size={18} />} size="md" />}
            title="Crypto"
            subtitle="BTC, ETH, USDC"
            right={<Text variant="body-sm" color="content-secondary">Network fee</Text>}
          />
        </Stack>
      </Section>
    </BaseLayout>
  )
}
