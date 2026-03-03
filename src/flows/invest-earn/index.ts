import { registerFlow } from '../../pages/simulator/flowRegistry'
import { registerPage } from '../../pages/gallery/pageRegistry'
import Screen1_Offer from './Screen1_Offer'
import Screen2_Amount from './Screen2_Amount'
import Screen3_Review from './Screen3_Review'
import Screen4_Processing from './Screen4_Processing'
import Screen5_Success from './Screen5_Success'

const screenDefs = [
  {
    id: 'invest-earn-offer',
    title: 'Earn Offer',
    description: 'Landing screen presenting the 5% APY USD savings product with key details and fund protection info.',
    componentsUsed: ['BaseLayout', 'Header', 'Card', 'Button', 'Text', 'Amount', 'Banner', 'DataList', 'Badge', 'StickyFooter', 'Stack'],
    component: Screen1_Offer,
    states: [
      { id: 'default', name: 'New user', description: 'User has no existing balance', isDefault: true, data: { currentBalance: 0 } },
      { id: 'has-balance', name: 'Has balance', description: 'User already has funds earning yield', data: { currentBalance: 1243.57 } },
    ],
    interactiveElements: [
      { id: 'btn-invest', component: 'Button', label: 'Começar a investir' },
      { id: 'btn-add-more', component: 'Button', label: 'Adicionar mais' },
    ],
  },
  {
    id: 'invest-earn-amount',
    title: 'Amount Entry',
    description: 'USD amount input with funding source selector (USD balance or PIX deposit). Shows earnings projection after calculation.',
    componentsUsed: ['BaseLayout', 'Header', 'CurrencyInput', 'Button', 'Text', 'ListItem', 'Avatar', 'DataList', 'Banner', 'Skeleton', 'BottomSheet', 'StickyFooter', 'Stack', 'Divider'],
    component: Screen2_Amount,
    states: [
      { id: 'default', name: 'Empty', description: 'No amount entered yet', isDefault: true, data: {} },
      { id: 'loading', name: 'Calculating', description: 'Amount entered, calculating yield projection', data: { initialAmount: '10000', initialCalcState: 'loading' } },
      { id: 'ready', name: 'Ready', description: 'Calculation complete, CTA enabled', data: { initialAmount: '10000', initialCalcState: 'ready' } },
      { id: 'error', name: 'Error', description: 'Amount below minimum or validation error', data: { initialAmount: '50', initialCalcState: 'error' } },
    ],
    interactiveElements: [
      { id: 'btn-continue', component: 'Button', label: 'Continuar' },
      { id: 'btn-change-source', component: 'Button', label: 'Mudar' },
      { id: 'input-amount', component: 'CurrencyInput', label: 'Valor (USD)' },
      { id: 'li-funding-source', component: 'ListItem', label: 'Fonte de recursos' },
    ],
  },
  {
    id: 'invest-earn-review',
    title: 'Review',
    description: 'Deposit confirmation screen with amount summary, fee breakdown, and earnings projection.',
    componentsUsed: ['BaseLayout', 'Header', 'Button', 'Text', 'Amount', 'DataList', 'Banner', 'GroupHeader', 'StickyFooter', 'Stack'],
    component: Screen3_Review,
    interactiveElements: [
      { id: 'btn-confirm', component: 'Button', label: 'Confirmar depósito' },
    ],
  },
  {
    id: 'invest-earn-processing',
    title: 'Processing',
    description: 'Animated loading with deposit progress steps. Auto-advances after completion.',
    componentsUsed: ['LoadingScreen'],
    component: Screen4_Processing,
  },
  {
    id: 'invest-earn-success',
    title: 'Success',
    description: 'Deposit confirmed. Shows earning summary, next payout, and navigation options.',
    componentsUsed: ['FeedbackLayout', 'Button', 'Text', 'DataList', 'Banner', 'GroupHeader', 'StickyFooter', 'Stack'],
    component: Screen5_Success,
    interactiveElements: [
      { id: 'btn-done', component: 'Button', label: 'Concluir' },
      { id: 'btn-view-portfolio', component: 'Button', label: 'Ver portfólio' },
    ],
  },
]

// Register each screen as a standalone page (with states when defined)
for (const s of screenDefs) {
  registerPage({
    id: s.id,
    name: s.title,
    description: s.description,
    area: 'Earn',
    componentsUsed: [...s.componentsUsed],
    component: s.component,
    ...(s.states ? { states: s.states } : {}),
  })
}

registerFlow({
  id: 'invest-earn-5pct',
  name: 'USD Savings',
  description: 'Users deposit USD (from balance or via PIX) into a 5% APY savings product. No lock-up, daily interest accrual, instant withdrawals.',
  domain: 'earn',
  level: 2,
  entryPoints: ['deposit-success-nudge', 'dashboard-earn'],
  screens: screenDefs.map((s) => ({ ...s, pageId: s.id })),
})
