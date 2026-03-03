# Design Lab — Screen Patterns & Implementation Rules

> The authoritative guide for building flows and screens in design-lab.
> Every LLM agent, contributor, or developer **must** follow these rules.

---

## 1. Golden Rules

| # | Rule | Wrong | Right |
|---|------|-------|-------|
| 1 | **No arbitrary colors** | `bg-green-500`, `color: "#3B82F6"` | Use CSS variable tokens: `var(--color-feedback-success)`, `text-content-primary` |
| 2 | **No custom typography** | `text-[18px] font-bold` | `<Text variant="heading-sm">` |
| 3 | **No new layout containers** | Custom `<div>` wrappers with padding/margin | `<BaseLayout>`, `<Stack>`, `<Section>` |
| 4 | **No re-creating existing components** | Custom card with icon + text + chevron | `<ListItem>` with `left`, `title`, `subtitle`, `onPress` |
| 5 | **No inline spacing magic numbers** | `mt-[37px]`, `gap-[13px]` | Use spacing scale: 4 / 8 / 12 / 16 / 24 / 32 px |
| 6 | **No raw HTML/CSS in flows** | `<button className="...">`, `<div className="flex ...">` | Always use a library component |
| 7 | **When no component exists, ask or create one** | Building custom markup inline | Ask which component to use, or create a new library component |
| 8 | **English for names & docs** | Flow names, descriptions, or version labels in pt-br | Flow names, descriptions, screen titles, version labels, and documentation are always in English. Only in-screen UI copy (button labels, body text) is pt-br. |

**Rule 6 is the most important.** Flows must be composed entirely of library components. If a design requires UI that no component provides, the correct action is to create a new component in `src/library/` or extend an existing one — never to write raw markup inside a flow screen.

---

## 2. Spacing Scale

| Value | Token | When to use |
|-------|-------|-------------|
| 4px | `--token-spacing-1` | Tight inner padding (icon to label) |
| 8px | `--token-spacing-2` | Between closely related items |
| 12px | `--token-spacing-3` | Card inner padding, list item gaps |
| 16px | `--token-spacing-4` | Standard padding |
| 24px | `--token-spacing-6` | Screen margin, section padding |
| 32px | — | Between major sections |

Use `<Stack>` gap presets instead of manual spacing:
- `gap="none"` → 0px
- `gap="sm"` → 8px
- `gap="default"` → 16px
- `gap="lg"` → 24px

---

## 3. Component Catalog

### 3.1 Layout

| Component | When to use | Key props |
|-----------|-------------|-----------|
| **BaseLayout** | Every screen's root wrapper. Provides 24px margins, scroll, safe area. | `children` (Header first, StickyFooter last) |
| **StickyFooter** | Bottom CTA area. Must be last child of BaseLayout. | `children` |
| **Stack** | Group items vertically (or horizontally) with consistent gaps. | `gap`, `direction` (`column`/`row`), `align` (`start`/`center`/`end`/`between`), `children`, `className` |
| **Section** | Semantic content group with optional title. | `title`, `children` |
| **FormLayout** | Form screens with fixed header, scrollable content, sticky submit. | `header`, `children`, `submitButton` |
| **BottomSheet** | Supplementary overlay content. Bottom on mobile, centered on desktop. | `open`, `onClose`, `title`, `children` |
| **Modal** | Interrupting decisions. Two variants: `regular` (centered) and `bottom`. | `isVisible`, `variant`, `buttonOneText`, `onButtonOnePress`, `children` |
| **FeedbackLayout** | Success/pending confirmation screens with animation. Close button top-right, Lottie left-aligned. | `animation`, `onClose`, `children` (StickyFooter last) |
| **FeatureLayout** | Full-screen layout for feature introduction pages. Full-bleed header image, overlaid close button, optional badge, scrollable content, sticky footer with gradient fade. | `imageSrc`, `imageAlt`, `imageMaxHeight`, `onClose`, `imageOverlay`, `children` |
| **AppShell** | Root responsive container (sidebar + content). Used once at app level. | `children`, `sidebar`, `tabBar` |

### 3.2 Navigation

