import type { FlowScreenProps } from '@/pages/simulator/flowRegistry'
import FeatureLayout from '@/library/layout/FeatureLayout'
import Stack from '@/library/layout/Stack'
import Button from '@/library/inputs/Button'
import Text from '@/library/foundations/Text'
import Banner from '@/library/display/Banner'
import Summary from '@/library/display/Summary'
import GroupHeader from '@/library/navigation/GroupHeader'
import { RiLineChartLine, RiPercentLine, RiShieldCheckLine } from '@remixicon/react'

export default function Screen1_Intro({ onNext, onElementTap }: FlowScreenProps) {
  return (
    <FeatureLayout
      imageSrc="https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&q=80"
      imageAlt="Investments growth"
    >
      <Stack gap="lg">
        <Stack gap="sm">
          <Text variant="display">Seus investimentos em um só lugar</Text>
          <Text variant="body-md" color="content-secondary">
            Invista em cripto, commodities e renda fixa direto da sua conta Picnic. Simples, seguro e sem burocracia.
          </Text>
        </Stack>

        <Stack gap="none">
          <GroupHeader text="O que você encontra" />
          <Summary
            data={[
              {
                icon: <RiLineChartLine size={20} />,
                title: 'Renda Variável',
                description: 'Cripto e commodities com potencial de valorização',
              },
              {
                icon: <RiPercentLine size={20} />,
                title: 'Renda Fixa',
                description: 'Rendimento automático em dólar, real ou euro',
              },
              {
                icon: <RiShieldCheckLine size={20} />,
                title: 'Proteção',
                description: 'Diversifique e proteja seu patrimônio',
              },
            ]}
          />
        </Stack>

        <Banner
          variant="neutral"
          title="Investimentos envolvem riscos"
          description="Rentabilidade passada não garante retorno futuro. Avalie seu perfil antes de investir."
        />

        <Button fullWidth onPress={() => {
          const handled = onElementTap?.('Button: Começar a investir')
          if (!handled) onNext()
        }}>
          Começar a investir
        </Button>
      </Stack>
    </FeatureLayout>
  )
}
