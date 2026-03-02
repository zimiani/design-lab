import { useState } from 'react'
import type { FlowScreenProps } from '../../../pages/simulator/flowRegistry'
import Header from '../../../library/navigation/Header'
import BaseLayout from '../../../library/layout/BaseLayout'
import Stack from '../../../library/layout/Stack'
import SearchBar from '../../../library/inputs/SearchBar'
import ListItem from '../../../library/display/ListItem'
import Avatar from '../../../library/display/Avatar'
import { SAVED_RECIPIENTS } from '../shared/data'

export default function B_Screen2_Recipient({ onNext, onBack }: FlowScreenProps) {
  const [search, setSearch] = useState('')

  const filtered = SAVED_RECIPIENTS.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.detail.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <BaseLayout>
      <Header title="Escolher destinatário" onBack={onBack} />

      <SearchBar
        placeholder="Buscar destinatário..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Stack gap="none">
        {filtered.map((recipient) => (
          <ListItem
            key={recipient.id}
            title={recipient.name}
            subtitle={recipient.detail}
            left={<Avatar initials={recipient.name.charAt(0)} size="md" />}
            onPress={onNext}
          />
        ))}
        <ListItem
          title="Adicionar novo destinatário"
          subtitle="Insira os dados manualmente"
          left={<Avatar initials="+" size="md" />}
          onPress={onNext}
        />
      </Stack>
    </BaseLayout>
  )
}
