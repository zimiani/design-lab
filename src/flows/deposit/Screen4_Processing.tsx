import { useEffect } from 'react'
import type { FlowScreenProps } from '../../pages/simulator/flowRegistry'
import BaseLayout from '../../library/layout/BaseLayout'
import Stack from '../../library/layout/Stack'
import LoadingSpinner from '../../library/feedback/LoadingSpinner'
import Text from '../../library/foundations/Text'

export default function Screen4_Processing({ onNext }: FlowScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onNext, 2500)
    return () => clearTimeout(timer)
  }, [onNext])

  return (
    <BaseLayout>
      <Stack className="flex-1 items-center justify-center">
        <LoadingSpinner size="lg" />
        <Stack gap="sm" className="items-center">
          <Text variant="heading-md" align="center">
            Confirming your payment...
          </Text>
          <Text variant="body-md" color="content-secondary" align="center">
            This usually takes a few seconds
          </Text>
        </Stack>
      </Stack>
    </BaseLayout>
  )
}
