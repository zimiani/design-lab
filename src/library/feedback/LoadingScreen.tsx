import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import Lottie from 'lottie-react'
import { registerComponent } from '../registry'
import ProgressBar from '../display/ProgressBar'

import cardWaveAnimation from '../../assets/lottie/card-wave.json'

export interface LoadingScreenStep {
  title: string
  /** Progress value 0–100 */
  progress: number
}

export interface LoadingScreenProps {
  /** Array of steps with title and progress value */
  steps: LoadingScreenStep[]
  /** Current step index (controlled mode). Ignored when autoAdvance is true. */
  currentStep?: number
  /** Auto-advance through steps on a timer */
  autoAdvance?: boolean
  /** Milliseconds between auto-advance steps (default: 1500) */
  autoAdvanceInterval?: number
  /** Called when step changes */
  onStepChange?: (step: number) => void
  /** Called when the last step completes (after autoAdvanceInterval) */
  onComplete?: () => void
  /** Optional Lottie animation data. Defaults to card-wave. Pass null to hide. */
  animation?: object | null
  className?: string
}

/** Height of each step row in px — used for translateY calculation */
const STEP_HEIGHT = 64

export default function LoadingScreen({
  steps,
  currentStep: controlledStep,
  autoAdvance = true,
  autoAdvanceInterval = 1500,
  onStepChange,
  onComplete,
  animation = cardWaveAnimation,
  className = '',
}: LoadingScreenProps) {
  const [internalStep, setInternalStep] = useState(controlledStep ?? 0)

  const activeStep = controlledStep ?? internalStep

  // Sync internal step when controlled prop changes
  useEffect(() => {
    if (controlledStep !== undefined) {
      setInternalStep(controlledStep)
    }
  }, [controlledStep])

  const handleComplete = useCallback(() => {
    onComplete?.()
  }, [onComplete])

  // Auto-advance logic
  useEffect(() => {
    if (!autoAdvance) return

    if (activeStep >= steps.length - 1) {
      const timer = setTimeout(handleComplete, autoAdvanceInterval)
      return () => clearTimeout(timer)
    }

    const timer = setTimeout(() => {
      const next = activeStep + 1
      setInternalStep(next)
      onStepChange?.(next)
    }, autoAdvanceInterval)

    return () => clearTimeout(timer)
  }, [activeStep, steps.length, autoAdvance, autoAdvanceInterval, onStepChange, handleComplete])

  const current = steps[activeStep]

  return (
    <div data-component="LoadingScreen" className={`flex flex-col h-full bg-white ${className}`}>
      {/* Lottie animation area */}
      <div className="flex-1 flex items-center justify-center">
        {animation && (
          <Lottie
            animationData={animation}
            loop
            className="w-full"
          />
        )}
      </div>

      {/* Bottom messages + progress */}
      <div className="shrink-0 px-[var(--token-spacing-6)] pb-[24px] mb-[40px]">
        {/* Scrolling text ticker — shows previous + current, clipped to 2 rows */}
        <div
          className="overflow-hidden relative"
          style={{ height: STEP_HEIGHT * 2 }}
        >
          {/* Fade-out gradient mask — covers only the top row (previous steps) */}
          <div
            className="absolute inset-x-0 top-0 z-10 pointer-events-none"
            style={{
              height: STEP_HEIGHT,
              background: 'linear-gradient(to bottom, white 0%, rgba(255,255,255,0.4) 70%, transparent 100%)',
            }}
          />

          {/* The sliding column of all steps */}
          <motion.div
            animate={{ y: -activeStep * STEP_HEIGHT }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            style={{ paddingTop: STEP_HEIGHT }}
          >
            {steps.map((step, i) => {
              const distance = activeStep - i
              // current = 0, previous = 1+, future = negative
              const opacity = distance === 0 ? 1 : distance > 0 ? 0.25 : 0

              return (
                <motion.div
                  key={i}
                  animate={{ opacity }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  style={{ height: STEP_HEIGHT }}
                  className="flex items-end"
                >
                  <span className="text-[length:var(--token-font-size-heading-lg)] leading-[var(--token-line-height-heading-lg)] font-[var(--token-font-weight-heading-lg)] tracking-[-0.6px] text-[var(--color-content-primary)]">
                    {step.title}
                  </span>
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        {/* Progress bar */}
        <div className="mt-[24px]">
          <ProgressBar value={current.progress} />
        </div>
      </div>
    </div>
  )
}

registerComponent({
  name: 'LoadingScreen',
  category: 'feedback',
  description: 'Full-screen loading state with Lottie animation, step-based animated messages, and progress bar. Use for transaction processing, account setup, and multi-step async operations.',
  component: LoadingScreen,
  props: [
    { name: 'steps', type: 'LoadingScreenStep[]', required: true, description: 'Array of { title, progress } steps' },
    { name: 'currentStep', type: 'number', required: false, description: 'Controlled step index' },
    { name: 'autoAdvance', type: 'boolean', required: false, defaultValue: 'true', description: 'Auto-advance through steps' },
    { name: 'autoAdvanceInterval', type: 'number', required: false, defaultValue: '1500', description: 'Ms between auto-advance steps' },
    { name: 'onStepChange', type: '(step: number) => void', required: false, description: 'Step change callback' },
    { name: 'onComplete', type: '() => void', required: false, description: 'Called after last step completes' },
    { name: 'animation', type: 'object | null', required: false, defaultValue: 'card-wave', description: 'Lottie animation data. Pass null to hide.' },
  ],
})
