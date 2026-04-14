/**
 * Caixinha MVP — Version B Dashboard
 *
 * Full dark gradient canvas with oversized balance,
 * glassmorphism currency cards, and animated entrance.
 */

import { motion } from 'framer-motion'
import type { FlowScreenProps } from '../../../pages/simulator/flowRegistry'
import { useScreenData } from '../../../lib/ScreenDataContext'
import Stack from '../../../library/layout/Stack'
import Text from '../../../library/foundations/Text'

import { GlassCurrencyCard, InsurancePill } from './Screen1_Dashboard_B.parts'
import { BalanceDisplay } from '../../savings-reviewed/manage/Screen2_Hub.parts'
import { MOCK_FX_TO_BRL, formatBrlEquivalent, formatCurrency } from '../../savings-reviewed/shared/data'

import savingsPiggyHero from '@/assets/images/savings-piggy-hero.png'

interface ScreenData {
  hasBalance?: boolean
  [key: string]: unknown
}

export default function Screen1_Dashboard_B({ onNext, onElementTap }: FlowScreenProps) {
  const data = useScreenData<ScreenData>()
  const hasBalance = data.hasBalance ?? true

  const usdBalance = hasBalance ? 2500.00 : 0
  const usdYield = hasBalance ? 0.34 : 0
  const totalBrl = usdBalance * MOCK_FX_TO_BRL.USD

  const handleTapDolar = () => {
    const resolved = onElementTap?.('CurrencyCard: Dólar americano')
    if (!resolved) onNext()
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[var(--color-brand-core-500)]">
      <div className="flex-1 overflow-y-auto">
        {/* Dark green canvas — brand-core-500 is the only shade dark enough for white text */}
        <div
          className="relative min-h-full bg-[var(--color-brand-core-500)]"
        >
          {/* Decorative background elements — low-opacity glows for depth */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute -top-[20%] -right-[30%] w-[80%] h-[80%] rounded-full opacity-[0.12]"
              style={{ background: 'radial-gradient(circle, var(--color-brand-core-100) 0%, transparent 70%)' }}
            />
            <div
              className="absolute -bottom-[10%] -left-[20%] w-[60%] h-[60%] rounded-full opacity-[0.08]"
              style={{ background: 'radial-gradient(circle, var(--color-brand-core-300) 0%, transparent 70%)' }}
            />
          </div>

          {/* Content */}
          <div className="relative px-[var(--token-spacing-24)] pt-[calc(var(--safe-area-top,12px)+16px)] pb-[48px]">
            <Stack gap="lg">
              {/* Hero section — piggy + balance */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center gap-4 pt-4 pb-2"
              >
                {/* Piggy illustration with glow */}
                <div className="relative">
                  <div
                    className="absolute inset-0 blur-3xl opacity-20"
                    style={{ background: 'var(--color-brand-core-100)' }}
                  />
                  <img
                    src={savingsPiggyHero}
                    alt=""
                    className="relative w-[120px] h-[120px] object-contain drop-shadow-2xl"
                  />
                </div>

                {/* Balance */}
                <Stack gap="none" align="center">
                  <Text variant="body-sm" className="text-white/70">Saldo total</Text>
                  <BalanceDisplay value={usdBalance} symbol="US$" inverted />
                  {totalBrl > 0 && (
                    <Text variant="body-sm" className="text-white/60">
                      {formatBrlEquivalent(usdBalance, 'USD')}
                    </Text>
                  )}
                  {usdYield > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                      className="mt-2 px-3 py-1 rounded-full"
                      style={{ backgroundColor: 'color-mix(in srgb, var(--color-feedback-success) 15%, transparent)' }}
                    >
                      <Text variant="caption" className="text-[var(--color-feedback-success)] font-medium">
                        +{formatCurrency(usdYield, 'USD')} rendendo hoje
                      </Text>
                    </motion.div>
                  )}
                </Stack>
              </motion.div>

              {/* Currency cards section */}
              <Stack gap="sm">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  <Text variant="body-sm" className="font-semibold text-white/70 uppercase tracking-widest text-[12px]">
                    Suas caixinhas
                  </Text>
                </motion.div>

                <GlassCurrencyCard
                  currency="USD"
                  balance={usdBalance}
                  yieldToday={usdYield}
                  onPress={handleTapDolar}
                  index={0}
                />
                <GlassCurrencyCard currency="EUR" balance={0} yieldToday={0} disabled index={1} />
                <GlassCurrencyCard currency="BRL" balance={0} yieldToday={0} disabled index={2} />
              </Stack>

              {/* Insurance pill */}
              <div className="flex justify-center">
                <InsurancePill />
              </div>
            </Stack>
          </div>
        </div>
      </div>
    </div>
  )
}
