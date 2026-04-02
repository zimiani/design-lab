import type { FlowScreenProps } from '@/pages/simulator/flowRegistry'
import LoadingScreen from '@/library/feedback/LoadingScreen'

const STEPS = [
  { title: 'Processando venda...', progress: 25 },
  { title: 'Executando ordem...', progress: 55 },
  { title: 'Atualizando saldo...', progress: 85 },
  { title: 'Pronto!', progress: 100 },
]

export default function Screen11_SellProcessing({ onNext }: FlowScreenProps) {
  return (
    <LoadingScreen
      steps={STEPS}
      autoAdvance
      autoAdvanceInterval={1500}
      onComplete={onNext}
    />
  )
}
