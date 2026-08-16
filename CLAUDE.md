# OpenWolf

@.wolf/OPENWOLF.md

This project uses OpenWolf for context management. Read and follow .wolf/OPENWOLF.md every session. Check .wolf/cerebrum.md before generating code. Check .wolf/anatomy.md before reading files.


# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Status

`nova-console` is NovaCore's central admin console (tenants, tenant permission scope,
subscriptions, security, localization, settings) — a Next.js 15 App Router app built on
two shared packages, `@novacore/frontend-foundation` (framework-agnostic platform layer)
and `@novacore/frontend-next-shadcn` (admin UI: shell, tokens, DataTable, forms — see
`docs/reference/frontend-nextjs.md`), both consumed via local `file:` links from
`../common/`.

Read `docs/rules/*.md` before writing code (architecture, project-structure, components,
hooks, coding-style, state-and-data, localization) and `docs/decisions/README.md` for the
reasoning behind divergences from prior art (`AdminPortal`). The NovaCore Admin visual
identity (brand tokens, KPI/freshness pattern, list/dashboard/settings page patterns) is
documented in `docs/reference/design-system.md` — read it before styling anything or
building a new page pattern; it, not this file, is the design source of truth.

## Commands

```bash
yarn dev         # next dev
yarn build       # next build (also type-checks)
yarn lint        # eslint .
yarn typecheck   # tsc --noEmit
yarn format      # prettier --write .
```

No test runner is configured yet.

## Architecture at a glance

```
src/
├── app/        Next.js routes — routing boundary only, see docs/rules/architecture.md
├── features/   UI, one folder per business feature (tenant, subscription, settings, ...)
├── services/   API layer, one folder per backend service
├── shared/     Cross-feature infrastructure (layout, i18n, hooks, forms, stores)
└── components/ Vendored shadcn output (do not hand-edit)
```

Full detail: `docs/rules/project-structure.md`.
