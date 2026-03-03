import { registerFlow } from '../../pages/simulator/flowRegistry'
import { registerPage } from '../../pages/gallery/pageRegistry'
import { getVersions, saveVersion, deleteVersion } from '../../pages/simulator/flowVersionStore'
import { autoGenerateFlowGraph } from '../../pages/simulator/flowGraphAutoGen'
import type { Flow } from '../../pages/simulator/flowRegistry'

// ── Shared screens ──
import SharedDepositAmount from './shared/SharedDepositAmount'
import SharedDepositReview from './shared/SharedDepositReview'
import SharedWithdrawAmount from './shared/SharedWithdrawAmount'
import SharedWithdrawReview from './shared/SharedWithdrawReview'
import SharedProcessing from './shared/SharedProcessing'
import SharedDepositSuccess from './shared/SharedDepositSuccess'
import SharedWithdrawSuccess from './shared/SharedWithdrawSuccess'

// ── Version A ──
import A_Screen1_Hub from './version-a/A_Screen1_Hub'

// ── Version B ──
import B_Screen1_Intro from './version-b/B_Screen1_Intro'
import B_Screen2_Hub from './version-b/B_Screen2_Hub'

// ── Version C ──
import C_Screen1_Portfolio from './version-c/C_Screen1_Portfolio'

// ── Version D ──
import D_Screen1_CaixinhaList from './version-d/D_Screen1_CaixinhaList'
import D_Screen2_CreateName from './version-d/D_Screen2_CreateName'
import D_Screen3_CreateGoal from './version-d/D_Screen3_CreateGoal'
import D_Screen4_CaixinhaDetail from './version-d/D_Screen4_CaixinhaDetail'

/* ═══════════════════════════════════════════════════════
 * FLOW 1: Deposit flow (shared, no versions)
 * Amount → Review → Processing → Success
 * ═══════════════════════════════════════════════════════ */

const depositScreenDefs = [
  {
    id: 'caixinha-deposit-amount',
    title: 'Deposit Amount',
    description: 'Currency entry with funding source selector, async calculation, and earnings projection.',
    componentsUsed: ['BaseLayout', 'Header', 'Stack', 'BottomSheet', 'Button', 'CurrencyInput', 'ListItem', 'Avatar', 'DataList', 'Banner', 'Text', 'Divider', 'StickyFooter', 'DataListSkeleton', 'BannerSkeleton'],
    component: SharedDepositAmount,
    states: [
      { id: 'default', name: 'Returning user', isDefault: true, data: {} },
      { id: 'new-user', name: 'First-time', data: { isNewUser: true } },
    ],
    interactiveElements: [
      { id: 'input-amount', component: 'CurrencyInput', label: 'Valor (USD)' },
      { id: 'btn-continue', component: 'Button', label: 'Continuar' },
    ],
  },
  {
    id: 'caixinha-deposit-review',
    title: 'Deposit Review',
    description: 'Review deposit amount, fee breakdown, and earnings projection before confirming.',
    componentsUsed: ['BaseLayout', 'Header', 'Stack', 'Button', 'Text', 'Amount', 'DataList', 'Banner', 'GroupHeader', 'StickyFooter'],
    component: SharedDepositReview,
    interactiveElements: [
      { id: 'btn-confirm', component: 'Button', label: 'Confirmar depósito' },
    ],
  },
  {
    id: 'caixinha-deposit-processing',
    title: 'Processing (Deposit)',
    description: 'Animated loading with deposit step messages.',
    componentsUsed: ['LoadingScreen'],
    component: SharedProcessing,
  },
  {
    id: 'caixinha-deposit-success',
    title: 'Deposit Success',
    description: 'Deposit confirmed with yield summary and navigation options.',
    componentsUsed: ['FeedbackLayout', 'Button', 'DataList', 'Banner', 'GroupHeader', 'Text', 'StickyFooter', 'Stack'],
    component: SharedDepositSuccess,
    interactiveElements: [
      { id: 'btn-view-earnings', component: 'Button', label: 'Ver meus rendimentos' },
      { id: 'btn-home', component: 'Button', label: 'Voltar ao início' },
    ],
  },
]

for (const s of depositScreenDefs) {
  registerPage({
    id: s.id,
    name: s.title,
    description: s.description,
    area: 'Earn',
    componentsUsed: [...s.componentsUsed],
    component: s.component,
    ...('states' in s && s.states ? { states: [...s.states] } : {}),
  })
}

