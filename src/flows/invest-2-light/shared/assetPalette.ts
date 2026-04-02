/**
 * OKLCH-based asset color palette.
 * Normalizes raw brand hex colors to perceptually uniform shades
 * so all assets feel equally bright and saturated side by side.
 */
import { ASSET_COLORS } from './data'

// ── Types ──

export interface AssetPalette {
  /** Card backgrounds, CTA buttons — L=0.62, C=0.18 (WCAG AA on white text) */
  bg: string
  /** TokenLogo circles — L=0.55, C=0.20 (deeper, pops on white surfaces) */
  iconBg: string
  /** Sparklines, glows, tint backgrounds — L=0.72, C=0.14 (lighter, less saturated) */
  accent: string
}

// ── sRGB ↔ linear ──

function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

function linearToSrgb(c: number): number {
  return c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055
}

// ── Linear sRGB ↔ Oklab (Björn Ottosson matrices) ──

function linearRgbToOklab(r: number, g: number, b: number): [number, number, number] {
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b
  const s = 0.1701573421 * r + 0.3066697424 * g + 0.5231729065 * b

  const l_ = Math.cbrt(l), m_ = Math.cbrt(m), s_ = Math.cbrt(s)

  return [
    0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
    1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
    0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_,
  ]
}

function oklabToLinearRgb(L: number, a: number, b: number): [number, number, number] {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b

  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3

  // True inverse of the forward sRGB→LMS matrix (computed, not copied)
  return [
    +3.9923600160 * l - 3.2713069648 * m + 0.2789469509 * s,
    -1.1437417183 * l + 2.5559599002 * m - 0.4122181854 * s,
    -0.6280493252 * l - 0.4342707029 * m + 2.0623200467 * s,
  ]
}

// ── Hex ↔ OKLCH pipeline ──

function hexToOklch(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const r = srgbToLinear(parseInt(h.slice(0, 2), 16) / 255)
  const g = srgbToLinear(parseInt(h.slice(2, 4), 16) / 255)
  const b = srgbToLinear(parseInt(h.slice(4, 6), 16) / 255)

  const [L, a, bOk] = linearRgbToOklab(r, g, b)
  const C = Math.hypot(a, bOk)
  const H = Math.atan2(bOk, a) * (180 / Math.PI)
  return [L, C, H < 0 ? H + 360 : H]
}

function oklchToHex(L: number, C: number, H: number): string {
  const hRad = H * (Math.PI / 180)
  const [lr, lg, lb] = oklabToLinearRgb(L, C * Math.cos(hRad), C * Math.sin(hRad))

  const toHex = (v: number) =>
    Math.round(Math.min(1, Math.max(0, linearToSrgb(v))) * 255)
      .toString(16).padStart(2, '0')

  return `#${toHex(lr)}${toHex(lg)}${toHex(lb)}`.toUpperCase()
}

// ── Gamut clamping (binary search on chroma) ──

function isInGamut(L: number, C: number, H: number): boolean {
  const hRad = H * (Math.PI / 180)
  const [r, g, b] = oklabToLinearRgb(L, C * Math.cos(hRad), C * Math.sin(hRad))
  const e = 0.001
  return r >= -e && r <= 1 + e && g >= -e && g <= 1 + e && b >= -e && b <= 1 + e
}

function clampChroma(L: number, targetC: number, H: number): number {
  if (isInGamut(L, targetC, H)) return targetC
  let lo = 0, hi = targetC
  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2
    if (isInGamut(L, mid, H)) lo = mid; else hi = mid
  }
  return lo
}

// ── Palette generation ──

// Apple-inspired approach: preserve each asset's natural hue + lightness character.
// Clamp L to a per-shade range, then maximize chroma within sRGB gamut.
// Warm hues (orange, gold) stay brighter; cool hues (blue, purple) can be deeper.

const SHADE_RANGES = {
  bg:     { Lmin: 0.58, Lmax: 0.75, Loffset: 0,     Cfloor: 0.12 },
  iconBg: { Lmin: 0.52, Lmax: 0.68, Loffset: -0.07, Cfloor: 0.14 },
  accent: { Lmin: 0.72, Lmax: 0.82, Loffset: +0.07, Cfloor: 0.10 },
} as const

// Hue overrides for near-achromatic colors
const HUE_OVERRIDES: Record<string, { hue: number; maxC?: number; forceBg?: string }> = {
  XRP: { hue: 0, maxC: 0, forceBg: '#1A1A1A' },
  KAG: { hue: 55, maxC: 0.08 },
}

function buildPalette(ticker: string, hex: string): AssetPalette {
  const ov = HUE_OVERRIDES[ticker]

  // Force all shades for special-case assets (e.g. XRP → black)
  if (ov?.forceBg) {
    return { bg: ov.forceBg, iconBg: ov.forceBg, accent: '#666666' }
  }

  const [naturalL, naturalC, rawH] = hexToOklch(hex)
  const H = ov?.hue ?? rawH

  const result = {} as Record<string, string>
  for (const [key, range] of Object.entries(SHADE_RANGES)) {
    const baseL = naturalL + range.Loffset
    const L = Math.max(range.Lmin, Math.min(range.Lmax, baseL))
    const targetC = ov?.maxC != null
      ? ov.maxC
      : Math.max(range.Cfloor, naturalC * 1.2)
    result[key] = oklchToHex(L, clampChroma(L, targetC, H), H)
  }
  return result as unknown as AssetPalette
}

// ── Pre-computed map (14 assets × 3 shades = 42 computations, runs once) ──

export const ASSET_PALETTES: Record<string, AssetPalette> = {}

for (const [ticker, hex] of Object.entries(ASSET_COLORS)) {
  ASSET_PALETTES[ticker] = buildPalette(ticker, hex)
}

const FALLBACK: AssetPalette = { bg: '#6366F1', iconBg: '#4F46E5', accent: '#818CF8' }

export function getAssetPalette(ticker: string): AssetPalette {
  return ASSET_PALETTES[ticker] ?? FALLBACK
}
