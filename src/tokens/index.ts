/* ============================================
   Picnic Design Lab — TypeScript Token Constants
   Mirrors tokens.css for use in JS/TS code.
   ============================================ */

/* Base palette — use apenas para definir tokens semânticos. Em componentes, use os semânticos abaixo. */
export const colors = {
  brand: {
    white: '#fcfcfc',
    black: '#1d211a',
    100: '#f3fedc',
    200: '#e6fdb9',
    300: '#d0fc79',
    400: '#b2fc1c',
    500: '#9ee510',
    600: '#86c705',
    700: '#6da300',
    800: '#4b7000',
    900: '#304700',
  },
  neutral: {
    100: '#fafafa',
    200: '#eaefe7',
    300: '#dfe5dc',
    400: '#d2d9cf',
    500: '#c3c8c1',
    600: '#969c93',
    700: '#747a71',
    800: '#52584e',
    900: '#2f362b',
  },
  avocado: {
    100: '#e6fef4',
    200: '#cafce8',
    300: '#8bf9cd',
    400: '#55f6b6',
    500: '#0df296',
    600: '#0bd081',
    700: '#09ae6c',
    800: '#078d57',
    900: '#066b42',
  },
  banana: {
    100: '#fef8e6',
    200: '#fdf0c9',
    300: '#fbdf88',
    400: '#fad052',
    500: '#f7bd08',
    600: '#d5a107',
    700: '#b28706',
    800: '#8f6d04',
    900: '#6d5203',
  },
  apple: {
    50:  '#ffe6e6',
    100: '#ffc7c7',
    200: '#ffa8a8',
    300: '#fc8383',
    400: '#f25a5a',
    500: '#df2020',
    600: '#ba2121',
    700: '#9a1d1d',
    800: '#6f2525',
    900: '#541c1c',
  },
  grape: {
    50:  '#f0f4ff',
    100: '#d4e1ff',
    200: '#b8cbff',
    300: '#97b5fc',
    400: '#608cfb',
    500: '#1a5bff',
    600: '#1919e5',
    700: '#2525b1',
    800: '#262682',
    900: '#22225e',
  },
  guava: {
    100: '#fee6ea',
    200: '#fed2d9',
    300: '#ffc0cb',
    400: '#fab2be',
    500: '#f5a3b1',
    600: '#d07a89',
    700: '#ab5261',
    800: '#862939',
    900: '#610010',
  },
  /* Semantic — use estes em componentes */
  semantic: {
    surfaceLevel0: '#fafafa',
    surfaceLevel1: '#eaefe7',
    surfaceLevel2: '#dfe5dc',
    surfaceInverseLevel0: '#1d211a',
    surfaceInverseLevel1: '#2f362b',
    surfaceInverseLevel2: '#52584e',
    surfaceItems: '#d2d9cf',
    contentPrimary: '#1d211a',
    contentSecondary: '#747a71',
    contentTertiary: '#969c93',
    contentInversePrimary: '#fafafa',
    contentInverseSecondary: '#dfe5dc',
    contentInverseTertiary: '#969c93',
    action: '#9ee510',
    actionAccent: '#b2fc1c',
    actionDisabled: '#c3c8c1',
    border: '#d2d9cf',
    feedbackSuccess: '#0bd081',
    feedbackSuccessAccent: '#0df296',
    surfaceFeedbackSuccess: '#e6fef4',
    feedbackWarning: '#f7bd08',
    feedbackWarningAccent: '#fad052',
    surfaceFeedbackWarning: '#fef8e6',
    feedbackError: '#ba2121',
    feedbackErrorAccent: '#df2020',
    surfaceFeedbackError: '#ffe6e6',
  },
} as const

export const spacing = {
  0: '0px',
  2: '2px',
  4: '4px',
  8: '8px',
  12: '12px',
  16: '16px',
  20: '20px',
  24: '24px',
  32: '32px',
  40: '40px',
  48: '48px',
  64: '64px',
  80: '80px',
  96: '96px',
} as const

export const spacingPadding = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '24px',
  xl: '32px',
} as const

export const spacingGap = {
  xs: '2px',
  sm: '4px',
  md: '8px',
  lg: '16px',
  xl: '32px',
} as const

export const spacingLayout = {
  sm: '8px',
  md: '16px',
  lg: '32px',
} as const

export const typography = {
  display: {
    fontSize: '42px',
    lineHeight: '48px',
    fontWeight: 600,
    letterSpacing: '-2.1px',
  },
  h1: {
    fontSize: '30px',
    lineHeight: '38px',
    fontWeight: 600,
    letterSpacing: '-0.6px',
  },
  h2: {
    fontSize: '26px',
    lineHeight: '32px',
    fontWeight: 600,
    letterSpacing: '-0.39px',
  },
  h3: {
    fontSize: '18px',
    lineHeight: '24px',
    fontWeight: 600,
    letterSpacing: '-0.18px',
  },
  h4: {
    fontSize: '14px',
    lineHeight: '18px',
    fontWeight: 600,
    letterSpacing: '-0.28px',
  },
  overline: {
    fontSize: '12px',
    lineHeight: '18px',
    fontWeight: 600,
    letterSpacing: '-0.28px',
    textTransform: 'uppercase' as const,
  },
  'body-lg': {
    fontSize: '18px',
    lineHeight: '24px',
    fontWeight: 400,
    letterSpacing: '-0.09px',
  },
  'body-md': {
    fontSize: '16px',
    lineHeight: '24px',
    fontWeight: 400,
    letterSpacing: '-0.08px',
  },
  'body-sm': {
    fontSize: '14px',
    lineHeight: '22px',
    fontWeight: 400,
  },
  caption: {
    fontSize: '12px',
    lineHeight: '18px',
    fontWeight: 400,
  },
} as const

export type TypographyVariant = keyof typeof typography

export const radii = {
  none: '0px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  full: '9999px',
} as const

export const shadows = {
  sm: '0px 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0px 4px 12px rgba(0, 0, 0, 0.08)',
  lg: '0px 12px 32px rgba(0, 0, 0, 0.12)',
} as const

export const transitions = {
  fast: '150ms ease-out',
  normal: '200ms ease-out',
  slow: '300ms ease-out',
} as const

export const tokens = {
  colors,
  spacing,
  spacingPadding,
  spacingGap,
  spacingLayout,
  typography,
  radii,
  shadows,
  transitions,
} as const

export type Tokens = typeof tokens

/* CSS variable accessor for runtime token editing */
export function getTokenVar(name: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(`--token-${name}`)
    .trim()
}

export function setTokenVar(name: string, value: string): void {
  document.documentElement.style.setProperty(`--token-${name}`, value)
}

export function resetTokenVar(name: string): void {
  document.documentElement.style.removeProperty(`--token-${name}`)
}

export function resetAllTokens(): void {
  document.documentElement.removeAttribute('style')
}
