import { RiArrowDownLine, RiBuildingLine, RiArrowLeftRightLine } from '@remixicon/react'
import type { FlowScreenProps } from '../../pages/simulator/flowRegistry'
import BaseLayout from '../../library/layout/BaseLayout'
import StickyFooter from '../../library/layout/StickyFooter'
import Stack from '../../library/layout/Stack'
import Header from '../../library/navigation/Header'
import Text from '../../library/foundations/Text'
import Divider from '../../library/foundations/Divider'
import Amount from '../../library/display/Amount'
import Card from '../../library/display/Card'
import Button from '../../library/inputs/Button'

const MOCK_SAVINGS = 12.5

const lineItems = [
  {
    icon: <RiArrowDownLine size={18} className="text-interactive-foreground" />,
    label: 'Taxa cobrada',
    sublabel: 'Spread + câmbio',
    picnic: 'R$ 0,00',
    others: 'R$ 7,50',
  },
  {
    icon: <RiBuildingLine size={18} className="text-interactive-foreground" />,
    label: 'Economia operacional',
    sublabel: 'IOF + tarifas',
    picnic: 'R$ 2,50',
    others: 'R$ 7,50',
  },
  {
    icon: <RiArrowLeftRightLine size={18} className="text-interactive-foreground" />,
    label: 'Custo de conversão',
    sublabel: 'Taxa de câmbio',
    picnic: 'Comercial',
    others: 'Turismo',
  },
]

export default function Screen5_SavingsBreakdown({ onNext, onBack }: FlowScreenProps) {
  return (
    <BaseLayout>
      <Header title="Como calculamos sua economia" onClose={onBack} />

      <Text variant="body-sm" color="content-secondary">
        Veja a comparação do que você paga na Picnic versus a média do mercado para
        conversões de dólar.
      </Text>

      <Stack>
        {/* Comparison header */}
        <div className="flex items-center">
          <div className="flex-1" />
          <div className="w-[80px] text-center">
            <Text variant="caption" color="content-tertiary">Picnic</Text>
          </div>
          <div className="w-[80px] text-center">
            <Text variant="caption" color="content-tertiary">Outros</Text>
          </div>
        </div>

        {/* Line items */}
        <Stack gap="none">
          {lineItems.map((item, i) => (
            <div key={item.label}>
              {i > 0 && <Divider spacing="sm" />}
              <div className="flex items-center py-[var(--token-spacing-12)]">
                <div className="flex items-center gap-[var(--token-spacing-8)] flex-1 min-w-0">
                  {item.icon}
                  <Stack gap="none">
                    <Text variant="body-sm">{item.label}</Text>
                    <Text variant="caption" color="content-tertiary">{item.sublabel}</Text>
                  </Stack>
                </div>
                <div className="w-[80px] text-center">
                  <Text variant="body-sm" className="text-interactive-foreground">{item.picnic}</Text>
                </div>
                <div className="w-[80px] text-center">
                  <Text variant="body-sm" color="content-tertiary">{item.others}</Text>
                </div>
              </div>
            </div>
          ))}
        </Stack>

        <Divider />

        {/* Total savings */}
        <Card variant="flat">
          <div className="flex items-center justify-between">
            <Text variant="body-md">Sua economia</Text>
            <Amount value={MOCK_SAVINGS} size="lg" />
          </div>
        </Card>

        <Text variant="caption" color="content-tertiary" align="center">
          Valores baseados em uma conversão de R$ 250,89 comparando
          com a média de 5 instituições financeiras.
        </Text>
      </Stack>

      <StickyFooter>
        <Button variant="ghost" fullWidth onPress={onNext}>
          Entendi
        </Button>
      </StickyFooter>
    </BaseLayout>
  )
}
