# Components

## Responsibility

> A component composes hooks and renders JSX. That's it.

```tsx
function TenantsPage() {
  const state = useTenantsPage();

  return (
    <AppPageLayout title={state.title}>
      <TenantTable tenants={state.tenants} onSelect={state.selectTenant} />
    </AppPageLayout>
  );
}
```

A component must not contain, inline: API calls, non-trivial business logic, validation
schemas, large constants, unrelated state management. Those live in the paired hook (see
hooks.md) or the appropriate scope (services/, shared/, etc — see project-structure.md).

Trivial UI-only behavior (a `useState` for a dropdown's open/closed state, say) can stay
inline if extracting it would make the code harder to follow. This is a responsibility
rule, not a file-count-maximization rule — don't extract every line just to satisfy it.

## Nesting by UI scope

Don't flatten all components for a feature into one directory. Nest by ownership so a
reader can trace UI hierarchy through the filesystem:

```
features/tenants/components/TenantsPage/
├── TenantsPage.tsx
├── useTenantsPage.ts
├── index.ts
│
├── TenantTable/
│   ├── TenantTable.tsx
│   ├── useTenantTable.ts
│   └── index.ts
│
└── TenantFilters/
    ├── TenantFilters.tsx
    ├── useTenantFilters.ts
    └── index.ts
```

A component that exists only because it belongs to `TenantTable` stays nested inside
`TenantTable/`, not hoisted to a flat `components/` directory.

## Local support files

A component folder may include supporting files, created only when they have a real
responsibility — don't create empty ones:

| File | Responsibility |
|---|---|
| `Component.tsx` | render |
| `useComponent.ts` | component behavior (see hooks.md) |
| `const.ts` | constants local to this component |
| `type.ts` | types local to this component |
| `schema.ts` | Zod validation local to this component |
| `index.ts` | public export — see project-structure.md's "index.ts as scope boundary" |

## Shared UI wrappers

Never import `components/ui/*` (vendored primitives) or the underlying UI library
(Radix/shadcn internals, MUI) directly from feature code. Always go through `shared/ui/`
(`App`-prefixed wrappers) or the public exports of `frontend-next-shadcn` /
`frontend-next-mui` — see reference/frontend-nextjs.md.

```tsx
// Good
import { AppButton } from "@/shared/ui";

// Bad
import { Button } from "@/components/ui/button";
```

## Promoting a component to shared scope

Feature-specific code stays in the feature. Promote to `shared/<domain>/` only when:

1. The same pattern already appears at **3+ concrete call sites** across **unrelated**
   features (not hypothetical future reuse).
2. It doesn't already fit an existing shared category's stated scope (`shared/ui` =
   third-party UI wrapper only; a domain layer like `shared/entity/` = a specific bounded
   concern — don't blur domains together).
3. The promoted component stays prop-driven / presentational — it must not fetch its own
   data. Data fetching stays owned by the feature that renders it.

If a component is used by only one page and has no intention of being reused (including a
context or store implemented as a component), it stays inside that page's own folder —
don't move it to global scope just because it's technically reusable.
