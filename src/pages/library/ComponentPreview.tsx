import { useState } from 'react'
import {
  Home,
  Wallet,
  ArrowLeftRight,
  TrendingUp,
  User,
  QrCode,
  CreditCard,
  Landmark,
  Search,
  Bell,
  Inbox,
} from 'lucide-react'
import type { ComponentMeta } from '../../library/registry'

import Text from '../../library/foundations/Text'
import Icon from '../../library/foundations/Icon'
import Divider from '../../library/foundations/Divider'
import Spacer from '../../library/foundations/Spacer'
import Button from '../../library/inputs/Button'
import TextInput from '../../library/inputs/TextInput'
import CurrencyInput from '../../library/inputs/CurrencyInput'
import PinInput from '../../library/inputs/PinInput'
import Checkbox from '../../library/inputs/Checkbox'
import Toggle from '../../library/inputs/Toggle'
import Select from '../../library/inputs/Select'
import Card from '../../library/display/Card'
import ListItem from '../../library/display/ListItem'
import Badge from '../../library/display/Badge'
import Avatar from '../../library/display/Avatar'
import Tag from '../../library/display/Tag'
import ProgressBar from '../../library/display/ProgressBar'
import Amount from '../../library/display/Amount'
import Toast from '../../library/feedback/Toast'
import EmptyState from '../../library/feedback/EmptyState'
import LoadingSpinner from '../../library/feedback/LoadingSpinner'
import Skeleton from '../../library/feedback/Skeleton'
import SuccessAnimation from '../../library/feedback/SuccessAnimation'
import Header from '../../library/navigation/Header'
import TabBar from '../../library/navigation/TabBar'
import SegmentedControl from '../../library/navigation/SegmentedControl'
import ScreenLayout from '../../library/layout/ScreenLayout'
import FormLayout from '../../library/layout/FormLayout'
import ResultLayout from '../../library/layout/ResultLayout'
import BottomSheet from '../../library/layout/BottomSheet'
import ActionSheet from '../../library/layout/ActionSheet'

interface ComponentPreviewProps {
  meta: ComponentMeta
}

export default function ComponentPreview({ meta }: ComponentPreviewProps) {
  return (
    <div className="flex flex-col gap-[var(--token-spacing-lg)]">
      <PreviewContent name={meta.name} />
    </div>
  )
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-[length:var(--token-font-size-caption)] font-medium text-text-secondary uppercase tracking-wider mb-[var(--token-spacing-2)]">
      {children}
    </p>
  )
}

function PreviewContent({ name }: { name: string }) {
  switch (name) {
    case 'Text':
      return <TextPreview />
    case 'Icon':
      return <IconPreview />
    case 'Divider':
      return <DividerPreview />
    case 'Spacer':
      return <SpacerPreview />
    case 'Button':
      return <ButtonPreview />
    case 'TextInput':
      return <TextInputPreview />
    case 'CurrencyInput':
      return <CurrencyInputPreview />
    case 'PinInput':
      return <PinInputPreview />
    case 'Checkbox':
      return <CheckboxPreview />
    case 'Toggle':
      return <TogglePreview />
    case 'Select':
      return <SelectPreview />
    case 'Card':
      return <CardPreview />
    case 'ListItem':
      return <ListItemPreview />
    case 'Badge':
      return <BadgePreview />
    case 'Avatar':
      return <AvatarPreview />
    case 'Tag':
      return <TagPreview />
    case 'ProgressBar':
      return <ProgressBarPreview />
    case 'Amount':
      return <AmountPreview />
    case 'Toast':
      return <ToastPreview />
    case 'EmptyState':
      return <EmptyStatePreview />
    case 'LoadingSpinner':
      return <LoadingSpinnerPreview />
    case 'Skeleton':
      return <SkeletonPreview />
    case 'SuccessAnimation':
      return <SuccessAnimationPreview />
    case 'Header':
      return <HeaderPreview />
    case 'TabBar':
      return <TabBarPreview />
    case 'SegmentedControl':
      return <SegmentedControlPreview />
    case 'ScreenLayout':
      return <ScreenLayoutPreview />
    case 'FormLayout':
      return <FormLayoutPreview />
    case 'ResultLayout':
      return <ResultLayoutPreview />
    case 'BottomSheet':
      return <BottomSheetPreview />
    case 'ActionSheet':
      return <ActionSheetPreview />
    default:
      return <p className="text-text-tertiary">No preview available</p>
  }
}

