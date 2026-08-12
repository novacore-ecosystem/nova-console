# frontend-foundation

Framework-agnostic TypeScript package (`FrontEnd/Common/frontend-foundation`), private,
consumed via a relative `file:` dependency (not published to a registry). ESM-only. Not a
UI library, not an API SDK — no React hooks/context. Sits below the Next.js UI wrapper
packages in the layering (see rules/architecture.md).

## i18n

`src/i18n/` — locale handling (`Locale = "en" | "vi" | "zh-CN"`, `DEFAULT_LOCALE = "en"`)
and translation resolution.

`createTranslator(sources, options)` returns a `translate(key, values?, callOptions?)`
closure. Resolution order (`resolveTranslation` in `src/i18n/resolve.ts`):

```
tenant(locale) → application(locale) → fallback(locale)
  → [only if fallbackLocale is set] tenant(fallbackLocale) → application(fallbackLocale) → fallback(fallbackLocale)
  → missing-key strategy (onMissingKey: "key" | "empty" | custom fn, or strict: true → throws)
```

Interpolation is `{{name}}`-style (`interpolate()`, delimiters configurable). Ships
`TRANSLATION_RESOURCES` (en/vi/zh-CN) for `common`/`navigation`/`admin`/`auth`/
`validation`/`errors`/`permissions` namespaces, each locale type-checked via
`satisfies typeof en`.

```ts
const translate = createTranslator(
  { application: { en: { "welcome.message": "Hello, {{name}}" } }, fallback: TRANSLATION_RESOURCES },
  { locale: "en" }
);
translate("welcome.message", { name: "Tan" }); // "Hello, Tan"
```

**No React hook exists yet** — `useTranslation()` is not published anywhere in the
ecosystem. nova-consoles must build a thin app-level hook around
`createTranslatorFromBootstrap`. See rules/localization.md.

## Bootstrap

`src/bootstrap/` — `TenantBootstrap`: `{ tenant, locale, timezone?, translations?:
{tenant?, application?, fallback?}, theme?, settings?, features?, metadata? }`. No single
canonical backend endpoint confirmed yet for this shape (documented gap).

Key helpers: `isFeatureEnabled(features, key, defaultValue?)`,
`resolveTenantLocale(bootstrap)`, `createTranslatorFromBootstrap(bootstrap, options?)` —
builds a translator from `bootstrap.translations` directly (defaults `fallbackLocale` to
`DEFAULT_LOCALE`). It does **not** auto-merge in `TRANSLATION_RESOURCES` — the app must
pass that in as `fallback` explicitly.

## HTTP

`src/http/` — `HttpClient` wraps one Axios instance per client (never one per request).

```ts
import { createHttpClient, endpoint } from "@novacore/frontend-foundation/http";

const httpClient = createHttpClient({ baseUrl, tokenProvider, retry: { enabled: true } });
const product = await httpClient.get<Product>("/products/123");
```

Or, for typed reusable endpoints: `endpoint<Req, Res>({ method, path })` +
`httpClient.execute(endpointDef, req)`.

All failures normalize to one `HttpError` shape (`kind: "network" | "timeout" |
"cancelled" | "api" | "unknown"`, `status`, `code` = backend `MessageCode`,
`validationErrors`, `requestId`) — no raw Axios error ever leaks out. Handle this shape;
don't build per-call-site error handling.

`TokenProvider` (`getAccessToken()`, optional `refreshAccessToken()`) is shared between
the http and realtime clients. `refreshAccessToken` fires once on a 401, then retries
once. Retry is off by default, and only applies to idempotent methods (GET/HEAD/OPTIONS)
unless explicitly overridden. Cancellation via standard `AbortSignal`.

## Realtime

`src/realtime/` — wraps `@microsoft/signalr` the same way: `createRealtimeClient`,
`hub<Events, Methods>()`, reuses the same `TokenProvider` contract as http.

## Authorization

`src/authorization/` — `Permissions` mirrors the backend's `Permissions.cs` verbatim
(e.g. `Permissions.Order.View = "order:view"`, `Permissions.Root = "system:root"`).
`hasPermission` / `hasAnyPermission` / `hasAllPermissions(owned, required)` are plain
array functions; `Root` bypasses all checks; `"{module}:full"` satisfies any leaf
permission in that module.

`CurrentUserAuthorization` (`{ roles, permissions }`) is a **UI-only signal** — it drives
what's shown, not real enforcement. The server enforces via JWT regardless of what the
client believes. See reference/authorization.md.

Naming gotcha carried over from the backend: `Permissions.User` (singular, baseline
capability) vs `Permissions.Users` (plural, admin module) — easy to confuse, check which
one you mean.

## Errors

`src/errors/` — built on `MessageCode` (from `src/api/error`). `ERROR_DEFINITIONS` maps a
subset of backend `MessageCode`s to `{ messageKey, defaultMessage }`. `translateError`
fallback chain: known error definition → translated message key (or its default message)
→ backend-provided raw `message` → generic localized fallback → (only with
`{ debug: true }`) raw code. Never surfaces a raw key/code in production.

## Other utilities

- `src/currency` — `formatCurrency(value, code, options)`, CLDR-driven fraction digits
  (VND=0, USD/EUR=2), no hardcoding.
- `src/number` — `formatNumber`, `formatDecimal`, `formatPercent`.
- `src/date` — manipulation, comparison, formatting, `relativeTime`. Bare `"YYYY-MM-DD"`
  strings parse as **local midnight**, deliberately, not UTC.
- `src/phone` — wraps `libphonenumber-js` (the package's only hard runtime dependency).
- `src/string` — `capitalize`, `camelCase`, `kebabCase`, `slugify`, etc. Unicode-aware.
- `src/validation` — regex patterns mirrored verbatim from the backend (`EMAIL_REGEX`,
  `SLUG_REGEX`, `SKU_REGEX`, `BARCODE_REGEX`). Phone validation is deliberately **not**
  mirrored here — the backend's phone regex pattern is broken (embeds JS-style regex
  delimiters inside a .NET pattern); use `src/phone` instead.
- `src/api` — `ApiResponse<T>`, `PaginatedResult<T>` / `CursorPaginatedResult<T>`,
  `CriteriaRequest` + builders, `MessageCode`. `ValidationFieldError` exists for forward
  compatibility only — the backend never actually sends it today.

## Known gaps (don't build against these as if they're solid)

- No `frontend-react` adapter package exists yet — no `useTranslation`, `usePermission`,
  or provider components ship from the ecosystem itself. nova-consoles needs its own thin
  wrapper (see rules/localization.md).
- `TenantBootstrap` has no confirmed single backend source endpoint yet.
- Backend supports only `en`/`vi` for dynamic content (e.g. permission display names);
  this package's static resources support `en`/`vi`/`zh-CN` — a known, harmless
  divergence limited to backend-owned dynamic content.
