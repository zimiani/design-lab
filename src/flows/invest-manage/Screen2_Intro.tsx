/**
 * @screen Investments Intro
 * @description Feature onboarding screen introducing the investments section
 */
import type { FlowScreenProps } from '@/pages/simulator/flowRegistry'
import FeatureLayout from '@/library/layout/FeatureLayout'
import Stack from '@/library/layout/Stack'
import Button from '@/library/inputs/Button'
import Text from '@/library/foundations/Text'
import Summary from '@/library/display/Summary'
import Banner from '@/library/display/Banner'
import GroupHeader from '@/library/navigation/GroupHeader'
import { RiBitCoinLine, RiVipCrownLine, RiPercentLine } from '@remixicon/react'

const HERO_IMG = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80'

export default function Screen2_Intro({ onNext, onElementTap }: FlowScreenProps) {
  const handleStart = () => {
    const resolved = onElementTap?.('Button: Começar a investir')
    if (!resolved) onNext()
  }

  return (
    <FeatureLayout
      imageSrc={HERO_IMG}
      imageAlt="Investment charts"
      imageMaxHeight={200}
    >
      <Stack gap="lg">
        <Stack gap="sm">
          <Text variant="display">Seus investimentos em um só lugar</Text>
          <Text variant="body-md" color="content-secondary">
            Criptomoedas, metais preciosos e renda fixa digital — tudo com a simplicidade que você já conhece.
          </Text>
        </Stack>

        <Stack gap="none">
          <GroupHeader text="O que você encontra" />
          <Summary
            data={[
              {
                icon: <RiBitCoinLine size={20} />,
                title: 'Criptomoedas',
                description: 'Bitcoin, Ethereum, Solana e mais',
              },
              {
                icon: <RiVipCrownLine size={20} />,
                title: 'Commodities',
                description: 'Ouro e prata tokenizados',
              },
              {
                icon: <RiPercentLine size={20} />,
                title: 'Renda Fixa Digital',
                description: 'Rendimento automático em dólar, real ou euro',
              },
            ]}
          />
        </Stack>

        <Banner
          variant="neutral"
          description="Investimentos envolvem riscos. Rentabilidade passada não é garantia de resultados futuros."
        />

        <Button fullWidth onPress={handleStart}>
          Começar a investir
        </Button>
      </Stack>
    </FeatureLayout>
  )
}
