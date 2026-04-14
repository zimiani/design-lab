/**
 * Receive / Deposit — shows wallet address and QR code for receiving assets.
 */
import { useState } from 'react'
import type { FlowScreenProps } from '@/pages/simulator/flowRegistry'
import BaseLayout from '@/library/layout/BaseLayout'
import Header from '@/library/navigation/Header'
import Stack from '@/library/layout/Stack'
import Text from '@/library/foundations/Text'
import Select from '@/library/inputs/Select'
import DataList from '@/library/display/DataList'
import Banner from '@/library/display/Banner'
import GroupHeader from '@/library/navigation/GroupHeader'

const NETWORK_OPTIONS = [
  { label: 'Ethereum', value: 'ethereum' },
  { label: 'Solana', value: 'solana' },
  { label: 'Bitcoin', value: 'bitcoin' },
]

const NETWORK_LABELS: Record<string, string> = {
  ethereum: 'Ethereum (ERC-20)',
  solana: 'Solana (SPL)',
  bitcoin: 'Bitcoin',
}

const MOCK_ADDRESS = '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b'
const SHORT_ADDRESS = '0x1a2b...9f0e'

export default function Screen1_Receive({ onBack }: FlowScreenProps) {
  const [network, setNetwork] = useState('ethereum')

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(MOCK_ADDRESS)
  }

  return (
    <BaseLayout>
      <Header title="Receber" onBack={onBack} />

      <Stack gap="lg">
        <Stack gap="sm">
          <Text variant="h2">Receba ativos na sua conta Picnic</Text>
          <Text variant="body-md" color="content-secondary">
            Use o endereço abaixo para receber ativos na rede selecionada.
          </Text>
        </Stack>

        <Select
          label="Rede"
          placeholder="Selecionar rede..."
          options={NETWORK_OPTIONS}
          value={network}
          onChange={setNetwork}
        />

        {/* QR Code placeholder */}
        <Stack gap="sm" align="center">
          <div className="w-[200px] h-[200px] rounded-[var(--token-radius-lg)] border-2 border-dashed border-[var(--color-border-default)] flex items-center justify-center bg-[var(--color-surface-secondary)]">
            <Text variant="body-md" color="content-tertiary">QR Code</Text>
          </div>

          {/* Copyable address */}
          <button
            type="button"
            onClick={handleCopyAddress}
            className="px-[var(--token-spacing-12)] py-[var(--token-spacing-8)] rounded-[var(--token-radius-md)] bg-[var(--color-surface-shade)] cursor-pointer border-none"
          >
            <Text variant="body-sm" color="content-secondary">
              {SHORT_ADDRESS}
            </Text>
          </button>
          <Text variant="caption" color="content-tertiary">
            Toque para copiar o endereço completo
          </Text>
        </Stack>

        <Stack gap="none">
          <GroupHeader text="Detalhes" />
          <DataList data={[
            { label: 'Rede', value: NETWORK_LABELS[network] ?? network },
            { label: 'Ativo', value: 'Todos os compatíveis' },
            {
              label: 'Taxa',
              value: <span className="text-[var(--color-feedback-success)] font-medium">Grátis</span>,
            },
          ]} />
        </Stack>

        <Banner
          variant="warning"
          title="Atenção"
          description="Envie apenas ativos compatíveis com a rede selecionada. Ativos enviados em redes incompatíveis podem ser perdidos."
        />
      </Stack>
    </BaseLayout>
  )
}