| Component | When to use | Key props |
|-----------|-------------|-----------|
| **Header** | Screen header with back/close button and large title. One per screen. | `title`, `description`, `onBack`, `onClose`, `rightAction` |
| **GroupHeader** | Section divider label inside lists or data displays. | `text`, `subtitle`, `icon` |
| **SegmentedControl** | Tab switcher for 2-4 mutually exclusive views. | `segments`, `activeIndex`, `onChange` |
| **TabBar** | Bottom navigation for 4-5 top-level destinations. | `items`, `activeId`, `onChange` |
| **Sidebar** | Desktop vertical navigation (240px). | `items`, `activeId`, `onChange`, `header` |
| **Breadcrumb** | Desktop path trail. Auto-shown by AppShell at level 2+. | `items` |

### 3.3 Inputs

| Component | When to use | Key props |
|-----------|-------------|-----------|
| **Button** | Primary and secondary actions. One primary per screen, at bottom. | `variant` (`primary`/`secondary`/`ghost`/`destructive`), `size`, `fullWidth`, `loading`, `disabled`, `onPress`, `subtitle` |
| **IconButton** | Icon-only actions: close, back, toolbar. | `icon`, `variant` (`large`/`base`/`small`/`no_background`), `onPress` |
| **TextInput** | Text field with label, validation, prefix/suffix. | `label`, `value`, `onChange`, `error`, `helperText`, `prefix`, `suffix` |
| **CurrencyInput** | Large currency entry with token avatar. For deposit/withdrawal/swap amounts. | `label`, `value`, `onChange`, `tokenIcon`, `error`, `helperText`, `disabled`, `readOnly` |
| **PinInput** | Digit-by-digit OTP or PIN entry. | `length` (4/5/6), `value`, `onChange`, `error` |
| **Select** | Dropdown picker for single option. | `label`, `options`, `value`, `onChange`, `error` |
| **SearchBar** | Search input with icon. | Standard input attributes |
| **RadioGroup** | Mutually exclusive choices with title + description. | `value`, `onChange`, `options`, `label`, `errorMessage` |
| **Checkbox** | Boolean selection. Use inside ListItem for labeled rows. | `checked`, `onChange`, `disabled` |
| **Toggle** | On/off switch. Use inside ListItem for settings rows. | `checked`, `onChange`, `label`, `disabled` |
| **Slider** | Range input for percentages, volumes, amounts. | `value`, `minimumValue`, `maximumValue`, `onValueChange`, `step` |
| **ShortcutButton** | Circular quick-action with icon + label. | `icon`, `label`, `variant`, `onPress` |

### 3.4 Display

| Component | When to use | Key props |
|-----------|-------------|-----------|
| **DataList** | Key-value rows for transaction details, settings, summaries. | `data` (array of `{ label, value, secondaryValue?, info?, copyable?, breakdown? }`) |
| **ListItem** | Any row-based layout: navigation, settings, asset lists. | `title`, `subtitle`, `left`, `right`, `trailing`, `onPress`, `inverted` |
| **Card** | Container for grouped content. | `variant` (`elevated`/`flat`), `pressable`, `onPress`, `children` |
| **Banner** | Contextual alerts, tips, warnings. | `title`, `description`, `variant` (`neutral`/`success`/`warning`/`critical`), `collapsable`, `dismissible`, `linkText`, `onLinkPress` |
| **Avatar** | User/entity avatar with image, initials, or icon fallback. | `src`, `initials`, `icon`, `size` (`sm`/`md`/`lg`/`xl`), `overlay`, `badge` |
| **Badge** | Small status indicator. | `variant` (`success`/`warning`/`error`/`info`/`neutral`/`guava`/`grape`/`lime`/`none`), `size`, `icon`, `children` |
| **Amount** | Formatted currency value with tabular numbers. | `value`, `currency`, `size` (`sm`/`md`/`lg`/`display`) |
| **Tag** | Compact label for categorization. Supports removable. | `label`, `removable`, `onRemove` |
| **Summary** | Steps/tasks list with icons and status indicators. | `data` (array of `{ icon, title, description?, status? }`), `header` |
| **ProgressBar** | Horizontal progress indicator. | `value`, `max` |
| **LineChart** | Time-series line/area chart for price history, portfolio value, yield curves. | `data`, `height`, `variant` (`baseline`/`area`), `showPriceScale`, `showTimeScale` |

### 3.5 Foundations

