import type { ReactNode } from 'react'
import { registerComponent } from '../registry'
import type { TypographyVariant } from '../../tokens'
import { cn } from '../../lib/cn'

export interface TextProps {
  variant?: TypographyVariant
  bold?: boolean
  color?: string
  align?: 'left' | 'center' | 'right'
  children: ReactNode
  className?: string
  as?: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'label'
}

const variantStyles: Record<TypographyVariant, string> = {
  display:
    'text-[length:var(--token-font-size-display)] leading-[var(--token-line-height-display)] font-semibold tracking-[var(--token-letter-spacing-display)]',
  h1:
    'text-[length:var(--token-font-size-h1)] leading-[var(--token-line-height-h1)] font-semibold tracking-[var(--token-letter-spacing-h1)]',
  h2:
    'text-[length:var(--token-font-size-h2)] leading-[var(--token-line-height-h2)] font-semibold tracking-[var(--token-letter-spacing-h2)]',
  h3:
    'text-[length:var(--token-font-size-h3)] leading-[var(--token-line-height-h3)] font-semibold tracking-[var(--token-letter-spacing-h3)]',
  h4:
    'text-[length:var(--token-font-size-h4)] leading-[var(--token-line-height-h4)] font-semibold tracking-[var(--token-letter-spacing-h4)]',
  overline:
    'text-[length:var(--token-font-size-overline)] leading-[var(--token-line-height-overline)] font-semibold tracking-[var(--token-letter-spacing-overline)] uppercase',
  'body-lg':
    'text-[length:var(--token-font-size-body-lg)] leading-[var(--token-line-height-body-lg)] font-normal tracking-[var(--token-letter-spacing-body-lg)]',
  'body-md':
    'text-[length:var(--token-font-size-body-md)] leading-[var(--token-line-height-body-md)] font-normal tracking-[var(--token-letter-spacing-body-md)]',
  'body-sm':
    'text-[length:var(--token-font-size-body-sm)] leading-[var(--token-line-height-body-sm)] font-normal',
  caption:
    'text-[length:var(--token-font-size-caption)] leading-[var(--token-line-height-caption)] font-normal',
}

const defaultTag: Record<TypographyVariant, TextProps['as']> = {
  display: 'h1',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  overline: 'span',
  'body-lg': 'p',
  'body-md': 'p',
  'body-sm': 'p',
  caption: 'span',
}

/** Extract a stable text ID from children (string content only). */
function deriveTextId(children: ReactNode): string | undefined {
  if (typeof children === 'string') return children
  if (typeof children === 'number') return String(children)
  return undefined
}

export default function Text({
  variant = 'body-md',
  bold = false,
  color,
  align = 'left',
  children,
  className = '',
  as,
}: TextProps) {
  const Tag = as ?? defaultTag[variant] ?? 'p'
  const colorStyle = color ? { color: `var(--token-${color})` } : undefined
  const alignClass =
    align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'

  const textId = deriveTextId(children)

  return (
    <Tag
      data-component="Text"
      data-text-id={textId}
      className={cn(variantStyles[variant], alignClass, bold && 'font-semibold', className)}
      style={colorStyle}
    >
      {children}
    </Tag>
  )
}

registerComponent({
  name: 'Text',
  category: 'foundations-removed',
  description: 'Typography primitive enforcing the type scale. Use for all text content — headings, body, captions.',
  component: Text,
  variants: [
    'display',
    'h1',
    'h2',
    'h3',
    'h4',
    'overline',
    'body-lg',
    'body-md',
    'body-sm',
    'caption',
  ],
  props: [
    { name: 'variant', type: 'TypographyVariant', required: false, defaultValue: 'body-md', description: 'Typography scale variant' },
    { name: 'bold', type: 'boolean', required: false, defaultValue: 'false', description: 'Semibold weight (600) for body emphasis' },
    { name: 'color', type: 'string', required: false, description: 'Token color name (e.g. "text-secondary")' },
    { name: 'align', type: '"left" | "center" | "right"', required: false, defaultValue: 'left', description: 'Text alignment' },
    { name: 'children', type: 'ReactNode', required: true, description: 'Text content' },
    { name: 'as', type: 'HTML tag', required: false, description: 'Override the rendered HTML element' },
  ],
})
