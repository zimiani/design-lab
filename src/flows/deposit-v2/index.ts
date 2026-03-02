import { registerFlow } from '../../pages/simulator/flowRegistry'
import { registerPage } from '../../pages/gallery/pageRegistry'
import Screen1_AmountEntry from './Screen1_AmountEntry'
import Screen3_PixPayment from './Screen3_PixPayment'
import Screen4_Processing from './Screen4_Processing'
import Screen5_Success from './Screen5_Success'

const screenDefs = [
  {
    id: 'deposit-v2-amount',
    title: 'Amount Entry',
    description: 'Dual currency input with bi-directional conversion. Shows skeleton while calculating, then reveals fee breakdown and benefit banner.',
    componentsUsed: ['BaseLayout', 'Header', 'CurrencyInput', 'Button', 'Divider', 'ListItem', 'Avatar', 'DataList', 'Banner', 'Skeleton', 'BottomSheet', 'StickyFooter', 'Stack'],
    component: Screen1_AmountEntry,
  },
  {
    id: 'deposit-v2-pix-payment',
    title: 'PIX Payment',
    description: 'PIX code display with copy action, countdown timer, QR code button, and payment details.',
    componentsUsed: ['BaseLayout', 'Header', 'Banner', 'Button', 'IconButton', 'DataList', 'ListItem', 'GroupHeader', 'Text', 'Toast', 'Countdown', 'BottomSheet', 'StickyFooter', 'Stack'],
    component: Screen3_PixPayment,
  },
  {
    id: 'deposit-v2-processing',
    title: 'Processing',
    description: 'Animated loading state with rotating messages and progress bar. Auto-advances after ~5.5 seconds.',
    componentsUsed: ['LoadingScreen'],
    component: Screen4_Processing,
  },
  {
    id: 'deposit-v2-success',
    title: 'Success',
    description: 'Deposit confirmed with savings nudge banner and transaction summary.',
    componentsUsed: ['FeedbackLayout', 'Button', 'DataList', 'Banner', 'GroupHeader', 'Text', 'StickyFooter', 'Stack'],
    component: Screen5_Success,
  },
] as const

// Register each screen as a standalone page
for (const s of screenDefs) {
  registerPage({
    id: s.id,
    name: s.title,
    description: s.description,
    area: 'Transactions',
    componentsUsed: [...s.componentsUsed],
    component: s.component,
  })
}

registerFlow({
  id: 'deposit-pix-v2',
  name: 'Deposit via PIX (v2)',
  description: 'Updated deposit flow matching the Figma handoff. User enters USD amount, reviews BRL conversion with fees, pays via PIX code, and sees success confirmation with savings summary.',
  domain: 'add-funds',
  level: 2,
  screens: screenDefs.map((s) => ({ ...s, pageId: s.id })),
})
