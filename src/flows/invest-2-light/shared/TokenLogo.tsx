/**
 * TokenLogo — renders @web3icons/react mono SVGs (white) inside a round
 * container filled with the asset color. Falls back to <img> for flags.
 */
import {
  TokenBTC, TokenETH, TokenSOL, TokenAAVE, TokenXRP,
  TokenLINK, TokenUSDC, TokenUSDT, TokenDAI, TokenPAXG, TokenKAG,
  TokenAVAX,
} from '@web3icons/react'
import type { IconComponent } from '@web3icons/react'

const SVG_MAP: Record<string, IconComponent> = {
  BTC: TokenBTC,
  ETH: TokenETH,
  SOL: TokenSOL,
  AAVE: TokenAAVE,
  XRP: TokenXRP,
  LINK: TokenLINK,
  USDC: TokenUSDC,
  USDT: TokenUSDT,
  DAI: TokenDAI,
  PAXG: TokenPAXG,
  KAG: TokenKAG,
  AVAX: TokenAVAX,
}

export interface TokenLogoProps {
  ticker: string
  fallbackUrl?: string
  size: number
  color?: string
  className?: string
  variant?: 'mono' | 'branded'
}

/**
 * Round container (bg = asset color) with white mono SVG icon centered inside.
 * Falls back to <img> inside a round container for flags / unknown tickers.
 */
export function TokenLogo({ ticker, fallbackUrl, size, color, className }: TokenLogoProps) {
  const Icon = SVG_MAP[ticker]
  const iconSize = Math.round(size * 0.73)

  if (Icon) {
    return (
      <div
        className={`flex-shrink-0 rounded-full flex items-center justify-center ${className ?? ''}`}
        style={{ width: size, height: size, background: color ?? 'rgba(0,0,0,0.1)' }}
      >
        <Icon size={iconSize} variant="mono" color="#FFFFFF" />
      </div>
    )
  }

  // Fallback: <img> inside round container
  if (fallbackUrl) {
    return (
      <div
        className={`flex-shrink-0 rounded-full overflow-hidden ${className ?? ''}`}
        style={{ width: size, height: size }}
      >
        <img src={fallbackUrl} alt={ticker} className="w-full h-full object-cover" />
      </div>
    )
  }

  // Placeholder
  return (
    <div
      className={`flex-shrink-0 rounded-full ${className ?? ''}`}
      style={{ width: size, height: size, background: 'rgba(0,0,0,0.1)' }}
    />
  )
}

/**
 * Alias — both TokenLogo and TokenLogoCircle now render the same round container.
 */
export const TokenLogoCircle = TokenLogo

/**
 * Bare SVG icon — no container, icon fills the full size.
 * Use for decorative placements where you control the container.
 */
export function TokenIconBare({ ticker, fallbackUrl, size, color = '#FFFFFF', className }: TokenLogoProps) {
  const Icon = SVG_MAP[ticker]
  if (Icon) {
    return <Icon size={size} variant="mono" color={color} className={className} />
  }
  if (fallbackUrl) {
    return <img src={fallbackUrl} alt={ticker} className={className} style={{ width: size, height: size, objectFit: 'cover' }} />
  }
  return null
}

/**
 * Network logo helper for send/receive screens.
 */
const NETWORK_TICKER: Record<string, string> = {
  eth: 'ETH',
  sol: 'SOL',
  btc: 'BTC',
}

export function NetworkLogo({ networkId, fallbackUrl, size, color, className }: {
  networkId: string
  fallbackUrl?: string
  size: number
  color?: string
  className?: string
}) {
  const ticker = NETWORK_TICKER[networkId]
  if (ticker) {
    return <TokenLogo ticker={ticker} size={size} color={color} className={className} />
  }
  return fallbackUrl ? (
    <div
      className={`flex-shrink-0 rounded-full overflow-hidden ${className ?? ''}`}
      style={{ width: size, height: size }}
    >
      <img src={fallbackUrl} alt={networkId} className="w-full h-full object-cover" />
    </div>
  ) : null
}
