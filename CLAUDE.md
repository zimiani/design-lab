# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Picnic Design Lab — a React-based design system browser, flow prototyper, and engineering handoff tool for a fintech product. It is NOT a production app; it's an internal tool for visualizing and simulating user flows.

## Commands

- `npm run dev` — Start Vite dev server with HMR
- `npm run build` — TypeScript check + Vite production build (`tsc -b && vite build`)
- `npm run lint` — ESLint (flat config, ESLint 9)
- No test framework is configured

## Stack

- React 18 + TypeScript 5.9 (strict, `erasableSyntaxOnly`)
- Vite 7 with `@vitejs/plugin-react`
- Tailwind CSS v4 via `@tailwindcss/vite` — **no `tailwind.config.js`**; all tokens configured in CSS `@theme` blocks in `src/index.css`
- `@xyflow/react` for flow graph canvases
- Framer Motion for transitions
- Path alias: `@` → `src/` (configured in both Vite and tsconfig)
- `cn()` from `src/lib/cn.ts` (clsx + tailwind-merge) is the only way to compose class names

## PATTERNS.md Is Law

`PATTERNS.md` at the project root is the authoritative guide for building flows and screens. **Read it before creating or modifying any flow screen or library component.** Key rules:

1. No arbitrary colors — use CSS variable tokens only
2. No custom typography — use `<Text variant="...">`
3. No new layout containers — use `<BaseLayout>`, `<Stack>`, `<Section>`
4. No re-creating existing components — check the library first
5. No inline spacing magic numbers — use the spacing scale (4/8/12/16/24/32px)
6. **No raw HTML/CSS in flow screens** — compose entirely from `src/library/` components
7. When no component exists, create one in `src/library/` or extend an existing one
8. English for all names, docs, labels, and code. Only in-screen UI copy is pt-BR.

## Architecture

### Four Routes

| Route | Page | Purpose |
|-------|------|---------|
| `/components` | `LibraryPage` | Design system browser (components, foundations, patterns, screen parts) |
| `/flows` | `SimulatorPage` | Flow prototype player + flow graph canvas editor |
| `/pages` | `PageGalleryPage` | Page gallery showing all registered screens |
| `/map` | `FlowMapPage` | High-level flow relationship map |

### Registration Pattern (Side Effects)

The app uses a side-effect registration pattern. Importing a module registers it:

- **Library components** call `registerComponent()` at module scope → populates the component registry
- **Flow `index.ts`** files call `registerFlow()`, `registerPage()`, and `saveFlowGraph()` → populates flow/page registries and bootstraps the graph
- These imports are triggered from the page components (`SimulatorPage.tsx`, `PageGalleryPage.tsx`, `LibraryPage.tsx`)

### Flow Structure

Each flow lives in `src/flows/<flow-name>/`:

```
index.ts                    — registerFlow() + registerPage() + saveFlowGraph()
Screen1_Name.tsx            — Screen component (default export, receives FlowScreenProps)
Screen1_Name.parts.tsx      — Optional: screen-local sub-components (named exports only)
```

**Screen components** receive `FlowScreenProps` (`onNext`, `onBack`, `overlays?`, `onOpenOverlay?`, `onElementTap?`, `onStateChange?`). They must call `onElementTap('Component: Label')` before `onNext()` for non-linear graph navigation to work.

**Screen states**: Screens can declare `states: PageStateDefinition[]` in their screen defs. The player injects state-specific data via `ScreenDataContext`; screens read it with `useScreenData<T>()`.

**`.parts.tsx` convention**: Screen-local sub-components that are ≥30 lines or have their own state. Named exports only. Never imported by other screens — if reuse is needed, promote to `src/library/`.

### Flow Graph System

Flows have a React Flow directed graph stored in localStorage (+ optionally Supabase). Node types: `screen`, `page`, `decision`, `error`, `flow-reference`, `action`, `overlay`, `api-call`, `delay`, `note`. Navigation is derived from the graph via `flowGraphNavigation.ts` — the player walks edges to build a `NavigableStep[]` path, skipping non-screen pass-through nodes.

### Persistence

Dual-write pattern: always localStorage (sync), optionally Supabase (async). Supabase client is created from `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` env vars; `null` if not configured. Hydration on mount overwrites localStorage from Supabase if data exists.

### Token System

- `src/tokens/tokens.css` — CSS custom properties (`--token-*`) are the source of truth
- `src/tokens/index.ts` — TypeScript mirrors + utilities (`getTokenVar`, `setTokenVar`)
- `src/index.css` — Bridges tokens to Tailwind via `@theme {}` blocks
- Shell chrome (dark IDE-like UI) uses separate `--color-shell-*` tokens

### Key Libraries

| File | Purpose |
|------|---------|
| `src/lib/cn.ts` | `cn()` — clsx + tailwind-merge |
| `src/lib/supabase.ts` | Supabase client (nullable) |
| `src/lib/tokenStore.ts` | Token override persistence |
| `src/lib/ScreenDataContext.tsx` | Context for injecting state data into screens |
| `src/lib/slugify.ts` | Slug/unique ID generation |

