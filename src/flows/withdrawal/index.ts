import { registerFlow } from '../../pages/simulator/flowRegistry'
import { registerPage } from '../../pages/gallery/pageRegistry'
import { getVersions, saveVersion } from '../../pages/simulator/flowVersionStore'
import { autoGenerateFlowGraph } from '../../pages/simulator/flowGraphAutoGen'
import type { Flow } from '../../pages/simulator/flowRegistry'

// Shared screens
import SharedProcessing from './shared/SharedProcessing'
import SharedSuccess from './shared/SharedSuccess'

// Version A screens
import A_Screen1_ChooseDestination from './version-a/A_Screen1_ChooseDestination'
import A_Screen2_ChooseRecipient from './version-a/A_Screen2_ChooseRecipient'
import A_Screen3_Amount from './version-a/A_Screen3_Amount'
import A_Screen4_Review from './version-a/A_Screen4_Review'

// Version B screens
import B_Screen1_Amount from './version-b/B_Screen1_Amount'
import B_Screen2_Recipient from './version-b/B_Screen2_Recipient'
import B_Screen3_Review from './version-b/B_Screen3_Review'

// Version C screens
import C_Screen1_Withdraw from './version-c/C_Screen1_Withdraw'

/* ─── Screen definitions ─── */

const sharedScreenDefs = [
  {
    id: 'withdrawal-processing',
    title: 'Processing',
    description: 'Animated loading with withdrawal-specific step messages.',
    componentsUsed: ['LoadingScreen'],
    component: SharedProcessing,
  },
  {
    id: 'withdrawal-success',
    title: 'Success',
    description: 'Withdrawal confirmed with recipient summary and transaction details.',
    componentsUsed: ['FeedbackLayout', 'Button', 'DataList', 'GroupHeader', 'Text', 'StickyFooter', 'Stack'],
    component: SharedSuccess,
  },
] as const

const versionAScreenDefs = [
  {
    id: 'withdrawal-a-choose-destination',
    title: 'Choose Destination',
    description: 'Select withdrawal destination type: PIX, Picnic account, Picnic user, or foreign bank.',
    componentsUsed: ['BaseLayout', 'Header', 'ListItem', 'Avatar', 'Text', 'Stack'],
    component: A_Screen1_ChooseDestination,
  },
  {
    id: 'withdrawal-a-choose-recipient',
    title: 'Choose Recipient',
    description: 'Search and select from saved recipients or add a new one.',
    componentsUsed: ['BaseLayout', 'Header', 'SearchBar', 'ListItem', 'Avatar', 'Stack'],
    component: A_Screen2_ChooseRecipient,
  },
  {
    id: 'withdrawal-a-amount',
    title: 'Amount',
    description: 'Enter withdrawal amount in USD with automatic BRL conversion and fee breakdown.',
    componentsUsed: ['BaseLayout', 'Header', 'CurrencyInput', 'DataList', 'DataListSkeleton', 'Button', 'StickyFooter'],
    component: A_Screen3_Amount,
  },
  {
    id: 'withdrawal-a-review',
    title: 'Review',
    description: 'Review withdrawal details with recipient, amounts, fees, and delivery estimate.',
    componentsUsed: ['BaseLayout', 'Header', 'ListItem', 'Avatar', 'DataList', 'Banner', 'GroupHeader', 'Button', 'StickyFooter', 'Stack'],
    component: A_Screen4_Review,
  },
] as const

