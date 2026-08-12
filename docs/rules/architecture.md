# Architecture

## Core principle

> **Every file must have a clear reason to exist.**

A file has one primary responsibility, belongs to a clearly defined scope, and is not a
dumping ground. The goal is not fewer files — it's files that are easy to navigate. Many
small, well-scoped files are preferred over few large ones.

Before creating a file, answer:
1. Why does this file exist?
2. What responsibility does it own?
3. What scope owns it?
4. Who is allowed to consume it?
5. Why can't this code live in an existing file?

If you can't answer these, don't create the file. Don't avoid creating files just to keep
file count low, either.

## Navigation model

A developer (or agent) should be able to trace any UI element back to its source by
following the directory hierarchy, top to bottom:

```
UI (app/ route)
  ↓
Feature (features/<name>/)
  ↓
Component (features/<name>/components/<Component>/)
  ↓
Child component (nested inside the parent's own folder)
  ↓
Hook (paired 1:1 with the component — see hooks.md)
  ↓
Supporting files (types, schema, constants — local to that scope)
```

## Layering (ecosystem-wide)

```
Backend services
      ↓
frontend-foundation   — framework-agnostic platform layer (i18n, http, auth model,
                         errors, date/number/currency/phone/validation).
                         See reference/frontend-foundation.md.
      ↓
frontend-nextjs        — Next.js UI wrapper packages (frontend-next-shadcn for admin
                         consoles, frontend-next-mui for customer-facing storefronts).
                         See reference/frontend-nextjs.md.
      ↓
App (nova-consoles)    — composes the above. Owns feature logic and business rules only.
```

Never reimplement something `frontend-foundation` or `frontend-nextjs` already provides
(i18n resolution, HTTP client, permission checks, date/currency formatting, themed UI
primitives). Read `reference/` before writing it yourself.

## Hybrid scope model

NovaCore frontend apps use a hybrid of feature-first and centralized-infrastructure
architecture:

- **UI is feature-scoped.** Pages, page-specific components, and page-specific behavior
  hooks live under `features/<name>/`.
- **Cross-feature infrastructure is centralized.** API/service clients, global state
  stores, and truly global contexts live in their own top-level scope (`services/`,
  `shared/stores/`), not inside any one feature.
- **Exception: page-local infrastructure stays page-local.** A context, store, or service
  used by exactly one page — with no intention of reuse — stays inside that page's folder.
  Scope follows responsibility and reuse, not the technology used (see
  project-structure.md for the full decision tree).

This lets you answer two different questions by looking in two different places:
- "How is this UI rendered?" → look under `features/`.
- "How does this app talk to the backend?" → look under `services/` /
  `reference/frontend-foundation.md`.

## Router responsibility

`app/` (Next.js App Router) is a routing boundary, not an implementation location. A route
file should only:
1. Receive route/search params.
2. Handle framework-level routing concerns (metadata, loading/error boundaries).
3. Render the corresponding feature page component.

```tsx
// app/(admin)/tenants/page.tsx
import { TenantsPage } from "@/features/tenants";

export default function Page() {
  return <TenantsPage />;
}
```

Anything more than that belongs in `features/<name>/`.

## No god files

Explicitly prohibited: god components, god hooks, god services, god utilities, giant page
files, giant `index.ts`, giant API files, giant context files.

A component must never contain, in the same file: API calls, non-trivial business logic,
validation schemas, large constants, unrelated state management, and unrelated child
components, all at once. A component's primary responsibility is rendering — see
components.md.

## Code organization principle

> **Scope first. Responsibility second. Reuse third.**

1. Determine where the code belongs (see the decision tree in project-structure.md).
2. Give it one responsibility.
3. Only move it to a shared scope once reuse is real, not hypothetical.

Don't start with "what folder can I put this in?" Start with "what owns this
responsibility?" then create the smallest scope around it.
