import { registerFlow } from '../../pages/simulator/flowRegistry'
import { registerPage } from '../../pages/gallery/pageRegistry'
import { bootstrapFlowGraph } from '../../pages/simulator/flowGraphStore'
import type { FlowNodeData } from '../../pages/simulator/flowGraph.types'

// ── Onboarding screens ──
import Onboarding_Intro from '../poupar/Screen1_Intro'
import Onboarding_Insurance from '../poupar/Screen2_InsuranceAbout'

// ── Manage screens ──
import Manage_Dashboard from '../savings-v2/manage/Screen1_Dashboard'
import Manage_Hub from '../savings-v2/manage/Screen2_Hub'
import Manage_InsuranceCard from '../savings-reviewed/manage/Screen3_InsuranceCard'

// ── Deposit screens ──
import Deposit_Amount from '../savings-reviewed/deposit/Screen1_AmountEntry'
import Deposit_Review from '../savings-reviewed/deposit/Screen2_Review'
import Deposit_Processing from '../savings-reviewed/deposit/Screen3_Processing'
import Deposit_Success from '../savings-reviewed/deposit/Screen4_Success'

// ── Withdraw screens ──
import Withdraw_Amount from '../savings-reviewed/withdraw/Screen1_AmountEntry'
import Withdraw_Review from '../savings-reviewed/withdraw/Screen2_Review'
import Withdraw_Processing from '../savings-reviewed/withdraw/Screen3_Processing'
import Withdraw_Success from '../savings-reviewed/withdraw/Screen4_Success'

// ═══════════════════════════════════════════════════════════════
// SCREEN DEFINITIONS
// ═══════════════════════════════════════════════════════════════

