# Diagram → Prototype Tools Research

Research into tools that combine flow diagramming with navigable prototype generation, with focus on **non-linear state handling** (bottom sheets, conditional screen updates, branching interactions). Goal: extract UX patterns and references to improve Design Lab.

---

## Tool Comparison Matrix

| Tool | Non-Linear States | Conditional Logic | Variables | Real Code | AI-Assisted | Pricing |
|------|:-:|:-:|:-:|:-:|:-:|---------|
| **Figma** | ✅ Strong | ✅ If/else actions | ✅ Boolean, string, number, color | ❌ | ❌ | Free tier + paid |
| **ProtoPie** | ✅ Strong | ✅ Conditions + triggers | ✅ "Baskets" (variables) | ❌ | ❌ | Free trial, from $13/mo |
| **Axure RP** | ✅ Very Strong | ✅ If/then cases | ✅ Global + local | ❌ | ❌ | From $25/mo |
| **UXPin** | ✅ Very Strong | ✅ If-then conditional interactions | ✅ + JS Expressions | ✅ Merge (React) | ❌ | From $39/mo |
| **Overflow** | ⚠️ Limited | ❌ | ❌ | ❌ | ❌ | Free tier + paid |
| **Moonchild** | ❓ Unconfirmed | ❓ Unconfirmed | ❓ Unconfirmed | ❌ | ✅ AI-first | Beta/waitlist |

---

## Detailed Analysis

