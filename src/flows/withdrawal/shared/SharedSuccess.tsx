import type { FlowScreenProps } from '../../../pages/simulator/flowRegistry'
import FeedbackLayout from '../../../library/layout/FeedbackLayout'
import StickyFooter from '../../../library/layout/StickyFooter'
import Stack from '../../../library/layout/Stack'
import Button from '../../../library/inputs/Button'
import DataList from '../../../library/display/DataList'
import GroupHeader from '../../../library/navigation/GroupHeader'
import Text from '../../../library/foundations/Text'

export default function SharedSuccess({ onBack }: FlowScreenProps) {
  return (
    <FeedbackLayout onClose={onBack}>
      <Stack gap="sm">
        <Text variant="display">Saque enviado!</Text>
        <Text variant="body-md" color="content-secondary">
          A transferência será processada e o valor estará disponível em breve.
        </Text>
      </Stack>

      <Stack gap="none">
        <GroupHeader text="Dados do saque" />
        <DataList
          data={[
            { label: 'Destinatário', value: 'Conta Bradesco' },
            { label: 'Valor enviado', value: 'US$ 100,00' },
            { label: 'Valor recebido', value: 'R$ 545,83' },
            { label: 'Taxa', value: 'Grátis' },
          ]}
        />
      </Stack>

      <StickyFooter>
        <Button fullWidth onPress={onBack}>
          Entendi
        </Button>
      </StickyFooter>
    </FeedbackLayout>
  )
}
