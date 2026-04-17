import type { FlowScreenProps } from '../../pages/simulator/flowRegistry'
import FeedbackLayout from '../../library/layout/FeedbackLayout'
import StickyFooter from '../../library/layout/StickyFooter'
import Stack from '../../library/layout/Stack'
import Button from '../../library/inputs/Button'
import DataList from '../../library/display/DataList'
import Alert from '../../library/display/Alert'
import GroupHeader from '../../library/navigation/GroupHeader'
import Text from '../../library/foundations/Text'

export default function Screen5_Success({ onBack }: FlowScreenProps) {
  return (
    <FeedbackLayout onClose={onBack}>
      <Stack gap="sm">
        <Text variant="display">Sucesso!</Text>
        <Text variant="body-md" color="content-secondary">
          Seu saldo ficará disponível para uso em alguns minutos.
        </Text>
      </Stack>

      <Alert
        variant="neutral"
        title="Você economizou R$20.71"
        description="Valor aproximado de economia em taxas e impostos"
      />

      <Stack gap="none">
        <GroupHeader text="Dados do depósito" />
        <DataList
          data={[
            { label: 'Você pagou', value: 'R$ 545,83' },
            { label: 'Você recebeu', value: 'US$ 100' },
            { label: 'Conversão', value: 'US$ 1 ⇄ R$ 5,43' },
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