registerFlow({
  id: 'caixinha-deposit',
  name: 'Caixinha — Depositar',
  description: 'Deposit flow for Caixinha do Dólar: amount entry → review → processing → success.',
  domain: 'earn',
  level: 2,
  entryPoints: ['caixinha-hub'],
  screens: depositScreenDefs.map((s) => ({ ...s, pageId: s.id })),
})

/* ═══════════════════════════════════════════════════════
 * FLOW 2: Withdraw flow (shared, no versions)
 * Amount → Review → Processing → Success
 * ═══════════════════════════════════════════════════════ */

const withdrawScreenDefs = [
  {
    id: 'caixinha-withdraw-amount',
    title: 'Withdraw Amount',
    description: 'Withdrawal amount entry with pre-filled balance, quick-pick buttons, and tax info.',
    componentsUsed: ['BaseLayout', 'Header', 'Stack', 'Button', 'CurrencyInput', 'DataList', 'StickyFooter'],
    component: SharedWithdrawAmount,
    interactiveElements: [
      { id: 'input-amount', component: 'CurrencyInput', label: 'Valor do resgate' },
      { id: 'btn-continue', component: 'Button', label: 'Continuar' },
    ],
  },
  {
    id: 'caixinha-withdraw-review',
    title: 'Withdraw Review',
    description: 'Review withdrawal details with tax breakdown before confirming.',
    componentsUsed: ['BaseLayout', 'Header', 'Stack', 'Button', 'Text', 'Amount', 'DataList', 'Banner', 'GroupHeader', 'StickyFooter'],
    component: SharedWithdrawReview,
    interactiveElements: [
      { id: 'btn-confirm', component: 'Button', label: 'Confirmar resgate' },
    ],
  },
  {
    id: 'caixinha-withdraw-processing',
    title: 'Processing (Withdraw)',
    description: 'Animated loading with withdraw step messages.',
    componentsUsed: ['LoadingScreen'],
    component: SharedProcessing,
  },
  {
    id: 'caixinha-withdraw-success',
    title: 'Withdraw Success',
    description: 'Withdrawal confirmed with transaction summary.',
    componentsUsed: ['FeedbackLayout', 'Button', 'DataList', 'GroupHeader', 'Text', 'StickyFooter', 'Stack'],
    component: SharedWithdrawSuccess,
    interactiveElements: [
      { id: 'btn-done', component: 'Button', label: 'Entendi' },
    ],
  },
]

for (const s of withdrawScreenDefs) {
  registerPage({
    id: s.id,
    name: s.title,
    description: s.description,
    area: 'Earn',
    componentsUsed: [...s.componentsUsed],
    component: s.component,
  })
}

registerFlow({
  id: 'caixinha-withdraw',
  name: 'Caixinha — Resgatar',
  description: 'Withdrawal flow for Caixinha do Dólar: amount → review → processing → success.',
  domain: 'earn',
  level: 2,
  entryPoints: ['caixinha-hub'],
  screens: withdrawScreenDefs.map((s) => ({ ...s, pageId: s.id })),
})

/* ═══════════════════════════════════════════════════════
 * FLOW 3: Main Caixinha flow (versioned — entry screens only)
 * Each version has only its unique hub/entry screens.
 * Deposit & withdraw are linked flows.
 * ═══════════════════════════════════════════════════════ */

const versionAScreenDefs = [
  {
    id: 'caixinha-a-hub',
    title: 'Hub (A)',
    description: 'Minimalist hub with balance card, yield ticker, quick actions, chart, and inline deposit/withdraw BottomSheets.',
    componentsUsed: ['BaseLayout', 'Header', 'Stack', 'BottomSheet', 'Button', 'CurrencyInput', 'ListItem', 'Avatar', 'DataList', 'Banner', 'LineChart', 'Text', 'Badge', 'Amount', 'ShortcutButton'],
    component: A_Screen1_Hub,
    states: [
      { id: 'default', name: 'Has balance', isDefault: true, data: {} },
      { id: 'new-user', name: 'New user', data: { isNewUser: true } },
    ],
    interactiveElements: [
      { id: 'btn-deposit', component: 'ShortcutButton', label: 'Depositar' },
      { id: 'btn-withdraw', component: 'ShortcutButton', label: 'Resgatar' },
    ],
  },
] as const

