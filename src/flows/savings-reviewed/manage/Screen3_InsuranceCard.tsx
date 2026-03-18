/**
 * @screen Coverage
 * @description Nexus Mutual-style green certificate card with coverage details.
 */
import type { FlowScreenProps } from '../../../pages/simulator/flowRegistry'
import BaseLayout from '../../../library/layout/BaseLayout'
import Stack from '../../../library/layout/Stack'
import Header from '../../../library/navigation/Header'
import InsurancePolicyCard from '../../../library/display/InsurancePolicyCard'
import Summary from '../../../library/display/Summary'
import GroupHeader from '../../../library/navigation/GroupHeader'
import DataList from '../../../library/display/DataList'
import { RiBugLine, RiAlertLine, RiRefundLine } from '@remixicon/react'

export default function Screen3_InsuranceCard({ onBack }: FlowScreenProps) {
  return (
    <BaseLayout>
      <Header
        title="Certificado de cobertura"
        description="Sua caixinha já vem com seguro incluso. Sem contratação, sem custo extra."
        onBack={onBack}
      />

      <Stack gap="lg">

        <InsurancePolicyCard
          providerName="Nexus Mutual"
          coverItems={[
            { label: 'Tipo', value: 'Smart Contract Cover' },
            { label: 'Protocolo', value: 'Aave v3 + Compound' },
            { label: 'Dedutível', value: '5%' },
            { label: 'Carência', value: '14 dias' },
            { label: 'Prazo do sinistro', value: '30 dias' },
            { label: 'Custo', value: 'Incluso' },
          ]}
        />

        <Stack gap="none">
          <GroupHeader text="O que o seguro cobre" />
          <Summary
            data={[
              { icon: <RiBugLine size={20} />, title: 'Falha técnica no sistema', description: 'Um erro na tecnologia afeta seu saldo? Você é reembolsado.' },
              { icon: <RiAlertLine size={20} />, title: 'Dados de preço incorretos', description: 'Se uma informação errada causar perda, a cobertura entra em ação.' },
              { icon: <RiRefundLine size={20} />, title: 'Problema na liquidação', description: 'Algo trava na hora de processar? O seguro garante a devolução.' },
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
      </Stack>
    </BaseLayout>
  )
}