| Component | When to use | Key props |
|-----------|-------------|-----------|
| **Text** | All text content. Never use raw `<p>`, `<span>`, `<h1>`. | `variant` (`display`/`heading-lg`/`heading-md`/`heading-sm`/`body-lg`/`body-md`/`body-sm`/`caption`), `color`, `align`, `as` |
| **Divider** | Thin horizontal separator between content sections. | `spacing` (`sm`/`md`/`lg`) |
| **Link** | Inline text link with optional icons. | `linkText`, `onLinkPress`, `size`, `leadingIcon`, `trailingIcon` |

### 3.6 Feedback

| Component | When to use | Key props |
|-----------|-------------|-----------|
| **Toast** | Brief non-blocking notification after an action. Material snackbar style (dark bg, white text, fixed bottom). | `variant` (`success`/`error`/`info`/`warning`), `message`, `visible`, `onDismiss` |
| **LoadingScreen** | Full-screen processing with Lottie animation, step messages, and progress bar. Auto-advances. | `steps`, `autoAdvance`, `autoAdvanceInterval`, `onComplete`, `animation` |
| **Countdown** | Time-sensitive countdown (PIX payments, OTP codes). Turns red < 60s. | `seconds`, `onExpire`, `label` |
| **LoadingSpinner** | Async operation indicator. | `size` (`sm`/`md`/`lg`) |
| **Skeleton** | Pulsing placeholder while content loads. | `width`, `height`, `variant` (`text`/`circle`/`rect`) |
| **DataListSkeleton / BannerSkeleton** | Content-aware skeleton composites that mirror the exact layout of DataList and Banner to prevent layout shifts. | `rows` (DataListSkeleton), `className` |
| **EmptyState** | Placeholder for empty lists/searches. | `icon`, `title`, `description`, `action` |
| **Tooltip** | Dark floating callout with arrow. | `visible`, `onClose`, `children`, `position` (`top`/`bottom`) |

---

## 4. Screen Patterns

### 4.1 Standard Flow Screen

Every flow screen receives `FlowScreenProps` (`onNext`, `onBack`) and follows this structure:

```tsx
import type { FlowScreenProps } from '../../pages/simulator/flowRegistry'
import BaseLayout from '../../library/layout/BaseLayout'
import StickyFooter from '../../library/layout/StickyFooter'
import Header from '../../library/navigation/Header'
import Button from '../../library/inputs/Button'

export default function ScreenName({ onNext, onBack }: FlowScreenProps) {
  return (
    <BaseLayout>
      <Header title="Screen Title" onBack={onBack} />
      {/* Content using only library components */}
      <StickyFooter>
        <Button fullWidth onPress={onNext}>Continue</Button>
      </StickyFooter>
    </BaseLayout>
  )
}
```

### 4.2 Close-Button Screen (no back arrow)

For screens opened as overlays or initial flow entry, use Header with `onClose`. Pass an empty title if the design has no title text — **always prefer Header over raw IconButton wrappers**:

```tsx
<BaseLayout>
  <Header title="" onClose={onBack} />
  {/* ... */}
</BaseLayout>
```

Or with a visible title:

```tsx
<BaseLayout>
  <Header title="Screen Title" onClose={onBack} />
  {/* ... */}
</BaseLayout>
```

> **Important:** Always prefer Header over creating custom top-action wrappers with raw divs + IconButton. Avoid creating new components when not strictly necessary.

### 4.3 List / Selection Screen

```
BaseLayout
  ├── Header (title + back)
  ├── Section (title: "Choose an option")
  │    └── Stack (gap="none")
  │         ├── ListItem (left=Avatar, title, subtitle, right=Text, onPress)
  │         ├── ListItem
  │         └── ListItem
  └── (no StickyFooter — selection navigates directly)
```

### 4.4 Form / Input Screen

```
BaseLayout
  ├── Header (title + back)
  ├── Stack
  │    ├── CurrencyInput or TextInput
  │    └── Card variant="flat" (preview/conversion info)
  └── StickyFooter
       └── Button (primary, fullWidth, disabled until valid)
```

### 4.5 Detail / Review Screen

```
BaseLayout
  ├── Header (title + back)
  ├── Stack (read-only content summary)
  ├── DataList (transaction details, fees, rates)
  ├── Banner (optional: benefit, warning, or info)
  └── StickyFooter
       └── Button (primary CTA)
```

