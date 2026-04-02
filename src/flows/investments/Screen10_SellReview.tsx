import type { FlowScreenProps } from '@/pages/simulator/flowRegistry'
import BaseLayout from '@/library/layout/BaseLayout'
import Header from '@/library/navigation/Header'
import StickyFooter from '@/library/layout/StickyFooter'
import Stack from '@/library/layout/Stack'
import Button from '@/library/inputs/Button'
import DataList from '@/library/display/DataList'
import GroupHeader from '@/library/navigation/GroupHeader'

export default function Screen10_SellReview({ onNext, onBack, onElementTap }: FlowScreenProps) {
  return (
    <BaseLayout>
      <Header title="Confirmar venda" onBack={onBack} />

      <Stack gap="none">
        <GroupHeader text="Resumo da venda" />
        <DataList
          data={[
            { label: 'Ativo', value: 'Bitcoin (BTC)' },
            { label: 'Quantidade', value: '0,00017 BTC' },
            { label: 'Valor estimado', value: 'R$ 100,00' },
            { label: 'Destino', value: 'Saldo Picnic' },
            { label: 'Taxa', value: <span className="text-[var(--color-feedback-success)] font-medium">Grátis</span> },
          ]}
        />
      </Stack>

      <StickyFooter>
        <Button fullWidth onPress={() => {
          const handled = onElementTap?.('Button: Confirmar venda')
          if (!handled) onNext()
        }}>
          Confirmar venda
        </Button>
      </StickyFooter>
    </BaseLayout>
  )
}
