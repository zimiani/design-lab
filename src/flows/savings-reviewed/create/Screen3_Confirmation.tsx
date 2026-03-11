import { RiPlaneLine } from '@remixicon/react'
import type { FlowScreenProps } from '../../../pages/simulator/flowRegistry'
import BaseLayout from '../../../library/layout/BaseLayout'
import StickyFooter from '../../../library/layout/StickyFooter'
import Stack from '../../../library/layout/Stack'
import Header from '../../../library/navigation/Header'
import GroupHeader from '../../../library/navigation/GroupHeader'
import Button from '../../../library/inputs/Button'
import DataList from '../../../library/display/DataList'
import Avatar from '../../../library/display/Avatar'
import Text from '../../../library/foundations/Text'

export default function Screen3_Confirmation({ onNext, onBack, onElementTap }: FlowScreenProps) {
  return (
    <BaseLayout>
      <Header title="" onBack={onBack} />

      <Stack gap="lg">
        <Text variant="heading-lg">Confirme sua caixinha</Text>

        {/* Preview */}
        <Stack gap="sm" align="center">
          <Avatar
            icon={<RiPlaneLine size={32} />}
            size="xl"
            bgColor="var(--color-brand-core-500)"
            iconColor="#ffffff"
          />
          <Text variant="heading-sm">Viagem Europa</Text>
        </Stack>

        <Stack gap="none">
          <GroupHeader text="Detalhes" />
          <DataList data={[
            { label: 'Moeda', value: 'Euro (EUR)' },
            { label: 'Rendimento', value: '3% a.a.' },
            {
              label: 'Resgate',
              value: <span className="text-[var(--color-feedback-success)] font-medium">Imediato</span>,
            },
            { label: 'Proteção', value: 'Seguro incluso' },
          ]} />
        </Stack>
      </Stack>

      <StickyFooter>
        <Button fullWidth onPress={() => {
          const handled = onElementTap?.('Button: Criar caixinha')
          if (!handled) onNext()
        }}>
          Criar caixinha
        </Button>
      </StickyFooter>
    </BaseLayout>
  )
}