### 4.6 Payment Instruction Screen

```
BaseLayout
  ├── Header (title + onBack)
  ├── Banner variant="warning" (critical notice)
  ├── Text (helper instructions)
  ├── ListItem (code display + IconButton for copy)
  ├── Stack direction="row" align="between"
  │    ├── Countdown (time left)
  │    └── Button secondary (QR code → opens BottomSheet)
  ├── GroupHeader + DataList (payment details)
  ├── Toast (copy confirmation)
  └── StickyFooter
       └── Stack gap="sm" (primary + ghost buttons)
```

### 4.7 Processing / Loading Screen

Use the `LoadingScreen` component instead of building custom loading layouts:

```
LoadingScreen
  ├── Lottie animation (full-width, centered)
  ├── Step messages (vertical ticker animation)
  └── ProgressBar (auto-advancing)
```

### 4.8 Success / Confirmation Screen

Use the `FeedbackLayout` component instead of building custom success layouts:

```
FeedbackLayout (onClose)
  ├── Lottie animation (180×180, left-aligned)
  ├── Text variant="display" (large title)
  ├── Text variant="body-md" (description)
  ├── Banner variant="neutral" (optional savings/nudge)
  ├── GroupHeader + DataList (transaction summary)
  └── StickyFooter
       └── Button ("Entendi" / "Done")
```

### 4.9 Currency Entry with Async Calculation

```
BaseLayout
  ├── Header (onClose — level 2 screen)
  ├── Stack gap="none"
  │    ├── CurrencyInput (receive amount)
  │    ├── Divider
  │    ├── CurrencyInput (pay amount)
  │    └── ListItem inverted (payment method selector → opens BottomSheet)
  ├── DataListSkeleton + BannerSkeleton (while loading)
  ├── DataList + Banner (when ready)
  └── StickyFooter
       └── Button (disabled until calcState === 'ready')
```

### 4.10 Feature Introduction Screen

Use the `FeatureLayout` component for pages that introduce a new feature with a hero image:

```
FeatureLayout (imageSrc, onClose, imageOverlay=Badge)
  ├── Stack gap="sm"
  │    ├── Text variant="display" (large title)
  │    └── Text variant="body-md" (description)
  ├── Summary (feature benefits with icons)
  ├── Banner variant="neutral" (optional activation note)
  └── StickyFooter
       └── Button (primary CTA)
```

---

## 5. Component Composition Rules

### Which components go together

| Pattern | Components | Notes |
|---------|-----------|-------|
| **Navigation list** | `ListItem` rows in `Stack gap="none"` | Use Avatar in `left`, Text in `right` |
| **Data display** | `GroupHeader` + `DataList` | GroupHeader labels the section |
| **Form** | `TextInput` / `CurrencyInput` + `Button` in `StickyFooter` | Stack inputs vertically |
| **Confirmation modal** | `BottomSheet` or `Modal` + `DataList` + `Button` | Show summary, CTA as footer |
| **Contextual alert** | `Banner` with appropriate variant | Place after the content it relates to |
| **Empty state** | `EmptyState` | Center in content area |
| **Loading** | `Skeleton` (for content preview) or `LoadingSpinner` (for actions) | Match Skeleton to content shape |
| **Tabs** | `SegmentedControl` + conditional content | 2-4 segments max |
| **Settings row** | `ListItem` with `right={<Toggle>}` or `right={<Badge>}` | |
| **Selection** | `RadioGroup` (2-5 options) or `Select` (dropdown) | RadioGroup for visible choices |
| **Currency conversion** | `CurrencyInput` + `Divider` + `CurrencyInput` + `ListItem` + `BottomSheet` + `DataList` + `Banner` | Bilateral correlation between inputs; payment method selector in BottomSheet; DataListSkeleton/BannerSkeleton during loading |

### CTA hierarchy (one primary per screen)

1. **Primary action**: `<Button variant="primary">` — one per screen, in StickyFooter
2. **Secondary action**: `<Button variant="secondary">` — alongside or below primary
3. **Destructive action**: `<Button variant="destructive">` — delete, cancel
4. **Ghost / text action**: `<Button variant="ghost">` — tertiary, underlined text style
5. **Inline link**: `<Link>` — inline within text content
6. **Icon action**: `<IconButton>` — toolbar, close buttons, compact controls

