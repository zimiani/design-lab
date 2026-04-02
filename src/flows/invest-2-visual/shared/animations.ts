// ── Shared Animation Variants & Configs ──
import type { Variants, Transition } from 'framer-motion'

// ── List stagger system ──

export const listContainer: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
}

export const listItem: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
}

/** Vertical list variant (slides up instead of left) */
export const listItemY: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
}

// ── Interactive element feedback ──

export const hoverScale = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.97 },
  transition: { type: 'spring' as const, stiffness: 400, damping: 20 },
}

export const tapScale = {
  whileTap: { scale: 0.96 },
  transition: { type: 'spring' as const, stiffness: 400, damping: 20 },
}

export const tapScaleSmall = {
  whileTap: { scale: 0.92 },
  transition: { type: 'spring' as const, stiffness: 500, damping: 25 },
}

/** Star/favorite morph — scale up + slight rotate then spring back */
export const starMorph = {
  whileTap: { scale: 1.3, rotate: 15 },
  transition: { type: 'spring' as const, stiffness: 500, damping: 15 },
}

// ── Sheet/modal transitions ──

export const sheetSpring: Transition = {
  type: 'spring',
  stiffness: 350,
  damping: 35,
}

export const overlayFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
}

export const sheetSlideUp = {
  initial: { y: '100%' },
  animate: { y: 0 },
  exit: { y: '100%' },
  transition: sheetSpring,
}

// ── Value/number animation ──

/** Spring config for animated number count-ups */
export const countSpring: Transition = {
  type: 'spring',
  stiffness: 100,
  damping: 30,
  mass: 1,
}

/** Digit swap animation — slide up + fade */
export const digitSwap: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
}

export const digitTransition: Transition = {
  duration: 0.15,
  ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
}

// ── Chart animations ──

/** SVG path draw animation (stroke-dasharray progression) */
export const chartDraw: Transition = {
  pathLength: { type: 'spring', duration: 0.9, bounce: 0 },
  opacity: { duration: 0.3 },
}

// ── Glow/pulse effects ──

/** Pulsing glow ring — scale 1→2, opacity 0.6→0 */
export const pulseGlow = {
  initial: { scale: 0.8, opacity: 0.6 },
  animate: { scale: 2, opacity: 0 },
  transition: { duration: 1.2, ease: 'easeOut' as const },
}

/** Gentle idle pulse for icons/indicators */
export const idlePulse = {
  animate: { scale: [1, 1.08, 1] },
  transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' as const },
}

// ── Stagger helper for inline use ──

export const stagger = (baseDelay: number, index: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.3,
    delay: baseDelay + index * 0.05,
    ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
  },
})

// ── Dropdown option stagger ──

export const dropdownContainer: Variants = {
  hidden: { opacity: 0, y: -4, scaleY: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scaleY: 1,
    transition: { duration: 0.15, staggerChildren: 0.04 },
  },
  exit: { opacity: 0, y: -4, scaleY: 0.95, transition: { duration: 0.1 } },
}

export const dropdownItem: Variants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0 },
}
