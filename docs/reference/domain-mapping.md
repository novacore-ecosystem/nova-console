# Domain Mapping — Auth Service (Tenant, Scope, Permissions, Translation)

Factual mapping from the actual backend (`BackEnd/src/Services/Auth`), used as the
contract basis for nova-console. Don't invent fields, endpoints, or permissions beyond
what's listed here — extend this file (and the backend) if new ones are needed.

## Tenant (`Auth.Domain/Entities/Tenants/Tenant.cs`)

| Field | Type | Notes |
|---|---|---|
| `Code` | `TenantCode` (string VO) | immutable after create |
| `Name` | `string` | |
| `LogoUrl` / `FaviconUrl` | `string?` | |
| `Version` | `int` | bootstrap version, bumped on change |
| `Metadata` | `TenantMetadata` | typed metadata bag |
| `IsActive` | `bool` | **no status enum** — just a boolean |
| `Locales` | `TenantLocale[]` | owned, see below |

`TenantLocale`: `LanguageCode?` (null = fallback), `ConfigurationJson`, `DictionaryJson` —
both **opaque JSON blobs**, not a structured key/value table.

## Scope (`Auth.Domain/Entities/Scopes/Scope.cs`)

Hierarchical org unit (branch/agency/dealer/region), tenant-owned:

| Field | Type | Notes |
|---|---|---|
| `TenantId` | `Guid` | |
| `ParentScopeId` | `Guid?` | |
| `Code` | `ScopeCode` (string VO) | unique per `(TenantId, Code)` |
| `Name` / `Description` | `string` / `string?` | |
| `Metadata` | `ScopeMetadata` | |
| `Path` / `Level` | `string` / `int` | hierarchy bookkeeping, recomputed by caller |
| `SortOrder` | `int` | |
| `IsActive` | `bool` | |
| `Translations` | `ScopeTranslation[]` | `(Name, Description)` per `LanguageCode` |

## Permissions (`BuildingBlock.SharedKernel/Constants/Permissions.cs`)

Only what's relevant to this console — the full catalog has more modules (Product,
Order, etc.), not reproduced here:

```
Permissions.Root = "system:root"
Permissions.User = "system:user"
Permissions.Role.View = "role:view"
Permissions.Role.Manage = "role:manage"
Permissions.Role.Full = "role:full"
Permissions.Permission.View = "permission:view"
Permissions.Permission.Manage = "permission:manage"
Permissions.Permission.Full = "permission:full"
```

`Root` bypasses all checks. `{module}:full` satisfies any leaf permission in that module.
**No `Tenant.*` or `Scope.*` permission keys exist in the catalog.** `GET /tenants` is
gated by `Permissions.Root` alone — see "Permission gating decision" below.

## Authentication

Cookie-based JWT, not bearer tokens in the response body:

- `POST /login` — body `{ email, password }`, header `X-Tenant-Client-Key` (pre-login
  tenant resolution, a 64-char hex value — see `TenantClient` below). Sets HTTP-only
  `AccessToken` (15 min) + `RefreshToken` (7 days) cookies. Response body carries no
  token.
- `POST /refresh-token` — reads the `RefreshToken` cookie, reissues both cookies.
- `POST /logout` — revokes refresh token, clears cookies.
- No `Authorization` header is used anywhere; the http client must send credentials via
  cookies (`withCredentials`), matching `frontend-foundation`'s `TokenProvider` contract
  but with no token value to store client-side — see reference/authentication.md.

## Existing endpoints (real, callable today)

| Method | Route | Notes |
|---|---|---|
| POST | `/login`, `/logout`, `/refresh-token`, `/register` | auth flow |
| GET | `/tenants` | **Root only.** Returns `{ id, code, name, logoUrl, isActive }[]` — no `metadata`/`version`/public-key fields |
| GET/POST/PUT/DELETE | `/roles`, `/roles/{id}` | full CRUD, `PUT /roles/{id}/permissions` wholesale-replaces permission keys |
| GET/PUT/DELETE | `/permissions`, `/permissions/{id}` | regroup/delete only, no create (permissions are seeded) |

## Backend gap — no current-user/session endpoint

There is no `GET /me`, `GET /session`, or equivalent. `BuildingBlock.Web/CurrentUser/
CurrentUserService.cs` reads JWT claims **server-side, inside each backend service** —
it is not an HTTP endpoint exposed to the frontend. `POST /login` sets HTTP-only cookies
and returns an empty body; `POST /refresh-token` reissues cookies but also returns no
user data. Since the access token cookie is HTTP-only, client-side JS cannot read or
decode it either.

**Practical effect:** nova-console has no way to learn who is logged in or what
permissions they hold, beyond knowing a session cookie exists and is valid (confirmed by
probing `POST /refresh-token`). See decisions/README.md for how the frontend handles
this without inventing fake identity/permission data.

## Backend gaps (build against these, don't invent replacements)

| Gap | Domain model exists? | API exists? |
|---|---|---|
| Tenant create/update/deactivate/get-by-id | Yes (`Rename`, `UpdateBranding`, `Activate`, `Deactivate`, `SetLocale`) | **No** — only the Root-only list |
| Scope CRUD (any) | Yes, full hierarchy + translations | **No** — zero endpoints |
| Tenant public key / client management | Yes — see `TenantClient` below | **No** — zero endpoints |
| `Tenant.*` / `Scope.*` permission keys | — | **No** — not in the catalog |
| Translation-key management (structured dictionary CRUD) | **No** — only opaque per-tenant JSON blobs (`TenantLocale`) and scattered per-aggregate translation tables (`ScopeTranslation`, `RoleTranslation`, etc.) | **No** |

### `TenantClient` ("public key") — narrower than a signing key

`TenantClient` is a client-identification credential, not a crypto signing/certificate
key: `PublicKey` (64-char hex, CSPRNG-generated, never user-supplied) sent as
`X-Tenant-Client-Key` before login, to resolve which tenant is being logged into. It has
`Status` (`Active | Revoked | Expired`), `ExpiresAt`, `RevokedAt`/`RevokedReason`, but
**no rotation flow exists on the backend** (`IsUsable()` is a computed invariant, not
enforced anywhere yet). Model the frontend around this shape, not a JWT-signing-key
concept — nova-console's "Tenant Public Key" screens manage `TenantClient` records.

## Permission gating decision

Every Tenant/Scope/Public-Key/Translation screen in nova-console is gated by
`Permissions.Root` — the single permission that already, factually, protects the one real
endpoint in this domain (`GET /tenants`). This is not an invented permission; it's the
existing one, applied consistently since none of the finer-grained actions have their own
permission keys yet. When `Tenant.*`/`Scope.*` permissions are added to the backend
catalog, narrow the `PermissionGate`/navigation `permission` fields accordingly — see
decisions/README.md.

## Mock/development adapter decision

Because most of this domain has no real API yet, nova-console's `services/tenant/` and
`services/scope/` layers are backed by an isolated development adapter (in-memory, typed
against the DTOs above) rather than blocking implementation. See decisions/README.md for
the isolation boundary and the plan for swapping to real endpoints.