const versionBScreenDefs = [
  {
    id: 'caixinha-b-intro',
    title: 'Feature Intro (B)',
    description: 'FeatureLayout introduction with hero image, benefits summary, tax info, and activation CTA.',
    componentsUsed: ['FeatureLayout', 'StickyFooter', 'Stack', 'Button', 'Text', 'Badge', 'Banner', 'Summary'],
    component: B_Screen1_Intro,
    interactiveElements: [
      { id: 'btn-activate', component: 'Button', label: 'Ativar Caixinha' },
    ],
  },
  {
    id: 'caixinha-b-hub',
    title: 'Hub (B)',
    description: 'Detailed hub with SegmentedControl tabs (Resumo/Histórico), balance, chart, metrics, and history.',
    componentsUsed: ['BaseLayout', 'Header', 'Stack', 'SegmentedControl', 'ShortcutButton', 'Badge', 'Amount', 'DataList', 'Banner', 'LineChart', 'Text', 'ListItem', 'Avatar', 'GroupHeader'],
    component: B_Screen2_Hub,
    interactiveElements: [
      { id: 'btn-deposit', component: 'ShortcutButton', label: 'Depositar' },
      { id: 'btn-withdraw', component: 'ShortcutButton', label: 'Resgatar' },
      { id: 'seg-tabs', component: 'SegmentedControl', label: 'Resumo / Histórico' },
    ],
  },
] as const

const versionCScreenDefs = [
  {
    id: 'caixinha-c-portfolio',
    title: 'Portfolio (C)',
    description: 'Multi-product portfolio with caixinha as one product. Detail BottomSheet with balance, metrics, and actions.',
    componentsUsed: ['BaseLayout', 'Header', 'Stack', 'BottomSheet', 'ShortcutButton', 'Amount', 'DataList', 'Banner', 'ListItem', 'Avatar', 'Badge', 'GroupHeader', 'Text'],
    component: C_Screen1_Portfolio,
    states: [
      { id: 'default', name: 'Active', isDefault: true, data: {} },
      { id: 'new-user', name: 'New user', data: { isNewUser: true } },
    ],
    interactiveElements: [
      { id: 'li-caixinha', component: 'ListItem', label: 'Caixinha do Dólar' },
      { id: 'btn-deposit', component: 'ShortcutButton', label: 'Depositar' },
      { id: 'btn-withdraw', component: 'ShortcutButton', label: 'Resgatar' },
    ],
  },
] as const

const versionDScreenDefs = [
  {
    id: 'caixinha-d-list',
    title: 'Caixinha List (D)',
    description: 'List of user caixinhas with emoji, name, progress bar toward goal, and create new button.',
    componentsUsed: ['BaseLayout', 'Header', 'Stack', 'Button', 'Amount', 'Badge', 'Text', 'Card', 'ProgressBar'],
    component: D_Screen1_CaixinhaList,
    states: [
      { id: 'default', name: 'Has caixinhas', isDefault: true, data: {} },
      { id: 'new-user', name: 'Empty state', data: { isNewUser: true } },
    ],
    interactiveElements: [
      { id: 'btn-create', component: 'Button', label: 'Nova Caixinha' },
      { id: 'li-caixinha', component: 'Card', label: 'Caixinha item' },
    ],
  },
  {
    id: 'caixinha-d-create-name',
    title: 'Create — Name (D)',
    description: 'Choose emoji and name for a new caixinha. Live preview of emoji + name.',
    componentsUsed: ['BaseLayout', 'Header', 'Stack', 'Button', 'TextInput', 'Text', 'StickyFooter'],
    component: D_Screen2_CreateName,
    interactiveElements: [
      { id: 'input-name', component: 'TextInput', label: 'Nome da caixinha' },
      { id: 'btn-continue', component: 'Button', label: 'Continuar' },
    ],
  },
  {
    id: 'caixinha-d-create-goal',
    title: 'Create — Goal (D)',
    description: 'Set target amount and time horizon for the caixinha. Shows monthly deposit suggestion.',
    componentsUsed: ['BaseLayout', 'Header', 'Stack', 'Button', 'CurrencyInput', 'RadioGroup', 'DataList', 'Banner', 'Text', 'StickyFooter'],
    component: D_Screen3_CreateGoal,
    interactiveElements: [
      { id: 'input-target', component: 'CurrencyInput', label: 'Meta' },
      { id: 'radio-horizon', component: 'RadioGroup', label: 'Prazo' },
      { id: 'btn-create', component: 'Button', label: 'Criar Caixinha' },
    ],
  },
  {
    id: 'caixinha-d-detail',
    title: 'Caixinha Detail (D)',
    description: 'Per-caixinha detail: emoji hero, goal progress bar, balance, yield chart, deposit/withdraw actions.',
    componentsUsed: ['BaseLayout', 'Header', 'Stack', 'ShortcutButton', 'Amount', 'Badge', 'DataList', 'Banner', 'ProgressBar', 'LineChart', 'Text'],
    component: D_Screen4_CaixinhaDetail,
    interactiveElements: [
      { id: 'btn-deposit', component: 'ShortcutButton', label: 'Depositar' },
      { id: 'btn-withdraw', component: 'ShortcutButton', label: 'Resgatar' },
    ],
  },
] as const

