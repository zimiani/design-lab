# Wireframe Explorer — Product Requirements Document

> **Project**: Design Lab (Wireframe Explorer)
> **Owner**: Rafael Paranaíba
> **Last updated**: 2026-03-02
> **Objective**: Replace Figma-heavy design workflows with an AI-assisted prototype tool, enabling faster iteration and better engineering handoff using components that mirror Picnic's production design system.

---

## 1. Current State Assessment

### 1.1 Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | 18.3.1 |
| Build | Vite | 7.3.1 |
| Styling | Tailwind CSS | 4.2.1 |
| Animation | Framer Motion | 12.34.3 |
| Flow diagrams | @xyflow/react | 12.10.1 |
| Icons | @remixicon/react + Lucide React | 4.9.0 |
| Charts | lightweight-charts | 3.8.0 |
| Lottie | lottie-react | 2.4.1 |
| Persistence | localStorage + Supabase | 2.97.0 |
| Routing | React Router | 6.30.3 |
| Language | TypeScript | 5.9.3 |
| Deployment | Vercel | — |

### 1.2 Component Library (55+ components)

Components live in `src/library/` with a registry pattern (`registry.ts`) providing metadata (name, category, variants, props).

| Category | Count | Components |
|----------|-------|------------|
| **Layout** | 10 | AppShell, BaseLayout, BottomSheet, FeedbackLayout, FormLayout, LayoutProvider, Modal, Section, Stack, StickyFooter |
| **Navigation** | 6 | Breadcrumb, GroupHeader, Header, SegmentedControl, Sidebar, TabBar |
| **Inputs** | 12 | Button, Checkbox, CurrencyInput, IconButton, PinInput, RadioGroup, SearchBar, Select, ShortcutButton, Slider, TextInput, Toggle |
| **Display** | 11 | Amount, Avatar, Badge, Banner, Card, DataList, LineChart, ListItem, ProgressBar, Summary, Tag (+tokenIcons) |
| **Foundations** | 3 | Divider, Link, Text |
| **Feedback** | 7 | Countdown, EmptyState, LoadingScreen, LoadingSpinner, Skeleton, Toast, Tooltip |

### 1.3 Flow System (5 domains)

Flows live in `src/flows/` with domain-based organization:

| Flow | Screens | Notes |
|------|---------|-------|
| deposit | 5 | Screen1_AddFunds → Screen5_Confirmed |
| deposit-v2 | 4 | Screen1_AmountEntry → Screen5_Success |
| invest-earn | 5 | Screen1_Offer → Screen5_Success |
| perks | 6 | Screen1_PerksHome → Screen6_Share |
| withdrawal | 8+ | Multi-version (a/b/c) with shared components |

### 1.4 Architecture Highlights

**Three views** accessible via routes: `/components` (Library), `/flows` (Simulator with flow diagram + prototype), `/pages` (Gallery).

**Dual persistence**: localStorage-first (`picnic-design-lab:flow-overrides`) with optional Supabase cloud sync gated behind env vars. Supabase schema has 4 tables (flow_overrides, screen_overrides, token_overrides, flow_graphs) with RLS enabled.

**Version management**: Snapshot-based with semantic versioning and tags (exploration / milestone / production).

**Design rules**: `patterns.md` serves as a living contract — 7 Golden Rules, spacing scale (4/8/12/16/24/32px), 9 screen patterns, 14 anti-patterns, component composition rules, and flow registration instructions. Updated every feedback cycle.

### 1.5 Workflow (current)

1. Designer describes what's needed
2. Claude creates flow/screens using `patterns.md` as reference
3. Designer reviews in prototype view
4. Feedback is captured and `patterns.md` is updated
5. Claude creates new version → repeat

---

## 2. Gap Analysis

### What's strong

- Component library is comprehensive (55+ components covering all major UI categories)
- Form inputs, feedback, and layout components are all present
- Registry pattern enables discoverability
- `patterns.md` is well-structured with clear rules and anti-patterns
- Multi-version support exists for A/B exploration (withdrawal flow demonstrates this)
- Dual persistence (local + cloud) is architecturally sound

