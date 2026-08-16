# NovaCore Admin Design System

Extracted from the mockup at `docs/mock-up/nova-core-mockup_template.png`. This is the
**visual and UX baseline for every NovaCore admin product**, not just `nova-console`. The
implementation lives in `@novacore/frontend-next-shadcn` (`frontend-nextjs/packages/shadcn`)
— that package, not the mockup image, is the source of truth for exact values going
forward. This document explains the rules and why they exist.

## Package boundary

- **`frontend-foundation` owns none of this.** It's the framework-agnostic layer beneath
  every React adapter (i18n, http, auth model, date/number/currency) and explicitly
  forbids any UI/styling dependency — see its own `CLAUDE.md`. Never look for theme code
  there.
- **`frontend-next-shadcn` owns the token engine and every reusable admin primitive**
  (`AdminProvider`/`ThemeConfig`/`resolveTheme`, `AdminLayout`/`AdminSidebar`/`AdminHeader`,
  `DataTable`, `StatCard`, `DataFreshness`, `FilterToolbar`, `StatusBadge`, `ConfirmDialog`,
  `EmptyState`/`LoadingState`/`ErrorState`, `CommandPalette`, the permission kit). Anything
  reusable across NovaCore admin products belongs here, built once — see
  `docs/reference/frontend-nextjs.md`.
- **`nova-console` (or any admin app) only composes** — it picks a theme, wires real data
  into shared components, and adds app-specific pages. It should not redefine tokens,
  hand-roll KPI cards, or hand-roll filter toolbars.

## Color system

### Chrome vs. accent — two independent dimensions

The mockup's defining trait is a **dark navy/indigo sidebar that stays dark regardless of
whether the content area is in light or dark mode**, paired with a **violet/purple accent**
used for primary actions and active nav state.

The token engine (`ThemeConfig{base,color,style,radius,overrides}` →
`resolveTheme` → light/dark `ThemeTokens`) already supports this without any core change:
`overrides` is applied identically to both the light and dark resolved token sets
(`resolve-theme.ts`), so a `sidebar`/`sidebar-foreground`/`sidebar-border`/`sidebar-accent`/
`sidebar-accent-foreground` override is mode-independent for free. `sidebar-primary` (the
active-nav highlight) is deliberately **not** overridden — it keeps tracking `color`, so it
stays light/dark-aware and swaps automatically if a product picks a different accent.

