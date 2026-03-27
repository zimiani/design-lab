// ── Light Visual Theme Constants ──

export const BG = '#FFFFFF'
export const BG_CARD = '#F7F7F8'
export const BG_CARD_HOVER = '#EDEDF0'
export const BG_GLASS = '#F2F2F4'
export const BORDER = '#E5E5EA'
export const BORDER_LIGHT = '#F0F0F2'
export const TEXT_PRIMARY = '#1C1C1E'
export const TEXT_SECONDARY = '#6B6B76'
export const TEXT_TERTIARY = '#9A9AA5'
export const TEXT_MUTED = '#C5C5CD'
export const GREEN = '#059669'
export const RED = '#DC2626'
export const SAFE_TOP = 'var(--safe-area-top)'
export const SAFE_BOTTOM = 'max(var(--safe-area-bottom), 20px)'

/** Framer Motion spring config for elements entering the screen */
export const ENTER_SPRING = { type: 'spring' as const, stiffness: 300, damping: 30 }

/** Staggered fade-up for list items */
export const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay, ease: [0.25, 0.1, 0.25, 1] },
})

/** Glow background style for asset-colored radial gradient */
export const glowBg = (color: string, opacity = 0.08) =>
  `radial-gradient(circle at 50% 0%, ${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`

/** Glass backdrop filter (light: no blur, solid bg) */
export const glass = {
  background: BG_GLASS,
  backdropFilter: 'none',
  WebkitBackdropFilter: 'none',
}
