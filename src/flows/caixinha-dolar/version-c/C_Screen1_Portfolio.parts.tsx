/**
 * Screen-only parts for the Portfolio screen (Version C).
 */

import { RiPercentLine, RiSparklingLine } from '@remixicon/react'
import Stack from '../../../library/layout/Stack'
import Text from '../../../library/foundations/Text'
import Badge from '../../../library/display/Chip'
import Avatar from '../../../library/display/Avatar'
import ListItem from '../../../library/display/ListItem'
import GroupHeader from '../../../library/navigation/GroupHeader'

import { MOCK_BALANCE, YIELD_TODAY, formatUsd } from '../shared/data'

/* ── ProductListItem ── */

interface ProductListItemProps {
  onPress: () => void
}

export function ProductListItem({ onPress }: ProductListItemProps) {
  return (
    <ListItem
      title="Caixinha do Dólar"
      subtitle={formatUsd(MOCK_BALANCE)}
      left={
        <Avatar
         
          icon={<RiPercentLine size={16} />}
          bgColor="#dcfce7"
          iconColor="#22c55e"
        />
      }
      right={
        <Stack gap="none" align="end">
          <Badge variant="positive">5% a.a.</Badge>
          <Text variant="caption" className="text-[#22c55e] mt-1">
            +{formatUsd(YIELD_TODAY)}/dia
          </Text>
        </Stack>
      }
      onPress={onPress}
    />
  )
}

/* ── DiscoverSection ── */

interface DiscoverSectionProps {
  onActivate: () => void
}

export function DiscoverSection({ onActivate }: DiscoverSectionProps) {
  return (
    <Stack gap="none">
      <GroupHeader text="Descubra" />
      <ListItem
        title="Caixinha do Dólar"
        subtitle="Ganhe 5% a.a. sobre seus dólares parados"
        left={
          <Avatar
           
            icon={<RiSparklingLine size={16} />}
            bgColor="#fef3c7"
            iconColor="#f59e0b"
          />
        }
        right={<Badge variant="positive">Novo</Badge>}
        onPress={onActivate}
      />
    </Stack>
  )
}