function TextPreview() {
  return (
    <div className="flex flex-col gap-[var(--token-spacing-2)] bg-surface-primary p-[var(--token-spacing-md)] rounded-[var(--token-radius-md)]">
      <Text variant="display">Display — R$ 12,450.00</Text>
      <Text variant="heading-lg">Heading Large</Text>
      <Text variant="heading-md">Heading Medium</Text>
      <Text variant="heading-sm">Heading Small</Text>
      <Text variant="body-lg">Body Large — regular paragraph text</Text>
      <Text variant="body-md">Body Medium — standard content</Text>
      <Text variant="body-sm">Body Small — secondary information</Text>
      <Text variant="caption">Caption — timestamps and labels</Text>
      <Text variant="body-md" color="text-secondary">Colored text with token</Text>
    </div>
  )
}

function IconPreview() {
  const icons = [Home, Wallet, ArrowLeftRight, TrendingUp, User, Search, Bell]
  return (
    <div className="flex flex-col gap-[var(--token-spacing-md)]">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size}>
          <SectionLabel>{size}</SectionLabel>
          <div className="flex gap-[var(--token-spacing-3)] bg-surface-primary p-[var(--token-spacing-md)] rounded-[var(--token-radius-md)]">
            {icons.map((ic, i) => (
              <Icon key={i} icon={ic} size={size} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function DividerPreview() {
  return (
    <div className="bg-surface-primary p-[var(--token-spacing-md)] rounded-[var(--token-radius-md)]">
      <Text variant="body-sm">Content above</Text>
      <Divider spacing="sm" />
      <Text variant="body-sm">Spacing SM</Text>
      <Divider spacing="md" />
      <Text variant="body-sm">Spacing MD</Text>
      <Divider spacing="lg" />
      <Text variant="body-sm">Spacing LG</Text>
    </div>
  )
}

function SpacerPreview() {
  return (
    <div className="bg-surface-primary p-[var(--token-spacing-md)] rounded-[var(--token-radius-md)]">
      {(['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const).map((size) => (
        <div key={size}>
          <Text variant="caption">{size}</Text>
          <Spacer size={size} />
          <div className="h-[1px] bg-brand-200" />
        </div>
      ))}
    </div>
  )
}

function ButtonPreview() {
  return (
    <div className="flex flex-col gap-[var(--token-spacing-md)]">
      {(['primary', 'secondary', 'ghost', 'destructive'] as const).map((v) => (
        <div key={v}>
          <SectionLabel>{v}</SectionLabel>
          <div className="flex flex-wrap gap-[var(--token-spacing-2)]">
            {(['sm', 'md', 'lg'] as const).map((s) => (
              <Button key={s} variant={v} size={s}>
                {v} {s}
              </Button>
            ))}
            <Button variant={v} loading>Loading</Button>
            <Button variant={v} disabled>Disabled</Button>
          </div>
        </div>
      ))}
      <div>
        <SectionLabel>Full Width</SectionLabel>
        <Button fullWidth>Continue</Button>
      </div>
    </div>
  )
}

function TextInputPreview() {
  const [val, setVal] = useState('')
  return (
    <div className="flex flex-col gap-[var(--token-spacing-md)] max-w-[360px]">
      <TextInput label="Full name" placeholder="Enter your name" value={val} onChange={setVal} />
      <TextInput label="Email" placeholder="you@email.com" helperText="We'll never share your email" prefix={<span>@</span>} />
      <TextInput label="Amount" error="Minimum deposit is R$ 10.00" value="5" suffix={<span>BRL</span>} />
      <TextInput label="Disabled" placeholder="Can't edit" disabled />
    </div>
  )
}

function CurrencyInputPreview() {
  const [val, setVal] = useState('15000')
  return (
    <div className="flex flex-col gap-[var(--token-spacing-md)] max-w-[360px]">
      <CurrencyInput label="Amount to deposit" value={val} onChange={setVal} helperText="Min R$ 10.00" />
      <CurrencyInput label="With error" value="0" error="Amount must be greater than zero" />
      <CurrencyInput label="USD" currency="$" value="100000" />
      <CurrencyInput label="Disabled" disabled />
    </div>
  )
}

function PinInputPreview() {
  const [pin4, setPin4] = useState('')
  const [pin6, setPin6] = useState('')
  return (
    <div className="flex flex-col gap-[var(--token-spacing-lg)] items-center">
      <div>
        <SectionLabel>4 digits</SectionLabel>
        <PinInput length={4} value={pin4} onChange={setPin4} />
      </div>
      <div>
        <SectionLabel>6 digits</SectionLabel>
        <PinInput length={6} value={pin6} onChange={setPin6} />
      </div>
      <div>
        <SectionLabel>Error</SectionLabel>
        <PinInput length={4} value="12" error="Invalid code" />
      </div>
    </div>
  )
}

function CheckboxPreview() {
  const [a, setA] = useState(false)
  const [b, setB] = useState(true)
  return (
    <div className="flex flex-col gap-[var(--token-spacing-3)] bg-surface-primary p-[var(--token-spacing-md)] rounded-[var(--token-radius-md)]">
      <Checkbox label="Accept terms and conditions" checked={a} onChange={setA} />
      <Checkbox label="Enable notifications" checked={b} onChange={setB} />
      <Checkbox label="Disabled unchecked" disabled />
      <Checkbox label="Disabled checked" checked disabled />
    </div>
  )
}

function TogglePreview() {
  const [a, setA] = useState(false)
  const [b, setB] = useState(true)
  return (
    <div className="flex flex-col gap-[var(--token-spacing-3)] bg-surface-primary p-[var(--token-spacing-md)] rounded-[var(--token-radius-md)] max-w-[320px]">
      <Toggle label="Push notifications" checked={a} onChange={setA} />
      <Toggle label="Biometric login" checked={b} onChange={setB} />
      <Toggle label="Disabled" disabled />
    </div>
  )
}

function SelectPreview() {
  const [val, setVal] = useState('')
  return (
    <div className="flex flex-col gap-[var(--token-spacing-md)] max-w-[360px]">
      <Select
        label="Account type"
        options={[
          { label: 'Checking', value: 'checking' },
          { label: 'Savings', value: 'savings' },
          { label: 'Investment', value: 'investment' },
        ]}
        value={val}
        onChange={setVal}
        placeholder="Choose an account"
      />
      <Select label="With error" error="Please select an option" options={[]} />
      <Select label="Disabled" disabled options={[]} />
    </div>
  )
}

function CardPreview() {
  return (
    <div className="flex flex-col gap-[var(--token-spacing-md)]">
      {(['elevated', 'outlined', 'flat'] as const).map((v) => (
        <div key={v}>
          <SectionLabel>{v}</SectionLabel>
          <Card variant={v}>
            <Text variant="heading-sm">Account Balance</Text>
            <Text variant="display">R$ 12,450.00</Text>
          </Card>
        </div>
      ))}
      <div>
        <SectionLabel>Pressable</SectionLabel>
        <Card variant="elevated" pressable>
          <Text variant="body-md">Tap me</Text>
        </Card>
      </div>
    </div>
  )
}

function ListItemPreview() {
  return (
    <div className="bg-surface-primary rounded-[var(--token-radius-md)] overflow-hidden">
      <ListItem icon={<QrCode size={20} />} label="PIX" description="Instant transfer" rightValue="Free" />
      <ListItem icon={<Landmark size={20} />} label="TED" description="Bank transfer" rightValue="R$ 8.50" />
      <ListItem icon={<CreditCard size={20} />} label="Credit Card" description="Visa •••• 4242" />
      <ListItem label="No icon" description="Simple list item" showChevron={false} />
      <ListItem icon={<Wallet size={20} />} label="Disabled" disabled />
    </div>
  )
}

function BadgePreview() {
  return (
    <div className="flex flex-wrap gap-[var(--token-spacing-2)]">
      {(['success', 'warning', 'error', 'info', 'neutral'] as const).map((v) => (
        <div key={v} className="flex gap-[var(--token-spacing-2)]">
          <Badge variant={v} size="sm">{v} sm</Badge>
          <Badge variant={v} size="md">{v} md</Badge>
        </div>
      ))}
    </div>
  )
}

function AvatarPreview() {
  return (
    <div className="flex flex-col gap-[var(--token-spacing-md)]">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size}>
          <SectionLabel>{size}</SectionLabel>
          <div className="flex gap-[var(--token-spacing-3)]">
            <Avatar size={size} initials="RP" />
            <Avatar size={size} />
            <Avatar size={size} icon={<Wallet size={size === 'sm' ? 14 : size === 'md' ? 18 : 24} />} />
          </div>
        </div>
      ))}
    </div>
  )
}

