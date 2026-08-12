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

### Session bootstrap probes `refresh-token`; identity/permissions are a stubbed, isolated adapter pending a `/me` endpoint
- **Context:** No `GET /me`/session endpoint exists (see docs/reference/domain-mapping.md)
  — `POST /login` and `POST /refresh-token` both return empty bodies. The frontend
  cannot read the HTTP-only access-token cookie either.
- **Decision:** On app load, nova-console silently calls `POST /refresh-token` to
  determine *whether* a valid session exists (success = authenticated, 401 = not).
  Actual identity and permissions come from an isolated dev adapter
  (`services/auth/getCurrentUser.dev-adapter.ts`) that assumes an authenticated session
  implies Root access — since nova-console's only real, callable endpoint in this domain
  (`GET /tenants`) already requires Root, and every screen in this app gates on Root too.
- **Why:** Refusing to render anything until a `/me` endpoint exists would make the
  console unusable even for legitimate Root operators; inventing a fake `/me` response
  shape and pretending it's real would violate "never pretend development
  authentication is production." This is the narrowest possible assumption: it doesn't
  invent permissions, doesn't fabricate roles, and is isolated to one clearly-labeled
  file. Client-side permission checks are a UI-only signal regardless (see
  reference/authorization.md) — the backend enforces the real boundary either way.
- **Divergence:** N/A, new pattern. **Must be replaced** once a real session/`/me`
  endpoint exists — that's a prerequisite for this assumption to go away, not just a
  nice-to-have.

### nova-console gates entirely on `Permissions.Root`, not invented Tenant/Scope permissions
- **Context:** The backend permission catalog has no `Tenant.*`/`Scope.*` keys yet — see
  docs/reference/domain-mapping.md. The one real endpoint in this domain (`GET /tenants`)
  is gated by `Permissions.Root` alone.
- **Decision:** Every Tenant/Scope/Public-Key/Translation screen and action in
  nova-console is gated by `Permissions.Root`, applied uniformly, rather than inventing
  finer-grained permission strings that don't exist server-side.
- **Why:** Client-side permission checks are a UI-only signal (see
  reference/authorization.md) — inventing permission strings the server doesn't
  recognize would be actively misleading, implying enforcement that doesn't exist.
- **Divergence:** N/A — no prior app manages this domain. Revisit once the backend adds
  granular Tenant/Scope permission keys.

### Tenant/Scope/Public-Key features are built against a documented backend gap
- **Context:** Tenant CRUD, Scope CRUD, and TenantClient (public key) management have no
  backend API today — domain models exist, endpoints don't. See
  docs/reference/domain-mapping.md.
- **Decision:** `services/tenant/` and `services/scope/` are backed by an isolated
  in-memory development adapter, typed against the real domain shapes, rather than
  blocking frontend implementation until the backend catches up.
- **Why:** Matches the documented ecosystem rule that UI must stay independent of
  transport (see rules/state-and-data.md) — swapping the adapter for a real HTTP-backed
  service later should require no changes above the `.service.ts` layer.
- **Divergence:** N/A, new pattern. The adapter boundary itself is documented per-feature
  as it's introduced (see each feature's own notes), not duplicated here.

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
