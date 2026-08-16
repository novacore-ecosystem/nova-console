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

### Enterprise list-page infrastructure (filter/sort/columns/pagination) is real `CriteriaRequest`, applied locally
- **Context:** A follow-up refinement pass asked for column visibility, an advanced filter
  builder, multi-field sort, and full pagination on admin list pages, plus persisted
  sidebar/navigation-group state — explicitly requiring the OMS sibling app be inspected
  first for prior art (it had none worth reusing: no persistence, no multi-sort, no
  reusable filter-criteria builder — see the plan file for the full audit) and the
  backend's real search-criteria contract be used, not an invented shape.
- **Decision:** `AdvancedFilter`/`AdvancedSort` (`frontend-next-shadcn`) produce real
  `CriteriaFilter[]`/`CriteriaSort[]` from `@novacore/frontend-foundation`'s
  `src/api/search/` contract. Since no `/tenants/search`-style endpoint exists yet, they're
  applied **locally** via two new, unit-tested `frontend-foundation` functions
  (`applyCriteriaFilters`/`applyCriteriaSorts`, `src/api/search/apply.ts`) rather than
  posted to a fabricated endpoint. `ColumnVisibility` and sidebar collapse/group-open state
  persist through one new shared primitive, `usePersistentState`
  (`frontend-next-shadcn`'s `./hooks` export), namespaced
  `novacore.admin.preferences.*`, keyed by stable ids (group ids, column ids), never
  translated labels.
- **Why:** Matches the same "honest about what's real vs. approximated" pattern already
  established for KPI freshness — the filter/sort *mechanism* is real and reusable (the
  same `CriteriaFilter`/`CriteriaSort` shapes a real endpoint will eventually accept), only
  the data source is a local, documented stand-in. Keeping `AdvancedFilter` to a flat
  filter list (no AND/OR grouping) matches the actual backend contract, which has no
  grouping concept — building one would imply a capability that doesn't exist server-side.
- **Divergence:** N/A, new pattern. Applied fully only to Tenant List (the established
  reference list page); Packages/Groups/Tags don't have these controls yet — a documented
  follow-up, not silently dropped scope.

---

### NovaCore Admin visual identity lives in `frontend-next-shadcn`, not `nova-console`
- **Context:** A mockup (`docs/mock-up/nova-core-mockup_template.png`) was supplied as the
  visual baseline for NovaCore's admin ecosystem, not just this app. The prior state had
  one raw, unlabeled `overrides` block in `nova-console/src/app/providers.tsx` (commit
  `eb3ad71`) setting only `primary`/`ring` to a hand-picked indigo — the sidebar stayed
  stock zinc, and a local `StatTile` existed only because the shared package had no KPI
  card. Both are the "ShadCN starter" problem the brief warned against.
- **Decision:** Brand tokens (`NOVACORE_ADMIN_THEME`/`NOVACORE_CHROME_OVERRIDES`) and new
  reusable primitives (`StatCard`, `DataFreshness`/`useDataFreshness`, `FilterToolbar`)
  were added to `@novacore/frontend-next-shadcn` (`frontend-nextjs/packages/shadcn`), not
  `nova-console`. `nova-console`'s `providers.tsx` now consumes `NOVACORE_ADMIN_THEME`
  directly instead of hand-rolled overrides; its local `StatTile`/`StatTileRow` was
  deleted in favor of the shared `StatCard`/`StatCardRow`.
- **Why:** Matches the ecosystem's own layering rule (`docs/rules/architecture.md`) —
  anything reusable across NovaCore admin products belongs in `frontend-next-shadcn`, not
  duplicated per app. The chrome-override mechanism itself needed no core engine change:
  `resolveTheme` already applies `ThemeConfig.overrides` identically to both light and dark
  resolved token sets (`resolve-theme.ts`), which is exactly why a mode-independent dark
  sidebar could ship as a named export instead of a new architectural layer. Full rules:
  `docs/reference/design-system.md`.
- **Divergence:** Replaces the `eb3ad71` ad-hoc override entirely.

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

### Translation Management edits the live `tenant` override layer directly, no service/adapter split
- **Context:** No structured translation-key backend exists at all — only opaque
  per-tenant `TenantLocale.DictionaryJson` blobs and scattered per-aggregate translation
  tables (see docs/reference/domain-mapping.md). There's nothing shaped like a
  key/value store to call, real or mocked.
- **Decision:** Translation Management edits `shared/stores/translationOverrides.store.ts`
  directly — a Zustand store holding flat dotted-key overrides per locale
  (`Record<Locale, Record<string, string>>`). `AppTranslationProvider` (from Phase 1)
  now reads this store as the `tenant` layer of `createTranslator`'s resolution chain —
  the highest-priority layer, exactly as documented in rules/localization.md. Editing a
  translation in this UI changes what `t()` actually resolves to, live, app-wide.
  The **browsable catalog** (the list of known keys and their base/fallback values) is
  built by flattening `frontend-foundation`'s `TRANSLATION_RESOURCES` and this app's own
  `APP_DICTIONARY` — both real, already-shipped dictionaries, not synthetic sample data.
- **Why:** This is the one feature in nova-console where the "dev adapter standing in
  for a missing backend" pattern doesn't fit — there's no entity shape to mimic. The
  actual, real thing to manage is the resolution chain already built in Phase 1. Wiring
  overrides into it directly makes the feature real (not a disconnected form that writes
  to nowhere) without inventing a fake backend contract.
- **Divergence:** No TanStack Query layer for this feature (see rules/state-and-data.md
  — Query owns *fetched* data; there's nothing fetched here, it's synchronous in-memory
  state, which is exactly what Zustand is for). Every other feature in this app uses
  Query; this is a deliberate, narrow exception.
- **Persistence:** in-memory only (a `TenantBootstrap`-sourced `tenant` dictionary is
  the eventual real mechanism, per docs/reference/frontend-foundation.md — still no
  confirmed backend endpoint for that). Overrides don't survive a page reload; this is
  a known, documented limitation, not a bug.

### TenantClient (public key) management is split: a Tenant detail tab plus a top-level Security page for Root clients
- **Context:** `TenantClient.TenantId` is nullable — Root clients (`IsRootClient =>
  TenantId is null`) aren't owned by any one tenant, unlike Scope. Nesting the whole
  feature under Tenant detail the way Scope was wouldn't cover Root clients at all.
- **Decision:** `TenantClientListPanel` (shared component, takes `tenantId: string |
  null`) is reused in two places: a "Keys" tab on `/tenants/[id]` (`tenantId` = that
  tenant), and a new top-level `/security` page gated on `Permissions.Root` (`tenantId =
  null`, showing Root clients). One feature, two entry points, not two separate
  implementations.
- **Why:** Matches the actual domain shape (a client can belong to a tenant or be
  global) instead of forcing a per-tenant-only or global-only model that doesn't fit.
- **Divergence:** N/A, new pattern — first feature in nova-console with a nullable
  tenant scope. Zero backend endpoints exist for `TenantClient` at all (domain +
  persistence only, no CQRS/API wired yet) — same dev-adapter isolation as Tenant/Scope.
- **Security handling:** the adapter's generated `publicKey` value is shown once, on
  creation/rotation, in a dedicated reveal dialog — never persisted to localStorage/
  sessionStorage/URL, never logged, matching the original task brief's explicit
  requirement to never expose key material outside a one-time display.

### Scope Management is scoped per-tenant (Tenant detail page), fully dev-adapter-backed
- **Context:** Scope is a hierarchical org unit (branch/agency/dealer/region) owned by a
  Tenant (`Scope.TenantId`, `ParentScopeId`, `Path`, `Level`). Unlike Tenant, **zero**
  backend endpoints exist for Scope — no real list to seed from at all (see
  docs/reference/domain-mapping.md).
- **Decision:** Scope Management lives inside a new Tenant detail page
  (`/tenants/[id]`, "Scopes" tab), not as its own top-level nav item. The adapter is
  seeded with a small static sample set per tenant, not from any real call.
- **Why:** Scope only makes sense in the context of one Tenant (the domain model itself
  requires a `TenantId`) — a global cross-tenant Scope list would misrepresent the
  domain. Nesting under Tenant detail also matches how the data is actually owned.
- **Divergence:** N/A, new pattern. Introduces the Tenant detail page (`/tenants/[id]`)
  that Phase 4 didn't need — Tenant's list page had no click-through before this.
- **UI shape:** flat table with a `path`/`level` column, not a tree view or nested
  expand/collapse. `frontend-next-shadcn` has no tree component. A flat table matches
  the existing DataTable pattern and avoids building a new UI primitive for one feature.

### Tenant Management reads real data, mutates through a seeded in-memory adapter
- **Context:** `GET /tenants` is real (Root-only summary list). Create/update/
  activate/deactivate/get-by-id have no backend endpoint at all (see
  docs/reference/domain-mapping.md). Showing real list data next to a *disconnected*
  mock CRUD store would silently misrepresent state (create a tenant, it vanishes on
  refresh; edit a real tenant, the edit applies to an unrelated mock copy).
- **Decision:** `services/tenant/tenant.dev-adapter.ts` holds one in-memory store,
  seeded once from the real `GET /tenants` response. All reads and writes after that
  go through the adapter, so the UI is internally consistent (a created/edited tenant
  behaves the same as a real one for the rest of the session) even though nothing
  persists server-side yet.
- **Why:** Matches the same isolation principle as the current-user adapter — one
  clearly-labeled file, real data where it exists, no invented backend behavior implied.
- **Divergence:** N/A, new pattern. Replace the adapter's write operations with real
  HTTP calls once Tenant CRUD endpoints exist; `listTenants()` (the real call) doesn't
  need to change.

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
