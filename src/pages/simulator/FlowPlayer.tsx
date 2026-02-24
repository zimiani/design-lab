import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'
import { getFlow } from './flowRegistry'
import PhoneFrame from './PhoneFrame'
import AnnotationsPanel from './AnnotationsPanel'

interface FlowPlayerProps {
  flowId: string
}

export default function FlowPlayer({ flowId }: FlowPlayerProps) {
  const flow = getFlow(flowId)
  const [screenIdx, setScreenIdx] = useState(0)
  const [direction, setDirection] = useState(1)

  const goNext = useCallback(() => {
    if (flow && screenIdx < flow.screens.length - 1) {
      setDirection(1)
      setScreenIdx((i) => i + 1)
    }
  }, [flow, screenIdx])

  const goBack = useCallback(() => {
    if (screenIdx > 0) {
      setDirection(-1)
      setScreenIdx((i) => i - 1)
    }
  }, [screenIdx])

  const restart = useCallback(() => {
    setDirection(-1)
    setScreenIdx(0)
  }, [])

  if (!flow) {
    return (
      <div className="flex-1 flex items-center justify-center text-text-tertiary">
        Select a flow from the sidebar
      </div>
    )
  }

  const current = flow.screens[screenIdx]

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -300 : 300, opacity: 0 }),
  }

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Center: Phone + controls */}
      <div className="flex-1 flex flex-col items-center justify-center gap-[var(--token-spacing-lg)] bg-neutral-100 py-[var(--token-spacing-md)]">
        <PhoneFrame>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={screenIdx}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="h-full"
            >
              <current.component onNext={goNext} onBack={goBack} />
            </motion.div>
          </AnimatePresence>
        </PhoneFrame>

        {/* Controls */}
        <div className="flex items-center gap-[var(--token-spacing-3)]">
          <button
            type="button"
            onClick={goBack}
            disabled={screenIdx === 0}
            className="w-[40px] h-[40px] flex items-center justify-center rounded-[var(--token-radius-full)] bg-surface-primary border border-border-default hover:bg-surface-secondary transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-[length:var(--token-font-size-body-sm)] text-text-secondary min-w-[80px] text-center">
            {screenIdx + 1} / {flow.screens.length}
          </span>
          <button
            type="button"
            onClick={goNext}
            disabled={screenIdx === flow.screens.length - 1}
            className="w-[40px] h-[40px] flex items-center justify-center rounded-[var(--token-radius-full)] bg-surface-primary border border-border-default hover:bg-surface-secondary transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight size={18} />
          </button>
          <button
            type="button"
            onClick={restart}
            className="w-[40px] h-[40px] flex items-center justify-center rounded-[var(--token-radius-full)] bg-surface-primary border border-border-default hover:bg-surface-secondary transition-colors cursor-pointer ml-[var(--token-spacing-2)]"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Right: Annotations */}
      <AnnotationsPanel flow={flow} currentScreen={current} screenIndex={screenIdx} />
    </div>
  )
}
