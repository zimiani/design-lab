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
      style={sizeStyle}
      className={`animate-pulse bg-neutral-200 ${radiusClass} ${className}`}
    />
  )
}

registerComponent({
  name: 'Skeleton',
  category: 'feedback',
  description: 'Content placeholder with pulse animation.',
  component: Skeleton,
  variants: ['text', 'circle', 'rect'],
  props: [
    { name: 'width', type: 'string', required: false, description: 'Element width' },
    { name: 'height', type: 'string', required: false, defaultValue: '16px', description: 'Element height' },
    { name: 'variant', type: '"text" | "circle" | "rect"', required: false, defaultValue: 'text', description: 'Shape variant' },
  ],
})
