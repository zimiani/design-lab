import { registerFlow } from '../../pages/simulator/flowRegistry'
import { registerPage } from '../../pages/gallery/pageRegistry'
import Screen1_PerksHome from './Screen1_PerksHome'
import Screen2_BenefitsPromos from './Screen2_BenefitsPromos'
import Screen3_DollarRate from './Screen3_DollarRate'
import Screen4_Conversion from './Screen4_Conversion'
import Screen5_SavingsBreakdown from './Screen5_SavingsBreakdown'
import Screen6_Share from './Screen6_Share'
import specContent from './spec.md?raw'

const screenDefs = [
  {
    id: 'perks-home',
    title: 'Perks Home',
    description: 'Hero landing page showcasing Picnic benefits with CTA to explore more.',
    componentsUsed: ['FeatureLayout', 'Stack', 'Text', 'Badge', 'Summary', 'Banner', 'Button', 'StickyFooter'],
    component: Screen1_PerksHome,
    interactiveElements: [
      { id: 'btn-explore', component: 'Button', label: 'Explorar benefícios' },
    ],
  },
  {
    id: 'perks-benefits-promos',
    title: 'Benefits & Promos',
    description: 'Segmented list of highlights (fee-free conversion, cashback) and referral program.',
    componentsUsed: ['Header', 'BaseLayout', 'SegmentedControl', 'ListItem', 'Divider', 'Badge', 'Text'],
    component: Screen2_BenefitsPromos,
    interactiveElements: [
      { id: 'seg-highlights', component: 'SegmentedControl', label: 'Destaques' },
      { id: 'seg-promos', component: 'SegmentedControl', label: 'Promoções' },
      { id: 'li-dollar-rate', component: 'ListItem', label: 'Dólar sem taxas' },
      { id: 'li-cashback', component: 'ListItem', label: 'Cashback' },
    ],
  },
  {
    id: 'perks-dollar-rate',
    title: 'Dollar Rate Detail',
    description: 'Explains competitive dollar conversion rate with benefits breakdown.',
    componentsUsed: ['FeatureLayout', 'Stack', 'Text', 'Button', 'IconButton', 'Link', 'BottomSheet', 'ListItem', 'StickyFooter'],
    component: Screen3_DollarRate,
    interactiveElements: [
      { id: 'btn-convert', component: 'Button', label: 'Converter agora' },
      { id: 'btn-share', component: 'IconButton', label: 'Compartilhar' },
    ],
  },
  {
    id: 'perks-conversion',
    title: 'Currency Conversion',
    description: 'BRL to USD conversion form with real-time rate preview.',
    componentsUsed: ['Header', 'FormLayout', 'CurrencyInput', 'Card', 'Text', 'Amount', 'Button'],
    component: Screen4_Conversion,
    interactiveElements: [
      { id: 'input-brl', component: 'CurrencyInput', label: 'Valor (BRL)' },
      { id: 'btn-convert', component: 'Button', label: 'Converter' },
    ],
  },
  {
    id: 'perks-savings-breakdown',
    title: 'Savings Breakdown',
    description: 'Comparison table showing Picnic vs market fees with total savings.',
    componentsUsed: ['Text', 'Spacer', 'Divider', 'Amount'],
    component: Screen5_SavingsBreakdown,
  },
  {
    id: 'perks-share',
    title: 'Share',
    description: 'Share savings and referral code via WhatsApp, Instagram, email, or link.',
    componentsUsed: ['Header', 'BaseLayout', 'Text', 'Card', 'Badge', 'Amount', 'Toast', 'Spacer'],
    component: Screen6_Share,
    interactiveElements: [
      { id: 'btn-whatsapp', component: 'Button', label: 'WhatsApp' },
      { id: 'btn-copy-link', component: 'Button', label: 'Copiar link' },
    ],
  },
] as const

for (const s of screenDefs) {
  registerPage({
    id: s.id,
    name: s.title,
    description: s.description,
    area: 'Perks',
    componentsUsed: [...s.componentsUsed],
    component: s.component,
  })
}

registerFlow({
  id: 'perks-benefits',
  name: 'Perks & Benefits',
  description: 'User explores Picnic benefits — competitive dollar rates, cashback program, and referral rewards — with conversion flow and social sharing.',
  domain: 'perks',
  specContent,
  linkedFlows: ['deposit-pix-v2'],
  entryPoints: ['tab-bar', 'onboarding'],
  screens: screenDefs.map((s) => ({ ...s, pageId: s.id })),
})
