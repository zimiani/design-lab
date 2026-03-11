/**
 * Screen-only parts for the MVP Dashboard.
 */

import { RiArrowRightSLine, RiLock2Line } from '@remixicon/react'
import Avatar from '../../../library/display/Avatar'
import Badge from '../../../library/display/Badge'
import Text from '../../../library/foundations/Text'
import Stack from '../../../library/layout/Stack'
import type { CaixinhaCurrency } from '../../savings-reviewed/shared/data'
import { CURRENCIES, formatCurrency, formatBrlEquivalent } from '../../savings-reviewed/shared/data'

// ── Currency Card ──

interface CurrencyCardProps {
  currency: CaixinhaCurrency
  balance: number
  yieldToday: number
  disabled?: boolean
  onPress?: () => void
}

export function CurrencyCard({ currency, balance, yieldToday, disabled, onPress }: CurrencyCardProps) {
  const curr = CURRENCIES[currency]
  const brlEquiv = formatBrlEquivalent(balance, currency)
  const hasBalance = balance > 0

  if (disabled) {
    return (
      <div className="flex items-center gap-3 w-full p-4 rounded-[var(--token-radius-lg)] bg-surface-secondary opacity-50">
        <Avatar
          icon={<img src={curr.flagIcon} alt="" className="w-5 h-5 rounded-full object-cover" />}
          size="lg"
        />
        <Stack gap="none" className="flex-1 min-w-0">
          <Stack direction="row" gap="sm" align="center">
            <Text variant="body-md" className="font-medium">{curr.name}</Text>
            <Badge variant="neutral" size="sm">Em breve</Badge>
          </Stack>
          <Text variant="body-sm" color="content-tertiary">{curr.apyDisplay}</Text>
        </Stack>
        <RiLock2Line size={18} className="text-content-tertiary shrink-0" />
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={onPress}
      className="flex items-center gap-3 w-full text-left p-4 rounded-[var(--token-radius-lg)] bg-surface-secondary hover:bg-surface-shade transition-colors cursor-pointer border-2 border-[var(--color-brand-core-100)]"
    >
      <Avatar
        icon={<img src={curr.flagIcon} alt="" className="w-5 h-5 rounded-full object-cover" />}
        size="lg"
        bgColor="var(--color-brand-core-500)"
        iconColor="#ffffff"
      />
      <Stack gap="none" className="flex-1 min-w-0">
        <Stack direction="row" gap="sm" align="center">
          <Text variant="body-md" className="font-medium">{curr.name}</Text>
          <Badge variant="lime" size="sm">{curr.apyDisplay}</Badge>
        </Stack>
        {hasBalance ? (
          <>
            <Text variant="body-md" className="font-semibold tabular-nums">
              {formatCurrency(balance, currency)}
            </Text>
            {brlEquiv && (
              <Text variant="caption" color="content-tertiary">{brlEquiv}</Text>
            )}
          </>
        ) : (
          <Text variant="body-sm" color="content-tertiary">Toque para começar a render</Text>
        )}
      </Stack>
      <Stack gap="none" align="end" className="shrink-0">
        {hasBalance && yieldToday > 0 && (
          <Text variant="caption" className="text-[var(--color-feedback-success)] font-medium tabular-nums">
            +{formatCurrency(yieldToday, currency)}
          </Text>
        )}
        <RiArrowRightSLine size={18} className="text-content-tertiary" />
      </Stack>
    </button>
  )
}
