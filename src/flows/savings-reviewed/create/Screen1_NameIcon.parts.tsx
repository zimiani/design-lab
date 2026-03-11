/**
 * Screen-only parts for the caixinha name & icon picker.
 * IconPickerGrid — a tappable icon grid for selecting caixinha icons.
 * Created as screen part because no library component handles icon-grid selection.
 */

import type { RemixiconComponentType } from '@remixicon/react'
import { cn } from '../../../lib/cn'
import type { CaixinhaIconId } from '../shared/data'

interface IconOption {
  id: CaixinhaIconId
  label: string
}

interface IconPickerGridProps {
  icons: readonly IconOption[]
  iconMap: Record<CaixinhaIconId, RemixiconComponentType>
  selected: CaixinhaIconId
  onSelect: (id: CaixinhaIconId) => void
}

export function IconPickerGrid({ icons, iconMap, selected, onSelect }: IconPickerGridProps) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {icons.map((icon) => {
        const IconComp = iconMap[icon.id]
        const isSelected = selected === icon.id
        return (
          <button
            key={icon.id}
            type="button"
            onClick={() => onSelect(icon.id)}
            className={cn(
              'flex flex-col items-center gap-1.5 py-3 rounded-[var(--token-radius-lg)] border-2 transition-colors cursor-pointer',
              isSelected
                ? 'border-[var(--color-interactive-default)] bg-[var(--color-brand-lime-100)]'
                : 'border-transparent bg-surface-secondary hover:bg-surface-shade'
            )}
          >
            <IconComp
              size={24}
              className={isSelected ? 'text-[var(--color-brand-core-500)]' : 'text-content-tertiary'}
            />
            <span className={cn(
              'text-xs font-medium',
              isSelected ? 'text-[var(--color-brand-core-500)]' : 'text-content-tertiary'
            )}>
              {icon.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
