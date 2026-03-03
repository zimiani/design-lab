/**
 * Screen-only parts for the Dashboard screen.
 * Do not import from other screens — extract to src/library/ if reused.
 */

import { useRef, useState, useEffect } from 'react'
import {
  RiArrowUpLine,
  RiArrowDownLine,
  RiSendPlaneLine,
  RiBarcodeLine,
  RiEyeLine,
  RiBankCardLine,
} from '@remixicon/react'
import Stack from '../../library/layout/Stack'
import Text from '../../library/foundations/Text'
import Avatar from '../../library/display/Avatar'
import ListItem from '../../library/display/ListItem'
import GroupHeader from '../../library/navigation/GroupHeader'
import ShortcutButton from '../../library/inputs/ShortcutButton'

/* ── BalanceCard ── */

interface BalanceCardProps {
  hidden: boolean
  updating: boolean
}

export function BalanceCard({ hidden, updating }: BalanceCardProps) {
  return (
    <div style={{ position: 'relative', height: 200 }}>
      {/* Depth layer 3 — lime */}
      <div
        style={{
          position: 'absolute',
          top: 8,
          left: 12,
          right: 12,
          height: 180,
          borderRadius: 20,
          background: '#a5f20c',
        }}
      />
      {/* Depth layer 2 — purple */}
      <div
        style={{
          position: 'absolute',
          top: 4,
          left: 6,
          right: 6,
          height: 186,
          borderRadius: 20,
          background: '#9747ff',
        }}
      />
      {/* Main card */}
      <div
        className={updating ? 'animate-pulse' : ''}
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 20,
          background: '#1b1b1b',
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text variant="caption" className="text-[#8a8a8a]">
            Saldo disponível
          </Text>
          <Text variant="caption" className="text-[#8a8a8a]">
            Visa
          </Text>
        </div>

        <div>
          <Text variant="heading-lg" className="text-white">
            {hidden ? 'US$ ••••' : 'US$ 81,72'}
          </Text>
          <Text variant="caption" className="text-[#8a8a8a] mt-1">
            {hidden ? 'Aprox. R$ ••••' : 'Aprox. R$ 445,72'}
          </Text>
        </div>

        {updating && (
          <Text variant="caption" className="text-[#a5f20c] mt-1">
            Processando depósito...
          </Text>
        )}
      </div>
    </div>
  )
}

/* ── QuickActions ── */

interface QuickActionsProps {
  onElementTap?: (label: string) => boolean
}

const quickActionItems = [
  { label: 'Depositar', icon: <RiArrowDownLine size={20} />, variant: 'primary' as const, tapLabel: 'ShortcutButton: Depositar' },
  { label: 'Receber', icon: <RiArrowUpLine size={20} />, variant: 'secondary' as const, tapLabel: 'ShortcutButton: Receber' },
  { label: 'Enviar', icon: <RiSendPlaneLine size={20} />, variant: 'secondary' as const },
  { label: 'Pagar', icon: <RiBarcodeLine size={20} />, variant: 'secondary' as const },
  { label: 'Ver senha', icon: <RiEyeLine size={20} />, variant: 'secondary' as const },
  { label: 'Cartões', icon: <RiBankCardLine size={20} />, variant: 'secondary' as const },
]

export function QuickActions({ onElementTap }: QuickActionsProps) {
  return (
    <div className="-mx-[var(--token-spacing-6)] px-[var(--token-spacing-6)] flex overflow-x-auto gap-8 scrollbar-none">
      {quickActionItems.map((item) => (
        <ShortcutButton
          key={item.label}
          icon={item.icon}
          label={item.label}
          variant={item.variant}
          onPress={item.tapLabel ? () => onElementTap?.(item.tapLabel!) : undefined}
          className="shrink-0"
        />
      ))}
    </div>
  )
}

/* ── PromoCarousel ── */

const promoCards = [
  { title: 'O dólar mais barato do Brasil', description: 'Compre dólar com a menor taxa do mercado.', bg: '#a5f20c', textClass: 'text-[#1b1b1b]' },
  { title: 'Sua conta nos USA', description: 'Conta americana com cartão Visa internacional.', bg: '#9747ff', textClass: 'text-white' },
  { title: 'Converta dólar facilmente', description: 'Conversão instantânea sem taxas escondidas.', bg: '#1b1b1b', textClass: 'text-white' },
]

