# Localization

## Rule

Hardcoded user-facing text is prohibited.

```tsx
// Bad
<Button>Save</Button>

// Good
<Button>{t("common.actions.save", "Save")}</Button>
```

All user-facing text goes through the app's translation abstraction — never a raw string
literal in JSX, never string concatenation for a sentence.

## Resolution chain

```
1. Tenant/runtime bootstrap dictionary (overrides, per-tenant)
2. Application dictionary (this app's own translation resources)
3. Fallback dictionary (baseline resources shipped by frontend-foundation)
4. Explicit default text passed at the call site, if provided
5. Never silently render a raw, unresolved technical key — unless explicitly in a
   debug/dev context
```

This is exactly the resolution order `frontend-foundation`'s `createTranslator` /
`resolveTranslation` implements (tenant → application → fallback, per locale, with a
locale-level fallback pass and a configurable `onMissingKey` strategy) — see
[reference/frontend-foundation.md](../reference/frontend-foundation.md#i18n). Don't
reimplement this resolution logic in nova-consoles; consume it.

## API shape

There is no published React hook yet in the ecosystem (`frontend-foundation` is
framework-agnostic by design — see reference/frontend-foundation.md). nova-consoles must
provide one thin app-level hook wrapping `createTranslator`/`createTranslatorFromBootstrap`,
conceptually:

```tsx
const { t } = useAppTranslation();

t("tenant.list.title", "Tenants");
```

Build this hook once, in `shared/` (e.g. `shared/i18n/useAppTranslation.ts`), backed by a
provider that supplies the resolved bootstrap dictionary — don't let individual features
each wire up their own translator instance.

## Do not use next-intl

AdminPortal (the existing reference app) uses `next-intl`'s `useTranslations()` directly,
with locale resolved from a cookie — **do not copy this pattern into nova-consoles.** It
predates the bootstrap/tenant-override resolution model `frontend-foundation` now
provides, bypasses the tenant-dictionary-override layer entirely, and duplicates
resolution logic `frontend-foundation` already owns. It's flagged here as a known,
existing implementation that conflicts with the intended rule — not something to migrate
AdminPortal off of as part of unrelated work, but not a pattern to replicate in a new app
either. See [decisions/README.md](../decisions/README.md).

## Namespacing

Keep translation keys namespaced by feature (`tenant.list.title`, not a flat global key
space), mirroring the dictionary structure `frontend-foundation`'s
`TRANSLATION_RESOURCES`/`TranslationBundle` types expect (`common`, `navigation`, `admin`,
`auth`, `validation`, `errors`, plus per-feature namespaces added by the app).