function TagPreview() {
  return (
    <div className="flex flex-wrap gap-[var(--token-spacing-2)]">
      <Tag label="Crypto" />
      <Tag label="PIX" />
      <Tag label="Removable" removable onRemove={() => {}} />
      <Tag label="Investment" removable onRemove={() => {}} />
    </div>
  )
}

function ProgressBarPreview() {
  return (
    <div className="flex flex-col gap-[var(--token-spacing-md)] max-w-[360px]">
      <div>
        <SectionLabel>25%</SectionLabel>
        <ProgressBar value={25} />
      </div>
      <div>
        <SectionLabel>50%</SectionLabel>
        <ProgressBar value={50} />
      </div>
      <div>
        <SectionLabel>75%</SectionLabel>
        <ProgressBar value={75} />
      </div>
      <div>
        <SectionLabel>100%</SectionLabel>
        <ProgressBar value={100} />
      </div>
    </div>
  )
}

function AmountPreview() {
  return (
    <div className="flex flex-col gap-[var(--token-spacing-3)] bg-surface-primary p-[var(--token-spacing-md)] rounded-[var(--token-radius-md)]">
      <Amount value={12450.0} size="display" />
      <Amount value={5280.5} size="lg" />
      <Amount value={150.0} size="md" />
      <Amount value={-42.99} size="sm" />
      <Amount value={1000} currency="$" size="lg" />
    </div>
  )
}

