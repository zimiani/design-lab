import { useState } from 'react'
import type { FlowScreenProps } from '../../../pages/simulator/flowRegistry'
import Header from '../../../library/navigation/Header'
import BaseLayout from '../../../library/layout/BaseLayout'
import StickyFooter from '../../../library/layout/StickyFooter'
import Stack from '../../../library/layout/Stack'
import Button from '../../../library/inputs/Button'
import TextInput from '../../../library/inputs/TextInput'
import Text from '../../../library/foundations/Text'

import { EMOJI_OPTIONS } from '../shared/data'

export default function D_Screen2_CreateName({ onNext, onBack }: FlowScreenProps) {
  const [name, setName] = useState('')
  const [selectedEmoji, setSelectedEmoji] = useState('✈️')

  const isValid = name.trim().length >= 2

  return (
    <BaseLayout>
      <Header title="Nova Caixinha" onBack={onBack} />

      <Stack gap="default">
        <Stack gap="sm">
          <Text variant="heading-sm">Escolha um ícone</Text>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {EMOJI_OPTIONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setSelectedEmoji(emoji)}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  border: selectedEmoji === emoji ? '2px solid var(--color-interactive-default)' : '2px solid transparent',
                  background: selectedEmoji === emoji ? 'var(--color-surface-secondary)' : 'transparent',
                  fontSize: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        </Stack>

        {/* Preview */}
        <Stack gap="sm" align="center" className="py-4">
          <span style={{ fontSize: 48 }}>{selectedEmoji}</span>
          <Text variant="heading-md" align="center">
            {name || 'Minha Caixinha'}
          </Text>
        </Stack>

        <TextInput
          label="Nome da caixinha"
          placeholder="Ex: Viagem, Reserva, iPhone..."
          value={name}
          onChange={setName}
        />
      </Stack>

      <StickyFooter>
        <Button fullWidth disabled={!isValid} onPress={onNext}>
          Continuar
        </Button>
      </StickyFooter>
    </BaseLayout>
  )
}
