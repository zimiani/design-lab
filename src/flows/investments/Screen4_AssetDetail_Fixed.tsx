import type { FlowScreenProps } from '@/pages/simulator/flowRegistry'
import { useScreenData } from '@/lib/ScreenDataContext'
import BaseLayout from '@/library/layout/BaseLayout'
import Header from '@/library/navigation/Header'
import StickyFooter from '@/library/layout/StickyFooter'
import Stack from '@/library/layout/Stack'
import Button from '@/library/inputs/Button'
import Text from '@/library/foundations/Text'
import Avatar from '@/library/display/Avatar'
import Badge from '@/library/display/Badge'
import Alert from '@/library/display/Alert'
import DataList from '@/library/display/DataList'
import Summary from '@/library/display/Summary'
import GroupHeader from '@/library/navigation/GroupHeader'
import { RiPercentLine, RiTimeLine, RiShieldCheckLine } from '@remixicon/react'
import type { AssetTicker } from './shared/data'
import { getAsset } from './shared/data'

const PROVIDERS: Record<string, string> = {
  'RENDA-USD': 'Aave V3 (USDC)',
  'RENDA-BRL': 'Aave V3 (BRZ)',
  'RENDA-EUR': 'Aave V3 (EURe)',
}

const CURRENCIES: Record<string, string> = {
  'RENDA-USD': 'Dólar Americano (USDC)',
  'RENDA-BRL': 'Real Brasileiro (BRZ)',
  'RENDA-EUR': 'Euro (EURe)',
}

export default function Screen4_AssetDetail_Fixed({ onNext, onBack, onElementTap }: FlowScreenProps) {
  const { assetTicker } = useScreenData<{ assetTicker?: AssetTicker }>()
  const asset = getAsset(assetTicker ?? 'RENDA-USD')

  return (
    <BaseLayout>
      <Header title={asset.name} onBack={onBack} />

      <Stack gap="sm" align="center">
        <Avatar src={asset.icon} size="lg" />
        <Badge variant="positive" size="md">Renda Fixa</Badge>
        <Text variant="display">{asset.apyDisplay}</Text>
      </Stack>

      <Summary
        data={[
          {
            icon: <RiPercentLine size={20} />,
            title: 'Rendimento automático',
            description: 'Seu saldo rende todos os dias',
          },
          {
            icon: <RiTimeLine size={20} />,
            title: 'Resgate imediato',
            description: 'Retire a qualquer momento',
          },
          {
            icon: <RiShieldCheckLine size={20} />,
            title: 'Proteção',
            description: 'Cobertura inclusa contra falhas técnicas',
          },
        ]}
      />

      <Stack gap="none">
        <GroupHeader text="Detalhes" />
        <DataList
          data={[
            { label: 'Moeda', value: CURRENCIES[asset.ticker] ?? '—' },
            { label: 'Rendimento', value: asset.apyDisplay ?? '—' },
            { label: 'Resgate', value: 'Imediato' },
            { label: 'Proteção', value: 'Cobertura automática' },
            { label: 'Provedor', value: PROVIDERS[asset.ticker] ?? '—' },
          ]}
        />
      </Stack>

      <Alert
        variant="neutral"
        title="Seu investimento é protegido por cobertura automática"
        description="Em caso de falha técnica, você é reembolsado integralmente."
      />

      <StickyFooter>
        <Button fullWidth onPress={() => {
          const handled = onElementTap?.('Button: Investir')
          if (!handled) onNext()
        }}>
          Investir
        </Button>
      </StickyFooter>
    </BaseLayout>
  )
}
