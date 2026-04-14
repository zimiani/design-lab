import { registerComponent } from '../registry'

export interface SkeletonProps {
  width?: string
  height?: string
  variant?: 'text' | 'circle' | 'rect'
  className?: string
}

export default function Skeleton({
  width,
  height = '16px',
  variant = 'text',
  className = '',
}: SkeletonProps) {
  const radiusClass =
    variant === 'circle'
      ? 'rounded-[var(--token-radius-full)]'
      : variant === 'rect'
        ? 'rounded-[var(--token-radius-md)]'
        : 'rounded-[var(--token-radius-sm)]'

  const sizeStyle = {
    width: variant === 'circle' ? height : width ?? '100%',
    height,
  }

  return (
    <div
      data-component="Skeleton"
      aria-hidden="true"
      style={sizeStyle}
      className={`animate-pulse bg-neutral-200 ${radiusClass} ${className}`}
    />
  )
}

/* ------------------------------------------------------------------ */
/*  Content-aware skeleton composites                                  */
/*  Mirror the exact layout of the components they replace.           */
/* ------------------------------------------------------------------ */

/**
 * Mirrors a single DataList row: label (left) + value (right), separated by border.
 * Matches DataListRow's py-[16px] + line-height 24px = 56px per row.
 */
function DataListSkeletonRow({ isLast = false, labelWidth = '40%', valueWidth = '30%' }: {
  isLast?: boolean
  labelWidth?: string
  valueWidth?: string
}) {
  return (
    <div
      aria-hidden="true"
      className={`w-full flex items-center justify-between py-[var(--token-spacing-16)] ${isLast ? '' : 'border-b border-[var(--token-neutral-100)]'}`}
    >
      <Skeleton width={labelWidth} height="16px" />
      <Skeleton width={valueWidth} height="16px" />
    </div>
  )
}

export interface DataListSkeletonProps {
  rows?: number
  className?: string
}

/**
 * Mirrors DataList layout with the specified number of rows.
 * Each row matches the exact spacing and height of a real DataListRow.
 */
export function DataListSkeleton({ rows = 3, className = '' }: DataListSkeletonProps) {
  const rowWidths = [
    { label: '45%', value: '35%' },
    { label: '50%', value: '20%' },
    { label: '30%', value: '25%' },
    { label: '35%', value: '30%' },
    { label: '25%', value: '35%' },
  ]

  return (
    <div data-component="DataListSkeleton" aria-busy="true" className={`w-full flex flex-col ${className}`}>
      {Array.from({ length: rows }, (_, i) => {
        const widths = rowWidths[i % rowWidths.length]
        return (
          <DataListSkeletonRow
            key={i}
            isLast={i === rows - 1}
            labelWidth={widths.label}
            valueWidth={widths.value}
          />
        )
      })}
    </div>
  )
}

export interface BannerSkeletonProps {
  className?: string
}

/**
 * Mirrors Banner layout: 32px circle icon + title text, inside p-16px rounded container.
 */
export function BannerSkeleton({ className = '' }: BannerSkeletonProps) {
  return (
    <div
      data-component="BannerSkeleton"
      aria-hidden="true"
      className={`flex gap-[12px] items-center p-[16px] rounded-[12px] w-full bg-neutral-100 ${className}`}
    >
      <Skeleton variant="circle" height="32px" />
      <Skeleton width="70%" height="16px" />
    </div>
  )
}

registerComponent({
  name: 'Skeleton',
  category: 'feedback',
  description: 'Pulsing placeholder for content that is loading. Use the primitive for simple shapes, or the content-aware composites (DataListSkeleton, BannerSkeleton) to mirror exact component layouts and prevent layout shifts.',
  component: Skeleton,
  variants: ['text', 'circle', 'rect'],
  props: [
    { name: 'width', type: 'string', required: false, description: 'Element width' },
    { name: 'height', type: 'string', required: false, defaultValue: '16px', description: 'Element height' },
    { name: 'variant', type: '"text" | "circle" | "rect"', required: false, defaultValue: 'text', description: 'Shape variant' },
  ],
})
