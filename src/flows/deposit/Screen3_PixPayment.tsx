import { useState, useEffect, useCallback } from 'react'
import { RiQrCodeLine } from '@remixicon/react'
import type { FlowScreenProps } from '../../pages/simulator/flowRegistry'
import Header from '../../library/navigation/Header'
import BaseLayout from '../../library/layout/BaseLayout'
import StickyFooter from '../../library/layout/StickyFooter'
import Stack from '../../library/layout/Stack'
import Card from '../../library/display/Card'
import Text from '../../library/foundations/Text'
import Divider from '../../library/foundations/Divider'
import Badge from '../../library/display/Badge'
import Button from '../../library/inputs/Button'
import Toast from '../../library/feedback/Toast'

const MOCK_PIX_CODE = '00020126580014br.gov.bcb.pix013636c3a9b2-7e4f-4d8a-b912-3d4c5e6f7a8b5204000053039865802BR5925PICNIC'

export default function Screen3_PixPayment({ onNext, onBack }: FlowScreenProps) {
  const [seconds, setSeconds] = useState(600)
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(MOCK_PIX_CODE)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }, [])

  return (
    <BaseLayout>
      <Header title="PIX Payment" onBack={onBack} />

      <Stack className="items-center">
        {/* QR Code placeholder */}
        <div className="w-[200px] h-[200px] bg-surface-secondary rounded-[var(--token-radius-lg)] flex items-center justify-center">
          <RiQrCodeLine size={80} className="text-content-tertiary" />
        </div>

        <Text variant="body-md" align="center" color="content-secondary">
          Scan this QR code with your bank app
        </Text>
      </Stack>

      <Divider />

      <Stack>
        <Text variant="body-sm" color="content-secondary">
          Or copy the PIX code
        </Text>
        <Card variant="flat">
          <Text variant="caption" className="font-mono truncate">
            {MOCK_PIX_CODE}
          </Text>
        </Card>
        <Button variant="secondary" fullWidth onPress={handleCopy}>
          Copy code
        </Button>
      </Stack>

      <Stack className="items-center">
        <Badge variant="info" size="md">
          Expires in {timeStr}
        </Badge>
      </Stack>

      <div className="fixed top-[var(--token-spacing-6)] left-1/2 -translate-x-1/2 z-50">
        <Toast variant="success" message="PIX code copied!" visible={showToast} />
      </div>

      <StickyFooter>
        <Button fullWidth onPress={onNext}>
          I already paid
        </Button>
      </StickyFooter>
    </BaseLayout>
  )
}
