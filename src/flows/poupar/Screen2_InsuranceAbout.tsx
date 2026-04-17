import type { FlowScreenProps } from '../../pages/simulator/flowRegistry'
import BaseLayout from '../../library/layout/BaseLayout'
import Stack from '../../library/layout/Stack'
import Header from '../../library/navigation/Header'
import Alert from '../../library/display/Alert'
import Summary from '../../library/display/Summary'
import GroupHeader from '../../library/navigation/GroupHeader'
import DataList from '../../library/display/DataList'
import { RiBugLine, RiAlertLine, RiRefundLine } from '@remixicon/react'

export default function Screen2_InsuranceAbout({ onBack }: FlowScreenProps) {
  return (
    <BaseLayout>
      <Header
        title="Seu dinheiro protegido"
        description="Toda caixinha já vem com cobertura. Sem contratação, sem custo extra. A proteção ativa no momento em que você guarda."
        onBack={onBack}
      />

      <Stack gap="lg">

        <Stack gap="none">
          <GroupHeader text="O que o seguro cobre" />
          <Summary
            data={[
              { icon: <RiBugLine size={20} />, title: 'Falha técnica no sistema', description: 'Cobre erros técnicos no provedor do investimento' },
              { icon: <RiAlertLine size={20} />, title: 'Dados de preço incorretos', description: 'Se uma informação errada causar perda, a cobertura entra em ação.' },
              { icon: <RiRefundLine size={20} />, title: 'Problema na liquidação', description: 'Cobre problemas em resgatar o dinheiro investido' },
            ]}
          />
        </Stack>

        <Stack gap="none">
          <GroupHeader text="Detalhes" />
          <DataList data={[
            { label: 'Provedor', value: 'Nexus Mutual' },
            { label: 'Custo', value: 'Incluso' },
            { label: 'Cobertura', value: '97% do valor investido' },
            { label: 'Prazo de análise', value: 'Até 14 dias' },
            { label: 'Reembolso após aprovação', value: 'Até 30 dias' },
          ]} />
        </Stack>

        <Alert
          variant="neutral"
          title="O que não é coberto?"
          description="Quedas normais de mercado, decisões pessoais de resgate e perdas por acesso indevido à sua conta (como phishing)."
        />
      </Stack>

    </BaseLayout>
  )
}