### Real gaps

| Gap | Impact | Description |
|-----|--------|-------------|
| **No component reuse rules for Claude** | High | Claude doesn't know when to reuse existing components vs. create new ones. Leads to inconsistency and bloat. |
| **One-time-use elements undefined** | Medium | No clear pattern for elements that appear once in a flow but aren't reusable library components (e.g., a custom illustration container). |
| **No non-UI flow nodes** | High | Flow canvas only shows screens. No representation for decisions, API calls, error branches, or conditional logic — limits engineering handoff value. |
| **No page states** | High | Screens only show the "happy path" default state. No loading, empty, error, or edge-case states represented. |
| **Flow taxonomy unclear** | Medium | 5 flow domains exist but no formal classification system (onboarding vs. transactional vs. informational). Makes organization harder as flows grow. |
| **No cross-flow linking** | Medium | Flows are isolated. Can't represent "deposit flow links to invest-earn flow" or shared entry points. |
| **Handoff is manual** | Low (future) | No automated spec export. Engineers read the prototype visually. Acceptable now, bottleneck at scale. |
| **Page gallery is basic** | Low | Gallery exists but lacks filtering, search, or metadata. |
| **No page IDs** | Medium | Pages don't have stable identifiers for referencing across flows or in documentation. |
| **Flow versioning is manual** | Medium | Versions exist but require manual snapshot creation. No diff view or comparison. |
| **No shareable prototype link** | High | Can't send a phone/desktop-viewable link to stakeholders for review without deploying the full app. |
| **No automated tests** | Medium | No unit or integration tests for components or flows. |
| **Limited documentation** | Low | `patterns.md` covers rules well but individual component docs (props, usage examples) are thin. |

---

## 3. Improvement Proposals

### 3.1 Claude Reuse Protocol

Add a `## Component Reuse Rules` section to `patterns.md`:

- Before creating any new element, Claude must search the registry for existing matches
- If a component exists with >80% overlap, extend it via props/variants instead of creating new
- One-time-use elements go in a `_local/` subfolder within the flow, never in `src/library/`
- Register all new library components in `registry.ts` immediately

### 3.2 Non-UI Flow Nodes

Extend the @xyflow/react canvas with new node types: **Decision** (diamond), **API Call** (rectangle with icon), **Error Branch** (red path), **Conditional** (branching), **Delay/Timer** (clock icon). These nodes don't render in prototype mode but appear on the flow diagram, making it a proper engineering handoff artifact.

### 3.3 Page States System

Each screen component gets an optional `pageState` prop: `default | loading | empty | error | disabled`. The prototype view gets a state switcher toolbar. `patterns.md` gets a `## Page States` section defining required states per screen pattern.

### 3.4 Flow Taxonomy

Introduce flow metadata in a `flow.config.ts` per flow directory:

```ts
export const flowConfig = {
  id: "deposit-v2",
  name: "Deposit V2",
  category: "transactional", // onboarding | transactional | informational | settings
  entryPoints: ["home-card", "quick-action"],
  linkedFlows: ["invest-earn"],
  tags: ["money-in", "pix"],
};
```

### 3.5 Cross-Flow Linking

Use `flowConfig.linkedFlows` to render connection edges between flow canvases. Add a "flow map" view showing all flows and their connections at a high level.

### 3.6 Page IDs

Auto-generate stable IDs from flow + screen: `{flowId}:{screenNumber}:{state}` (e.g., `deposit-v2:3:default`). Store in screen metadata. Use for cross-referencing in documentation and handoff.

### 3.7 Shareable Prototype Link

Deploy a read-only prototype viewer route (`/preview/:flowId`) that strips editing UI and renders mobile-first. Share via Vercel deployment URL. Add QR code generation for quick phone access.

### 3.8 Flow Versioning Improvements

Add auto-snapshot on significant changes (configurable threshold). Add side-by-side diff view comparing two versions. Add version notes (already partially supported via `description` field).