const versionBScreenDefs = [
  {
    id: 'withdrawal-b-amount',
    title: 'Amount',
    description: 'Bi-directional currency input with destination type selector via BottomSheet.',
    componentsUsed: ['BaseLayout', 'Header', 'CurrencyInput', 'Divider', 'ListItem', 'Avatar', 'DataList', 'Banner', 'DataListSkeleton', 'BannerSkeleton', 'BottomSheet', 'Button', 'StickyFooter', 'Stack'],
    component: B_Screen1_Amount,
  },
  {
    id: 'withdrawal-b-recipient',
    title: 'Recipient',
    description: 'Search and select from saved recipients or add a new one.',
    componentsUsed: ['BaseLayout', 'Header', 'SearchBar', 'ListItem', 'Avatar', 'Stack'],
    component: B_Screen2_Recipient,
  },
  {
    id: 'withdrawal-b-review',
    title: 'Review',
    description: 'Review withdrawal details with recipient, amounts, fees, and delivery estimate.',
    componentsUsed: ['BaseLayout', 'Header', 'ListItem', 'Avatar', 'DataList', 'Banner', 'GroupHeader', 'Button', 'StickyFooter', 'Stack'],
    component: B_Screen3_Review,
  },
] as const

const versionCScreenDefs = [
  {
    id: 'withdrawal-c-withdraw',
    title: 'Withdraw',
    description: 'All-in-one withdrawal screen with destination, recipient, amount, and fees. Uses BottomSheets for selections.',
    componentsUsed: ['BaseLayout', 'Header', 'ListItem', 'Avatar', 'CurrencyInput', 'Divider', 'DataList', 'Banner', 'DataListSkeleton', 'BannerSkeleton', 'SearchBar', 'BottomSheet', 'Button', 'StickyFooter', 'Stack'],
    component: C_Screen1_Withdraw,
  },
] as const

/* ─── Register individual pages ─── */

const allScreenDefs = [
  ...versionAScreenDefs,
  ...versionBScreenDefs,
  ...versionCScreenDefs,
  ...sharedScreenDefs,
]

for (const s of allScreenDefs) {
  registerPage({
    id: s.id,
    name: s.title,
    description: s.description,
    area: 'Withdrawals',
    componentsUsed: [...s.componentsUsed],
    component: s.component,
  })
}

/* ─── Register single unified withdrawal flow ─── */

const allScreens = [...allScreenDefs].map((s) => ({ ...s, pageId: s.id }))

registerFlow({
  id: 'withdrawal',
  name: 'Saque',
  description: 'Withdrawal flow with multiple exploration versions: A (destination first), B (amount first), C (compact).',
  domain: 'send-funds',
  level: 2,
  screens: allScreens,
})

/* ─── Bootstrap exploration versions (once) ─── */

const FLOW_ID = 'withdrawal'

function bootstrapVersions() {
  const existing = getVersions(FLOW_ID)
  if (existing.length > 0) return // Already bootstrapped

  // We need a dummy graph to save with each version
  const dummyFlow: Flow = {
    id: FLOW_ID,
    name: 'Saque',
    description: '',
    domain: 'send-funds',
    screens: allScreens,
  }
  const graph = autoGenerateFlowGraph(dummyFlow)

  // Version A — Destination First
  const versionAScreenIds = [
    ...versionAScreenDefs.map((s) => s.id),
    ...sharedScreenDefs.map((s) => s.id),
  ]
  saveVersion(FLOW_ID, '1.0', 'Versão A — Destino Primeiro: guided step-by-step withdrawal flow.', graph.nodes, graph.edges, 'exploration', versionAScreenIds)

  // Version B — Amount First
  const versionBScreenIds = [
    ...versionBScreenDefs.map((s) => s.id),
    ...sharedScreenDefs.map((s) => s.id),
  ]
  saveVersion(FLOW_ID, '2.0', 'Versão B — Valor Primeiro: amount-first flow mirroring deposit-v2 patterns.', graph.nodes, graph.edges, 'exploration', versionBScreenIds)

  // Version C — Compact
  const versionCScreenIds = [
    ...versionCScreenDefs.map((s) => s.id),
    ...sharedScreenDefs.map((s) => s.id),
  ]
  saveVersion(FLOW_ID, '3.0', 'Versão C — Compacto: all-in-one single screen with BottomSheets.', graph.nodes, graph.edges, 'exploration', versionCScreenIds)
}

bootstrapVersions()
