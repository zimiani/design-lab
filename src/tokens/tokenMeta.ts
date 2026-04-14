/* Token metadata for the token editor UI */

export interface TokenMeta {
  cssVar: string
  label: string
  type: 'color' | 'size' | 'shadow' | 'font' | 'weight'
  defaultValue: string
}

export interface TokenCategory {
  label: string
  group: 'Base Colors' | 'Measures' | 'Typography'
  tokens: TokenMeta[]
}

export interface SemanticTokenMeta {
  cssVar: string      // part after '--color-', e.g. 'action'
  label: string
  defaultBase: string // base token cssVar, e.g. 'brand-500'
}

export interface SemanticCategory {
  label: string
  tokens: SemanticTokenMeta[]
}

export const semanticCategories: SemanticCategory[] = [
  {
    label: 'Surfaces',
    tokens: [
      { cssVar: 'surface-level-0',         label: 'Level 0',         defaultBase: 'neutral-100' },
      { cssVar: 'surface-level-1',         label: 'Level 1',         defaultBase: 'neutral-200' },
      { cssVar: 'surface-level-2',         label: 'Level 2',         defaultBase: 'neutral-300' },
      { cssVar: 'surface-inverse-level-0', label: 'Inverse Level 0', defaultBase: 'brand-black' },
      { cssVar: 'surface-inverse-level-1', label: 'Inverse Level 1', defaultBase: 'neutral-900' },
      { cssVar: 'surface-inverse-level-2', label: 'Inverse Level 2', defaultBase: 'neutral-800' },
      { cssVar: 'surface-items',           label: 'Items',           defaultBase: 'neutral-400' },
    ],
  },
  {
    label: 'Content',
    tokens: [
      { cssVar: 'content-primary',          label: 'Primary',          defaultBase: 'brand-black' },
      { cssVar: 'content-secondary',        label: 'Secondary',        defaultBase: 'neutral-700' },
      { cssVar: 'content-tertiary',         label: 'Tertiary',         defaultBase: 'neutral-600' },
      { cssVar: 'content-inverse-primary',  label: 'Inverse Primary',  defaultBase: 'neutral-100' },
      { cssVar: 'content-inverse-secondary',label: 'Inverse Secondary',defaultBase: 'neutral-300' },
      { cssVar: 'content-inverse-tertiary', label: 'Inverse Tertiary', defaultBase: 'neutral-600' },
    ],
  },
  {
    label: 'Action',
    tokens: [
      { cssVar: 'action',          label: 'Default',  defaultBase: 'brand-500' },
      { cssVar: 'action-accent',   label: 'Accent',   defaultBase: 'brand-400' },
      { cssVar: 'action-disabled', label: 'Disabled', defaultBase: 'neutral-500' },
    ],
  },
  {
    label: 'Border',
    tokens: [
      { cssVar: 'border', label: 'Default', defaultBase: 'neutral-400' },
    ],
  },
  {
    label: 'Feedback',
    tokens: [
      { cssVar: 'feedback-success',         label: 'Success',         defaultBase: 'avocado-600' },
      { cssVar: 'feedback-success-accent',  label: 'Success Accent',  defaultBase: 'avocado-500' },
      { cssVar: 'surface-feedback-success', label: 'Surface Success', defaultBase: 'avocado-100' },
      { cssVar: 'feedback-warning',         label: 'Warning',         defaultBase: 'banana-500' },
      { cssVar: 'feedback-warning-accent',  label: 'Warning Accent',  defaultBase: 'banana-400' },
      { cssVar: 'surface-feedback-warning', label: 'Surface Warning', defaultBase: 'banana-100' },
      { cssVar: 'feedback-error',           label: 'Error',           defaultBase: 'apple-600'  },
      { cssVar: 'feedback-error-accent',    label: 'Error Accent',    defaultBase: 'apple-500'  },
      { cssVar: 'surface-feedback-error',   label: 'Surface Error',   defaultBase: 'apple-50'   },
    ],
  },
]

