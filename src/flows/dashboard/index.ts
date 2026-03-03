import { registerFlow } from '../../pages/simulator/flowRegistry'
import { registerPage } from '../../pages/gallery/pageRegistry'
import { saveFlowGraph } from '../../pages/simulator/flowGraphStore'
import type { FlowNodeData } from '../../pages/simulator/flowGraph.types'
import Screen1_Dashboard from './Screen1_Dashboard'

const screenDefs = [
  {
    id: 'dashboard-main',
    title: 'Dashboard',
    description: 'Main home screen showing balance card, quick actions, promo carousel, pending tasks, and transaction history.',
    componentsUsed: [
      'BaseLayout', 'Stack', 'Text', 'Avatar', 'Badge', 'IconButton',
      'ListItem', 'Card', 'BottomSheet', 'GroupHeader', 'Button', 'ShortcutButton',
    ],
    component: Screen1_Dashboard,
    states: [
      { id: 'default', name: 'Default', isDefault: true, data: {} },
      { id: 'hidden', name: 'Hidden Values', data: { valuesHidden: true } },
      { id: 'pending-task', name: 'Pending Task', data: { hasPendingTask: true } },
      { id: 'updating', name: 'Balance Updating', data: { balanceUpdating: true } },
    ],
    interactiveElements: [
      { id: 'btn-deposit', component: 'ShortcutButton', label: 'Depositar' },
      { id: 'btn-receive', component: 'ShortcutButton', label: 'Receber' },
      { id: 'btn-toggle-values', component: 'IconButton', label: 'Mostrar/Ocultar' },
      { id: 'li-pending-tasks', component: 'ListItem', label: 'Tarefas pendentes' },
      { id: 'li-netflix', component: 'ListItem', label: 'Netflix' },
    ],
  },
]

for (const s of screenDefs) {
  registerPage({
    id: s.id,
    name: s.title,
    description: s.description,
    area: 'Dashboard',
    componentsUsed: [...s.componentsUsed],
    component: s.component,
    states: [...s.states],
  })
}

registerFlow({
  id: 'dashboard',
  name: 'Dashboard',
  description: 'Main home screen with balance overview, quick actions, promotions, and transaction history.',
  domain: 'dashboard',
  level: 1,
  linkedFlows: ['deposit-pix-v2', 'perks-benefits', 'caixinha-dolar', 'caixinha-deposit', 'caixinha-withdraw'],
  screens: screenDefs.map((s) => ({ ...s, pageId: s.id })),
})

// Bootstrap graph: tapping Depositar navigates to deposit-pix-v2
{
  const x = 300
  const xR = 600
  const ROW = 120

  const nodes = [
    { id: 'n-dashboard', type: 'screen', position: { x, y: 0 }, data: { label: 'Dashboard', screenId: 'dashboard-main', nodeType: 'screen', pageId: 'dashboard-main' } as FlowNodeData },
    { id: 'n-tap-deposit', type: 'action', position: { x: xR, y: 0 }, data: { label: 'Tap Depositar', screenId: null, nodeType: 'action', actionType: 'tap', actionTarget: 'ShortcutButton: Depositar' } as FlowNodeData },
    { id: 'n-ref-deposit', type: 'flow-reference', position: { x: xR, y: ROW }, data: { label: 'Deposit via PIX', screenId: null, nodeType: 'flow-reference', targetFlowId: 'deposit-pix-v2' } as FlowNodeData },
  ]

  const edges = [
    { id: 'e-dash-deposit', source: 'n-dashboard', target: 'n-tap-deposit', sourceHandle: 'right-source', targetHandle: 'left-target' },
    { id: 'e-deposit-ref', source: 'n-tap-deposit', target: 'n-ref-deposit', sourceHandle: 'bottom', targetHandle: 'top' },
  ]

  saveFlowGraph('dashboard', nodes, edges)
}
