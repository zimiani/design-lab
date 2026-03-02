/**
 * Screen-only parts for Screen1_AmountEntry.
 * Do not import from other screens — extract to src/library/ if reuse is needed.
 */

import Stack from '../../library/layout/Stack'
import BottomSheet from '../../library/layout/BottomSheet'
import ListItem from '../../library/display/ListItem'
import Avatar from '../../library/display/Avatar'

interface PaymentMethod {
  id: string
  title: string
  subtitle: string
  icon: string
}

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'brl',
    title: 'Real Brasileiro',
    subtitle: 'Pague de sua conta bancária com Pix',
    icon: 'https://flagcdn.com/w80/br.png',
  },
  {
    id: 'usd',
    title: 'Dólar Americano',
    subtitle: 'Pague de sua conta americana com transferência ACH',
    icon: 'https://flagcdn.com/w80/us.png',
  },
  {
    id: 'eur',
    title: 'Euro',
    subtitle: 'Pague de sua conta internacional com SEPA',
    icon: 'https://flagcdn.com/w80/eu.png',
  },
  {
    id: 'crypto',
    title: 'Criptomoedas',
    subtitle: 'Transferência via carteira ou corretora',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/128px-Bitcoin.svg.png',
  },
]

export function getPaymentMethods() {
  return PAYMENT_METHODS
}

export function PaymentMethodSheet({
  open,
  onClose,
  onSelect,
}: {
  open: boolean
  onClose: () => void
  onSelect: (id: string) => void
}) {
  return (
    <BottomSheet open={open} onClose={onClose} title="Como quer pagar?">
      <Stack gap="none">
        {PAYMENT_METHODS.map((method) => (
          <ListItem
            key={method.id}
            title={method.title}
            subtitle={method.subtitle}
            left={<Avatar src={method.icon} size="md" />}
            onPress={() => onSelect(method.id)}
          />
        ))}
      </Stack>
    </BottomSheet>
  )
}
