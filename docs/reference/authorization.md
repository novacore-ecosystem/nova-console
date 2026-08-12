# Authorization

## Model

Provided by `frontend-foundation`'s `src/authorization/` (see
reference/frontend-foundation.md) — don't reimplement permission logic locally.

- `Permissions` mirrors the backend's `Permissions.cs` verbatim
  (`Permissions.Order.View = "order:view"`, `Permissions.Root = "system:root"`).
- `hasPermission(owned, required)`, `hasAnyPermission`, `hasAllPermissions` — plain array
  functions. `Root` bypasses all checks. `"{module}:full"` satisfies any leaf permission
  within that module.
- `CurrentUserAuthorization` = `{ roles, permissions }`, sourced from the backend's user
  detail response.

## This is a UI-only signal

Client-side permission checks control what's *shown* — hiding a button, disabling a nav
item, gating a route at the UI layer. They are **not** real security enforcement. The
backend enforces via JWT/claims on every request regardless of what the client believes
the user can do. Never treat a passed client-side check as proof an action is authorized;
the API call can and will still be rejected server-side if it isn't.

## UI gating

Use `PermissionGate` from `frontend-next-shadcn`'s `./layout` export (see
reference/frontend-nextjs.md) to conditionally render UI based on
`hasPermission`/`hasAnyPermission`. Don't hand-roll permission checks scattered across
components — route them through this one gating mechanism so permission logic stays
auditable in one place.

## Naming gotcha

`Permissions.User` (singular — a baseline capability every authenticated user has) is
distinct from `Permissions.Users` (plural — the admin user-management module). Easy to
reach for the wrong one; double-check which is intended.
