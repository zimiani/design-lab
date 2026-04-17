import type { FlowScreenProps } from '@/pages/simulator/flowRegistry'
import FeatureLayout from '@/library/layout/FeatureLayout'
import Stack from '@/library/layout/Stack'
import Button from '@/library/inputs/Button'
import Text from '@/library/foundations/Text'
import Alert from '@/library/display/Alert'
import Summary from '@/library/display/Summary'
import GroupHeader from '@/library/navigation/GroupHeader'
import { RiBitCoinLine, RiVipCrown2Line, RiPercentLine } from '@remixicon/react'

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
            Invista em cripto, commodities e renda fixa digital. Tudo na sua conta Picnic, sem burocracia.
          </Text>
        </Stack>

        <Stack gap="none">
          <GroupHeader text="O que você encontra" />
          <Summary
            data={[
              {
                icon: <RiBitCoinLine size={20} />,
                title: 'Cripto',
                description: 'Bitcoin, Ethereum, Solana e mais. Potencial de valorização a longo prazo.',
              },
              {
                icon: <RiVipCrown2Line size={20} />,
                title: 'Commodities',
                description: 'Ouro e prata tokenizados. Diversificação em metais preciosos.',
              },
              {
                icon: <RiPercentLine size={20} />,
                title: 'Renda Fixa Digital',
                description: 'Rendimento automático em dólar, real ou euro. Resgate quando quiser.',
              },
            ]}
          />
        </Stack>

        <Alert
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
