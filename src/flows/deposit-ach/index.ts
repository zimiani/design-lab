import { registerFlow } from '../../pages/simulator/flowRegistry'
import { getFlowGraph, saveFlowGraph } from '../../pages/simulator/flowGraphStore'
import type { FlowNodeData } from '../../pages/simulator/flowGraph.types'
import { registerPage } from '../../pages/gallery/pageRegistry'
import Screen1_AccountData from './Screen1_AccountData'
import Screen2_Success from './Screen2_Success'

const screenDefs = [
  {
    id: 'deposit-ach-account-data',
    title: 'Account Data',
    description: 'Bank account details for receiving USD via ACH or Wire. Includes routing number, account number, and bank address with copy actions. "Prazos, limites e taxas" opens a BottomSheet with fee/limit info. "Compartilhar" opens an iOS share sheet simulation.',
    componentsUsed: ['BaseLayout', 'Header', 'Stack', 'Button', 'IconButton', 'ListItem', 'DataList', 'GroupHeader', 'Summary', 'Text', 'BottomSheet', 'StickyFooter', 'Toast'],
    component: Screen1_AccountData,
    interactiveElements: [
      { id: 'btn-share', component: 'Button', label: 'Compartilhar' },
      { id: 'btn-done', component: 'Button', label: 'Pronto' },
      { id: 'li-limits', component: 'ListItem', label: 'Prazos, limites e taxas' },
    ],
  },
  {
    id: 'deposit-ach-success',
    title: 'Awaiting Payment',
    description: 'Success/pending feedback screen shown after user confirms their bank details. Informs user that they will be notified when the deposit is recognized.',
    componentsUsed: ['FeedbackLayout', 'Stack', 'Button', 'Banner', 'Text', 'StickyFooter'],
    component: Screen2_Success,
    interactiveElements: [
      { id: 'btn-ok', component: 'Button', label: 'Entendi' },
    ],
  },
]

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
  id: 'deposit-ach',
  name: 'Deposit via ACH/Wire',
  description: 'Receive USD into your Picnic account via ACH or Wire transfer. User views their US bank account details, can share them, and confirms when the transfer has been initiated. The deposit appears in the transaction log and a push notification is sent when recognized.',
  domain: 'add-funds',
  level: 2,
  linkedFlows: ['deposit-pix-v2'],
  entryPoints: ['deposit-pix-v2-payment-method'],
  screens: screenDefs.map((s) => ({ ...s, pageId: s.id })),
})

// Bootstrap demo graph
if (!getFlowGraph('deposit-ach')) {
  const COL = 300
  const ROW = 120
  const x = 300

  const nodes = [
    { id: 'n-account', type: 'screen', position: { x, y: 0 }, data: { label: 'Account Data', screenId: 'deposit-ach-account-data', nodeType: 'screen', pageId: 'deposit-ach-account-data' } as FlowNodeData },
    // Overlay: limits BottomSheet
    { id: 'n-limits-sheet', type: 'overlay', position: { x: x - COL, y: ROW * 0.5 }, data: { label: 'Limits & Fees', screenId: null, nodeType: 'overlay', overlayType: 'bottom-sheet', parentScreenNodeId: 'n-account', description: 'Taxas, prazos estimados e limites de transferência' } as FlowNodeData },
    // Overlay: iOS share sheet
    { id: 'n-share-sheet', type: 'overlay', position: { x: x + COL, y: ROW * 0.5 }, data: { label: 'iOS Share Sheet', screenId: null, nodeType: 'overlay', overlayType: 'dialog', parentScreenNodeId: 'n-account', description: 'Sistema iOS share dialog — compartilhar dados bancários via AirDrop, WhatsApp, Copiar, etc.' } as FlowNodeData },
    // Action: User taps Pronto
    { id: 'n-tap-done', type: 'action', position: { x, y: ROW }, data: { label: 'User taps Pronto', screenId: null, nodeType: 'action', actionType: 'tap', actionTarget: 'Button: Pronto' } as FlowNodeData },
    // Success screen
    { id: 'n-success', type: 'screen', position: { x, y: ROW * 2 }, data: { label: 'Awaiting Payment', screenId: 'deposit-ach-success', nodeType: 'screen', pageId: 'deposit-ach-success' } as FlowNodeData },
    // Post-success: async events
    { id: 'n-wait', type: 'delay', position: { x, y: ROW * 3 }, data: { label: 'Await bank transfer', screenId: null, nodeType: 'delay', delayType: 'webhook', delayDuration: '~1-3 days' } as FlowNodeData },
    // Decision: deposit recognized
    { id: 'n-recognized', type: 'decision', position: { x, y: ROW * 4 }, data: { label: 'Deposit recognized?', screenId: null, nodeType: 'decision', description: 'Banking partner confirms the incoming transfer' } as FlowNodeData },
    // Note
    { id: 'n-note', type: 'note', position: { x: x - COL, y: ROW * 3.5 }, data: { label: 'Post-deposit', screenId: null, nodeType: 'note', description: 'When the deposit is recognized: the new deposit appears on the transaction log and a push notification is sent to the user.' } as FlowNodeData },
  ]

  const edges = [
    { id: 'e-limits', source: 'n-account', target: 'n-limits-sheet' },
    { id: 'e-share', source: 'n-account', target: 'n-share-sheet' },
    { id: 'e-done', source: 'n-account', target: 'n-tap-done' },
    { id: 'e-to-success', source: 'n-tap-done', target: 'n-success' },
    { id: 'e-to-wait', source: 'n-success', target: 'n-wait', sourceHandle: 'bottom', targetHandle: 'top' },
    { id: 'e-to-check', source: 'n-wait', target: 'n-recognized', sourceHandle: 'bottom', targetHandle: 'top' },
  ]

  saveFlowGraph('deposit-ach', nodes, edges)
}
