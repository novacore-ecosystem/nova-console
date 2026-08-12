# Hooks

## Component/hook pairing

Every meaningful feature or page-level component gets a paired behavior hook, same name
prefixed with `use`, living in the same folder:

```
TenantsPage        → useTenantsPage
TenantTable         → useTenantTable
TenantFilters        → useTenantFilters
```

The hook owns the component's non-trivial behavior (local state, derived values, event
handlers, orchestrating query hooks). The component owns rendering and composition only —
see components.md.

Don't create an empty hook to satisfy this rule. If a component genuinely has no
meaningful behavior (pure props → JSX, e.g. a presentational leaf like a badge or a
dialog with no local state), it doesn't need one.

**This is a hard rule for nova-consoles**, formalized precisely because it was *not*
consistently applied in AdminPortal — it only shows up reliably in AdminPortal's
`features/users/components/UserPage/**`; other AdminPortal features mix hooks inline or
into a shared per-feature `hooks/` folder instead. Don't replicate that inconsistency here.
Use the paired-hook shape for every non-trivial component from the start.

## Two kinds of hooks — don't mix them

1. **Query hooks** (`features/<name>/api/<name>.queries.ts`) — TanStack Query wrappers
   around server data. This is the *only* place components are allowed to reach for server
   data. See state-and-data.md.
2. **Behavior hooks** (`useComponentName.ts`, or `features/<name>/hooks/` for behavior not
   tied to one specific component) — local UI state, derived values, event handlers. May
   *call* query hooks, but doesn't reimplement caching/fetching itself.

A behavior hook that fetches data manually (raw `fetch`/axios calls, manual `useEffect`
data loading) is a bug — that's what query hooks and `services/` are for.

## Generic reusable hooks

A hook with no feature ownership (debounce, cursor pagination, mobile breakpoint
detection) belongs in `shared/hooks/`, not duplicated per feature. Promote it there under
the same reuse rule as components — see components.md's promotion rule.

## Hook size

If a hook's return object needs a comment explaining what each field is for, it's doing
too much — split by responsibility (e.g. separate the query-orchestration concern from
the local-UI-state concern) rather than growing one hook indefinitely.