This is packaged as `NOVACORE_ADMIN_THEME` / `NOVACORE_CHROME_OVERRIDES`
(`frontend-next-shadcn`'s `./theme` export, `src/theme/novacore.ts`):

```ts
export const NOVACORE_ADMIN_THEME: ThemeConfig = {
  base: "zinc",
  color: "violet",
  style: "modern",
  radius: "large",
  overrides: NOVACORE_CHROME_OVERRIDES, // 5 sidebar-* keys, dark navy, mode-independent
};
```

**Never write raw HSL overrides in an app.** The previous state of this app did exactly
that (`src/app/providers.tsx`, commit `eb3ad71`) — one unlabeled `overrides` block with
only `primary`/`ring` set, sidebar left stock zinc. That's the "ShadCN starter" problem:
branding that isn't a first-class, named, reusable thing. Consume `NOVACORE_ADMIN_THEME`
instead.

### Product identity layer

A future NovaCore admin product (CRM, Payments, Logistics, ...) inherits the same dark
chrome and swaps only its accent:

```ts
<AdminProvider theme={{ ...NOVACORE_ADMIN_THEME, color: "blue" }}>
```

Do not rebuild the shell, invent a new base palette, or duplicate the chrome overrides per
product. `color` is the one dimension a product identity is allowed to change (optionally
`radius`); everything else (layout, typography, spacing, component behavior) is shared.

### Status semantics

Use the existing semantic tokens (`success`/`warning`/`destructive`/`info`) via
`StatusBadge`/`StatCard`'s `tone` prop — never a one-off color per feature. `tone="brand"`
on `StatCard` ties an icon chip to the product accent (`primary`), for the "headline"
metric of a KPI row (e.g. total count).

## KPI cards and data freshness

`StatCard`/`StatCardRow` (`frontend-next-shadcn`, `./data` export) replace bare numbers
with icon + value + optional trend + optional freshness. **Always wire `freshness` when the
number is approximate or cached** — nova-console's own tenant/package counts are a bounded
client-side sample (`GET /tenants?pageSize=100`, no aggregate endpoint exists), so every
`StatCard` in this app passes `freshness={{ updatedAt: query.dataUpdatedAt, isFetching:
query.isFetching }}`, sourced straight from TanStack Query. Never let a KPI imply
real-time precision it doesn't have.

`DataFreshness`/`useDataFreshness` (same export) render "Updated 2m ago" or "Cached ·
refresh in 42s", staying visually secondary (`text-xs text-muted-foreground`). The props
(`updatedAt`, `nextRefreshAt`, `ttlSeconds`, `isFetching`) are shaped so a real backend
`refreshedAt`/`cacheTtl` contract can plug in later without changing the component — today
there is no such backend contract anywhere in the ecosystem, so `isFetching`/`dataUpdatedAt`
is the only honest signal available.

## List-page pattern

```
Breadcrumb + PageHeader
    ↓
StatCardRow (module-appropriate metrics, each with freshness if approximate)
    ↓
FilterToolbar (search + filter selects + clear-all + trailing actions)
    ↓
DataTable (built-in pagination/sort/loading/error/empty states)
```

`FilterToolbar` (`./layout` export) replaces hand-rolled `Toolbar` compositions — see
`features/tenant/.../TenantFilters` for the reference usage. It's slot-based
(`search`/`filters`/`onClearFilters`/`actions`); it owns no state itself.

## Business identity through icons and tone, not new hues

Within one product, different modules should read as distinct at a glance without
introducing new colors: Tenant Management uses an org/identity icon
(`Building2`) with `tone="brand"` on its headline stat; Subscription/Package uses a
package icon; Permission Scope uses a security-leaning icon. This is presentational only
(icon + `tone` choice) — it does not fork the token system per module. Reserve actual hue
changes for product-level identity (see above), not for modules within one product.

## Settings pattern

A settings page is a `PageHeader` + `Tabs` (not a full separate nav shell unless there are
enough real sections to warrant one) — see `features/settings/components/SettingsPage`.
Only build sections for capabilities that are genuinely real; don't add a tab, a save
button, or a danger zone for something with no backing behavior. nova-console's Settings
page currently has one real section (Appearance — `AdminProvider`'s theme mode, with true
draft/save/cancel state) and a bridge to the existing Console Language page.

## Confirmation / destructive actions

Use `ConfirmDialog` (`frontend-next-shadcn`) — see any of `TenantActions`, `ScopeActions`,
`TenantClientRotateAction`, `PackageGroupListPage`, `PackageTagListPage`,
`TenantOverviewPanel` for reference usage. It already includes loading/inline-error/retry
states; don't hand-roll a destructive-confirmation flow.

## Explicitly out of scope (and why)

- **No charting library.** The mockup's line/donut/bar charts have no real backing
  time-series data anywhere in the domain (`GET /tenants` has no history/aggregate
  endpoint). Fabricating chart data would violate this project's established convention of
  never inventing backend behavior (see `docs/decisions/README.md`'s dev-adapter entries —
  all scoped to real domain models pending endpoints, never to invented data). Add a chart
  package (and decide where it's owned — likely a `./charts` subpath on
  `frontend-next-shadcn`) only once a real data source exists to back it.
- **No per-module accent colors within one product.** See "Business identity" above —
  reserved for product-level identity, not intra-product module distinction.

## App shell composition (sidebar collapse, user profile, search)

`AdminLayout`/`AdminSidebar`/`AdminHeader` (`frontend-next-shadcn`) already ship the full
collapse/expand mechanism (`useAdminLayout`, `AdminSidebarToggle` for mobile,
`AdminSidebarCollapseToggle` for desktop — both now rendered automatically by
`AdminHeader`) and a shared `UserProfile` component (avatar + name + role + dropdown;
`variant="full"` for a sidebar footer, `variant="compact"` for a header avatar-only
trigger). `nova-console/src/shared/layout/AdminShell.tsx` is the reference composition:

- **Reading `sidebarCollapsed` for `<AdminSidebar collapsed>`**: `AdminSidebar` needs an
  explicit boolean prop, but the app builds its `sidebar` JSX *before* `<AdminLayout>`
  mounts the context provider that owns that state. The fix is a small internal
  `ShellSidebar` component that itself calls `useAdminLayout()` — since React doesn't
  execute a component's body until it actually renders (which happens *inside*
  `AdminLayout`'s provider, regardless of where the JSX was authored), this works with zero
  changes to the shared package. Don't thread `collapsed` through `AdminShell`'s own props;
  wrap.
- **Search** is a plain button styled like a search input that calls
  `useCommandPalette().setOpen(true)`; `CommandPalette`'s `onNavigate` does **not** route by
  itself — the consumer must call `router.push(item.href)`.
- **Notifications** is a `DropdownMenu` showing an honest "No notifications yet." — there is
  no real notification data source anywhere in the domain, so don't render a badge/count
  that would imply otherwise.
- **Icons everywhere real navigation exists**: every `NavigationItem` in
  `shared/layout/navigation.tsx` (note the `.tsx` extension — it's JSX, not `.ts`) carries
  a lucide icon. Business identity per module (§ above) is expressed the same way: pick an
  icon + `tone` on that module's `StatCard`, not a new hue.

## nova-console's own Tailwind build — read before writing any className here

`nova-console` has its own `tailwind.config.ts` / `postcss.config.js` /
`src/app/globals.css` (`@tailwind utilities;` only). This was **not** originally part of
the architecture and is easy to assume unnecessary — it is not optional. Two facts explain
why:

1. `@novacore/frontend-next-shadcn/styles.css` is precompiled from **that package's own
   source only** (`content: ["./src/**/*.{ts,tsx}"]` scoped to `packages/shadcn`). It has
   no visibility into `nova-console`'s source. Any Tailwind class written directly in
   `nova-console/src/**` that doesn't already happen to appear somewhere in the shared
   package's own source has **no compiled CSS backing it at all** — the class name renders
   as an inert string. This is why early attempts at header/sidebar polish silently did
   nothing (`sm:flex`, `size-7`, etc. never had rules generated).
2. Two independently-compiled Tailwind stylesheets sharing the page are **not** safe to
   naively concatenate even once nova-console has its own build: if a class name (e.g. the
   bare `hidden`) is emitted by *both* files, the browser resolves the conflict by document
   order — whichever file is loaded last wins for **every** element using that class
   anywhere on the page, including ones from the *other* file. This broke the sidebar
   outright: nova-console's own (later-loaded, unconditional) `.hidden{}` rule beat the
   shared package's `@media(min-width:768px){.md\:block{}}` rule for `<AdminSidebar>`'s
   wrapping `<aside>`.

The fix in place: `tailwind.config.ts`'s `content` array scans **both**
`nova-console/src/**` and the shared package's `packages/shadcn/src/**`. This makes
nova-console's own build a self-consistent superset — Tailwind always emits unconditional
utilities before responsive-variant ones within one build, so the last matching rule for
any class combination is correct regardless of the other file's ordering. Don't remove that
second content glob, and don't add a third consumer app without adding its source to this
same list (or revisiting this approach entirely — see the file's own comment).

## Bugs found and fixed while implementing this baseline (frontend-next-shadcn)

- **`Button`'s `asChild` + Radix `Slot` crash** (`components/ui/button.tsx`): the component
  unconditionally rendered `{loading ? <Loader2/> : null}{children}` inside `Slot`, giving
  Slot two children (`null` + the real one) even when not loading — `Slot` requires exactly
  one. Every `<Button asChild><Link>...</Link></Button>` in the app crashed with "Slot
  failed to slot onto its children" the moment it actually rendered in a browser (a
  build/typecheck never catches this — it's a runtime-only Radix invariant). Fixed by only
  wrapping in the loading fragment when `!asChild`.
- **Sibling nav items double-highlighting** (`components/admin/admin-sidebar.tsx`):
  `isHrefActive`'s prefix match (`activeHref.startsWith(href + "/")`) made a *sibling* item
  like "All tenants" (`/tenants`) also match `/tenants/new`, alongside "New tenant" itself.
  Fixed with `resolveBestMatchHref` — flattens the whole nav tree and picks the single
  longest-prefix-matching href; only that exact item highlights. Parent-auto-expand for
  nested `children` still uses subtree containment separately, so that behavior is
  unaffected.

Neither bug was ever caught before this pass because no prior session had a working
browser session against a real (or mocked) backend — see the OpenWolf buglog for the full
detail and how the mock backend was set up for verification.

## Sidebar group collapse and persisted UI preferences

`AdminSidebar` groups can be `collapsible: true` (was already supported, just unused).
Group open/closed state and the sidebar's own collapsed/expanded state are **two
independent concepts** — collapsing the whole sidebar never resets a group's remembered
state; expanding it restores exactly what it was.

Both `AdminLayout` (`collapsed`/`onCollapsedChange`) and `AdminSidebar`
(`openGroupIds`/`onGroupOpenChange`) now support the standard controlled-if-provided/
uncontrolled-otherwise pattern (same shape as this package's own `Select`/`Dialog`
`value`/`defaultValue` convention) — passing neither keeps the old internal-state-only
behavior, so this is non-breaking for any existing consumer.

`nova-console`'s `useSidebarPreferences` (`shared/layout/useSidebarPreferences.ts`) is the
reference pattern for wiring persistence onto that controlled API: one
`usePersistentState` call (`frontend-next-shadcn`'s `./hooks` export) holding
`{ collapsed, openGroups: Record<groupId, boolean> }`, keyed
`novacore.admin.preferences.sidebar`. Resilience is inherited from `usePersistentState`
itself (malformed/missing localStorage data silently falls back to defaults) plus the
natural behavior of `openGroupIds?.[group.id] ?? group.defaultOpen ?? true` — new groups
get their configured default, removed/renamed groups just leave harmless stale keys
behind. **Group ids are the persistence key — never rename one without expecting existing
users' remembered state for it to reset.**

## `usePersistentState` — the one preference-storage mechanism

`frontend-next-shadcn`'s `./hooks` export (`usePersistentState`, `useDebouncedValue`,
`useDebouncedCallback`). `usePersistentState<T>(key, defaultValue)` is the single
`localStorage`-backed state primitive every persisted UI preference in this ecosystem
should use — sidebar state, per-table column visibility, anything similar later. It does
**not** own a naming scheme (callers pass a fully-qualified key); the convention actually
in use is `novacore.admin.preferences.<area>[.<scope>]`, e.g.
`novacore.admin.preferences.sidebar`,
`novacore.admin.preferences.table.tenants.columns`. SSR-safe (first render always uses
`defaultValue`, matching the theme system's own documented flash-of-default tradeoff),
resilient to malformed JSON/unavailable storage (falls back silently, never throws).

`useDebouncedValue` (debounces a value) was promoted here from a `nova-console`-local hook
with only two call sites — any future NovaCore product doing debounced search needs the
same thing. `useDebouncedCallback` (debounces a function, with `.cancel()`) is new,
for cases where you need to defer an action rather than a derived value.

## List-page infrastructure: filter, sort, columns, pagination

Four new `frontend-next-shadcn` primitives, all demonstrated on `nova-console`'s Tenant
List (the reference "enterprise list page" for this pass — Packages/Groups/Tags don't have
them yet, a documented follow-up, not an oversight):

- **`Pagination`** (`./data`) — page numbers with ellipsis, page-size selector, "Showing
  X–Y of Z" range. `DataTable`'s own footer now delegates to this internally, so every
  existing `DataTable` consumer gets it for free with no changes required.
- **`ColumnVisibility`** (`./data`) — per-table show/hide popover with a hidden-count
  badge and Clear. Purely controlled/presentational; persistence is layered on by the
  consumer via `usePersistentState` (see `useTenantListPage.ts`), not baked in, so it stays
  usable by a consumer that doesn't want persistence.
- **`AdvancedFilter`** / **`AdvancedSort`** (`./layout`) — config-driven builders that
  produce real `@novacore/frontend-foundation` `CriteriaFilter[]`/`CriteriaSort[]`, not an
  invented shape. `AdvancedFilter` deliberately has no AND/OR grouping — the real backend
  `CriteriaRequest` contract is a flat filter list only (implicit AND); building a grouped
  UI would imply a backend capability that doesn't exist. `AdvancedSort` is independent
  from `DataTable`'s single-column header sort (`sortable`/`onSortingChange`,
  "quick sort") — a `SortFieldConfig` marks which fields are also quick-sortable, but the
  two mechanisms don't have to overlap; a field can be advanced-sort-only.

**No `/tenants/search`-style criteria endpoint exists yet** (`GET /auth/tenants` only takes
`search/page/pageSize`), so `useTenantListPage.ts` applies the produced
`CriteriaFilter[]`/`CriteriaSort[]` **locally** via `@novacore/frontend-foundation`'s new
`applyCriteriaFilters`/`applyCriteriaSorts` (`src/api/search/apply.ts`, unit-tested) —
evaluators for the exact same wire contract, for exactly this "no backend endpoint yet"
situation. This only affects whichever page is already fetched, not the full result set
across pages — a known, documented limitation, not a bug. When a real search endpoint
ships for an entity, swap the local `applyCriteria*` calls for sending the
`CriteriaRequest` to it; the UI components and the field-config shape don't need to change.

## `HowTo` and `AboutDialog`

`HowTo` (`.` root export) — subtle, reusable page-footer guidance box (icon + title +
body + optional link), content always caller-supplied. `AboutDialog` (`./layout`) — same
principle for a header `?` button: every string (`appName`, `description`, `version`,
`links`) is passed in by the consumer, nothing `nova-console`-specific is hardcoded in the
shared package. `nova-console`'s `AdminShell.tsx` supplies its own `app.name`/
`app.description` translations plus `package.json`'s real `version` (via
`resolveJsonModule`, already enabled).

## Header: search width, language switcher

The header search trigger moved from `AdminHeader`'s `search` slot (a `shrink-0` trailing
slot, too narrow for a real search box) to its `children` slot, which renders in the
flexible middle region — `max-w-md` with real growable width instead of being squeezed
into the icon row. `LocaleSwitcher` (`./layout`) is presentational only (`locale`,
`availableLocales`, `onLocaleChange` props, no store coupling) — `nova-console`'s
`useLocale()` (`shared/i18n/useLocale.ts`) is a thin typed wrapper around the
already-existing, already-persisted `useLocaleStore` (this was live and working before
this pass; only the switcher UI was missing).

## Where a future NovaCore admin product starts

1. Depend on `@novacore/frontend-next-shadcn` and `@novacore/frontend-foundation`, same as
   `nova-console`.
2. `<AdminProvider theme={{ ...NOVACORE_ADMIN_THEME, color: <product-accent> }}>`.
3. Reuse `AdminLayout`/`AdminSidebar`/`AdminHeader`, `PageHeader`, `StatCard`/`StatCardRow`,
   `FilterToolbar`, `Pagination`, `AdvancedFilter`/`AdvancedSort`, `ColumnVisibility`,
   `DataTable`, `StatusBadge`, `ConfirmDialog`, `EmptyState`/`LoadingState`/`ErrorState`,
   `HowTo`, `AboutDialog`, `LocaleSwitcher`, `UserProfile` as-is.
4. Wire `freshness` on the `StatCardRow` for every KPI row backed by an approximate/cached
   number — one freshness line per row/snapshot, never repeated per card.
5. Do not re-derive chrome, typography, spacing, or radius — those are shared, not
   per-product.
6. Set up the app's **own** minimal Tailwind build (config + postcss + a utilities-only
   global stylesheet) the same way `nova-console` does — see "nova-console's own Tailwind
   build" above. This is required the moment the app writes even one Tailwind class of its
   own; add the app's `content` glob to `nova-console`'s `tailwind.config.ts` comment as a
   reminder of every consumer that needs the same superset-scanning treatment, or revisit
   the approach if a third consumer makes per-app content globs unwieldy.