### 3.9 Page Gallery Improvements

Add filtering by flow, category, and state. Add search by screen name. Show screen metadata (flow, position, states available). Enable grid/list toggle.

---

## 4. Prioritized Backlog

Scoring: **Impact** (1–5) × **Inverse Cost** (1–5) = **Priority Score**. Higher = do first.

| # | Item | Impact | Cost | Score | Rationale |
|---|------|--------|------|-------|-----------|
| 1 | Component reuse rules for Claude | 5 | Low (docs only) | **25** | Zero code change — just `patterns.md` update. Immediately reduces inconsistency in every future flow. |
| 2 | One-time-use elements handling | 4 | Low (convention) | **20** | Convention + folder structure. Prevents library bloat. |
| 9 | Page IDs | 4 | Low (utility fn) | **20** | Small utility function + metadata. Enables cross-referencing for items 6 and 8. |
| 11 | Shareable prototype link | 5 | Medium (new route) | **15** | High stakeholder value. Requires new route + stripped UI. Already on Vercel so deployment is free. |
| 4 | Page states representation | 5 | Medium (prop + UI) | **15** | Significant handoff improvement. Requires prop system + state switcher toolbar. |
| 3 | Non-UI flow nodes | 5 | Medium-High (new nodes) | **12** | Transforms flow canvas from wireframe to engineering spec. Requires new @xyflow node types. |
| 5 | Flow taxonomy / organization | 3 | Low (config files) | **15** | Config file per flow. Enables item 6. Small effort, good foundation. |
| 6 | Cross-flow linking | 4 | Medium (flow map) | **12** | Depends on items 5 and 9. Requires flow map view + edge rendering. |
| 10 | Flow version improvements | 3 | Medium (diff UI) | **9** | Auto-snapshot is easy; diff view is moderate effort. Nice-to-have. |
| 8 | Page gallery improvement | 2 | Low-Medium (UI) | **8** | Filtering/search on existing gallery. Low urgency. |
| 7 | Better handoff | 4 | High (export system) | **8** | Future item. Spec export requires structured data layer. Items 3, 4, 6, 9 are prerequisites. |

### Recommended execution phases

**Phase 1 — Foundation (1–2 weeks)**
Items 1, 2, 9, 5. All low-cost convention/config work that unlocks later items.

**Phase 2 — Core Value (2–4 weeks)**
Items 11, 4, 3. The features that most visibly improve the workflow and validate the hypothesis that this approach is faster than Figma.

**Phase 3 — Connections (1–2 weeks)**
Items 6, 10, 8. Build on Phase 1 foundations to connect flows and improve navigation.

**Phase 4 — Scale (future)**
Item 7. Automated handoff becomes viable once all structured data is in place.

---

## 5. Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Time to create a new 5-screen flow | ~45 min (estimated) | <15 min with Claude |
| Screens with multiple states represented | 0% | 80%+ |
| Flows with non-UI nodes (decisions, APIs) | 0% | 100% of transactional flows |
| Stakeholder review turnaround | Requires screen share | Self-serve via prototype link |
| Component reuse rate | Unknown | >70% reuse, <30% new per flow |
| Flow coverage of Picnic product | 5 domains | 15+ domains |

---

## 6. Hypothesis Validation

The core hypothesis: **AI-assisted prototyping with a constrained component library is faster than Figma for producing high-fidelity wireframes that engineers can build from.**

Validation plan:

1. **Measure baseline**: Time the next 3 flows created with the current setup
2. **Implement Phase 1+2**: Add reuse rules, page states, non-UI nodes, and shareable links
3. **Measure improvement**: Time the next 3 flows post-improvements
4. **Compare**: Against equivalent Figma workflow for same complexity flows
5. **Engineer feedback**: Do engineers find the prototype + flow diagram sufficient for implementation without additional Figma specs?

If the hypothesis holds, this tool becomes Picnic's primary rapid prototyping layer, with Figma reserved only for pixel-perfect visual polish.
