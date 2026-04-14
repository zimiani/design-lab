import { RiShareLine, RiFileCopyLine, RiMessage3Line, RiInstagramLine, RiMailLine, RiLinksLine } from '@remixicon/react'
import { useState } from 'react'
import type { FlowScreenProps } from '../../pages/simulator/flowRegistry'
import Header from '../../library/navigation/Header'
import BaseLayout from '../../library/layout/BaseLayout'
import Stack from '../../library/layout/Stack'
import Section from '../../library/layout/Section'
import Text from '../../library/foundations/Text'
import Card from '../../library/display/Card'
import Badge from '../../library/display/Badge'
import Amount from '../../library/display/Amount'
import IconButton from '../../library/inputs/IconButton'
import ShortcutButton from '../../library/inputs/ShortcutButton'
import Toast from '../../library/feedback/Toast'

const shareChannels = [
  { icon: <RiMessage3Line size={22} />, label: 'WhatsApp', color: '#25D366' },
  { icon: <RiInstagramLine size={22} />, label: 'Instagram', color: '#E1306C' },
  { icon: <RiMailLine size={22} />, label: 'E-mail', color: '#4A90D9' },
  { icon: <RiLinksLine size={22} />, label: 'Copiar link', color: 'var(--color-content-secondary)' },
]

export default function Screen6_Share({ onBack }: FlowScreenProps) {
  const [showToast, setShowToast] = useState(false)

  const handleShare = () => {
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  return (
    <BaseLayout>
      <Header title="Compartilhar" onBack={onBack} />

      {/* Savings card */}
      <Card variant="flat">
        <Stack gap="sm" className="items-center text-center">
          <div className="flex items-center gap-[var(--token-spacing-8)]">
            <RiShareLine size={20} className="text-interactive-foreground" />
            <Badge variant="positive" size="md">Economia</Badge>
          </div>
          <Amount value={1250} size="display" />
          <Text variant="body-sm" color="content-secondary">de economia</Text>
          <Text variant="caption" color="content-tertiary">
            Comparado com a média do mercado financeiro
          </Text>
        </Stack>
      </Card>

      {/* Share options */}
      <Section title="Compartilhar via">
        <div className="grid grid-cols-4 gap-[var(--token-spacing-16)]">
          {shareChannels.map((ch) => (
            <ShortcutButton
              key={ch.label}
              icon={ch.icon}
              label={ch.label}
              variant="secondary"
              onPress={handleShare}
            />
          ))}
        </div>
      </Section>

      {/* Referral code */}
      <Card variant="flat">
        <div className="flex items-center justify-between">
          <Stack gap="none">
            <Text variant="body-sm" color="content-secondary">Seu código de indicação</Text>
            <Text variant="body-md" className="font-mono">PICNIC-AB12</Text>
          </Stack>
          <IconButton
            variant="small"
            icon={<RiFileCopyLine size={18} className="text-interactive-foreground" />}
            onPress={handleShare}
          />
        </div>
      </Card>

      <Text variant="caption" color="content-tertiary" align="center">
        Ganhe $5 a cada amigo que se cadastrar com seu código.
      </Text>

      <div className="fixed top-[var(--token-spacing-24)] left-1/2 -translate-x-1/2 z-50">
        <Toast variant="success" message="Link copiado!" visible={showToast} />
      </div>
    </BaseLayout>
  )
}
