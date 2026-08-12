# Decisions

Ecosystem-level architectural decisions and the reasoning behind them. Not a duplicate of
`rules/` — rules state *what* to do; this states *why*, and where nova-consoles
deliberately diverges from prior art (mainly AdminPortal). Only record decisions that
affect the ecosystem's architecture, not routine implementation choices.

## Format

```
### <Decision>
- **Context:** what prompted this
- **Decision:** what was chosen
- **Why:** the reasoning / trade-off
- **Divergence:** if this differs from an existing app, what and why
```

---

### Hybrid scope architecture (feature-scoped UI, centralized infrastructure)
- **Context:** Need a structure that scales past a handful of features without either
  scattering infrastructure across every feature folder or collapsing all UI into one
  flat directory.
- **Decision:** UI (`features/<name>/`) is feature-scoped; API/service clients, global
  contexts, and global stores are centralized (`services/`, `shared/`).
- **Why:** Lets a reader answer "how is this rendered" and "how does this talk to the
  backend" by looking in two different, predictable places.
- **Divergence:** None — this matches AdminPortal's existing, working structure. See
  rules/architecture.md and rules/project-structure.md.

### Localization goes through `frontend-foundation`, not `next-intl`
- **Context:** AdminPortal uses `next-intl` directly, with cookie-based locale
  resolution, predating `frontend-foundation`'s bootstrap/tenant-override translator.
- **Decision:** nova-consoles uses `frontend-foundation`'s `createTranslator` /
  `createTranslatorFromBootstrap`, via a thin app-level hook, not `next-intl`.
- **Why:** `frontend-foundation`'s resolver supports per-tenant runtime dictionary
  overrides (tenant → application → fallback), which a central admin console for a
  multi-tenant platform needs. `next-intl` has no notion of a tenant override layer.
- **Divergence:** Deliberate — see rules/localization.md. AdminPortal is not being
  migrated as part of this decision; this only governs new apps.

### Admin UI comes from `frontend-next-shadcn`, not a from-scratch shadcn setup
- **Context:** Two UI wrapper packages exist: `frontend-next-shadcn` (admin) and
  `frontend-next-mui` (storefront). AdminPortal predates both and vendors shadcn output
  directly plus its own `App`-prefixed wrapper layer.
- **Decision:** nova-consoles, as a purely admin console, consumes
  `frontend-next-shadcn`'s public exports (`AdminProvider`, `AdminLayout`, `DataTable`,
  etc.) directly rather than re-vendoring shadcn/Radix from scratch.
- **Why:** The wrapper package already exists and is exercised in `apps/playground`;
  re-vendoring would duplicate work the ecosystem is meant to share.
- **Divergence:** From AdminPortal's approach (predates the package). nova-consoles' own
  `shared/ui/` layer, if one emerges, should wrap `frontend-next-shadcn` exports rather
  than raw Radix primitives.

### Component/hook pairing is a hard rule, not a convention
- **Context:** AdminPortal only applies the `Component` + `useComponent` pairing
  consistently in one feature (`features/users`); other features mix hooks inline or into
  a shared per-feature `hooks/` folder.
- **Decision:** nova-consoles applies the pairing to every non-trivial component from the
  start.
- **Why:** Consistency was the actual gap in AdminPortal, not the pattern itself — formalizing
  it removes the ambiguity about when to use it.
- **Divergence:** Stricter than AdminPortal's current (inconsistent) practice. See
  rules/hooks.md.
