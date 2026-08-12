# NovaCore Frontend Documentation — Entry Point

This is the source of truth for frontend engineering rules across the NovaCore ecosystem
(`nova-consoles` and any future console/app built the same way). It is written for AI
agents and humans to navigate without loading everything into context at once.

`nova-consoles` itself is currently unscaffolded. This documentation defines the rules it
must be built under, derived from the working reference app (`AdminPortal`) and the two
shared packages (`frontend-foundation`, `frontend-nextjs`). See
[decisions/README.md](decisions/README.md) for where nova-consoles is intentionally
expected to diverge from AdminPortal.

## How this documentation is organized

- **`rules/`** — normative. What you MUST do when writing code. One authoritative rule per
  topic, no duplication across files.
- **`reference/`** — descriptive. What the shared packages and existing apps actually
  provide/do. Not instructions — read to know what's available before you build something
  that already exists.
- **`roadmap/`** — a task → docs lookup table. Read this to decide what else to read.
- **`decisions/`** — a log of ecosystem-level architectural decisions and why they were
  made. Not a duplicate of `rules/`; only the reasoning lives here.

## Always read (every session, before writing code)

1. [rules/architecture.md](rules/architecture.md) — the core philosophy and layering model
2. [rules/project-structure.md](rules/project-structure.md) — what each directory means
3. [rules/coding-style.md](rules/coding-style.md) — naming, tooling, TS/lint/format rules

## Conditional — read only when the task touches that area

| Working on... | Read |
|---|---|
| Any page/screen/component | [rules/components.md](rules/components.md), [rules/hooks.md](rules/hooks.md) |
| Any hook | [rules/hooks.md](rules/hooks.md) |
| User-facing text | [rules/localization.md](rules/localization.md) |
| API calls, server data, caching | [rules/state-and-data.md](rules/state-and-data.md), [reference/frontend-foundation.md](reference/frontend-foundation.md) |
| Auth / login / session | [reference/authentication.md](reference/authentication.md) |
| Permissions / role gating | [reference/authorization.md](reference/authorization.md) |
| UI components (buttons, tables, layout, theme) | [reference/frontend-nextjs.md](reference/frontend-nextjs.md) |
| "What should I read for X?" in general | [roadmap/README.md](roadmap/README.md) |

Do not blindly load every file in `docs/`. Use the roadmap.

## Non-negotiables (see rules/ for full detail)

- Every file must have one clear reason to exist. No god components/hooks/services/utils.
- Scope first, responsibility second, reuse third — don't promote code to shared scope
  speculatively.
- `app/` (Next.js routes) is a routing boundary only. It renders a feature page; it does
  not implement one.
- No hardcoded user-facing text.
- Server state lives in TanStack Query. Client-only cross-component state lives in
  Zustand. Everything else is local state.
