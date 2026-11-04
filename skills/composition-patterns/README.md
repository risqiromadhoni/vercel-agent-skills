# React Composition Patterns

A structured repository for React composition patterns that scale. These
patterns help avoid boolean prop proliferation by using compound components,
lifting state, and composing internals.

## Structure

- `rules/` - Individual rule files (one per rule)
  - `_sections.md` - Section metadata (titles, impacts, descriptions)
  - `_template.md` - Template for creating new rules
  - `area-description.md` - Individual rule files
- `metadata.json` - Document metadata (version, organization, abstract)
- **`AGENTS.md`** - Compiled output (generated)

## Rules

### Component Architecture (HIGH)

- `architecture-avoid-boolean-props.md` - Don't add boolean props to customize
  behavior
- `architecture-compound-components.md` - Structure as compound components with
  shared context

### State Management (MEDIUM)

- `state-lift-state.md` - Lift state into provider components
- `state-context-interface.md` - Define clear context interfaces
  (state/actions/meta)
- `state-decouple-implementation.md` - Decouple state management from UI

### Implementation Patterns (MEDIUM)

- `patterns-children-over-render-props.md` - Prefer children over renderX props
- `patterns-explicit-variants.md` - Create explicit component variants

### React 19 APIs (MEDIUM)

- `react19-ref-as-prop-and-use.md` - `ref` as a regular prop, `<Context value>`
  as the provider, and `use(Context)` for conditional reads

## Core Principles

1. **Composition over configuration** — Instead of adding props, let consumers
   compose
2. **Lift your state** — State in providers, not trapped in components
3. **Compose your internals** — Subcomponents access context, not props
4. **Explicit variants** — Create ThreadComposer, EditMessageComposer, not Composer
   with isThread

## Testing

Before committing a change to these rules, validate and regenerate from the build tooling:

```bash
cd packages/react-best-practices-build && pnpm validate && pnpm build
```

`pnpm validate` checks every rule file. `pnpm build` regenerates `AGENTS.md` and `packages/react-best-practices-build/test-cases.composition-patterns.json`.

Rule examples are also checked by the cross-framework bench in `packages/skill-bench/`, which targets Next.js 16 and TanStack Start:

- Tier 1 (deterministic, runs in CI): compiles each rule's Correct example in both frameworks and runs the production build.
- Tier 2 (agent eval, manual): measures whether an agent applies the rule when the skill is loaded and when it is not.

See `packages/skill-bench/README.md` for the commands.

## Creating a New Rule

1. Copy `rules/_template.md` to `rules/area-description.md`
2. Choose the appropriate area prefix:
   - `architecture-` for Component Architecture
   - `state-` for State Management
   - `patterns-` for Implementation Patterns
   - `react19-` for React 19 APIs
3. Fill in the frontmatter and content
4. Ensure you have clear examples with explanations

## Impact Levels

- `CRITICAL` - Foundational patterns, prevents unmaintainable code
- `HIGH` - Significant maintainability improvements
- `MEDIUM` - Good practices for cleaner code
