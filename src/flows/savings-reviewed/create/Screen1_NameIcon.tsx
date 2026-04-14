import { useState } from 'react'
import {
  RiPlaneLine, RiHomeLine, RiCarLine, RiSmartphoneLine,
  RiShieldLine, RiGiftLine, RiGraduationCapLine, RiHeartLine,
  RiGamepadLine, RiMoneyDollarCircleLine, RiBearSmileLine, RiMusicLine,
} from '@remixicon/react'
import type { FlowScreenProps } from '../../../pages/simulator/flowRegistry'
import BaseLayout from '../../../library/layout/BaseLayout'
import StickyFooter from '../../../library/layout/StickyFooter'
import Stack from '../../../library/layout/Stack'
import Header from '../../../library/navigation/Header'
import Button from '../../../library/inputs/Button'
import TextInput from '../../../library/inputs/TextInput'
import Avatar from '../../../library/display/Avatar'
import Text from '../../../library/foundations/Text'
import type { RemixiconComponentType } from '@remixicon/react'
import { CAIXINHA_ICONS, type CaixinhaIconId } from '../shared/data'
import { IconPickerGrid } from './Screen1_NameIcon.parts'

const ICON_MAP: Record<CaixinhaIconId, RemixiconComponentType> = {
  plane: RiPlaneLine,
  home: RiHomeLine,
  car: RiCarLine,
  phone: RiSmartphoneLine,
  shield: RiShieldLine,
  gift: RiGiftLine,
  graduation: RiGraduationCapLine,
  heart: RiHeartLine,
  game: RiGamepadLine,
  money: RiMoneyDollarCircleLine,
  pet: RiBearSmileLine,
  music: RiMusicLine,
}

export { ICON_MAP }

export default function Screen1_NameIcon({ onNext, onBack, onElementTap }: FlowScreenProps) {
  const [name, setName] = useState('')
  const [selectedIcon, setSelectedIcon] = useState<CaixinhaIconId>('plane')

  const isValid = name.trim().length >= 2

  const SelectedIconComp = ICON_MAP[selectedIcon]

  return (
    <BaseLayout>
      <Header title="" onClose={onBack} />

      <Stack gap="lg">
        <Stack gap="sm">
          <Text variant="h1">Crie sua caixinha</Text>
          <Text variant="body-md" color="content-secondary">
            Escolha um nome e um ícone para organizar seus objetivos.
          </Text>
        </Stack>

        {/* Live preview */}
        <Stack gap="sm" align="center">
          <Avatar
            icon={<SelectedIconComp size={32} />}
            size="xl"
            bgColor="var(--color-brand-core-500)"
            iconColor="#ffffff"
          />
          <Text variant="h3">
            {name.trim() || 'Minha caixinha'}
          </Text>
        </Stack>

        <TextInput
          label="Nome da caixinha"
          placeholder="Ex: Viagem Europa"
          value={name}
          onChange={setName}
          helperText={`${name.length}/30 caracteres`}
        />

        {/* Icon grid */}
        <Stack gap="sm">
          <Text variant="body-sm" color="content-secondary">Escolha um ícone</Text>
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
          const handled = onElementTap?.('Button: Continuar')
          if (!handled) onNext()
        }}>
          Continuar
        </Button>
      </StickyFooter>
    </BaseLayout>
  )
}
