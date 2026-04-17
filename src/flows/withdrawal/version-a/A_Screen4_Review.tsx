import type { FlowScreenProps } from '../../../pages/simulator/flowRegistry'
import Header from '../../../library/navigation/Header'
import BaseLayout from '../../../library/layout/BaseLayout'
import StickyFooter from '../../../library/layout/StickyFooter'
import Stack from '../../../library/layout/Stack'
import Button from '../../../library/inputs/Button'
import ListItem from '../../../library/display/ListItem'
import Avatar from '../../../library/display/Avatar'
import DataList from '../../../library/display/DataList'
import Alert from '../../../library/display/Alert'
import GroupHeader from '../../../library/navigation/GroupHeader'

export default function A_Screen4_Review({ onNext, onBack }: FlowScreenProps) {
  return (
    <BaseLayout>
      <Header title="Revisar saque" onBack={onBack} />

      <ListItem
        title="Conta Bradesco"
        subtitle="PIX: ***456"
        left={<Avatar initials="C" size="md" />}
        trailing={null}
      />

      <Stack gap="none">
        <GroupHeader text="Detalhes da transação" />
        <DataList
          data={[
            { label: 'Valor enviado', value: 'US$ 100,00' },
            { label: 'Valor recebido', value: 'R$ 545,83' },
            { label: 'Câmbio', value: 'US$ 1 ⇄ R$ 5,4583' },
            { label: 'Taxa de saque', value: 'Grátis' },
          ]}
        />
      </Stack>

      <Alert variant="neutral" title="Prazo estimado: 1-2 dias úteis" />

      <StickyFooter>
        <Button fullWidth onPress={onNext}>
          Confirmar saque
        </Button>
      </StickyFooter>
    </BaseLayout>
  )
}
