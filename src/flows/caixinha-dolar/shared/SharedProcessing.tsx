import type { FlowScreenProps } from '../../../pages/simulator/flowRegistry'
import LoadingScreen from '../../../library/feedback/LoadingScreen'

const STEPS = [
  { title: 'Preparando transação...', progress: 20 },
  { title: 'Alocando fundos...', progress: 50 },
  { title: 'Ativando rendimento...', progress: 80 },
  { title: 'Pronto!', progress: 100 },
]

export default function SharedProcessing({ onNext }: FlowScreenProps) {
  return <LoadingScreen steps={STEPS} autoAdvance autoAdvanceInterval={1200} onComplete={onNext} />
}
