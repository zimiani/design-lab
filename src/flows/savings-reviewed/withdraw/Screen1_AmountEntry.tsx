import { useState, useCallback } from 'react'
import type { FlowScreenProps } from '../../../pages/simulator/flowRegistry'
import { useScreenData } from '../../../lib/ScreenDataContext'
import BaseLayout from '../../../library/layout/BaseLayout'
import StickyFooter from '../../../library/layout/StickyFooter'
import Stack from '../../../library/layout/Stack'
import Header from '../../../library/navigation/Header'
import Button from '../../../library/inputs/Button'
import CurrencyInput from '../../../library/inputs/CurrencyInput'
import DataList from '../../../library/display/DataList'
import Badge from '../../../library/display/Badge'
import Text from '../../../library/foundations/Text'
import {
  type CaixinhaCurrency,
  CURRENCIES,
  formatBrlEquivalent,
} from '../shared/data'

const MOCK_BALANCES: Record<CaixinhaCurrency, number> = {
  USD: 2500.00,
  BRL: 5200.00,
  EUR: 843.57,
}

export default function Screen1_AmountEntry({ onNext, onBack, onElementTap }: FlowScreenProps) {
  const { currency: dataCurrency } = useScreenData<{ currency?: CaixinhaCurrency }>()
  const currency = dataCurrency ?? 'USD'
  const curr = CURRENCIES[currency]
  const balance = MOCK_BALANCES[currency]
  const balanceRaw = Math.round(balance * 100)

  const [amount, setAmount] = useState('')
  const [balanceError, setBalanceError] = useState(false)

  const cents = parseInt(amount || '0', 10)
  const parsedAmount = cents / 100
  const isValid = cents >= 100 && cents <= balanceRaw
  const isOverBalance = cents > balanceRaw

  const brlEquiv = currency !== 'BRL' && parsedAmount > 0 ? formatBrlEquivalent(parsedAmount, currency) : ''

  const handleBalanceTap = useCallback(() => {
    setAmount(balanceRaw.toString())
    setBalanceError(false)
  }, [balanceRaw])

  const handleChange = useCallback((value: string) => {
    setAmount(value)
    const v = parseInt(value || '0', 10)
    setBalanceError(v > balanceRaw)
  }, [balanceRaw])

  const balanceDisplay = `${curr.symbol} ${balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`

  return (
    <BaseLayout>
      <Header title="Resgatar" onClose={onBack} />

      <Stack gap="default">
        <Stack direction="row" gap="sm" align="center" className="justify-center">
          <Badge variant="success" size="sm">Resgate imediato</Badge>
        </Stack>

        <CurrencyInput
          currencySymbol={curr.symbol}
          tokenIcon={curr.flagIcon}
          value={amount}
          onChange={handleChange}
          balance={balanceDisplay}
          onBalanceTap={handleBalanceTap}
          balanceError={isOverBalance || balanceError}
        />

        {brlEquiv && (
          <Text variant="body-sm" color="content-secondary" className="mt-[-8px] pl-1">
            {brlEquiv}
          </Text>
        )}

        <DataList data={[
          { label: 'Destino', value: 'Saldo do Cartão' },
          { label: 'Taxa', value: 'Grátis' },
          {
            label: 'Prazo',
            value: <span className="text-[var(--color-feedback-success)] font-medium">Imediato</span>,
          },
        ]} />
      </Stack>

      <StickyFooter>
        <Button fullWidth disabled={!isValid} onPress={() => {
          const handled = onElementTap?.('Button: Continuar')
          if (!handled) onNext()
        }}>
          Continuar
        </Button>
      </StickyFooter>
    </BaseLayout>
  )
}
