/**
 * Screen-only parts for the MVP Dashboard — Version B (Visual).
 * Glass-morphism currency cards on a dark gradient canvas.
 */

import { motion } from 'framer-motion'
import { RiArrowRightSLine, RiLock2Line, RiShieldCheckLine } from '@remixicon/react'
import Text from '../../../library/foundations/Text'
import Stack from '../../../library/layout/Stack'
import Badge from '../../../library/display/Badge'
import type { CaixinhaCurrency } from '../../savings-reviewed/shared/data'
import { CURRENCIES, formatCurrency, formatBrlEquivalent } from '../../savings-reviewed/shared/data'

// ── Glass Currency Card ──

interface GlassCurrencyCardProps {
  currency: CaixinhaCurrency
  balance: number
  yieldToday: number
  disabled?: boolean
  onPress?: () => void
  index?: number
}

export function GlassCurrencyCard({ currency, balance, yieldToday, disabled, onPress, index = 0 }: GlassCurrencyCardProps) {
  const curr = CURRENCIES[currency]
  const brlEquiv = formatBrlEquivalent(balance, currency)
  const hasBalance = balance > 0

  const stagger = { delay: 0.1 + index * 0.08, duration: 0.5 }

  if (disabled) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={stagger}
        className="flex items-center gap-3 w-full p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06]"
      >
        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 opacity-40">
          <img src={curr.flagIcon} alt="" className="w-full h-full object-cover" />
        </div>
        <Stack gap="none" className="flex-1 min-w-0">
          <Stack direction="row" gap="sm" align="center">
            <Text variant="body-md" className="font-medium text-white/50">{curr.name}</Text>
            <Badge variant="neutral" size="sm">Em breve</Badge>
          </Stack>
          <Text variant="body-sm" className="text-white/40">{curr.apyDisplay}</Text>
        </Stack>
        <RiLock2Line size={18} className="text-white/35 shrink-0" />
      </motion.div>
    )
  }

  return (
    <motion.button
      type="button"
      onClick={onPress}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={stagger}
      whileTap={{ scale: 0.98 }}
      className="flex items-center gap-3 w-full text-left p-4 rounded-2xl bg-white/[0.08] border border-white/[0.12] backdrop-blur-sm hover:bg-white/[0.12] transition-colors cursor-pointer"
    >
      <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 ring-2 ring-white/20">
        <img src={curr.flagIcon} alt="" className="w-full h-full object-cover" />
      </div>
      <Stack gap="none" className="flex-1 min-w-0">
        <Stack direction="row" gap="sm" align="center">
          <Text variant="body-md" className="font-medium text-white">{curr.name}</Text>
          <Badge variant="positive" size="sm">{curr.apyDisplay}</Badge>
        </Stack>
        {hasBalance ? (
          <>
            <Text variant="body-md" className="font-semibold tabular-nums text-white">
              {formatCurrency(balance, currency)}
            </Text>
            {brlEquiv && (
              <Text variant="caption" className="text-white/60">{brlEquiv}</Text>
            )}
          </>
        ) : (
          <Text variant="body-sm" className="text-white/50">Toque para começar a render</Text>
        )}
      </Stack>
      <Stack gap="none" align="end" className="shrink-0">
        {hasBalance && yieldToday > 0 && (
          <Text variant="caption" className="text-[var(--color-feedback-success)] font-medium tabular-nums">
            +{formatCurrency(yieldToday, currency)}
          </Text>
        )}
        <RiArrowRightSLine size={18} className="text-white/50" />
      </Stack>
    </motion.button>
  )
}

// ── Insurance Pill ──

export function InsurancePill() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.4 }}
      className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.06] border border-white/[0.08]"
    >
      <RiShieldCheckLine size={16} className="text-[var(--color-feedback-success)] shrink-0" />
      <Text variant="caption" className="text-white/70">
        Investimento assegurado — sem custo adicional
      </Text>
    </motion.div>
  )
}
