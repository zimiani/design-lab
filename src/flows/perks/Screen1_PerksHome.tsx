import { RiSparklingLine, RiArrowRightLine } from '@remixicon/react'
import type { FlowScreenProps } from '../../pages/simulator/flowRegistry'
import FeatureLayout from '../../library/layout/FeatureLayout'
import StickyFooter from '../../library/layout/StickyFooter'
import Stack from '../../library/layout/Stack'
import Text from '../../library/foundations/Text'
import Badge from '../../library/display/Chip'
import Button from '../../library/inputs/Button'
import Summary from '../../library/display/Summary'
import Alert from '../../library/display/Alert'

export default function Screen1_PerksHome({ onNext, onBack }: FlowScreenProps) {
  return (
    <FeatureLayout
      imageSrc="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=400&fit=crop&q=80"
      imageAlt="Picnic benefits"
      onClose={onBack}
      imageOverlay={
        <Badge variant="positive" icon={<RiSparklingLine size={16} />}>Benefícios</Badge>
      }
    >
      <Stack gap="sm">
        <Text variant="display">
          Cliente Picnic tem mais benefícios!
        </Text>
        <Text variant="body-md" color="content-secondary">
          Dólar mais barato, cashback exclusivo, indicações que rendem e muito mais.
        </Text>
      </Stack>

      <Summary
        header="Suas vantagens"
        data={[
          { icon: <RiSparklingLine size={24} className="text-content-primary" />, title: 'Dólar mais barato', description: 'Converta sem taxas nem spread cambial' },
          { icon: <RiSparklingLine size={24} className="text-content-primary" />, title: 'Cashback em cripto', description: 'Receba de volta parte do que gastar' },
          { icon: <RiSparklingLine size={24} className="text-content-primary" />, title: 'Indique e ganhe', description: 'Ganhe recompensas por cada amigo que se cadastrar' },
        ]}
      />

      <Alert
        variant="neutral"
        title="Aproveite todos os benefícios"
        description="Quanto mais você usa o Picnic, mais vantagens desbloqueia."
      />

      <StickyFooter>
        <Button fullWidth size="lg" onPress={onNext}>
          <span className="flex items-center gap-[var(--token-spacing-8)]">
            Ver mais benefícios
            <RiArrowRightLine size={18} />
          </span>
        </Button>
      </StickyFooter>
    </FeatureLayout>
  )
}
