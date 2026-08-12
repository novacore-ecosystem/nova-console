# Project Structure

This is the intended structure for `nova-consoles`, formalized from the working reference
app (`AdminPortal`). Don't create a directory until the app actually needs that
responsibility — this list is what each directory *means*, not a scaffold to pre-create.

```
src/
├── app/            Next.js routes. Routing boundary only — see architecture.md.
├── features/       UI, feature-scoped. One folder per business feature.
├── services/       API layer. One folder per BACKEND service (not per feature).
├── shared/         Cross-feature infrastructure and shared UI.
├── components/ui/  Vendored shadcn/Radix primitives (from frontend-next-shadcn or CLI).
│                   Never hand-edited. Never imported by feature code directly.
└── i18n/           Translation resources (see rules/localization.md).
```

## `app/`

Route segments only: layouts, pages, loading/error boundaries, route-level metadata. One
import + one render per page file. See architecture.md's router responsibility rule.

## `features/<name>/`

```
features/<name>/
├── components/     Presentation, feature-scoped. Nested by UI ownership (see components.md).
├── hooks/          Non-query behavior hooks not tied to one specific component.
├── api/
│   ├── <name>.service.ts   Calls into services/<backend-service>/*.
│   └── <name>.queries.ts   TanStack Query hooks. The ONLY thing components call.
├── store/          Zustand, feature-scoped state. Rare — most state is Query or local.
├── <name>.types.ts
├── <name>.schema.ts        Zod schemas for this feature's forms/validation.
└── index.ts                Public barrel. See "index.ts as scope boundary" below.
```

Data flow is one-directional: `component → *.queries.ts → *.service.ts → services/*`.
Components never call `.service.ts` or `services/*` directly.

## `services/<backend-service>/`

One folder per backend microservice (e.g. `product`, `order`, `user`, `tenant`), not per
frontend feature — a backend service commonly backs multiple features. One file per
endpoint, named after the backend's operation id. `_base.ts` holds the service's path
prefix. `types/` holds shared enums for that service. This is the only layer allowed to
know backend DTO shapes; `*.queries.ts` reshapes them into frontend view models.

## `shared/`

Cross-feature infrastructure and genuinely reusable UI. Sub-scopes:

- `shared/ui/` — thin wrappers around `frontend-next-shadcn` primitives (prefix: `App`,
  e.g. `AppButton`, `AppDialog`). Feature code imports UI only from here, never from
  `components/ui/*` or the wrapper package directly. See components.md.
- `shared/entity/` — admin-CRUD scaffolding shared across features (toolbars, status
  badges, confirm-delete dialogs). Prop-driven only, no data fetching.
- `shared/layout/` — app shell (sidebar, topbar, locale/theme switchers).
- `shared/lib/` — cross-cutting non-UI code: the shared API client instance, query client
  config, env access, generic utils. Keep files here narrow and named for what they hold
  (`api/client.ts`, not a catch-all `utils.ts`).
- `shared/stores/` — global Zustand stores only (session cache, UI/modal registry,
  locale). See state-and-data.md for what qualifies as global.
- `shared/hooks/` — generic reusable hooks with no feature ownership (e.g. cursor
  pagination, debounce).
- `shared/forms/` — the form abstraction (wraps React Hook Form + Zod). Business code
  never imports React Hook Form directly.

Domain-specific shared component layers (e.g. a future `shared/tenant/` or
`shared/scope/` for nova-consoles) may be added the same way AdminPortal added
`shared/commerce/`, `shared/inventory/`, `shared/notifications/` — see the promotion rule
below.

## `components/ui/`

Vendored output only (shadcn CLI, or re-exports from `frontend-next-shadcn`). Never
hand-edited, never imported outside `shared/ui/`.

## No top-level `hooks/`, `contexts/`, `types/`, `stores/`

Don't create app-root catch-all directories for these. They belong inside the scope that
owns them: `features/<name>/` for feature-scoped, `shared/` for genuinely global. A
top-level `hooks/` or `types/` folder is exactly the kind of dumping ground this
architecture exists to prevent.

## Orphan files

An orphan file has no clear owner: generic names (`utils.ts`, `helpers.ts`, `common.ts`,
`misc.ts`) used as a dumping ground rather than a specifically-scoped file. These names
aren't forbidden — `features/tenants/utils.ts` for tenant-specific helpers is fine.
`src/utils.ts` at the app root, holding unrelated helpers for five different features, is
not.

## Scope decision tree

```
Used by only one component?
  → Keep it inside that component's folder.

Used by multiple components within one feature?
  → Keep it inside features/<name>/.

Used by multiple unrelated features, with REAL (not hypothetical) repetition
across 3+ concrete call sites?
  → Promote to shared/<domain>/ or shared/ui/.

Application-wide (routing, theming, auth session)?
  → shared/lib/, shared/stores/, or app/ as appropriate.

Framework-specific (routing file, layout)?
  → Stays in the Next.js app/ boundary.
```

Don't promote to shared scope speculatively ("might be reused someday"). Wait for real
reuse.

## `index.ts` as a scope boundary

Every feature and every meaningfully-scoped component exposes its public API through
`index.ts`. Consumers import the barrel, not internal files:

```ts
// Good
import { TenantsPage } from "@/features/tenants";

// Bad — reaches past the scope boundary
import { TenantsPage } from "@/features/tenants/components/TenantsPage/TenantsPage";
```

`index.ts` is a boundary, not a global export dump — it exports what that scope
intentionally makes public, nothing more.

## Import boundaries

One-way dependency graph: `app → features → shared`, with `services` sitting between
`shared/lib/api` and `features`.

- `shared/*` never imports `features/*` or `app/*`.
- `features/*` never imports `app/*`.
- Cross-feature imports go through the other feature's `index.ts` barrel only, never into
  its internals.
- Business code never imports `components/ui/*` or the underlying UI library (Radix/MUI)
  directly — always through `shared/ui/`.
