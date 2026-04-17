/**
 * Send / Withdraw — form for sending crypto to an external wallet.
 */
import { useState } from 'react'
import type { FlowScreenProps } from '@/pages/simulator/flowRegistry'
import BaseLayout from '@/library/layout/BaseLayout'
import StickyFooter from '@/library/layout/StickyFooter'
import Header from '@/library/navigation/Header'
import Stack from '@/library/layout/Stack'
import TextInput from '@/library/inputs/TextInput'
import CurrencyInput from '@/library/inputs/CurrencyInput'
import Select from '@/library/inputs/Select'
import DataList from '@/library/display/DataList'
import Alert from '@/library/display/Alert'
import GroupHeader from '@/library/navigation/GroupHeader'
import Button from '@/library/inputs/Button'

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

export default function Screen1_Send({ onBack, onNext, onElementTap }: FlowScreenProps) {
  const [address, setAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [network, setNetwork] = useState('ethereum')

  const parsedAmount = parseInt(amount || '0', 10) / 100
  const isValid = address.length > 5 && parsedAmount > 0

  return (
    <BaseLayout>
      <Header title="Enviar" onBack={onBack} />

      <Stack gap="default">
        <TextInput
          label="Endereço de destino"
          placeholder="0x..."
          value={address}
          onChange={setAddress}
        />

        <CurrencyInput
          label="Valor"
          value={amount}
          onChange={setAmount}
          currencySymbol="US$"
          tokenIcon="https://assets.coingecko.com/coins/images/6319/small/usdc.png"
          balance="US$ 1.144,00"
        />

        <Select
          label="Rede"
          placeholder="Selecionar rede..."
          options={NETWORK_OPTIONS}
          value={network}
          onChange={setNetwork}
        />

        <Stack gap="none">
          <GroupHeader text="Resumo" />
          <DataList data={[
            { label: 'Rede', value: NETWORK_LABELS[network] ?? network },
            { label: 'Taxa estimada', value: 'US$ 2,50' },
            { label: 'Tempo estimado', value: '~5 minutos' },
          ]} />
        </Stack>

        <Alert
          variant="neutral"
          title="Verifique o endereço"
          description="Verifique o endereço antes de enviar. Transações são irreversíveis."
        />
      </Stack>

      <StickyFooter>
        <Button fullWidth disabled={!isValid} onPress={() => {
          const handled = onElementTap?.('Button: Enviar')
          if (!handled) onNext()
        }}>
          Enviar
        </Button>
      </StickyFooter>
    </BaseLayout>
  )
}