### Typography via Text component

| Screen element | Text variant |
|---------------|-------------|
| App-level display title | `display` |
| Screen title | `heading-lg` (via Header component) |
| Section heading | `heading-md` |
| Card / block heading | `heading-sm` |
| Body text | `body-md` |
| Small / secondary text | `body-sm` |
| Labels / captions | `caption` |

**Never use raw HTML headings or paragraphs.** Always use `<Text variant="...">`.

### 5.5 Interaction Patterns

**Copy with Toast feedback:**
```tsx
const handleCopy = useCallback(() => {
  navigator.clipboard.writeText(code)
  setShowToast(true)
  setTimeout(() => setShowToast(false), 3000)
}, [])
```

**Async calculation state machine:**
- States: `'idle' | 'loading' | 'ready'`
- Show content-aware skeletons (`DataListSkeleton`, `BannerSkeleton`) during `'loading'`
- Disable CTA until `'ready'`

**BottomSheet for selection lists:**
```tsx
<BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Title">
  <Stack gap="none">
    {items.map(item => (
      <ListItem key={item.id} title={item.title} left={<Avatar />} onPress={() => select(item)} />
    ))}
  </Stack>
</BottomSheet>
```

**Close button pattern — always top-right:**
- Use `Header onClose` or `FeedbackLayout onClose`
- Never build custom close button wrappers with raw divs

---

## 6. Anti-Patterns — DO NOT

1. **Write raw HTML elements in flow screens** — no `<div>`, `<span>`, `<button>`, `<p>`, `<h1>`, `<img>` with custom classes. Always use library components.
2. **Create custom card/container components inline** — use `Card`, `Banner`, `Stack`, `Section`.
3. **Use raw `<img>` for avatars** — use `Avatar` with `src`, `icon`, or `initials`.
4. **Build custom loading states** — use `LoadingSpinner`, `Skeleton`, or `LoadingScreen`.
11. **Build custom loading screens** — use `LoadingScreen` component.
12. **Build custom success layouts** — use `FeedbackLayout`.
13. **Use raw countdown timers** — use `Countdown` component.
14. **Use generic Skeleton boxes for known content** — use `DataListSkeleton` / `BannerSkeleton` to match the exact layout of the content they replace.
5. **Create custom alert/info banners** — use `Banner` with the appropriate variant.
6. **Hardcode colors** — always reference token CSS variables.
7. **Use raw `<input>` elements** — use `TextInput`, `CurrencyInput`, `PinInput`, `Select`, `SearchBar`.
8. **Build custom toggle/checkbox UI** — use `Toggle`, `Checkbox`.
9. **Use inline `style` for positioning** — compose layout with `BaseLayout`, `Stack`, `Section`, `StickyFooter`.
10. **Create one-off display patterns inline** — if a pattern is needed and no component exists, create a reusable component in `src/library/`.

---

## 7. DO

1. **Check this catalog (Section 3) before building anything** — a component probably already exists.
2. **Use design tokens** for all colors, typography, spacing, and radius.
3. **Follow the screen shell pattern** — `BaseLayout` > `Header` > content > `StickyFooter`.
4. **Use `Stack`** for vertical grouping instead of manual `flex-col` + `gap`.
5. **Place primary CTA in `StickyFooter`** at the bottom of the screen.
6. **Ask or create a new component** when no existing one matches the design. New components go in `src/library/` and must call `registerComponent()`.
7. **Use `Text` for all text** — never raw HTML text elements.
8. **Use `Divider`** between sections — never raw `<hr>` or border hacks.
9. **Use `DataList`** for any key-value display — never custom flex rows.
10. **Use `Banner`** for any contextual message — never custom alert divs.

---

## 8. Flow Registration

### File structure

```
src/flows/<flow-name>/
  ├── index.ts              ← Registers flow + pages
  ├── Screen1_Name.tsx      ← One file per screen
  ├── Screen2_Name.tsx
  └── spec.md               ← Optional specification document
```

### index.ts pattern