function ToastPreview() {
  return (
    <div className="flex flex-col gap-[var(--token-spacing-3)]">
      {(['success', 'error', 'info', 'warning'] as const).map((v) => (
        <Toast key={v} variant={v} message={`This is a ${v} toast notification`} onDismiss={() => {}} />
      ))}
    </div>
  )
}

function EmptyStatePreview() {
  return (
    <div className="bg-surface-primary rounded-[var(--token-radius-md)]">
      <EmptyState
        icon={<Inbox size={48} />}
        title="No transactions yet"
        description="Your transactions will appear here once you make your first deposit."
        action={<Button size="sm">Make a deposit</Button>}
      />
    </div>
  )
}

function LoadingSpinnerPreview() {
  return (
    <div className="flex items-end gap-[var(--token-spacing-lg)]">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-[var(--token-spacing-2)]">
          <LoadingSpinner size={size} />
          <Text variant="caption">{size}</Text>
        </div>
      ))}
    </div>
  )
}

function SkeletonPreview() {
  return (
    <div className="flex flex-col gap-[var(--token-spacing-md)] bg-surface-primary p-[var(--token-spacing-md)] rounded-[var(--token-radius-md)] max-w-[320px]">
      <div className="flex items-center gap-[var(--token-spacing-3)]">
        <Skeleton variant="circle" height="40px" />
        <div className="flex-1 flex flex-col gap-[var(--token-spacing-2)]">
          <Skeleton height="14px" width="60%" />
          <Skeleton height="12px" width="40%" />
        </div>
      </div>
      <Skeleton variant="rect" height="120px" />
      <Skeleton height="14px" />
      <Skeleton height="14px" width="80%" />
    </div>
  )
}

function SuccessAnimationPreview() {
  return (
    <div className="flex items-end gap-[var(--token-spacing-lg)] justify-center">
      <SuccessAnimation size={48} />
      <SuccessAnimation size={80} />
      <SuccessAnimation size={120} />
    </div>
  )
}

