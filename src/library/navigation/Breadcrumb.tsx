import { registerComponent } from '../registry'

export interface BreadcrumbItem {
  label: string
  onClick?: () => void
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  if (items.length === 0) return null

  return (
    <nav data-component="Breadcrumb" className="flex items-center gap-[var(--token-spacing-8)]">
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        return (
          <span key={i} className="flex items-center gap-[var(--token-spacing-8)]">
            {i > 0 && (
              <span className="text-[length:var(--token-font-size-body-sm)] leading-[var(--token-line-height-body-sm)] text-content-tertiary select-none">
                /
              </span>
            )}
            {isLast ? (
              <span className="text-[length:var(--token-font-size-body-sm)] leading-[var(--token-line-height-body-sm)] text-content-primary font-medium">
                {item.label}
              </span>
            ) : (
              <button
                type="button"
                onClick={item.onClick}
                className="text-[length:var(--token-font-size-body-sm)] leading-[var(--token-line-height-body-sm)] text-content-secondary hover:underline cursor-pointer bg-transparent border-0 p-0 font-normal"
              >
                {item.label}
              </button>
            )}
          </span>
        )
      })}
    </nav>
  )
}

registerComponent({
  name: 'Breadcrumb',
  category: 'navigation',
  description: 'Horizontal navigation trail for desktop. Shows path hierarchy with clickable ancestors and active current page.',
  component: Breadcrumb,
  props: [
    { name: 'items', type: 'BreadcrumbItem[]', required: true, description: 'Breadcrumb trail items — last item is current page' },
  ],
})
