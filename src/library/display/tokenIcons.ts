const BASE = 'https://coin-images.coingecko.com/coins/images'

export const tokenIcons = {
  BTC: `${BASE}/1/large/bitcoin.png`,
  ETH: `${BASE}/279/large/ethereum.png`,
  USDC: `${BASE}/6319/large/usdc.png`,
  USDT: `${BASE}/325/large/tether.png`,
  SOL: `${BASE}/4128/large/solana.png`,
  BNB: `${BASE}/825/large/bnb.png`,
  XRP: `${BASE}/44/large/xrp.png`,
  ADA: `${BASE}/975/large/cardano.png`,
  DOGE: `${BASE}/5/large/dogecoin.png`,
  AVAX: `${BASE}/12559/large/Avalanche_Circle_RedWhite_Trans.png`,
  DOT: `${BASE}/12171/large/polkadot.png`,
  MATIC: `${BASE}/4713/large/polygon.png`,
  LINK: `${BASE}/877/large/Chainlink_Logo_500.png`,
  UNI: `${BASE}/12504/large/uniswap.png`,
  AAVE: `${BASE}/12645/large/aave.png`,
  DAI: `${BASE}/9956/large/dai.png`,
  SUSHI: `${BASE}/12271/large/sushi.png`,
  CRV: `${BASE}/12124/large/curve.png`,
  ARB: `${BASE}/16547/large/arb.png`,
  OP: `${BASE}/25244/large/optimism.png`,
} as const

export type TokenSymbol = keyof typeof tokenIcons

export function getTokenIcon(symbol: string): string | undefined {
  return tokenIcons[symbol.toUpperCase() as TokenSymbol]
}
