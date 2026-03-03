import type { FlowScreenProps } from '../../pages/simulator/flowRegistry'
import FeedbackLayout from '../../library/layout/FeedbackLayout'
import StickyFooter from '../../library/layout/StickyFooter'
import Stack from '../../library/layout/Stack'
import Button from '../../library/inputs/Button'
import Banner from '../../library/display/Banner'
import Text from '../../library/foundations/Text'

export default function Screen2_Success({ onBack }: FlowScreenProps) {
  return (
    <FeedbackLayout onClose={onBack}>
      <Stack gap="sm">
        <Text variant="display">Aguardando pagamento</Text>
        <Text variant="body-md" color="content-secondary">
          Avisaremos quando seu depósito for reconhecido.
        </Text>
      </Stack>

      <Banner
        variant="neutral"
        title="Consulte os prazos com seu banco"
        description="Transferências podem levar até 3 dias úteis a depender do seu banco"
      />

      <StickyFooter>
        <Button fullWidth onPress={onBack}>
          Entendi
        </Button>
      </StickyFooter>
    </FeedbackLayout>
  )
}
