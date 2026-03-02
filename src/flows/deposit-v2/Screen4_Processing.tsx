import type { FlowScreenProps } from '../../pages/simulator/flowRegistry'
import LoadingScreen from '../../library/feedback/LoadingScreen'

const STEPS = [
  { title: 'Reconhecemos seu pagamento...', progress: 20 },
  { title: 'Processando', progress: 45 },
  { title: 'Convertendo em dólar', progress: 75 },
  { title: 'Pronto!', progress: 100 },
]

export default function Screen4_Processing({ onNext }: FlowScreenProps) {
  return (
    <LoadingScreen
      steps={STEPS}
      autoAdvance
      autoAdvanceInterval={1500}
      onComplete={onNext}
    />
  )
}
