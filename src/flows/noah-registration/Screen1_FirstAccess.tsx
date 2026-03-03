import { RiPercentLine, RiFlashlightLine, RiTimeLine, RiCalendarEventLine, RiUserSmileLine, RiGroupLine } from '@remixicon/react'
import type { FlowScreenProps } from '../../pages/simulator/flowRegistry'
import FeatureLayout from '../../library/layout/FeatureLayout'
import StickyFooter from '../../library/layout/StickyFooter'
import Stack from '../../library/layout/Stack'
import Button from '../../library/inputs/Button'
import Badge from '../../library/display/Badge'
import Banner from '../../library/display/Banner'
import Summary from '../../library/display/Summary'
import GroupHeader from '../../library/navigation/GroupHeader'
import Text from '../../library/foundations/Text'

const HEADER_IMAGE = 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&h=400&fit=crop'

export default function Screen1_FirstAccess({ onNext, onBack }: FlowScreenProps) {
  return (
    <FeatureLayout
      imageSrc={HEADER_IMAGE}
      imageAlt="US banking illustration"
      onClose={onBack}
      imageOverlay={
        <Badge variant="lime" icon={<RiFlashlightLine size={16} />}>
          Novidade
        </Badge>
      }
    >
      <Stack gap="sm">
        <Text variant="display">Sua conta nos Estados Unidos</Text>
        <Text variant="body-md" color="content-secondary">
          Use o Picnic para receber e enviar dólares para qualquer banco via ACH ou Wire
        </Text>
      </Stack>

      <Summary
        header="Entenda como funciona"
        data={[
          {
            icon: <RiPercentLine size={24} className="text-content-primary" />,
            title: 'Taxa Zero',
            description: 'Você recebe 100% do valor depositado',
          },
          {
            icon: <RiFlashlightLine size={24} className="text-content-primary" />,
            title: 'Realize e receba pagamentos',
            description: 'Pague e receba dólar de contas em sua titularidade ou terceiros',
          },
          {
            icon: <RiTimeLine size={24} className="text-content-primary" />,
            title: 'Entenda os prazos',
            description: 'Varia entre algumas horas até 3 dias úteis dependendo do seu banco',
          },
        ]}
      />

      <Stack gap="none">
        <GroupHeader text="Seus limites" />
        <Summary
          data={[
            {
              icon: <RiCalendarEventLine size={24} className="text-content-primary" />,
              title: 'US$20.000',
              description: 'Limite mensal total',
            },
            {
              icon: <RiUserSmileLine size={24} className="text-content-primary" />,
              title: 'US$10.000 por transação',
              description: 'entre contas em seu nome',
            },
            {
              icon: <RiGroupLine size={24} className="text-content-primary" />,
              title: 'US$5.000 por transação',
              description: 'de ou para contas de terceiros',
            },
          ]}
        />
      </Stack>

      <Banner
        variant="neutral"
        title="Ativação Rápida"
        description="Para liberar seus dados bancários, faremos uma verificação de identidade segura via Noah."
      />

      <StickyFooter>
        <Stack gap="sm">
          <Button fullWidth onPress={onNext}>
            Ativar minha conta em USD
          </Button>
          <Text variant="caption" color="content-tertiary" align="center">
            Ao continuar, você autoriza o compartilhamento{'\n'}de seus dados com a Noah e GnosisPay
          </Text>
        </Stack>
      </StickyFooter>
    </FeatureLayout>
  )
}