const screenDefs = [
  // ── Onboarding ──
  {
    id: 'save-all-onboarding-intro',
    title: 'Onboarding – Intro',
    description: 'FeatureLayout introducing yields. Highlights automatic earnings, instant withdrawal, and insurance.',
    componentsUsed: ['FeatureLayout', 'Stack', 'Button', 'Text', 'Badge', 'Summary', 'GroupHeader', 'Link'],
    component: Onboarding_Intro,
    interactiveElements: [
      { id: 'btn-ativar', component: 'Button', label: 'Ativar minha Caixinha' },
      { id: 'link-seguro', component: 'Link', label: 'Saiba mais' },
      { id: 'btn-close', component: 'IconButton', label: 'Fechar' },
    ],
  },
  {
    id: 'save-all-onboarding-insurance',
    title: 'Onboarding – Insurance Details',
    description: 'Detailed OpenCover × Nexus Mutual vault cover explanation.',
    componentsUsed: ['BaseLayout', 'Header', 'Stack', 'Button', 'Banner', 'Summary', 'GroupHeader', 'DataList'],
    component: Onboarding_Insurance,
  },

  // ── Manage ──
  {
    id: 'save-all-manage-dashboard',
    title: 'Manage – Dashboard',
    description: 'Three pre-existing currency caixinhas. Only USD active, EUR/BRL disabled.',
    componentsUsed: ['FeatureLayout', 'Stack', 'Amount', 'Badge', 'GroupHeader', 'Banner', 'Text', 'Avatar'],
    component: Manage_Dashboard,
    interactiveElements: [
      { id: 'cc-usd', component: 'CurrencyCard', label: 'Dólar americano' },
      { id: 'sc-adicionar', component: 'ShortcutButton', label: 'Adicionar' },
      { id: 'sc-resgatar', component: 'ShortcutButton', label: 'Resgatar' },
    ],
    states: [
      { id: 'default', name: 'Com saldo', description: 'USD caixinha has balance', isDefault: true, data: {} },
      { id: 'pending', name: 'Processando', description: 'Deposit processing (~3 min)', data: { hasPending: true } },
      { id: 'no-balance', name: 'Sem saldo', description: 'All caixinhas zero balance', data: { hasBalance: false } },
    ],
  },
  {
    id: 'save-all-manage-hub',
    title: 'Manage – Hub (USD)',
    description: 'Dollar caixinha detail: chart, balance, deposit/withdraw shortcuts, tabs, insurance.',
    componentsUsed: ['BaseLayout', 'Header', 'LineChart', 'ShortcutButton', 'SegmentedControl', 'DataList', 'Banner', 'Text', 'Stack'],
    component: Manage_Hub,
    interactiveElements: [
      { id: 'sc-adicionar', component: 'ShortcutButton', label: 'Adicionar' },
      { id: 'sc-resgatar', component: 'ShortcutButton', label: 'Resgatar' },
      { id: 'btn-apolice', component: 'Button', label: 'Ver certificado' },
    ],
    states: [
      { id: 'default', name: 'Com saldo', description: 'Has balance', isDefault: true, data: {} },
      { id: 'pending', name: 'Processando', description: 'Deposit processing', data: { hasPending: true } },
      { id: 'no-balance', name: 'Sem saldo', description: 'Zero balance', data: { hasBalance: false } },
    ],
  },
  {
    id: 'save-all-manage-insurance',
    title: 'Manage – Insurance Card',
    description: 'Nexus Mutual-style green certificate card with coverage details.',
    componentsUsed: ['BaseLayout', 'Header', 'InsurancePolicyCard', 'Summary', 'GroupHeader', 'DataList', 'Text', 'Stack'],
    component: Manage_InsuranceCard,
  },

  // ── Deposit ──
  {
    id: 'save-all-deposit-amount',
    title: 'Deposit – Amount Entry',
    description: 'Currency-aware amount entry with instant redemption callout.',
    componentsUsed: ['BaseLayout', 'Header', 'CurrencyInput', 'DataList', 'Banner', 'StickyFooter', 'Button', 'Text', 'Stack'],
    component: Deposit_Amount,
    interactiveElements: [
      { id: 'btn-continuar', component: 'Button', label: 'Continuar' },
    ],
    states: [
      { id: 'usd', name: 'USD', description: 'Dollar deposit', isDefault: true, data: { currency: 'USD' } },
      { id: 'eur', name: 'EUR', description: 'Euro deposit', data: { currency: 'EUR' } },
    ],
  },
  {
    id: 'save-all-deposit-review',
    title: 'Deposit – Review',
    description: 'Review deposit with instant redemption callout and insurance mention.',
    componentsUsed: ['BaseLayout', 'Header', 'GroupHeader', 'DataList', 'Banner', 'StickyFooter', 'Button', 'Text', 'Stack'],
    component: Deposit_Review,
    interactiveElements: [
      { id: 'btn-confirmar', component: 'Button', label: 'Confirmar depósito' },
    ],
    states: [
      { id: 'usd', name: 'Dólar (USD)', description: 'Dollar deposit review', isDefault: true, data: { currency: 'USD' } },
      { id: 'eur', name: 'Euro (EUR)', description: 'Euro deposit review', data: { currency: 'EUR' } },
    ],
  },
  {
    id: 'save-all-deposit-processing',
    title: 'Deposit – Processing',
    description: 'Loading screen with deposit processing steps.',
    componentsUsed: ['LoadingScreen'],
    component: Deposit_Processing,
  },
  {
    id: 'save-all-deposit-success',
    title: 'Deposit – Success',
    description: 'Deposit confirmed with processing time info.',
    componentsUsed: ['FeedbackLayout', 'StickyFooter', 'Button', 'DataList', 'GroupHeader', 'Banner', 'Text', 'Stack'],
    component: Deposit_Success,
    interactiveElements: [
      { id: 'btn-entendi', component: 'Button', label: 'Entendi' },
    ],
    states: [
      { id: 'usd', name: 'Dólar (USD)', description: 'Dollar deposit success', isDefault: true, data: { currency: 'USD' } },
      { id: 'eur', name: 'Euro (EUR)', description: 'Euro deposit success', data: { currency: 'EUR' } },
    ],
  },

  // ── Withdraw ──
  {
    id: 'save-all-withdraw-amount',
    title: 'Withdraw – Amount Entry',
    description: 'USD withdrawal with instant redemption badge.',
    componentsUsed: ['BaseLayout', 'Header', 'CurrencyInput', 'DataList', 'Badge', 'StickyFooter', 'Button', 'Text', 'Stack'],
    component: Withdraw_Amount,
    interactiveElements: [
      { id: 'btn-continuar', component: 'Button', label: 'Continuar' },
    ],
    states: [
      { id: 'usd', name: 'Dólar (USD)', description: 'Dollar withdrawal', isDefault: true, data: { currency: 'USD' } },
      { id: 'eur', name: 'Euro (EUR)', description: 'Withdraw USD, receive EUR', data: { currency: 'EUR' } },
    ],
  },
  {
    id: 'save-all-withdraw-review',
    title: 'Withdraw – Review',
    description: 'Withdrawal review with "Prazo: Imediato" in green.',
    componentsUsed: ['BaseLayout', 'Header', 'GroupHeader', 'DataList', 'StickyFooter', 'Button', 'Text', 'Stack'],
    component: Withdraw_Review,
    interactiveElements: [
      { id: 'btn-confirmar', component: 'Button', label: 'Confirmar resgate' },
    ],
    states: [
      { id: 'usd', name: 'Dólar (USD)', description: 'Dollar withdrawal review', isDefault: true, data: { currency: 'USD' } },
    ],
  },
  {
    id: 'save-all-withdraw-processing',
    title: 'Withdraw – Processing',
    description: 'Loading screen with withdrawal processing steps.',
    componentsUsed: ['LoadingScreen'],
    component: Withdraw_Processing,
  },
  {
    id: 'save-all-withdraw-success',
    title: 'Withdraw – Success',
    description: 'Withdrawal confirmed.',
    componentsUsed: ['FeedbackLayout', 'StickyFooter', 'Button', 'DataList', 'GroupHeader', 'Text', 'Stack'],
    component: Withdraw_Success,
    interactiveElements: [
      { id: 'btn-entendi', component: 'Button', label: 'Entendi' },
    ],
    states: [
      { id: 'default', name: 'Com saldo', description: 'Has remaining balance', isDefault: true, data: { currency: 'USD' } },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════
// REGISTER PAGES
// ═══════════════════════════════════════════════════════════════

for (const s of screenDefs) {
  registerPage({
    id: s.id,
    name: s.title,
    description: s.description,
    area: 'Earn',
    componentsUsed: [...s.componentsUsed],
    component: s.component,
    ...('states' in s && Array.isArray(s.states) ? { states: s.states } : {}),
  })
}

// ═══════════════════════════════════════════════════════════════
// REGISTER FLOW
// ═══════════════════════════════════════════════════════════════

registerFlow({
  id: 'save-all',
  name: 'Save (Unified)',
  description: 'Complete savings journey: onboarding, manage, deposit, and withdraw in a single flow.',
  domain: 'earn',
  level: 1,
  screens: screenDefs.map(s => ({
    id: s.id,
    title: s.title,
    description: s.description,
    componentsUsed: s.componentsUsed,
    component: s.component,
    ...(s.interactiveElements ? { interactiveElements: s.interactiveElements } : {}),
    ...('states' in s && Array.isArray(s.states) ? { states: s.states } : {}),
  })),
})

// ═══════════════════════════════════════════════════════════════
// FLOW GRAPH
// ═══════════════════════════════════════════════════════════════

{
  const ROW = 120
  // Action nodes are 120px wide, screen nodes 200px — offset to center-align
  const AC = 40
  // Internal padding for group nodes
  const GP = 40
  // Group header height (label bar)
  const GH = 40

  // Group positions (absolute)
  const GX_ONBOARD = 0
  const GX_MANAGE = 520
  const GX_DEPOSIT = 1060
  const GX_WITHDRAW = 1440

  // Group colors
  const CLR_ONBOARD = '#4ADE80'
  const CLR_MANAGE = '#60A5FA'
  const CLR_DEPOSIT = '#FBBF24'
  const CLR_WITHDRAW = '#FB923C'

  const nodes = [
    // ═══════════════════════════════════════════════════════════
    // GROUP NODES (parents)
    // ═══════════════════════════════════════════════════════════

    { id: 'g-onboard', type: 'group', position: { x: GX_ONBOARD, y: 0 },
      style: { width: 520, height: ROW * 3 + GH + GP * 2 },
      data: { label: 'Onboarding', screenId: null, nodeType: 'group', groupColor: CLR_ONBOARD } as FlowNodeData },

    { id: 'g-manage', type: 'group', position: { x: GX_MANAGE, y: 0 },
      style: { width: 520, height: ROW * 5 + GH + GP * 2 },
      data: { label: 'Manage', screenId: null, nodeType: 'group', groupColor: CLR_MANAGE } as FlowNodeData },

    { id: 'g-deposit', type: 'group', position: { x: GX_DEPOSIT, y: ROW * 3 },
      style: { width: 300, height: ROW * 8 + GH + GP * 2 },
      data: { label: 'Deposit', screenId: null, nodeType: 'group', groupColor: CLR_DEPOSIT } as FlowNodeData },

    { id: 'g-withdraw', type: 'group', position: { x: GX_WITHDRAW, y: ROW * 3 },
      style: { width: 300, height: ROW * 8 + GH + GP * 2 },
      data: { label: 'Withdraw', screenId: null, nodeType: 'group', groupColor: CLR_WITHDRAW } as FlowNodeData },

    // ═══════════════════════════════════════════════════════════
    // ONBOARDING (children of g-onboard, relative positions)
    // ═══════════════════════════════════════════════════════════

    { id: 's-onboard-intro', type: 'screen', parentId: 'g-onboard',
      position: { x: GP, y: GH + GP },
      data: { label: 'Intro', screenId: 'save-all-onboarding-intro', nodeType: 'screen',
              pageId: 'save-all-onboarding-intro', description: 'Savings intro with activate CTA' } as FlowNodeData },

    { id: 'a-tap-ativar', type: 'action', parentId: 'g-onboard',
      position: { x: GP + AC, y: GH + GP + ROW },
      data: { label: 'Tap Ativar', screenId: null, nodeType: 'action',
              actionType: 'tap', actionTarget: 'Button: Ativar minha Caixinha' } as FlowNodeData },

    { id: 'a-tap-seguro', type: 'action', parentId: 'g-onboard',
      position: { x: 250 + AC, y: GH + GP + ROW },
      data: { label: 'Tap Saiba mais', screenId: null, nodeType: 'action',
              actionType: 'tap', actionTarget: 'Link: Saiba mais' } as FlowNodeData },

    { id: 's-onboard-insurance', type: 'screen', parentId: 'g-onboard',
      position: { x: 250, y: GH + GP + ROW * 2 },
      data: { label: 'Insurance Details', screenId: 'save-all-onboarding-insurance', nodeType: 'screen',
              pageId: 'save-all-onboarding-insurance', description: 'OpenCover insurance explained' } as FlowNodeData },

    { id: 'api-activate', type: 'api-call', parentId: 'g-onboard',
      position: { x: GP, y: GH + GP + ROW * 2 },
      data: { label: 'Activate Yields', screenId: null, nodeType: 'api-call',
              apiMethod: 'POST', apiEndpoint: '/api/savings/activate',
              description: 'Enable automatic yield' } as FlowNodeData },

    // ═══════════════════════════════════════════════════════════
    // MANAGE (children of g-manage, relative positions)
    // ═══════════════════════════════════════════════════════════

    { id: 's-manage-dashboard', type: 'screen', parentId: 'g-manage',
      position: { x: 140, y: GH + GP },
      data: { label: 'Dashboard', screenId: 'save-all-manage-dashboard', nodeType: 'screen',
              pageId: 'save-all-manage-dashboard', description: 'Multi-currency caixinha list' } as FlowNodeData },

    { id: 'a-tap-dolar', type: 'action', parentId: 'g-manage',
      position: { x: 140 + AC, y: GH + GP + ROW },
      data: { label: 'Tap Dólar', screenId: null, nodeType: 'action',
              actionType: 'tap', actionTarget: 'CurrencyCard: Dólar americano' } as FlowNodeData },

    { id: 's-manage-hub', type: 'screen', parentId: 'g-manage',
      position: { x: 140, y: GH + GP + ROW * 2 },
      data: { label: 'Hub (USD)', screenId: 'save-all-manage-hub', nodeType: 'screen',
              pageId: 'save-all-manage-hub', description: 'Caixinha detail with chart and shortcuts' } as FlowNodeData },

    { id: 'a-hub-adicionar', type: 'action', parentId: 'g-manage',
      position: { x: 140 + AC, y: GH + GP + ROW * 3 },
      data: { label: 'Tap Adicionar', screenId: null, nodeType: 'action',
              actionType: 'tap', actionTarget: 'ShortcutButton: Adicionar' } as FlowNodeData },

    { id: 'a-hub-resgatar', type: 'action', parentId: 'g-manage',
      position: { x: 340 + AC, y: GH + GP + ROW * 3 },
      data: { label: 'Tap Resgatar', screenId: null, nodeType: 'action',
              actionType: 'tap', actionTarget: 'ShortcutButton: Resgatar' } as FlowNodeData },

    { id: 'a-hub-certificado', type: 'action', parentId: 'g-manage',
      position: { x: GP + AC, y: GH + GP + ROW * 3 },
      data: { label: 'Tap Certificado', screenId: null, nodeType: 'action',
              actionType: 'tap', actionTarget: 'Button: Ver certificado' } as FlowNodeData },

    { id: 's-manage-insurance', type: 'screen', parentId: 'g-manage',
      position: { x: GP, y: GH + GP + ROW * 4 },
      data: { label: 'Insurance Card', screenId: 'save-all-manage-insurance', nodeType: 'screen',
              pageId: 'save-all-manage-insurance', description: 'Insurance certificate' } as FlowNodeData },

    // ═══════════════════════════════════════════════════════════
    // DEPOSIT (children of g-deposit, relative positions)
    // ═══════════════════════════════════════════════════════════

    { id: 's-deposit-amount', type: 'screen', parentId: 'g-deposit',
      position: { x: GP, y: GH + GP },
      data: { label: 'Amount Entry', screenId: 'save-all-deposit-amount', nodeType: 'screen',
              pageId: 'save-all-deposit-amount', description: 'Deposit amount input' } as FlowNodeData },

    { id: 'a-deposit-continuar', type: 'action', parentId: 'g-deposit',
      position: { x: GP + AC, y: GH + GP + ROW },
      data: { label: 'Tap Continuar', screenId: null, nodeType: 'action',
              actionType: 'tap', actionTarget: 'Button: Continuar' } as FlowNodeData },

    { id: 's-deposit-review', type: 'screen', parentId: 'g-deposit',
      position: { x: GP, y: GH + GP + ROW * 2 },
      data: { label: 'Review', screenId: 'save-all-deposit-review', nodeType: 'screen',
              pageId: 'save-all-deposit-review', description: 'Review deposit details' } as FlowNodeData },

    { id: 'a-deposit-confirmar', type: 'action', parentId: 'g-deposit',
      position: { x: GP + AC, y: GH + GP + ROW * 3 },
      data: { label: 'Tap Confirmar', screenId: null, nodeType: 'action',
              actionType: 'tap', actionTarget: 'Button: Confirmar depósito' } as FlowNodeData },

    { id: 'api-deposit', type: 'api-call', parentId: 'g-deposit',
      position: { x: GP, y: GH + GP + ROW * 4 },
      data: { label: 'Process Deposit', screenId: null, nodeType: 'api-call',
              apiMethod: 'POST', apiEndpoint: '/api/caixinha/deposit' } as FlowNodeData },

    { id: 's-deposit-processing', type: 'screen', parentId: 'g-deposit',
      position: { x: GP, y: GH + GP + ROW * 5 },
      data: { label: 'Processing', screenId: 'save-all-deposit-processing', nodeType: 'screen',
              pageId: 'save-all-deposit-processing', description: 'Deposit processing' } as FlowNodeData },

    { id: 's-deposit-success', type: 'screen', parentId: 'g-deposit',
      position: { x: GP, y: GH + GP + ROW * 6 },
      data: { label: 'Success', screenId: 'save-all-deposit-success', nodeType: 'screen',
              pageId: 'save-all-deposit-success', description: 'Deposit confirmed' } as FlowNodeData },

    { id: 'a-deposit-entendi', type: 'action', parentId: 'g-deposit',
      position: { x: GP + AC, y: GH + GP + ROW * 7 },
      data: { label: 'Tap Entendi', screenId: null, nodeType: 'action',
              actionType: 'tap', actionTarget: 'Button: Entendi' } as FlowNodeData },

    // ═══════════════════════════════════════════════════════════
    // WITHDRAW (children of g-withdraw, relative positions)
    // ═══════════════════════════════════════════════════════════

    { id: 's-withdraw-amount', type: 'screen', parentId: 'g-withdraw',
      position: { x: GP, y: GH + GP },
      data: { label: 'Amount Entry', screenId: 'save-all-withdraw-amount', nodeType: 'screen',
              pageId: 'save-all-withdraw-amount', description: 'Withdrawal amount' } as FlowNodeData },

    { id: 'a-withdraw-continuar', type: 'action', parentId: 'g-withdraw',
      position: { x: GP + AC, y: GH + GP + ROW },
      data: { label: 'Tap Continuar', screenId: null, nodeType: 'action',
              actionType: 'tap', actionTarget: 'Button: Continuar' } as FlowNodeData },

    { id: 's-withdraw-review', type: 'screen', parentId: 'g-withdraw',
      position: { x: GP, y: GH + GP + ROW * 2 },
      data: { label: 'Review', screenId: 'save-all-withdraw-review', nodeType: 'screen',
              pageId: 'save-all-withdraw-review', description: 'Review withdrawal' } as FlowNodeData },

    { id: 'a-withdraw-confirmar', type: 'action', parentId: 'g-withdraw',
      position: { x: GP + AC, y: GH + GP + ROW * 3 },
      data: { label: 'Tap Confirmar', screenId: null, nodeType: 'action',
              actionType: 'tap', actionTarget: 'Button: Confirmar resgate' } as FlowNodeData },

    { id: 'api-withdraw', type: 'api-call', parentId: 'g-withdraw',
      position: { x: GP, y: GH + GP + ROW * 4 },
      data: { label: 'Execute Withdrawal', screenId: null, nodeType: 'api-call',
              apiMethod: 'POST', apiEndpoint: '/api/caixinha/withdraw' } as FlowNodeData },

    { id: 's-withdraw-processing', type: 'screen', parentId: 'g-withdraw',
      position: { x: GP, y: GH + GP + ROW * 5 },
      data: { label: 'Processing', screenId: 'save-all-withdraw-processing', nodeType: 'screen',
              pageId: 'save-all-withdraw-processing', description: 'Withdrawal processing' } as FlowNodeData },

    { id: 's-withdraw-success', type: 'screen', parentId: 'g-withdraw',
      position: { x: GP, y: GH + GP + ROW * 6 },
      data: { label: 'Success', screenId: 'save-all-withdraw-success', nodeType: 'screen',
              pageId: 'save-all-withdraw-success', description: 'Withdrawal confirmed' } as FlowNodeData },

    { id: 'a-withdraw-entendi', type: 'action', parentId: 'g-withdraw',
      position: { x: GP + AC, y: GH + GP + ROW * 7 },
      data: { label: 'Tap Entendi', screenId: null, nodeType: 'action',
              actionType: 'tap', actionTarget: 'Button: Entendi' } as FlowNodeData },
  ]

  const edges = [
    // ── Onboarding ──
    { id: 'e-ob1', source: 's-onboard-intro', target: 'a-tap-ativar', sourceHandle: 'bottom', targetHandle: 'top' },
    { id: 'e-ob2', source: 's-onboard-intro', target: 'a-tap-seguro', sourceHandle: 'right-source', targetHandle: 'top' },
    { id: 'e-ob3', source: 'a-tap-seguro', target: 's-onboard-insurance', sourceHandle: 'bottom', targetHandle: 'top' },
    { id: 'e-ob4', source: 'a-tap-ativar', target: 'api-activate', sourceHandle: 'bottom', targetHandle: 'top' },
    // Onboarding → Manage (cross-group)
    { id: 'e-ob-manage', source: 'api-activate', target: 's-manage-dashboard', sourceHandle: 'right-source', targetHandle: 'left-target' },

    // ── Manage ──
    { id: 'e-m1', source: 's-manage-dashboard', target: 'a-tap-dolar', sourceHandle: 'bottom', targetHandle: 'top' },
    { id: 'e-m2', source: 'a-tap-dolar', target: 's-manage-hub', sourceHandle: 'bottom', targetHandle: 'top' },
    { id: 'e-m3', source: 's-manage-hub', target: 'a-hub-adicionar', sourceHandle: 'bottom', targetHandle: 'top' },
    { id: 'e-m4', source: 's-manage-hub', target: 'a-hub-resgatar', sourceHandle: 'right-source', targetHandle: 'top' },
    { id: 'e-m5', source: 's-manage-hub', target: 'a-hub-certificado', sourceHandle: 'left-source', targetHandle: 'top' },
    { id: 'e-m6', source: 'a-hub-certificado', target: 's-manage-insurance', sourceHandle: 'bottom', targetHandle: 'top' },

    // Manage → Deposit/Withdraw (cross-group)
    { id: 'e-hub-deposit', source: 'a-hub-adicionar', target: 's-deposit-amount', sourceHandle: 'right-source', targetHandle: 'left-target' },
    { id: 'e-hub-withdraw', source: 'a-hub-resgatar', target: 's-withdraw-amount', sourceHandle: 'right-source', targetHandle: 'left-target' },

    // ── Deposit ──
    { id: 'e-d1', source: 's-deposit-amount', target: 'a-deposit-continuar', sourceHandle: 'bottom', targetHandle: 'top' },
    { id: 'e-d2', source: 'a-deposit-continuar', target: 's-deposit-review', sourceHandle: 'bottom', targetHandle: 'top' },
    { id: 'e-d3', source: 's-deposit-review', target: 'a-deposit-confirmar', sourceHandle: 'bottom', targetHandle: 'top' },
    { id: 'e-d4', source: 'a-deposit-confirmar', target: 'api-deposit', sourceHandle: 'bottom', targetHandle: 'top' },
    { id: 'e-d5', source: 'api-deposit', target: 's-deposit-processing', sourceHandle: 'bottom', targetHandle: 'top' },
    { id: 'e-d6', source: 's-deposit-processing', target: 's-deposit-success', sourceHandle: 'bottom', targetHandle: 'top' },
    { id: 'e-d7', source: 's-deposit-success', target: 'a-deposit-entendi', sourceHandle: 'bottom', targetHandle: 'top' },
    // Deposit → back to Dashboard (cross-group)
    { id: 'e-d-back', source: 'a-deposit-entendi', target: 's-manage-dashboard', sourceHandle: 'left-source', targetHandle: 'right-target' },

    // ── Withdraw ──
    { id: 'e-w1', source: 's-withdraw-amount', target: 'a-withdraw-continuar', sourceHandle: 'bottom', targetHandle: 'top' },
    { id: 'e-w2', source: 'a-withdraw-continuar', target: 's-withdraw-review', sourceHandle: 'bottom', targetHandle: 'top' },
    { id: 'e-w3', source: 's-withdraw-review', target: 'a-withdraw-confirmar', sourceHandle: 'bottom', targetHandle: 'top' },
    { id: 'e-w4', source: 'a-withdraw-confirmar', target: 'api-withdraw', sourceHandle: 'bottom', targetHandle: 'top' },
    { id: 'e-w5', source: 'api-withdraw', target: 's-withdraw-processing', sourceHandle: 'bottom', targetHandle: 'top' },
    { id: 'e-w6', source: 's-withdraw-processing', target: 's-withdraw-success', sourceHandle: 'bottom', targetHandle: 'top' },
    { id: 'e-w7', source: 's-withdraw-success', target: 'a-withdraw-entendi', sourceHandle: 'bottom', targetHandle: 'top' },
    // Withdraw → back to Dashboard (cross-group)
    { id: 'e-w-back', source: 'a-withdraw-entendi', target: 's-manage-dashboard', sourceHandle: 'left-source', targetHandle: 'right-target' },
  ]

  bootstrapFlowGraph('save-all', nodes, edges, 7)
}