function HeaderPreview() {
  return (
    <div className="flex flex-col gap-[var(--token-spacing-3)] bg-surface-primary rounded-[var(--token-radius-md)] overflow-hidden">
      <Header title="Deposit" onBack={() => {}} />
      <Header title="Settings" rightAction={<Bell size={20} className="text-text-primary" />} />
      <Header title="Back + Action" onBack={() => {}} rightAction={<Search size={20} className="text-text-primary" />} />
    </div>
  )
}

function TabBarPreview() {
  const [active, setActive] = useState('home')
  const items = [
    { id: 'home', label: 'Home', icon: <Home size={22} /> },
    { id: 'wallet', label: 'Wallet', icon: <Wallet size={22} /> },
    { id: 'transfer', label: 'Transfer', icon: <ArrowLeftRight size={22} /> },
    { id: 'invest', label: 'Invest', icon: <TrendingUp size={22} /> },
    { id: 'profile', label: 'Profile', icon: <User size={22} /> },
  ]
  return (
    <div className="bg-surface-primary rounded-[var(--token-radius-md)] overflow-hidden">
      <TabBar items={items} activeId={active} onChange={setActive} />
    </div>
  )
}

function SegmentedControlPreview() {
  const [idx, setIdx] = useState(0)
  return (
    <div className="max-w-[360px]">
      <SegmentedControl segments={['All', 'Income', 'Expense']} activeIndex={idx} onChange={setIdx} />
    </div>
  )
}

function ScreenLayoutPreview() {
  return (
    <div className="h-[300px] rounded-[var(--token-radius-md)] overflow-hidden border border-border-default">
      <ScreenLayout
        header={<Header title="Screen Layout" onBack={() => {}} />}
        bottomCTA={<Button fullWidth>Continue</Button>}
      >
        <div className="p-[var(--token-spacing-md)]">
          <Text variant="body-md">Scrollable content area with header and sticky bottom CTA.</Text>
        </div>
      </ScreenLayout>
    </div>
  )
}

function FormLayoutPreview() {
  return (
    <div className="h-[320px] rounded-[var(--token-radius-md)] overflow-hidden border border-border-default">
      <FormLayout
        header={<Header title="Form Layout" onBack={() => {}} />}
        submitButton={<Button fullWidth>Submit</Button>}
      >
        <TextInput label="Name" placeholder="Full name" />
        <TextInput label="Email" placeholder="you@email.com" />
      </FormLayout>
    </div>
  )
}

function ResultLayoutPreview() {
  return (
    <div className="h-[320px] rounded-[var(--token-radius-md)] overflow-hidden border border-border-default">
      <ResultLayout
        animation={<SuccessAnimation size={64} />}
        actions={
          <>
            <Button fullWidth>Done</Button>
            <Button variant="ghost" fullWidth>Share</Button>
          </>
        }
      >
        <Text variant="heading-md" align="center">Deposit confirmed!</Text>
        <Spacer size="xs" />
        <Text variant="body-md" color="text-secondary" align="center">R$ 150.00 added to your account</Text>
      </ResultLayout>
    </div>
  )
}

function BottomSheetPreview() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onPress={() => setOpen(true)}>Open Bottom Sheet</Button>
      <BottomSheet open={open} onClose={() => setOpen(false)} title="Transfer Details">
        <div className="flex flex-col gap-[var(--token-spacing-3)]">
          <Text variant="body-md">Amount: R$ 150.00</Text>
          <Text variant="body-md">To: John Doe</Text>
          <Text variant="body-md">Via: PIX</Text>
          <Spacer size="md" />
          <Button fullWidth onPress={() => setOpen(false)}>Confirm</Button>
        </div>
      </BottomSheet>
    </>
  )
}

function ActionSheetPreview() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onPress={() => setOpen(true)}>Open Action Sheet</Button>
      <ActionSheet
        open={open}
        onClose={() => setOpen(false)}
        title="What would you like to do?"
        actions={[
          { label: 'Copy PIX code', icon: <QrCode size={18} />, onPress: () => {} },
          { label: 'Share receipt', icon: <ArrowLeftRight size={18} />, onPress: () => {} },
          { label: 'Report issue', icon: <Bell size={18} />, destructive: true, onPress: () => {} },
        ]}
      />
    </>
  )
}
