import { useState, useEffect, useCallback } from 'react'
import { RiTimerLine } from '@remixicon/react'
import { registerComponent } from '../registry'

export interface CountdownProps {
  /** Total seconds to count down from */
  seconds: number
  /** Called when countdown reaches zero */
  onExpire?: () => void
  /** Optional label before the time (default: "Código válido por") */
  label?: string
  className?: string
}

function formatTime(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60)
  const secs = totalSeconds % 60
  if (mins > 0) {
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  return `${secs}s`
}

export default function Countdown({
  seconds: initialSeconds,
  onExpire,
  label = 'Código válido por',
  className = '',
}: CountdownProps) {
  const [remaining, setRemaining] = useState(initialSeconds)

  useEffect(() => {
    setRemaining(initialSeconds)
  }, [initialSeconds])

  const handleExpire = useCallback(() => {
    onExpire?.()
  }, [onExpire])

  useEffect(() => {
    if (remaining <= 0) {
      handleExpire()
      return
    }
    const timer = setInterval(() => {
      setRemaining((s) => {
        if (s <= 1) {
          clearInterval(timer)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [remaining, handleExpire])

  const isUrgent = remaining <= 60

  return (
    <div data-component="Countdown" className={`flex items-center gap-[var(--token-spacing-2)] ${className}`}>
      <RiTimerLine
        size={20}
        className={isUrgent ? 'text-[var(--token-error)]' : 'text-[var(--color-content-primary)]'}
      />
      <span
        className={`text-[length:var(--token-font-size-body-sm)] leading-[var(--token-line-height-body-sm)] font-medium tabular-nums ${
          isUrgent ? 'text-[var(--token-error)]' : 'text-[var(--color-content-primary)]'
        }`}
      >
        {label} {formatTime(remaining)}
      </span>
    </div>
  )
}

registerComponent({
  name: 'Countdown',
  category: 'feedback',
  description: 'Countdown timer that displays remaining time for time-sensitive operations (PIX payments, OTP codes). Turns red when urgent (< 60s). Calls onExpire when reaching zero.',
  component: Countdown,
  props: [
    { name: 'seconds', type: 'number', required: true, description: 'Total seconds to count down from' },
    { name: 'onExpire', type: '() => void', required: false, description: 'Called when countdown reaches zero' },
    { name: 'label', type: 'string', required: false, defaultValue: 'Código válido por', description: 'Label before the time display' },
  ],
})