// Register all version-unique screens in the page gallery
const mainFlowScreenDefs = [
  ...versionAScreenDefs,
  ...versionBScreenDefs,
  ...versionCScreenDefs,
  ...versionDScreenDefs,
]

for (const s of mainFlowScreenDefs) {
  registerPage({
    id: s.id,
    name: s.title,
    description: s.description,
    area: 'Earn',
    componentsUsed: [...s.componentsUsed],
    component: s.component,
    ...('states' in s && s.states ? { states: [...s.states] } : {}),
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mainFlowScreens = [...mainFlowScreenDefs].map((s) => ({ ...s, pageId: s.id })) as any[]

registerFlow({
  id: 'caixinha-dolar',
  name: 'Caixinha do Dólar',
  description: 'Fixed 5% APY savings on idle USD balances. Four exploration versions: A (minimalist hub), B (trust-first intro), C (portfolio), D (multi-caixinha goals). Deposit and withdraw are separate linked flows.',
  domain: 'earn',
  level: 2,
  entryPoints: ['dashboard-earn', 'invest-tab'],
  linkedFlows: ['dashboard', 'caixinha-deposit', 'caixinha-withdraw'],
  screens: mainFlowScreens,
})

/* ─── Bootstrap exploration versions with per-version graphs ─── */

const FLOW_ID = 'caixinha-dolar'

function makeGraphForScreens(screenDefs: ReadonlyArray<{ id: string; title: string; description: string; componentsUsed: readonly string[]; component: any; [key: string]: any }>) {
  const tempFlow: Flow = {
    id: FLOW_ID,
    name: 'Caixinha do Dólar',
    description: '',
    domain: 'earn',
    screens: screenDefs.map((s) => ({ ...s, pageId: s.id, componentsUsed: [...s.componentsUsed] })),
  }
  return autoGenerateFlowGraph(tempFlow)
}

const BOOTSTRAP_VERSION_KEY = 'picnic-design-lab:caixinha-dolar-bootstrap-v'
const BOOTSTRAP_VERSION = '2' // bump this to force re-bootstrap

function bootstrapVersions() {
  const bootstrapKey = BOOTSTRAP_VERSION_KEY + BOOTSTRAP_VERSION
  if (typeof localStorage !== 'undefined' && localStorage.getItem(bootstrapKey)) return

  // Clear old versions for this flow so we get fresh per-version graphs
  const existing = getVersions(FLOW_ID)
  for (const v of existing) {
    deleteVersion(FLOW_ID, v.id)
  }
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(bootstrapKey, '1')
  }

  // Version A — generate graph from ONLY version A screens
  const graphA = makeGraphForScreens(versionAScreenDefs)
  saveVersion(
    FLOW_ID, '1.0',
    'Version A — Nubank Caixinha: minimalist hub with BottomSheet deposit/withdraw.',
    graphA.nodes, graphA.edges,
    versionAScreenDefs.map((s) => s.id),
  )

  // Version B — generate graph from ONLY version B screens
  const graphB = makeGraphForScreens(versionBScreenDefs)
  saveVersion(
    FLOW_ID, '2.0',
    'Version B — Feature Introduction: FeatureLayout intro + SegmentedControl hub.',
    graphB.nodes, graphB.edges,
    versionBScreenDefs.map((s) => s.id),
  )

  // Version C — generate graph from ONLY version C screens
  const graphC = makeGraphForScreens(versionCScreenDefs)
  saveVersion(
    FLOW_ID, '3.0',
    'Version C — Dashboard-Integrated: multi-product portfolio with inline earn card.',
    graphC.nodes, graphC.edges,
    versionCScreenDefs.map((s) => s.id),
  )

  // Version D — generate graph from ONLY version D screens
  const graphD = makeGraphForScreens(versionDScreenDefs)
  saveVersion(
    FLOW_ID, '4.0',
    'Version D — Multi-Caixinha: multiple savings boxes with emoji, name, target, and progress tracking.',
    graphD.nodes, graphD.edges,
    versionDScreenDefs.map((s) => s.id),
  )
}

bootstrapVersions()
