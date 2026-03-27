// ── Web Audio Synthesizer for UI Sound Effects ──
// Zero network requests, <1KB — all sounds generated at runtime via AudioContext.
// Respects prefers-reduced-motion (returns no-ops).

let _ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  // Respect reduced motion preference
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return null
  if (!_ctx) {
    try { _ctx = new AudioContext() } catch { return null }
  }
  // Resume if suspended (browser autoplay policy)
  if (_ctx.state === 'suspended') _ctx.resume().catch(() => {})
  return _ctx
}

function osc(
  ctx: AudioContext,
  freq: number,
  type: OscillatorType,
  duration: number,
  gain: number,
  delay = 0,
): void {
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = type
  o.frequency.setValueAtTime(freq, ctx.currentTime + delay)
  g.gain.setValueAtTime(gain, ctx.currentTime + delay)
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration)
  o.connect(g).connect(ctx.destination)
  o.start(ctx.currentTime + delay)
  o.stop(ctx.currentTime + delay + duration + 0.05)
}

function noise(
  ctx: AudioContext,
  duration: number,
  gain: number,
  filterFreq: number,
): void {
  const bufferSize = ctx.sampleRate * duration
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1

  const src = ctx.createBufferSource()
  src.buffer = buffer
  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = filterFreq
  filter.Q.value = 1.5
  const g = ctx.createGain()
  g.gain.setValueAtTime(gain, ctx.currentTime)
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
  src.connect(filter).connect(g).connect(ctx.destination)
  src.start()
  src.stop(ctx.currentTime + duration + 0.05)
}

// ── Public API ──

/** Short click tone for button taps — 60ms, 800Hz sine */
export function playTap(): void {
  const ctx = getCtx()
  if (!ctx) return
  osc(ctx, 800, 'sine', 0.06, 0.08)
}

/** Ascending two-tone chime for success — C5→E5, 250ms */
export function playSuccess(): void {
  const ctx = getCtx()
  if (!ctx) return
  osc(ctx, 523, 'sine', 0.15, 0.1)         // C5
  osc(ctx, 659, 'triangle', 0.2, 0.08, 0.1) // E5 delayed
  osc(ctx, 784, 'sine', 0.25, 0.05, 0.18)   // G5 soft tail
}

/** Descending tone for errors — E4→C4, 150ms */
export function playError(): void {
  const ctx = getCtx()
  if (!ctx) return
  osc(ctx, 330, 'sawtooth', 0.08, 0.06)     // E4
  osc(ctx, 262, 'sine', 0.12, 0.05, 0.06)   // C4
}

/** Whoosh for sheet/modal open — 80ms noise burst */
export function playSlide(): void {
  const ctx = getCtx()
  if (!ctx) return
  noise(ctx, 0.08, 0.04, 2000)
}

/** Satisfying lock sound for confirmations — low thud + high ping */
export function playConfirm(): void {
  const ctx = getCtx()
  if (!ctx) return
  osc(ctx, 120, 'sine', 0.1, 0.12)          // Low thud
  osc(ctx, 1200, 'sine', 0.08, 0.06, 0.04)  // High ping
  osc(ctx, 880, 'triangle', 0.15, 0.04, 0.06) // Warm tail
}

/** Soft tick for toggle switches — 40ms */
export function playTick(): void {
  const ctx = getCtx()
  if (!ctx) return
  osc(ctx, 1000, 'sine', 0.04, 0.05)
}

/** Keypad press — slightly lower, snappier than tap */
export function playKey(): void {
  const ctx = getCtx()
  if (!ctx) return
  osc(ctx, 600, 'square', 0.03, 0.04)
}
