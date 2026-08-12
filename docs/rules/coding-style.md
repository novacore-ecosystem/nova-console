# Coding Style

Formalized from AdminPortal's conventions. Don't invent rules that conflict with the
formatter/linter config once nova-consoles is scaffolded — those are authoritative for
mechanical formatting; this file covers what a linter can't enforce.

## Naming

| What | Convention | Example |
|---|---|---|
| Folders | `kebab-case` | `features/tenant-management/` |
| Component files | `PascalCase.tsx`, matches the export | `TenantsPage.tsx` |
| Hook files | `useXxx.ts`, camelCase, always `use`-prefixed | `useTenantsPage.ts` |
| Other TS files | `kebab-case.ts` | `tenant.service.ts` |
| Service files | `<feature>.service.ts` | `tenant.service.ts` |
| Query hook files | `<feature>.queries.ts` | `tenant.queries.ts` |
| Type files | `<feature>.types.ts` | `tenant.types.ts` |
| Schema files | `<feature>.schema.ts`, variables `xxxSchema` | `tenantSchema` |
| Zustand stores | `<name>.store.ts` → `use<Name>Store` | `session.store.ts` → `useSessionStore` |
| Constants | `UPPER_SNAKE_CASE` | `DEFAULT_PAGE_SIZE` |
| Enums | `as const` object + derived union type — never TS `enum` | see below |
| Shared UI wrappers | `App`-prefixed | `AppButton`, `AppDialog` |
| `services/<service>` endpoint files/DTOs | mirror backend operation id / schema name verbatim | the one place backend vocabulary, not frontend vocabulary, is used |

```ts
// Enum convention
export const TenantStatus = {
  Active: "active",
  Suspended: "suspended",
} as const;
export type TenantStatus = (typeof TenantStatus)[keyof typeof TenantStatus];
```

## Exports and imports

- Public API of any feature/component scope goes through `index.ts` (see
  project-structure.md).
- Respect the one-way import graph (`app → features → shared`) — see project-structure.md.
- No default exports for components except where the framework requires them (`app/**/page.tsx`, `layout.tsx`).

## TypeScript

- Strict mode on. No `any` without a comment explaining why it's unavoidable.
- Backend-shaped data (DTOs) suffixed `Dto` once real API contracts exist; frontend view
  models are unsuffixed.
- Prefer types derived from `frontend-foundation`'s contracts (`ApiResponse<T>`,
  `PaginatedResult<T>`, `MessageCode`, etc.) over redefining shapes locally — see
  reference/frontend-foundation.md.

## Function/component size

- A component's job is composing hooks and rendering JSX — see components.md.
- If a function or component is hard to describe in one sentence, it's doing too much;
  split it along responsibility lines, not arbitrary line counts.

## Error handling

- Don't add try/catch or fallback branches for states that can't occur. HTTP failures
  normalize to a single typed error shape from `frontend-foundation` — handle that shape,
  don't invent parallel error handling per call site.
- Validate only at real boundaries: form input (via the shared form abstraction / Zod
  schema) and API responses (already normalized by `frontend-foundation`'s http client).

## Comments

- Default to no comments. Only write one when the *why* is non-obvious — a workaround, a
  hidden constraint, something that would surprise a reader. Never restate what
  well-named code already says.

## Dead code

- Delete code you're certain is unused. Don't leave commented-out blocks or
  `// removed` markers.

## Package manager / tooling

Match the ecosystem's existing choices unless there's a specific reason to diverge (record
it in decisions/ if so):

- **Package manager:** yarn (matches AdminPortal — pin the version once nova-consoles is
  scaffolded).
- **Linting:** ESLint flat config, `eslint-config-next` (core-web-vitals + typescript) +
  `eslint-config-prettier`.
- **Formatting:** Prettier + `prettier-plugin-tailwindcss` for class sorting.
- **Pre-commit:** `lint-staged` + `husky` running `eslint --fix` / `prettier --write` on
  staged files.
- Vendored UI primitives (`components/ui/**`) and CLI-generated hooks are excluded from
  linting — they're not hand-edited.
