import { useState } from 'react'
import { RiMoneyDollarCircleLine, RiGroupLine, RiPercentLine, RiStarLine, RiGiftLine } from '@remixicon/react'
import type { FlowScreenProps } from '../../pages/simulator/flowRegistry'
import Header from '../../library/navigation/Header'
import BaseLayout from '../../library/layout/BaseLayout'
import Stack from '../../library/layout/Stack'
import SegmentedControl from '../../library/navigation/SegmentedControl'
import ListItem from '../../library/display/ListItem'
import Badge from '../../library/display/Badge'
import Text from '../../library/foundations/Text'

const highlights = [
  {
    icon: <RiMoneyDollarCircleLine size={20} className="text-interactive-foreground" />,
    title: 'Conversão sem taxas',
    subtitle: 'Converta dólar com o melhor câmbio',
  },
  {
    icon: <RiGroupLine size={20} className="text-interactive-foreground" />,
    title: 'Indique e ganhe',
    subtitle: 'Ganhe $5 a cada amigo indicado',
  },
  {
    icon: <RiPercentLine size={20} className="text-interactive-foreground" />,
    title: 'Programa de Cashback',
    subtitle: 'Receba de volta em todas as compras',
  },
  {
    icon: <RiStarLine size={20} className="text-interactive-foreground" />,
    title: 'Benefícios exclusivos',
    subtitle: 'Acesso a promoções e ofertas especiais',
  },
]

const referrals = [
  {
    icon: <RiGiftLine size={20} className="text-interactive-foreground" />,
    title: 'Indique amigos',
    subtitle: 'Compartilhe seu código e ganhe $5',
    badge: 'Novo',
  },
  {
    icon: <RiGroupLine size={20} className="text-interactive-foreground" />,
    title: 'Seus indicados',
    subtitle: '3 amigos já se cadastraram',
  },
]

export default function Screen2_BenefitsPromos({ onNext, onBack }: FlowScreenProps) {
  const [tabIndex, setTabIndex] = useState(0)

  return (
    <BaseLayout>
      <Header title="Benefícios e Promos" onBack={onBack} />
      <SegmentedControl
        segments={['Destaques', 'Indicações']}
        activeIndex={tabIndex}
        onChange={setTabIndex}
      />

      {tabIndex === 0 ? (
        <Stack gap="none">
          {highlights.map((item, i) => (
            <ListItem
              key={item.title}
              left={item.icon}
              title={item.title}
              subtitle={item.subtitle}
              onPress={i === 0 ? onNext : undefined}
            />
          ))}
        </Stack>
      ) : (
        <Stack>
          <Stack gap="none">
            {referrals.map((item) => (
              <ListItem
                key={item.title}
                left={item.icon}
                title={item.title}
                subtitle={item.subtitle}
                right={item.badge ? <Badge variant="positive" size="sm">{item.badge}</Badge> : undefined}
                onPress={onNext}
              />
            ))}
          </Stack>
          <Text variant="body-sm" color="content-tertiary" align="center">
            Convide amigos e ganhe recompensas a cada cadastro confirmado.
          </Text>
        </Stack>
      )}
    </BaseLayout>
  )
}