```tsx
import { registerFlow } from '../../pages/simulator/flowRegistry'
import { registerPage } from '../../pages/gallery/pageRegistry'
import Screen1 from './Screen1_Name'
import Screen2 from './Screen2_Name'

const screenDefs = [
  {
    id: 'flow-screen-1',
    title: 'Screen Title',
    description: 'What this screen does.',
    componentsUsed: ['Header', 'BaseLayout', 'Button', ...],
    component: Screen1,
  },
  // ...
] as const

for (const s of screenDefs) {
  registerPage({
    id: s.id,
    name: s.title,
    description: s.description,
    area: 'AreaName',
    componentsUsed: [...s.componentsUsed],
    component: s.component,
  })
}

registerFlow({
  id: 'flow-id',
  name: 'Flow Display Name',
  description: 'Full description of the user journey.',
  area: 'AreaName',
  level: 2,  // Hides TabBar. Level 1 = main tabs, Level 2 = deeper flows
  screens: screenDefs.map((s) => ({ ...s, pageId: s.id })),
})
```

### Registering in the app

Add the import to both `SimulatorPage.tsx` and `PageGalleryPage.tsx`:

```tsx
import '../flows/<flow-name>'
```

---

## 9. Import Reference

```tsx
// Layout
import BaseLayout from '../../library/layout/BaseLayout'
import StickyFooter from '../../library/layout/StickyFooter'
import Stack from '../../library/layout/Stack'
import Section from '../../library/layout/Section'
import FormLayout from '../../library/layout/FormLayout'
import FeedbackLayout from '../../library/layout/FeedbackLayout'
import FeatureLayout from '../../library/layout/FeatureLayout'
import BottomSheet from '../../library/layout/BottomSheet'
import Modal from '../../library/layout/Modal'

// Navigation
import Header from '../../library/navigation/Header'
import GroupHeader from '../../library/navigation/GroupHeader'
import SegmentedControl from '../../library/navigation/SegmentedControl'

// Inputs
import Button from '../../library/inputs/Button'
import IconButton from '../../library/inputs/IconButton'
import TextInput from '../../library/inputs/TextInput'
import CurrencyInput from '../../library/inputs/CurrencyInput'
import PinInput from '../../library/inputs/PinInput'
import Select from '../../library/inputs/Select'
import SearchBar from '../../library/inputs/SearchBar'
import RadioGroup from '../../library/inputs/RadioGroup'
import Checkbox from '../../library/inputs/Checkbox'
import Toggle from '../../library/inputs/Toggle'
import Slider from '../../library/inputs/Slider'
import ShortcutButton from '../../library/inputs/ShortcutButton'

// Display
import DataList from '../../library/display/DataList'
import ListItem from '../../library/display/ListItem'
import Card from '../../library/display/Card'
import Banner from '../../library/display/Banner'
import Avatar from '../../library/display/Avatar'
import Badge from '../../library/display/Badge'
import Amount from '../../library/display/Amount'
import Tag from '../../library/display/Tag'
import Summary from '../../library/display/Summary'
import ProgressBar from '../../library/display/ProgressBar'
import LineChart from '../../library/display/LineChart'

// Foundations
import Text from '../../library/foundations/Text'
import Divider from '../../library/foundations/Divider'
import Link from '../../library/foundations/Link'

// Feedback
import Toast from '../../library/feedback/Toast'
import LoadingScreen from '../../library/feedback/LoadingScreen'
import Countdown from '../../library/feedback/Countdown'
import LoadingSpinner from '../../library/feedback/LoadingSpinner'
import Skeleton from '../../library/feedback/Skeleton'
import { DataListSkeleton, BannerSkeleton } from '../../library/feedback/Skeleton'
import EmptyState from '../../library/feedback/EmptyState'
import Tooltip from '../../library/feedback/Tooltip'

// Icons (Remix Icon — use any icon from @remixicon/react)
import { RiArrowLeftLine, RiCloseLine, RiCheckLine } from '@remixicon/react'

// Flow types
import type { FlowScreenProps } from '../../pages/simulator/flowRegistry'
```

---

## 10. Creating New Components

When the design requires UI that no existing component provides:

1. **Check Section 3 again** — really make sure nothing fits.
2. **Create the component in `src/library/<category>/`** — choose the right category (layout, navigation, inputs, display, foundations, feedback).
3. **Follow the existing pattern**: export default function, accept a props interface, register with `registerComponent()`.
4. **Register it** so it appears in the component showcase:

```tsx
registerComponent({
  name: 'ComponentName',
  category: 'category',
  description: 'One-line description of when to use it.',
  component: ComponentName,
  variants: ['variant1', 'variant2'],  // if applicable
  props: [
    { name: 'propName', type: 'string', required: true, description: 'What it does' },
  ],
})
```

5. **Update this document** (Section 3) to include the new component.
6. **Add a preview** in `src/pages/library/ComponentPreview.tsx`:
   - Import the component at the top of the file
   - Add a `case 'ComponentName': return <ComponentNamePreview />` in the `PreviewContent` switch
   - Create a `ComponentNamePreview()` function showing all variants/states with `SectionLabel` headers
   - When editing an existing component (adding variants, props), update its preview to cover the new states

### Creating or Editing Patterns

Patterns live in `src/pages/library/PatternDetail.tsx` (data) and `src/pages/library/pattern-previews/` (previews).

1. **Add the pattern** to the `patternData` record in `PatternDetail.tsx` with `title`, `description`, `recipe`, `usage`, and `preview`.
2. **Create an interactive preview** in `src/pages/library/pattern-previews/<PatternName>Preview.tsx`:
   - The preview should be a working mini-app using only library components — no raw HTML/CSS
   - It should demonstrate the core interaction (inputs, state transitions, loading → ready)
   - Keep mock data minimal but realistic
3. **Register in sidebar** — add the pattern key/label to the `patterns` array in `src/pages/library/ComponentSidebar.tsx`.
4. **Update this document** (Section 5 table) to list the pattern's component composition.
5. When editing an existing pattern, update its preview to reflect the changes.

---

## 11. One-Time Screen Parts (`.parts.tsx`)

### The Convention

When a flow screen needs extracted sub-components that are NOT reusable across screens:

```
src/flows/deposit-v2/
  Screen1_AmountEntry.tsx        ← the screen (default export)
  Screen1_AmountEntry.parts.tsx  ← one-time elements (named exports only)
```

### Inline vs Extract Threshold

| Condition | Action |
|-----------|--------|
| < ~30 lines, no independent state/effects | Keep inline in the screen file |
| ≥ ~30 lines OR has own state/effects | Extract to `.parts.tsx` sibling |

### Extract-When-Reused Rule

1. **Start co-located** — every new UI element begins in the screen file or its `.parts.tsx`
2. **Extract on second use** — only move to `src/library/` when a second screen genuinely needs the same component
3. **Never pre-extract** — do not add to the library "just in case"

### Anti-Pattern: Reusing Screen Parts

> **Screen parts (`.parts.tsx`) must NEVER be imported by other screens or pages.**
>
> If you need similar UI in another screen, that's the signal to extract a proper library component.

**Enforcement layers:**
1. **File convention** — `.parts.tsx` suffix signals "do not reuse"
2. **Export discipline** — named exports only, no default export, never re-exported through barrel files
3. **This rule** — screen parts are excluded from consideration when building new screens

### Consolidation Workflow

Periodically review the Screen Parts catalog (`/components?selected=screen-parts`) to:
1. Sort parts by visual/functional similarity
2. Spot duplicates or near-duplicates across flows
3. Extract common patterns into `src/library/` as proper components
4. Delete the `.parts.tsx` originals after extraction

---

## 12. Component Design Guidelines

| Guideline | Detail |
|-----------|--------|
| **IconButton backgrounds** | Use `bg-black/[0.06]` transparency — adapts to any parent bg |
| **Toast style** | Material snackbar: dark bg (`neutral-900`), white text, fixed bottom |
| **StickyFooter** | Always has `border-top` to separate from content |
| **BottomSheet** | Close button always visible, heading left-aligned `heading-md` |
| **ListItem subtitle** | Uses `line-clamp-2` (not `truncate`) — allows 2-line descriptions |
| **Banner warning variant** | Yellow bg avatar (`token-warning-light`), darker icon color (`token-warning`) |
| **CurrencyInput** | Supports `readOnly` prop (no opacity change unlike disabled) |
| **Stack direction="row"** | Use for side-by-side elements with `align="between"` for distribution |
| **data-component attribute** | All library components have `data-component="Name"` for browser devtools debugging |
| **Content-aware skeletons** | Always match the exact layout of the component they replace to prevent layout shifts |
