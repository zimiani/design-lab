import type { FlowScreenProps } from '@/pages/simulator/flowRegistry'
import LoadingScreen from '@/library/feedback/LoadingScreen'

const STEPS = [
  { title: 'Verificando saldo...', progress: 20 },
  { title: 'Processando ordem...', progress: 55 },
  { title: 'Atualizando portfólio...', progress: 85 },
  { title: 'Pronto!', progress: 100 },
]

export default function Screen7_BuyProcessing({ onNext }: FlowScreenProps) {
  return (
    <LoadingScreen
      steps={STEPS}
      autoAdvance
      autoAdvanceInterval={1500}
      onComplete={onNext}
    />
  )
}