### 1. Figma
**Link:** [figma.com](https://figma.com)

**Diagram ↔ Prototype relationship:** Frames on the canvas serve as screens; prototype connections create the flow. The "Prototype" panel defines interactions between frames, effectively turning a visual layout into a navigable prototype.

**Non-linear state handling:**
- **Variables** (boolean, string, number, color) auto-update any bound component property — enabling conditional visibility, dynamic text, and toggle states without duplicating frames.
- **Conditional actions:** If/else branching in prototype interactions. Example: a boolean variable `isBottomSheetOpen` controls overlay visibility; a button toggles it.
- **Expressions:** Combine variables with logic operators for complex state.
- **Unlimited action stacking:** A single trigger (tap, hover, etc.) can execute multiple actions sequentially — set variable + navigate + show overlay in one interaction.

**Relevance to Design Lab:**
- Figma's variable-driven prototype model is the closest mainstream analogue to what Design Lab does with `@xyflow/react` nodes and flow registration.
- The conditional action system (if variable → do X, else → do Y) maps directly to Design Lab's need for non-linear diagram nodes that branch based on state.
- Consider adopting Figma's pattern of binding variables to component properties as a reference for Design Lab's token/state system.

---

### 2. ProtoPie
**Link:** [protopie.io](https://protopie.io)

**Diagram ↔ Prototype relationship:** Not a diagramming tool per se — it's a dedicated interaction prototyping layer. Designs are imported (from Figma, Sketch, etc.) and interactions are added via the Object + Trigger + Response model.

**Non-linear state handling:**
- **Object + Trigger + Response model:** Every interaction is: pick an object → define a trigger (tap, drag, detect, receive) → assign responses (move, scale, opacity, scroll, etc.).
- **Conditions:** Attach conditions to any response — "only execute if variable X equals Y." This is equivalent to if/then branching.
- **Variables ("baskets"):** Store and pass data between screens/components. A variable can hold a user selection, toggle state, or form input value.
- **Toggle states:** Assign multiple states to an object and cycle through them via triggers — directly applicable to bottom sheets (closed → peek → full).
- **Conditional triggers:** Trigger different response chains based on variable values — e.g., tapping a button shows different content depending on prior selections.

**Relevance to Design Lab:**
- ProtoPie's OTR model is a clean mental model for interaction authoring that Design Lab could reference.
- The "conditions on responses" pattern is worth studying: rather than branching the flow diagram itself, you keep a linear flow but gate individual responses. This is simpler to author than full state machines.
- Variable-passing between screens mirrors Design Lab's `onNext`/`onBack` flow screen pattern but adds data carry-over.

---

### 3. Axure RP
**Link:** [axure.com](https://axure.com)

**Diagram ↔ Prototype relationship:** Axure operates as both a diagramming and prototyping tool. Flow diagrams can be created alongside interactive wireframes, and both are published as a single navigable prototype.

**Non-linear state handling:**
- **Dynamic Panels:** The core mechanism. A dynamic panel contains multiple "states" (views) that can be swapped via interactions. This is the direct analogue to bottom sheets, modals, tab content, and any UI element with multiple visual states.
- **Conditional logic (If/Then cases):** Interactions support full if/then/else case structures. Example: "If variable `userRole` equals 'admin', set panel state to 'adminView'; else set to 'defaultView'."
- **Variables:** Global and local variables persist across pages. Use cases: store form inputs, track navigation history, count interactions, drive conditional display.
- **Rich interaction events:** OnClick, OnLoad, OnResize, OnDrag, OnSwipe, OnFocus, OnTextChange — each can trigger conditional logic chains.
- **Repeaters:** Data-driven tables/lists that update dynamically based on filters and sorts — useful for prototyping data-heavy fintech screens.

**Relevance to Design Lab:**
- Axure's Dynamic Panel concept is the most direct reference for Design Lab's non-linear state challenge. Each panel state maps to a diagram node variant, and the switching logic maps to edge conditions.
- The if/then case structure in interactions is mature and well-documented — worth studying as a pattern for Design Lab's flow branching system.
- Axure's variable scope model (global vs. local) could inform how Design Lab handles data flow between flow screens beyond `onNext`/`onBack`.

---

### 4. UXPin
**Link:** [uxpin.com](https://uxpin.com)

**Diagram ↔ Prototype relationship:** UXPin combines design canvas with an interaction system. Screens are designed directly and connected via interactions. The standout feature is **UXPin Merge**, which imports real React components into the design tool.

**Non-linear state handling:**
- **Variables:** Create named variables (text, number, boolean) and use them to drive prototype behavior. A variable `formValid` can control button state, navigation paths, and visible content simultaneously.
- **Conditional Interactions:** If-then structure on any interaction. Example: On button click → if `emailField` is not empty → navigate to dashboard; else → show error state.
- **States:** Components can have multiple states (default, hover, active, error, success). Switching between states is triggered by interactions and conditions.
- **JS Expressions:** For advanced logic beyond simple if/then — compute values, validate formats, transform data.
- **UXPin Merge:** Import real React, Storybook, or Angular components into the design canvas. Prototypes use actual production code, not mockups. This means prototype behavior matches production behavior exactly.

**Relevance to Design Lab:**
- UXPin Merge is the most conceptually aligned with Design Lab's approach — both operate on the premise that prototypes should use real components, not static representations.
- The Variables + Conditional Interactions system is a clean reference for how Design Lab could expose state management to non-developers: name a variable, set conditions, done.
- The States feature (component-level multi-state) maps well to Design Lab's component library — each library component could expose multiple states that the flow diagram can switch between.

---

### 5. Overflow
**Link:** [overflow.io](https://overflow.io)

**Diagram ↔ Prototype relationship:** Overflow is specifically designed for user flow diagrams that double as presentable prototypes. Import screens from Figma/Sketch → arrange into flow diagrams → add interactive hotspots → present as navigable prototype or flow documentation.

**Non-linear state handling:**
- **Limited.** Overflow focuses on the mapping/documentation layer rather than deep interaction prototyping.
- Interactive areas (hotspots) connect screens with navigation, but there's no variable system, conditional logic, or dynamic state switching.
- Connectors between screens visualize the flow but don't carry conditional behavior.
- Best suited for communicating linear and lightly branching flows, not for prototyping complex stateful interactions.

**Relevance to Design Lab:**
- Overflow's primary value to Design Lab is as a **presentation/communication reference** — how to make flow diagrams legible and navigable for stakeholders.
- The bird's-eye ↔ screen-by-screen toggle is a useful UX pattern: view the whole flow at zoom-out, or click into any screen to see it full-size.
- Device skins and annotation layers are nice-to-have features for Design Lab's presentation mode.

---

### 6. Moonchild
**Link:** [moonchild.ai](https://moonchild.ai)

**Diagram ↔ Prototype relationship:** AI-first design tool. Drop in a PRD, product brief, or chat description → Moonchild generates wireframes, user flows, and screen designs. Double-click any screen → preview mode. Import from/export to Figma.

**Non-linear state handling:**
- **Unconfirmed.** No specific documentation found on conditional logic, variables, or dynamic state handling in the prototype interaction sense.
- Moonchild understands product logic (e.g., "sticky cart CTA that follows scroll," "order time estimate that updates") at the generation level — it creates screens that reflect these behaviors visually.
- However, whether the generated prototypes actually implement interactive state changes (bottom sheets toggling, form-driven updates) or just render static representations of those states is unclear.
- The tool is in beta and evolving rapidly; interaction capabilities may improve.

**Relevance to Design Lab:**
- Moonchild's AI generation approach is interesting for ideation: describe a flow in natural language → get a starting point to refine.
- The "product logic understanding" aspect (generating screens that account for dynamic elements) could complement Design Lab if used as an input stage — generate initial screens with Moonchild, then wire up real interactions in Design Lab.
- Not a reference for interaction/state architecture due to lack of documented non-linear capabilities.

---

## Key Takeaways for Design Lab

### Patterns Worth Adopting

1. **Variable-bound components (Figma, UXPin, ProtoPie):** A named variable changes → all bound components update. This is the standard for non-linear state without duplicating screens. Design Lab's `@xyflow/react` nodes could expose variable bindings on edges.

2. **Conditional branching on interactions (Axure, UXPin, Figma):** If/then/else logic on user triggers. Rather than creating separate flow paths for every state, a single node handles branching internally. This keeps diagrams cleaner.

3. **Component-level multi-state (Axure Dynamic Panels, UXPin States):** A component declares its possible states (default, loading, error, success, expanded, collapsed). The flow diagram references state transitions, not duplicate screens. This directly solves the bottom sheet problem: one node, two states (closed/open).

4. **Object + Trigger + Response authoring (ProtoPie):** Clean mental model for non-developers. Pick what → define when → describe what happens. Consider this as a UX pattern for Design Lab's interaction editor.

5. **Real code in prototypes (UXPin Merge):** Since Design Lab already uses React components, this validates the approach. Prototypes with real components eliminate the design↔development gap.

### Information Architecture References

- **Overflow:** Best reference for flow diagram readability and bird's-eye navigation. Study their connector styles, annotation layers, and zoom levels.
- **Axure:** Best reference for complex conditional logic UI. Study how they expose if/then cases in the interaction panel without overwhelming users.
- **ProtoPie:** Best reference for progressive disclosure of interaction complexity. Simple OTR model at surface, conditions/variables when needed.
- **UXPin:** Best reference for bridging design tools and code. Study how Merge presents React props as design-tool-friendly controls.

### Recommended Next Steps

1. **Prototype a "component states" system** in Design Lab — allow library components to declare multiple states that flow nodes can reference and switch between.
2. **Add variable/condition support to flow edges** — an edge can carry a condition ("if X then follow this path") rather than being purely navigational.
3. **Study Axure's Dynamic Panel UX** for how to present multi-state components in a diagram without visual clutter.
4. **Consider ProtoPie's OTR model** as the interaction authoring UX for Design Lab's flow screen configuration.

---

## Also Mentioned (Not Deeply Researched)

These tools overlap with the diagram→prototype space but were not analyzed in depth:

- **Miro** — collaborative whiteboard with basic prototyping features
- **Proto.io** — screen-based prototyping with interaction layers
- **Justinmind** — wireframing + prototyping with conditional logic
- **Moqups** — diagramming + wireframing (lighter-weight)
- **Creately** — visual collaboration with diagramming focus
- **LucidChart** — primarily diagramming, limited prototype features
