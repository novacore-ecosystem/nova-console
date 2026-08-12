# Reference

Descriptive, not normative — what the shared packages and ecosystem infrastructure
actually provide. Read these to find out what already exists before building it yourself.
For rules on *how* to use these, see `../rules/`.

- [frontend-foundation.md](frontend-foundation.md) — framework-agnostic platform package:
  i18n, http client, realtime, authorization model, errors, bootstrap, date/number/
  currency/phone/string/validation.
- [frontend-nextjs.md](frontend-nextjs.md) — Next.js UI wrapper packages:
  `frontend-next-shadcn` (admin, use this for nova-consoles) and `frontend-next-mui`
  (customer-facing storefronts).
- [authentication.md](authentication.md) — session/token handling, refresh flow.
- [authorization.md](authorization.md) — permission model and UI gating.

Source locations:
- `FrontEnd/Common/frontend-foundation`
- `FrontEnd/Common/frontend-nextjs` (`packages/shadcn`, `packages/mui`, `apps/playground`)
- `FrontEnd/AdminPortal` — the existing reference app these docs were derived from
