import type { FlowScreenProps } from '../../pages/simulator/flowRegistry'
import LoadingScreen from '../../library/feedback/LoadingScreen'

const STEPS = [
  { title: 'Preparing your deposit...', progress: 20 },
  { title: 'Allocating funds...', progress: 50 },
  { title: 'Activating yield...', progress: 80 },
  { title: 'Done!', progress: 100 },
]

export default function Screen4_Processing({ onNext }: FlowScreenProps) {
  return (
    <LoadingScreen
      steps={STEPS}
      autoAdvance
      autoAdvanceInterval={1200}
      onComplete={onNext}
    />
  )
}
