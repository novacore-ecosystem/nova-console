# frontend-nextjs

pnpm workspace (`FrontEnd/Common/frontend-nextjs`) providing two independent, framework-
specific UI wrapper packages plus a demo app (`apps/playground`), both depending on
`frontend-foundation` via relative `file:` path (not a real registry dependency yet).

## `packages/shadcn` → `@novacore/frontend-next-shadcn`

**Use this for nova-consoles** — it's the admin-facing package (shadcn/Radix/Tailwind
fully hidden behind it; consumers never configure Tailwind themselves).

Subpath exports: `.` (everything), `./theme` (`AdminProvider`, `useAdminTheme`,
`ThemeCustomizer`, presets/tokens), `./forms`, `./data` (`DataTable`,
`fromPaginatedResult`, `EmptyState`/`LoadingState`/`ErrorState`, `StatusBadge`), `./shell`,
`./realtime`, `./layout` (`AdminLayout`, `AdminSidebar`, `AdminHeader`, `AdminPage`,
`PageHeader`, `PermissionGate`), and `./styles.css` (precompiled — import once, don't
reconfigure Tailwind).

```tsx
// app/providers.tsx
"use client";
import { AdminProvider } from "@novacore/frontend-next-shadcn";

export function Providers({ children }) {
  return <AdminProvider theme={{ preset: "zinc-blue", mode: "system" }}>{children}</AdminProvider>;
}
```

```tsx
// app/layout.tsx
import "@novacore/frontend-next-shadcn/styles.css";
```

`DataTablePaginationState` is one-based, matching `frontend-foundation`'s
`PaginatedResult`. `shell/i18n.ts`'s `SHELL_TRANSLATIONS` covers only the shell's own
chrome strings (en/vi/zh-CN); business labels come from the app's own dictionaries via
`AdminShellConfig.translations`, which take priority over the shell defaults.

**Known limitations** (per the package's own README, as of this writing): no automated
tests/Storybook/CI yet; no no-flash SSR theme script (brief flash of default theme before
`AdminProvider` hydrates); several components not yet implemented — Calendar, Accordion,
DatePicker/DateRangePicker/NumberInput/CurrencyInput/FileUpload/ImageUpload,
EntitySelect/EntityCombobox, ActivityTimeline/MetadataPanel, schema-driven `AdminForm`.
Check before assuming a component exists.

## `packages/mui` → `@novacore/frontend-next-mui`

Customer/storefront-facing (MUI + Emotion, fully hidden). Not used by nova-consoles (an
admin console) unless it grows a customer-facing surface. `ClientProvider` wraps
`@mui/material-nextjs`'s `AppRouterCacheProvider` + `ThemeProvider` + `CssBaseline` — no
separate stylesheet import needed. Subpath exports: `.`, `./theme`, `./layout`, `./forms`,
`./product`, `./navigation`.

```tsx
import { formatCurrency } from "@novacore/frontend-foundation";
// used directly inside packages/mui/src/components/product/price.tsx
{formatCurrency(amount, currency, { locale })}
```

No admin-style `DataTable` in this package by design — that's the shadcn package's job.

## `apps/playground`

Dev/demo consumer app, not a test suite — exercises both packages' real usage patterns
(`src/app/admin/*` for shadcn, `src/app/mui/*` for MUI). Useful as a live reference for
exact import/consumption shape when the README examples are ambiguous.
