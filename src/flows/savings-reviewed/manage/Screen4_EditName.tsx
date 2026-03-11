import { useState } from 'react'
import type { FlowScreenProps } from '../../../pages/simulator/flowRegistry'
import BaseLayout from '../../../library/layout/BaseLayout'
import StickyFooter from '../../../library/layout/StickyFooter'
import Stack from '../../../library/layout/Stack'
import Header from '../../../library/navigation/Header'
import Button from '../../../library/inputs/Button'
import TextInput from '../../../library/inputs/TextInput'
import Text from '../../../library/foundations/Text'
import { CAIXINHA_ICONS, type CaixinhaIconId } from '../shared/data'
import { ICON_MAP } from '../create/Screen1_NameIcon'
import { IconPickerGrid } from '../create/Screen1_NameIcon.parts'

export default function Screen4_EditName({ onBack, onElementTap }: FlowScreenProps) {
  const [name, setName] = useState('Reserva de emergência')
  const [selectedIcon, setSelectedIcon] = useState<CaixinhaIconId>('shield')

  const isValid = name.trim().length >= 2

  return (
    <BaseLayout>
      <Header title="Editar caixinha" onBack={onBack} />

      <Stack gap="lg">
        <TextInput
          label="Nome da caixinha"
          placeholder="Ex: Viagem Europa"
          value={name}
          onChange={setName}
          helperText={`${name.length}/30 caracteres`}
        />

        <Stack gap="sm">
          <Text variant="body-sm" color="content-secondary">Ícone</Text>
          <IconPickerGrid
            icons={CAIXINHA_ICONS}
            iconMap={ICON_MAP}
            selected={selectedIcon}
            onSelect={setSelectedIcon}
          />
        </Stack>
      </Stack>

      <StickyFooter>
        <Button fullWidth disabled={!isValid} onPress={() => {
          const handled = onElementTap?.('Button: Salvar')
          if (!handled) onBack()
        }}>
          Salvar
        </Button>
      </StickyFooter>
    </BaseLayout>
  )
}
