// ── Dark Visual Theme Constants ──

export const BG = '#0a0a0f'
export const BG_CARD = 'rgba(255,255,255,0.04)'
export const BG_CARD_HOVER = 'rgba(255,255,255,0.07)'
export const BG_GLASS = 'rgba(255,255,255,0.06)'
export const BORDER = 'rgba(255,255,255,0.06)'
export const BORDER_LIGHT = 'rgba(255,255,255,0.04)'
export const TEXT_PRIMARY = '#ffffff'
export const TEXT_SECONDARY = 'rgba(255,255,255,0.60)'
export const TEXT_TERTIARY = 'rgba(255,255,255,0.40)'
export const TEXT_MUTED = 'rgba(255,255,255,0.25)'
export const GREEN = '#34D399'
export const RED = '#F87171'
export const SAFE_TOP = 'var(--safe-area-top)'
export const SAFE_BOTTOM = 'max(var(--safe-area-bottom), 20px)'

/** Framer Motion spring config for elements entering the screen */
export const ENTER_SPRING = { type: 'spring' as const, stiffness: 300, damping: 30 }

/** Staggered fade-up for list items */
export const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
})

/** Glow background style for asset-colored radial gradient */
export const glowBg = (color: string, opacity = 0.15) =>
  `radial-gradient(circle at 50% 0%, ${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`

/** Glass backdrop filter */
export const glass = {
  background: BG_GLASS,
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
}
