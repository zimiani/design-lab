import type { FlowScreenProps } from '../../../pages/simulator/flowRegistry'
import BaseLayout from '../../../library/layout/BaseLayout'
import Stack from '../../../library/layout/Stack'
import Header from '../../../library/navigation/Header'
import ListItem from '../../../library/display/ListItem'
import Avatar from '../../../library/display/Avatar'
import Badge from '../../../library/display/Badge'
import Text from '../../../library/foundations/Text'
import { CURRENCIES, type CaixinhaCurrency } from '../shared/data'

const CURRENCY_OPTIONS: { code: CaixinhaCurrency; subtitle: string }[] = [
  { code: 'USD', subtitle: 'Rende em dólar com liquidez imediata. Ideal para quem quer proteção cambial.' },
  { code: 'BRL', subtitle: 'Maior rendimento entre as opções. Sem risco de câmbio para brasileiros.' },
  { code: 'EUR', subtitle: 'Diversifique em euro com rendimento automático. Bom para viagens à Europa.' },
]

export default function Screen2_CurrencyPicker({ onNext, onBack, onElementTap }: FlowScreenProps) {
  const handleSelect = (code: CaixinhaCurrency) => {
    const c = CURRENCIES[code]
    const resolved = onElementTap?.(`ListItem: ${c.name}`)
    if (!resolved) onNext()
  }

  return (
    <BaseLayout>
      <Header title="" onBack={onBack} />

      <Stack gap="lg">
        <Stack gap="sm">
          <Text variant="h1">Escolha a moeda</Text>
          <Text variant="body-md" color="content-secondary">
            Cada moeda tem seu próprio rendimento. Você pode criar caixinhas em moedas diferentes.
          </Text>
        </Stack>

        <Stack gap="none">
          {CURRENCY_OPTIONS.map(({ code, subtitle }) => {
            const c = CURRENCIES[code]
            return (
              <ListItem
                key={code}
                title={c.name}
                subtitle={subtitle}
                left={<Avatar src={c.flagIcon} size="md" />}
                right={<Badge variant="positive" size="md">{c.apyDisplay}</Badge>}
                onPress={() => handleSelect(code)}
              />
            )
          })}
        </Stack>
      </Stack>
    </BaseLayout>
  )
}
