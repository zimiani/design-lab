// ── Neo-Brutalist Visual Theme Constants ──
// Bauhaus-inspired: B&W foundation, hard edges, typography-first, no decoration.

export const BG = '#FFFFFF'
export const BG_CARD = '#F2F2F2'
export const BG_CARD_HOVER = '#E8E8E8'
export const BG_GLASS = '#F2F2F2'
export const BORDER = '#1A1A1A'
export const BORDER_LIGHT = '#E0E0E0'
export const TEXT_PRIMARY = '#000000'
export const TEXT_SECONDARY = '#555555'
export const TEXT_TERTIARY = '#999999'
export const TEXT_MUTED = '#CCCCCC'
export const GREEN = '#00D632'
export const ACCENT = '#BFFF00'
export const RED = '#FF3B30'
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

/** Glow background — disabled in brutalist theme */
export const glowBg = (_color: string, _opacity = 0.08) => 'transparent'

/** Glass backdrop — flat, no blur */
export const glass = {
  background: BG_GLASS,
  backdropFilter: 'none',
  WebkitBackdropFilter: 'none',
}
