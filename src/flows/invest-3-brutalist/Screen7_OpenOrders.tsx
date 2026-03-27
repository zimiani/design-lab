/**
 * Open Orders — neo-brutalist list of active TP/SL orders.
 * Empty state when no orders exist. Hard-bordered cards, no rounded corners.
 * Pure custom Tailwind + inline styles + Framer Motion. NO library components.
 */
import { motion } from 'framer-motion'
import { RiArrowLeftLine, RiInboxLine } from '@remixicon/react'
import type { FlowScreenProps } from '@/pages/simulator/flowRegistry'
import {
  getActiveOrders, getAsset, formatBRL, formatQuantity,
} from './shared/data'
import {
  BG, BG_CARD, BORDER, BORDER_LIGHT, TEXT_PRIMARY, TEXT_SECONDARY, TEXT_TERTIARY,
  GREEN, RED, SAFE_TOP, SAFE_BOTTOM, fadeUp,
} from './shared/theme'
import { listContainer, listItemY, idlePulse } from './shared/animations'

export default function Screen7_OpenOrders({ onBack, onElementTap, onNext }: FlowScreenProps) {
  const orders = getActiveOrders()

  const handleCancelOrder = () => {
    const handled = onElementTap?.('ListItem: Cancelar ordem')
    if (!handled) onNext()
  }

  // ── Empty State ──
  if (orders.length === 0) {
    return (
      <div className="flex flex-col min-h-screen" style={{ background: BG }}>
        <div style={{ height: SAFE_TOP }} />

        {/* Header */}
        <div className="flex items-center gap-3 px-5 pt-3 pb-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="flex items-center justify-center border-none cursor-pointer"
            style={{ width: 36, height: 36, background: BG_CARD, border: `1px solid ${BORDER}` }}
          >
            <RiArrowLeftLine size={20} color={TEXT_PRIMARY} />
          </motion.button>
          <span style={{ color: TEXT_PRIMARY, fontSize: 17, fontWeight: 600 }}>
            Ordens abertas
          </span>
        </div>

        {/* Empty center */}
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          <motion.div
            {...fadeUp(0)}
            {...idlePulse}
            className="flex items-center justify-center mb-5"
            style={{
              width: 72,
              height: 72,
              background: BG_CARD,
              border: `1px solid ${BORDER}`,
            }}
          >
            <RiInboxLine size={32} color={TEXT_TERTIARY} />
          </motion.div>
          <motion.span
            {...fadeUp(0.05)}
            style={{ color: TEXT_SECONDARY, fontSize: 15, fontWeight: 500 }}
          >
            Nenhuma ordem ativa
          </motion.span>
          <motion.span
            {...fadeUp(0.1)}
            className="mt-1.5 text-center max-w-[220px]"
            style={{ color: TEXT_TERTIARY, fontSize: 13, lineHeight: 1.5 }}
          >
            Crie ordens de Take Profit ou Stop Loss na tela de negociação.
          </motion.span>
        </div>

        <div style={{ paddingBottom: SAFE_BOTTOM }} />
      </div>
    )
  }

  // ── Orders List ──
  return (
    <div className="flex flex-col min-h-screen" style={{ background: BG }}>
      <div style={{ height: SAFE_TOP }} />

      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-3 pb-4">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="flex items-center justify-center border-none cursor-pointer"
          style={{ width: 36, height: 36, background: BG_CARD, border: `1px solid ${BORDER}` }}
        >
          <RiArrowLeftLine size={20} color={TEXT_PRIMARY} />
        </motion.button>
        <span style={{ color: TEXT_PRIMARY, fontSize: 17, fontWeight: 600 }}>
          Ordens abertas
        </span>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Section header */}
        <motion.div {...fadeUp(0)} className="flex items-center gap-2.5 px-5 mb-3">
          <span style={{
            color: TEXT_TERTIARY,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: 0.5,
            textTransform: 'uppercase' as const,
          }}>
            Ordens ativas
          </span>
          <span
            className="inline-flex items-center justify-center"
            style={{
              minWidth: 20,
              height: 20,
              padding: '0 6px',
              fontSize: 11,
              fontWeight: 700,
              color: TEXT_PRIMARY,
              background: BG_CARD,
              border: `1px solid ${BORDER_LIGHT}`,
            }}
          >
            {orders.length}
          </span>
        </motion.div>

        {/* Order rows */}
        <motion.div variants={listContainer} initial="hidden" animate="visible" className="flex flex-col gap-2.5 px-5">
          {orders.map((order) => {
            const asset = getAsset(order.asset)
            const isTP = order.type === 'take-profit'
            const dotColor = isTP ? GREEN : RED
            const typeLabel = isTP ? 'Take Profit' : 'Stop Loss'

            return (
              <motion.button
                key={order.id}
                variants={listItemY}
                whileTap={{ scale: 0.97 }}
                onClick={handleCancelOrder}
                className="flex items-center gap-3 w-full rounded-none px-4 py-3.5 border-none cursor-pointer text-left"
                style={{
                  background: BG_CARD,
                  border: `1px solid ${BORDER}`,
                }}
              >
                {/* Color dot + asset icon */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      background: dotColor,
                    }}
                  />
                  <div
                    className="rounded-full overflow-hidden"
                    style={{ width: 24, height: 24 }}
                  >
                    <img
                      src={asset.icon}
                      alt={asset.ticker}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Center: title + date */}
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="truncate" style={{ color: TEXT_PRIMARY, fontSize: 14, fontWeight: 600 }}>
                    {asset.ticker} — {typeLabel}
                  </span>
                  <span style={{ color: TEXT_TERTIARY, fontSize: 12 }}>
                    Criada em {order.createdAt}
                  </span>
                </div>

                {/* Right: trigger price + quantity */}
                <div className="flex flex-col items-end flex-shrink-0">
                  <span style={{ color: TEXT_PRIMARY, fontSize: 14, fontWeight: 600 }}>
                    {formatBRL(order.triggerPrice)}
                  </span>
                  <span style={{ color: TEXT_SECONDARY, fontSize: 11 }}>
                    {formatQuantity(order.quantity, order.asset)}
                  </span>
                </div>
              </motion.button>
            )
          })}
        </motion.div>

        <div style={{ paddingBottom: SAFE_BOTTOM }} />
      </div>
    </div>
  )
}
