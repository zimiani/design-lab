import type { FlowScreenProps } from '@/pages/simulator/flowRegistry'
import Header from '@/library/navigation/Header'
import BaseLayout from '@/library/layout/BaseLayout'
import StickyFooter from '@/library/layout/StickyFooter'
import Stack from '@/library/layout/Stack'
import Button from '@/library/inputs/Button'
import DataList from '@/library/display/DataList'
import GroupHeader from '@/library/navigation/GroupHeader'
import Alert from '@/library/display/Alert'
import Text from '@/library/foundations/Text'

export default function Screen2_Review({ onNext, onBack, onElementTap }: FlowScreenProps) {
  return (
    <BaseLayout>
      <Header title="" onBack={onBack} />

      <Text variant="h1">Revise os dados</Text>

      <Stack gap="default">
        <Stack gap="none">
          <GroupHeader text="Detalhes da operação" />
          <DataList data={[
              { label: 'Você está guardando', value: 'US$ 100,00' },
            { label: 'Pagamento', value: 'Saldo do Cartão' },
            { label: 'Prazo', value: 'Instantâneo' },
            {
              label: 'Nossa taxa',
              value: (
                <span className="text-[var(--color-feedback-success)] font-medium">Grátis</span>
              ),
            },
          ]} />
        </Stack>

        <Stack gap="none">
          <GroupHeader text="Sobre o rendimento" />
          <DataList data={[
            { label: 'Rendimento atual', value: '5% a.a.' },
            { label: 'Rendimento a partir de', value: 'Hoje' },
            { label: 'Resgate', value: 'A qualquer momento' },
            { label: 'Proteção', value: 'Seguro incluso' },
          ]} />
        </Stack>

        <Alert
          variant="neutral"
          title="Seu saldo começa a render hoje"
          description="O valor depositado entra em rendimento automático no mesmo dia — sem carência e sem burocracia."
        />
      </Stack>

      <StickyFooter>
        <Button fullWidth onPress={() => {
          const handled = onElementTap?.('Button: Confirmar depósito')
          if (!handled) onNext()
        }}>
          Confirmar depósito
        </Button>
      </StickyFooter>
    </BaseLayout>
  )
}