export function PromoCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const handleScroll = () => {
      const idx = Math.round(el.scrollLeft / el.clientWidth)
      setActiveIndex(idx)
    }
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <Stack gap="sm">
      <div
        ref={scrollRef}
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          gap: 12,
          scrollbarWidth: 'none',
        }}
      >
        {promoCards.map((card) => (
          <div
            key={card.title}
            style={{
              flex: '0 0 85%',
              scrollSnapAlign: 'start',
              borderRadius: 16,
              background: card.bg,
              padding: 20,
              minHeight: 120,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              gap: 4,
            }}
          >
            <Text variant="heading-sm" className={card.textClass}>
              {card.title}
            </Text>
            <Text variant="body-sm" className={`${card.textClass} opacity-80`}>
              {card.description}
            </Text>
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
        {promoCards.map((_, i) => (
          <div
            key={i}
            style={{
              width: activeIndex === i ? 16 : 6,
              height: 6,
              borderRadius: 3,
              background: activeIndex === i ? '#1b1b1b' : '#d4d4d4',
              transition: 'all 0.2s ease',
            }}
          />
        ))}
      </div>
    </Stack>
  )
}

/* ── EarnStatusCard ── */

interface EarnStatusCardProps {
  onPress?: () => void
}

export function EarnStatusCard({ onPress }: EarnStatusCardProps) {
  return (
    <div
      onClick={onPress}
      style={{
        borderRadius: 16,
        background: 'linear-gradient(135deg, #1b1b1b 0%, #2d2d2d 100%)',
        padding: 16,
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Stack gap="sm">
        <Stack direction="row" gap="sm" align="center">
          <Text variant="body-sm" className="text-white font-semibold">Caixinha do Dólar</Text>
          <span
            style={{
              background: '#a5f20c',
              color: '#1b1b1b',
              fontSize: 11,
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: 10,
            }}
          >
            5% a.a.
          </span>
        </Stack>
        <Text variant="heading-sm" className="text-white">US$ 1.243,57</Text>
        <Text variant="caption" className="text-[#a5f20c]">+US$ 0,17 hoje</Text>
      </Stack>
    </div>
  )
}

/* ── TransactionList ── */

interface TransactionListProps {
  hidden: boolean
  onElementTap?: (label: string) => boolean
}

export function TransactionList({ hidden, onElementTap }: TransactionListProps) {
  if (hidden) {
    return (
      <Stack gap="default">
        <Stack direction="row" align="between">
          <Text variant="heading-sm">Histórico</Text>
          <Text variant="body-sm" className="text-[var(--token-interactive-default)]">Ver tudo</Text>
        </Stack>
        <Text variant="body-sm" align="center" className="text-[#8a8a8a] py-6">
          Nenhuma transação
        </Text>
      </Stack>
    )
  }

  return (
    <Stack gap="default">
      <Stack direction="row" align="between">
        <Text variant="heading-sm">Histórico</Text>
        <Text variant="body-sm" className="text-[var(--token-interactive-default)]">Ver tudo</Text>
      </Stack>

      <GroupHeader text="29 maio 2025" />

      <ListItem
        title="Netflix"
        subtitle="Cartão virtual 3436"
        left={
          <Avatar
            size="md"
            icon={<RiArrowUpLine size={16} />}
            bgColor="#fee2e2"
            iconColor="#ef4444"
          />
        }
        right={
          <Stack gap="none" align="end">
            <Text variant="body-sm" className="font-semibold">-US$ 19,27</Text>
            <Text variant="caption" className="text-[#8a8a8a]">R$ 105,02</Text>
          </Stack>
        }
        onPress={() => onElementTap?.('ListItem: Netflix')}
      />

      <ListItem
        title="Depositou fundos"
        subtitle="Transferência Pix"
        left={
          <Avatar
            size="md"
            icon={<RiArrowDownLine size={16} />}
            bgColor="#dcfce7"
            iconColor="#22c55e"
          />
        }
        right={
          <Stack gap="none" align="end">
            <Text variant="body-sm" className="font-semibold text-[#22c55e]">+US$ 100,00</Text>
            <Text variant="caption" className="text-[#8a8a8a]">R$ 545,32</Text>
          </Stack>
        }
      />
    </Stack>
  )
}
