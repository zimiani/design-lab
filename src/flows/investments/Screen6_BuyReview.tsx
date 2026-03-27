import type { FlowScreenProps } from '@/pages/simulator/flowRegistry'
import BaseLayout from '@/library/layout/BaseLayout'
import Header from '@/library/navigation/Header'
import StickyFooter from '@/library/layout/StickyFooter'
import Stack from '@/library/layout/Stack'
import Button from '@/library/inputs/Button'
import DataList from '@/library/display/DataList'
import Banner from '@/library/display/Banner'
import GroupHeader from '@/library/navigation/GroupHeader'

export default function Screen6_BuyReview({ onNext, onBack, onElementTap }: FlowScreenProps) {
  return (
    <BaseLayout>
      <Header title="Confirmar compra" onBack={onBack} />

      <Stack gap="none">
        <GroupHeader text="Resumo da ordem" />
        <DataList
          data={[
            { label: 'Ativo', value: 'Bitcoin (BTC)' },
            { label: 'Quantidade estimada', value: '0,00017 BTC' },
            { label: 'Valor', value: 'R$ 100,00' },
            { label: 'Método', value: 'Saldo Picnic' },
            { label: 'Taxa', value: <span className="text-[var(--color-feedback-success)] font-medium">Grátis</span> },
          ]}
        />
      </Stack>

      <Banner
        variant="neutral"
        title="Ativos de renda variável podem valorizar ou desvalorizar"
        description="O valor final pode variar conforme a cotação no momento da execução."
      />

      <StickyFooter>
        <Button fullWidth onPress={() => {
          const handled = onElementTap?.('Button: Confirmar compra')
          if (!handled) onNext()
        }}>
          Confirmar compra
        </Button>
      </StickyFooter>
    </BaseLayout>
  )
}
