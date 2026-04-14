import type { FlowScreenProps } from '../../../pages/simulator/flowRegistry'
import Header from '../../../library/navigation/Header'
import BaseLayout from '../../../library/layout/BaseLayout'
import Stack from '../../../library/layout/Stack'
import ListItem from '../../../library/display/ListItem'
import Avatar from '../../../library/display/Avatar'
import Text from '../../../library/foundations/Text'
import { DESTINATIONS } from '../shared/data'

export default function A_Screen1_ChooseDestination({ onNext, onBack }: FlowScreenProps) {
  return (
    <BaseLayout>
      <Header title="" onClose={onBack} />

      <Stack gap="sm">
        <Text variant="h1">Para onde deseja sacar?</Text>
        <Text variant="body-md" color="content-secondary">
          Escolha o destino da sua transferência
        </Text>
      </Stack>

      <Stack gap="none">
        {DESTINATIONS.map((dest) => (
          <ListItem
            key={dest.id}
            title={dest.title}
            subtitle={dest.subtitle}
            left={
              dest.icon.startsWith('http') ? (
                <Avatar src={dest.icon} size="md" />
              ) : (
                <Avatar initials={dest.icon} size="md" />
              )
            }
            onPress={onNext}
          />
        ))}
      </Stack>
    </BaseLayout>
  )
}