### Supplemental Prompts

The `claude-code-prompt-*.md` files at the project root contain detailed task specifications for specific features. Read the relevant one when working on: cross-flow linking, non-UI flow nodes, page states/IDs, or one-time patterns.

## UX & UI Patterns

**PATTERNS.md has the full reference** (component catalog, props, screen patterns, composition rules). Below is a quick-reference summary.

### Screen Shell

Every flow screen follows this skeleton:

```
BaseLayout
  ├── Header (title + onBack or onClose)
  ├── ...content (library components only)
  └── StickyFooter
       └── Button variant="primary" fullWidth
```

- `onBack` → back arrow (deeper screen). `onClose` → X button (overlay/entry screen).
- One primary Button per screen, always in StickyFooter.
- Use `Stack` for vertical grouping (gap presets: `none`/`sm`/`default`/`lg`), never manual `flex-col` + `gap`.

### Screen Pattern Catalog

| Pattern | Key Components | When to use |
|---------|---------------|-------------|
| **List / Selection** | Header + Stack(gap=none) of ListItems | User picks from a list; no StickyFooter (selection navigates directly) |
| **Form / Input** | Header + CurrencyInput or TextInput + StickyFooter(Button disabled until valid) | Data entry |
| **Detail / Review** | Header + DataList + Banner (optional) + StickyFooter | Confirmation before action |
| **Payment Instruction** | Header + Banner(warning) + ListItem(code+copy) + Countdown + DataList + Toast | Display payment codes, QR, deadlines |
| **Processing** | LoadingScreen (Lottie + step messages + ProgressBar) | Async wait with progress |
| **Success** | FeedbackLayout (Lottie + display title + DataList + StickyFooter) | Confirmation after action |
| **Currency Entry** | Header(onClose) + dual CurrencyInput + Divider + ListItem(payment selector) + DataListSkeleton→DataList | Amount conversion with async calc |
| **Feature Intro** | FeatureLayout (hero image + display title + Summary + StickyFooter) | Introduce a new feature |

### Component Composition Quick Reference

- **Navigation list**: ListItem rows in `Stack gap="none"`, Avatar in `left`, Text in `right`
- **Data display**: GroupHeader + DataList
- **Settings row**: ListItem with `right={<Toggle>}` or `right={<Badge>}`
- **Selection**: RadioGroup (2-5 visible choices) or Select (dropdown)
- **Contextual alert**: Banner (variants: `neutral`/`success`/`warning`/`critical`)
- **Overlay content**: BottomSheet (bottom on mobile, centered on desktop) with ListItem rows
- **Interrupting decision**: Modal (variants: `regular`/`bottom`)
- **Tabs**: SegmentedControl (2-4 segments) + conditional content
- **Loading states**: Skeleton/DataListSkeleton/BannerSkeleton (content preview) or LoadingSpinner (action indicator)
- **Empty content**: EmptyState with icon, title, description, optional action

### CTA Hierarchy

1. `Button variant="primary"` — one per screen, in StickyFooter
2. `Button variant="secondary"` — alongside primary
3. `Button variant="destructive"` — delete/cancel
4. `Button variant="ghost"` — tertiary text-style action
5. `Link` — inline within text
6. `IconButton` — toolbar, close, compact controls

### Typography via Text Component

| Element | Variant |
|---------|---------|
| App display title | `display` |
| Screen title | `heading-lg` (via Header) |
| Section heading | `heading-md` |
| Card/block heading | `heading-sm` |
| Body text | `body-md` |
| Small/secondary | `body-sm` |
| Labels/captions | `caption` |

### Interaction Patterns

- **Copy + feedback**: `navigator.clipboard.writeText()` → show Toast, auto-dismiss after 3s
- **Async calculation**: state machine `'idle' → 'loading' → 'ready'`; show DataListSkeleton/BannerSkeleton during loading; disable CTA until ready
- **BottomSheet selection**: open BottomSheet with Stack of ListItems, each with `onPress` to select + close

### Component Design Details

- IconButton backgrounds: `bg-black/[0.06]` (adapts to any parent)
- Toast: Material snackbar style (dark bg, white text, fixed bottom)
- StickyFooter: always has `border-top`
- BottomSheet: close button always visible, heading left-aligned `heading-md`
- ListItem subtitle: `line-clamp-2` (not `truncate`)
- All library components: `data-component="Name"` attribute for devtools
- Content-aware skeletons must match the exact layout they replace

### Adding New Components

1. Create in `src/library/<category>/` with default export + props interface
2. Call `registerComponent({ name, category, description, component, props })` at module scope
3. Add preview in `src/pages/library/ComponentPreview.tsx` (case in switch + preview function)
4. Update PATTERNS.md Section 3 with the new component

### Adding New Patterns

1. Add to `patternData` in `src/pages/library/PatternDetail.tsx`
2. Create interactive preview in `src/pages/library/pattern-previews/`
3. Register in sidebar via `src/pages/library/ComponentSidebar.tsx`
4. Update PATTERNS.md Section 5 table