export const tokenCategories: TokenCategory[] = [
  {
    label: 'Brand Primary',
    group: 'Base Colors',
    tokens: [
      { cssVar: 'brand-white', label: 'White', type: 'color', defaultValue: '#fcfcfc' },
      { cssVar: 'brand-black', label: 'Black', type: 'color', defaultValue: '#1d211a' },
      { cssVar: 'brand-100', label: '100', type: 'color', defaultValue: '#f3fedc' },
      { cssVar: 'brand-200', label: '200', type: 'color', defaultValue: '#e6fdb9' },
      { cssVar: 'brand-300', label: '300', type: 'color', defaultValue: '#d0fc79' },
      { cssVar: 'brand-400', label: '400', type: 'color', defaultValue: '#b2fc1c' },
      { cssVar: 'brand-500', label: '500', type: 'color', defaultValue: '#9ee510' },
      { cssVar: 'brand-600', label: '600', type: 'color', defaultValue: '#86c705' },
      { cssVar: 'brand-700', label: '700', type: 'color', defaultValue: '#6da300' },
      { cssVar: 'brand-800', label: '800', type: 'color', defaultValue: '#4b7000' },
      { cssVar: 'brand-900', label: '900', type: 'color', defaultValue: '#304700' },
    ],
  },
  {
    label: 'Neutral',
    group: 'Base Colors',
    tokens: [
      { cssVar: 'neutral-100', label: '100', type: 'color', defaultValue: '#fafafa' },
      { cssVar: 'neutral-200', label: '200', type: 'color', defaultValue: '#eaefe7' },
      { cssVar: 'neutral-300', label: '300', type: 'color', defaultValue: '#dfe5dc' },
      { cssVar: 'neutral-400', label: '400', type: 'color', defaultValue: '#d2d9cf' },
      { cssVar: 'neutral-500', label: '500', type: 'color', defaultValue: '#c3c8c1' },
      { cssVar: 'neutral-600', label: '600', type: 'color', defaultValue: '#969c93' },
      { cssVar: 'neutral-700', label: '700', type: 'color', defaultValue: '#747a71' },
      { cssVar: 'neutral-800', label: '800', type: 'color', defaultValue: '#52584e' },
      { cssVar: 'neutral-900', label: '900', type: 'color', defaultValue: '#2f362b' },
    ],
  },
  {
    label: 'Avocado (success)',
    group: 'Base Colors',
    tokens: [
      { cssVar: 'avocado-100', label: '100', type: 'color', defaultValue: '#e6fef4' },
      { cssVar: 'avocado-200', label: '200', type: 'color', defaultValue: '#cafce8' },
      { cssVar: 'avocado-300', label: '300', type: 'color', defaultValue: '#8bf9cd' },
      { cssVar: 'avocado-400', label: '400', type: 'color', defaultValue: '#55f6b6' },
      { cssVar: 'avocado-500', label: '500', type: 'color', defaultValue: '#0df296' },
      { cssVar: 'avocado-600', label: '600', type: 'color', defaultValue: '#0bd081' },
      { cssVar: 'avocado-700', label: '700', type: 'color', defaultValue: '#09ae6c' },
      { cssVar: 'avocado-800', label: '800', type: 'color', defaultValue: '#078d57' },
      { cssVar: 'avocado-900', label: '900', type: 'color', defaultValue: '#066b42' },
    ],
  },
  {
    label: 'Banana (warning)',
    group: 'Base Colors',
    tokens: [
      { cssVar: 'banana-100', label: '100', type: 'color', defaultValue: '#fef8e6' },
      { cssVar: 'banana-200', label: '200', type: 'color', defaultValue: '#fdf0c9' },
      { cssVar: 'banana-300', label: '300', type: 'color', defaultValue: '#fbdf88' },
      { cssVar: 'banana-400', label: '400', type: 'color', defaultValue: '#fad052' },
      { cssVar: 'banana-500', label: '500', type: 'color', defaultValue: '#f7bd08' },
      { cssVar: 'banana-600', label: '600', type: 'color', defaultValue: '#d5a107' },
      { cssVar: 'banana-700', label: '700', type: 'color', defaultValue: '#b28706' },
      { cssVar: 'banana-800', label: '800', type: 'color', defaultValue: '#8f6d04' },
      { cssVar: 'banana-900', label: '900', type: 'color', defaultValue: '#6d5203' },
    ],
  },
  {
    label: 'Apple (error)',
    group: 'Base Colors',
    tokens: [
      { cssVar: 'apple-50',  label: '50',  type: 'color', defaultValue: '#ffe6e6' },
      { cssVar: 'apple-100', label: '100', type: 'color', defaultValue: '#ffc7c7' },
      { cssVar: 'apple-200', label: '200', type: 'color', defaultValue: '#ffa8a8' },
      { cssVar: 'apple-300', label: '300', type: 'color', defaultValue: '#fc8383' },
      { cssVar: 'apple-400', label: '400', type: 'color', defaultValue: '#f25a5a' },
      { cssVar: 'apple-500', label: '500', type: 'color', defaultValue: '#df2020' },
      { cssVar: 'apple-600', label: '600', type: 'color', defaultValue: '#ba2121' },
      { cssVar: 'apple-700', label: '700', type: 'color', defaultValue: '#9a1d1d' },
      { cssVar: 'apple-800', label: '800', type: 'color', defaultValue: '#6f2525' },
      { cssVar: 'apple-900', label: '900', type: 'color', defaultValue: '#541c1c' },
    ],
  },
  {
    label: 'Grape',
    group: 'Base Colors',
    tokens: [
      { cssVar: 'grape-50',  label: '50',  type: 'color', defaultValue: '#f0f4ff' },
      { cssVar: 'grape-100', label: '100', type: 'color', defaultValue: '#d4e1ff' },
      { cssVar: 'grape-200', label: '200', type: 'color', defaultValue: '#b8cbff' },
      { cssVar: 'grape-300', label: '300', type: 'color', defaultValue: '#97b5fc' },
      { cssVar: 'grape-400', label: '400', type: 'color', defaultValue: '#608cfb' },
      { cssVar: 'grape-500', label: '500', type: 'color', defaultValue: '#1a5bff' },
      { cssVar: 'grape-600', label: '600', type: 'color', defaultValue: '#1919e5' },
      { cssVar: 'grape-700', label: '700', type: 'color', defaultValue: '#2525b1' },
      { cssVar: 'grape-800', label: '800', type: 'color', defaultValue: '#262682' },
      { cssVar: 'grape-900', label: '900', type: 'color', defaultValue: '#22225e' },
    ],
  },
  {
    label: 'Guava',
    group: 'Base Colors',
    tokens: [
      { cssVar: 'guava-100', label: '100', type: 'color', defaultValue: '#fee6ea' },
      { cssVar: 'guava-200', label: '200', type: 'color', defaultValue: '#fed2d9' },
      { cssVar: 'guava-300', label: '300', type: 'color', defaultValue: '#ffc0cb' },
      { cssVar: 'guava-400', label: '400', type: 'color', defaultValue: '#fab2be' },
      { cssVar: 'guava-500', label: '500', type: 'color', defaultValue: '#f5a3b1' },
      { cssVar: 'guava-600', label: '600', type: 'color', defaultValue: '#d07a89' },
      { cssVar: 'guava-700', label: '700', type: 'color', defaultValue: '#ab5261' },
      { cssVar: 'guava-800', label: '800', type: 'color', defaultValue: '#862939' },
      { cssVar: 'guava-900', label: '900', type: 'color', defaultValue: '#610010' },
    ],
  },
  {
    label: 'Spacing',
    group: 'Measures',
    tokens: [
      { cssVar: 'spacing-0',  label: '0px',  type: 'size', defaultValue: '0px' },
      { cssVar: 'spacing-2',  label: '2px',  type: 'size', defaultValue: '2px' },
      { cssVar: 'spacing-4',  label: '4px',  type: 'size', defaultValue: '4px' },
      { cssVar: 'spacing-8',  label: '8px',  type: 'size', defaultValue: '8px' },
      { cssVar: 'spacing-12', label: '12px', type: 'size', defaultValue: '12px' },
      { cssVar: 'spacing-16', label: '16px', type: 'size', defaultValue: '16px' },
      { cssVar: 'spacing-20', label: '20px', type: 'size', defaultValue: '20px' },
      { cssVar: 'spacing-24', label: '24px', type: 'size', defaultValue: '24px' },
      { cssVar: 'spacing-32', label: '32px', type: 'size', defaultValue: '32px' },
      { cssVar: 'spacing-40', label: '40px', type: 'size', defaultValue: '40px' },
      { cssVar: 'spacing-48', label: '48px', type: 'size', defaultValue: '48px' },
      { cssVar: 'spacing-64', label: '64px', type: 'size', defaultValue: '64px' },
      { cssVar: 'spacing-80', label: '80px', type: 'size', defaultValue: '80px' },
      { cssVar: 'spacing-96', label: '96px', type: 'size', defaultValue: '96px' },
    ],
  },
  {
    label: 'Typography',
    group: 'Typography',
    tokens: [
      { cssVar: 'font-size-display',  label: 'Display',  type: 'size', defaultValue: '42px' },
      { cssVar: 'font-size-h1',       label: 'H1',       type: 'size', defaultValue: '30px' },
      { cssVar: 'font-size-h2',       label: 'H2',       type: 'size', defaultValue: '26px' },
      { cssVar: 'font-size-h3',       label: 'H3',       type: 'size', defaultValue: '18px' },
      { cssVar: 'font-size-h4',       label: 'H4',       type: 'size', defaultValue: '14px' },
      { cssVar: 'font-size-overline', label: 'Overline', type: 'size', defaultValue: '12px' },
      { cssVar: 'font-size-body-lg',  label: 'Body LG',  type: 'size', defaultValue: '18px' },
      { cssVar: 'font-size-body-md',  label: 'Body MD',  type: 'size', defaultValue: '16px' },
      { cssVar: 'font-size-body-sm',  label: 'Body SM',  type: 'size', defaultValue: '14px' },
      { cssVar: 'font-size-caption',  label: 'Caption / XS', type: 'size', defaultValue: '12px' },
    ],
  },
  {
    label: 'Radii',
    group: 'Measures',
    tokens: [
      { cssVar: 'radius-none', label: 'None',       type: 'size', defaultValue: '0px' },
      { cssVar: 'radius-sm',   label: 'Small',      type: 'size', defaultValue: '8px' },
      { cssVar: 'radius-md',   label: 'Medium',     type: 'size', defaultValue: '12px' },
      { cssVar: 'radius-lg',   label: 'Large',      type: 'size', defaultValue: '16px' },
      { cssVar: 'radius-xl',   label: 'Extra Large', type: 'size', defaultValue: '24px' },
      { cssVar: 'radius-full', label: 'Full',       type: 'size', defaultValue: '9999px' },
    ],
  },
]
