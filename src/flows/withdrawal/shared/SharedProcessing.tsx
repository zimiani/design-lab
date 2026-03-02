import type { FlowScreenProps } from '../../../pages/simulator/flowRegistry'
import LoadingScreen from '../../../library/feedback/LoadingScreen'

const STEPS = [
  { title: 'Verificando dados do destinatário...', progress: 20 },
  { title: 'Processando saque...', progress: 50 },
  { title: 'Transferindo fundos...', progress: 80 },
  { title: 'Pronto!', progress: 100 },
]

export default function SharedProcessing({ onNext }: FlowScreenProps) {
  return (
    <LoadingScreen steps={STEPS} autoAdvance autoAdvanceInterval={1500} onComplete={onNext} />
  )
}
