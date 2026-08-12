# Reading Roadmap

Not a feature roadmap. This tells an AI agent what to read for a given task, and what to
skip. Full rule text lives in `rules/`; this file only maps task → docs.

Always read `rules/architecture.md`, `rules/project-structure.md`, `rules/coding-style.md`
first, regardless of task (see [docs/README.md](../README.md)).

| Task | Read | Skip |
|---|---|---|
| Create a new page/route | `rules/components.md`, `rules/hooks.md` | `reference/authorization.md` unless the page is permission-gated |
| Create a feature-scoped component | `rules/components.md`, `rules/project-structure.md` | `decisions/README.md` |
| Create a global/shared component | `rules/components.md` (promotion rule), `reference/frontend-nextjs.md` | `rules/state-and-data.md` |
| Create or modify a hook | `rules/hooks.md` | `reference/*` unless the hook wraps API/auth/i18n |
| Wire up an API call / server data | `rules/state-and-data.md`, `reference/frontend-foundation.md` (http section) | `reference/frontend-nextjs.md` |
| Add or change user-facing text | `rules/localization.md`, `reference/frontend-foundation.md` (i18n section) | everything else |
| Auth / login / session handling | `reference/authentication.md`, `reference/frontend-foundation.md` (http section) | `rules/components.md` |
| Permission gating / role-based UI | `reference/authorization.md` | `rules/state-and-data.md` |
| Add a themed UI element (button, table, layout, dialog) | `reference/frontend-nextjs.md` | `reference/frontend-foundation.md` |
| Understand why a decision was made / propose changing one | `decisions/README.md` | — |
| Anything touching `frontend-foundation` or `frontend-nextjs` source directly | Read both `reference/frontend-foundation.md` and `reference/frontend-nextjs.md` in full | — |

If a task doesn't map cleanly to a row above, read `rules/architecture.md` and
`rules/project-structure.md` and use the scope decision tree there.
