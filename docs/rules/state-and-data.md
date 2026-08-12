# State and Data

## Three owners, strict split

| State | Owner | Rule of thumb |
|---|---|---|
| Server data (anything fetched from or persisted to an API) | TanStack Query | If it's fetched or persisted, Query owns it — full stop. Never mirror server data into Zustand. |
| Cross-route / cross-component client-only state | Zustand, `shared/stores/` | Global stores only: session cache, UI/modal registry, locale, realtime connection state. |
| Single-component or single-form state | Local (`useState`, React Hook Form) | Default choice — most state is this. |

Feature-scoped Zustand stores (`features/<name>/store/`) are allowed but rare — reach for
them only when state genuinely needs to cross components within one feature and doesn't
fit local state.

## API / service layering

Rendering must never be mixed with API implementation.

```
Component
   ↓ calls
useXxxQuery / useXxxMutation   (features/<name>/api/<name>.queries.ts)
   ↓ calls
<name>Service                  (features/<name>/api/<name>.service.ts)
   ↓ calls
services/<backend-service>/*   (one file per endpoint, named after the backend operation id)
   ↓ uses
frontend-foundation http client (see reference/frontend-foundation.md)
```

Components call query hooks only — never `.service.ts`, never `services/*`, never the raw
HTTP client. This keeps UI independent of transport: backend contract changes are
absorbed in `services/` and `.service.ts`, not scattered across components.

`.service.ts` reshapes backend-DTO-shaped responses into frontend view models before
handing them to query hooks (e.g. backend pagination envelope → the app's
`PaginatedResult<T>` shape used by shared table components).

## Query key convention

Centralize query keys per feature as a factory object, not ad-hoc arrays scattered across
call sites:

```ts
export const tenantKeys = {
  all: ["tenants"] as const,
  lists: () => [...tenantKeys.all, "list"] as const,
  list: (filters: TenantFilters) => [...tenantKeys.lists(), filters] as const,
  detail: (id: string) => [...tenantKeys.all, "detail", id] as const,
};
```

Mutations invalidate the narrowest key that covers what changed — not `tenantKeys.all`
unless the whole list genuinely needs refetching.

## Contexts and stores follow the same scope rule as components

- Global context/store → `shared/`.
- Feature-wide context/store → `features/<name>/`.
- Used by exactly one page, no reuse intent → stays inside that page's own folder, even
  though it's technically promotable. Don't create a global context merely because React
  Context is convenient — see project-structure.md's scope decision tree.

## Pagination

Two supported patterns (both provided by `frontend-foundation`'s `PaginatedResult<T>` /
`CursorPaginatedResult<T>` contracts — see reference/frontend-foundation.md):

- **Page-based** — bounded admin tables. Manual pagination + `keepPreviousData`.
- **Cursor-based** — feeds/logs (e.g. audit trail). `useInfiniteQuery`, via a shared
  `useCursorList`-style hook in `shared/hooks/`.

Don't invent a third pagination shape — reuse one of these two.
