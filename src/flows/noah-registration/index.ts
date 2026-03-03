import { registerFlow } from '../../pages/simulator/flowRegistry'
import { getFlowGraph, saveFlowGraph } from '../../pages/simulator/flowGraphStore'
import type { FlowNodeData } from '../../pages/simulator/flowGraph.types'
import { registerPage } from '../../pages/gallery/pageRegistry'
import Screen1_FirstAccess from './Screen1_FirstAccess'

const screenDefs = [
  {
    id: 'noah-registration-first-access',
    title: 'First Access',
    description: 'Onboarding screen for US bank account feature powered by Noah/GnosisPay. Explains zero fees, transfer limits, and estimated timelines. User activates their USD account to receive ACH/Wire transfers.',
    componentsUsed: ['FeatureLayout', 'Stack', 'Button', 'Badge', 'Banner', 'Summary', 'GroupHeader', 'Text', 'StickyFooter'],
    component: Screen1_FirstAccess,
    interactiveElements: [
      { id: 'btn-activate', component: 'Button', label: 'Ativar minha conta em USD' },
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
  id: 'noah-registration',
  name: 'Noah Registration',
  description: 'First-time activation of US bank account (Noah/GnosisPay). User learns about zero fees, ACH/Wire support, transfer limits, and activates their USD account through identity verification.',
  domain: 'add-funds',
  level: 2,
  linkedFlows: ['deposit-ach'],
  entryPoints: ['settings-bank-account', 'deposit-method-selector'],
  screens: screenDefs.map((s) => ({ ...s, pageId: s.id })),
})

// Bootstrap demo graph
if (!getFlowGraph('noah-registration')) {
  const x = 300
  const ROW = 120

  const nodes = [
    { id: 'n-first-access', type: 'screen', position: { x, y: 0 }, data: { label: 'First Access', screenId: 'noah-registration-first-access', nodeType: 'screen', pageId: 'noah-registration-first-access' } as FlowNodeData },
    // Flow reference to deposit-ach after activation
    { id: 'n-ref-deposit', type: 'flow-reference', position: { x, y: ROW }, data: { label: 'Deposit via ACH/Wire', screenId: null, nodeType: 'flow-reference', targetFlowId: 'deposit-ach' } as FlowNodeData },
  ]

  const edges = [
    { id: 'e-activate', source: 'n-first-access', target: 'n-ref-deposit', sourceHandle: 'bottom', targetHandle: 'top' },
  ]

  saveFlowGraph('noah-registration', nodes, edges)
}
