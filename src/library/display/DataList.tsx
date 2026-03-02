import { useState, type ReactNode } from 'react'
import { RiInformationLine, RiFileCopyLine, RiArrowDownSLine } from '@remixicon/react'
import { motion, AnimatePresence } from 'framer-motion'
import { registerComponent } from '../registry'
import { cn } from '../../lib/cn'

export interface DataListBreakdownItem {
  label: string
  value?: string
}

export interface DataListItem {
  label: string
  value: string | ReactNode
  secondaryValue?: string
  info?: string | (() => void)
  copyable?: boolean
  onCopy?: () => void
  breakdown?: DataListBreakdownItem[]
}

export interface DataListProps {
  data: DataListItem[]
  className?: string
}

function BreakdownTimeline({ items }: { items: DataListBreakdownItem[] }) {
  return (
    <div className="flex flex-col mt-[var(--token-spacing-3)]">
      {items.map((item, idx) => (
        <div key={idx} className="flex gap-[var(--token-spacing-3)]">
          {/* Timeline dots and line */}
          <div className="flex flex-col items-center w-[12px] shrink-0">
            <div className="w-[6px] h-[6px] rounded-full bg-[var(--token-neutral-300)] mt-[7px] shrink-0" />
            {idx < items.length - 1 && (
              <div className="w-[1px] flex-1 bg-[var(--token-neutral-200)] my-[2px]" />
            )}
          </div>

          {/* Content */}
          <div className="flex items-center justify-between flex-1 pb-[var(--token-spacing-2)] min-h-[28px]">
            <span className="text-[length:var(--token-font-size-body-sm)] leading-[var(--token-line-height-body-sm)] text-content-tertiary">
              {item.label}
            </span>
            {item.value && (
              <span className="text-[length:var(--token-font-size-body-sm)] leading-[var(--token-line-height-body-sm)] text-content-tertiary">
                {item.value}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function DataListRow({ item, isLast }: { item: DataListItem; isLast: boolean }) {
  const [expanded, setExpanded] = useState(false)
  const hasBreakdown = item.breakdown && item.breakdown.length > 0

  const handleCopy = () => {
    if (item.onCopy) {
      item.onCopy()
    } else if (typeof item.value === 'string') {
      navigator.clipboard.writeText(item.value)
    }
  }

  return (
    <div
      className={cn(
        'w-full border-b border-[var(--token-neutral-100)]',
        isLast && 'border-b-0',
      )}
    >
      <div className="flex items-center justify-between py-[var(--token-spacing-4)]">
        {/* Label side */}
        <div className="flex items-center gap-[var(--token-spacing-1)]">
          <span className="text-[length:var(--token-font-size-body-md)] leading-[var(--token-line-height-body-md)] text-content-secondary">
            {item.label}
          </span>
          {item.info && (
            <button
              type="button"
              onClick={typeof item.info === 'function' ? item.info : undefined}
              className="shrink-0 flex items-center justify-center cursor-pointer bg-transparent border-none p-0"
            >
              <RiInformationLine size={16} className="text-content-tertiary" />
            </button>
          )}
        </div>

        {/* Value side */}
        <div className="flex items-center gap-[var(--token-spacing-2)]">
          <div className="flex flex-col items-end">
            {typeof item.value === 'string' ? (
              <span className="text-[length:var(--token-font-size-body-md)] leading-[var(--token-line-height-body-md)] font-medium text-content-primary tabular-nums">
                {item.value}
              </span>
            ) : (
              item.value
            )}
            {item.secondaryValue && (
              <span className="text-[length:var(--token-font-size-body-sm)] leading-[var(--token-line-height-body-sm)] text-content-tertiary tabular-nums">
                {item.secondaryValue}
              </span>
            )}
          </div>

          {item.copyable && (
            <button
              type="button"
              onClick={handleCopy}
              className="shrink-0 flex items-center justify-center cursor-pointer bg-transparent border-none p-0"
            >
              <RiFileCopyLine size={16} className="text-content-tertiary" />
            </button>
          )}

          {hasBreakdown && (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="shrink-0 flex items-center justify-center cursor-pointer bg-transparent border-none p-0"
            >
              <motion.div
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <RiArrowDownSLine size={18} className="text-content-tertiary" />
              </motion.div>
            </button>
          )}
        </div>
      </div>

      {/* Expandable breakdown */}
      {hasBreakdown && (
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <BreakdownTimeline items={item.breakdown!} />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}

export default function DataList({
  data,
  className = '',
}: DataListProps) {
  return (
    <div data-component="DataList" className={cn('w-full flex flex-col', className)}>
      {data.map((item, idx) => (
        <DataListRow
          key={idx}
          item={item}
          isLast={idx === data.length - 1}
        />
      ))}
    </div>
  )
}

registerComponent({
  name: 'DataList',
  category: 'presentation',
  description: 'Key-value table showing labeled rows with values, optional secondary values, expandable breakdowns, and copy actions. Use for transaction details, card information, and account summary tables.',
  component: DataList,
  props: [
    { name: 'data', type: 'DataListItem[]', required: true, description: 'Array of rows with label, value, optional info/copy/breakdown' },
  ],
})
