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

### Shell wiring — use the config-driven path, not the manual one

There are two ways to compose the admin shell. **Use the config-driven path** for
nova-console:

```tsx
<AdminProvider theme={{ preset: "zinc-blue", mode: "system" }}>
  <AdminShellProvider
    navigation={navigationConfig}        // NavigationGroup[]
    applications={applications}           // Application[] — app switcher entries
    user={currentUser}                    // AdminUser | null
    pathname={usePathname()}
    linkComponent={Link}
    onLogout={handleLogout}
    hasPermission={checkPermission}       // PermissionChecker
  >
    <AdminLayout>{children}</AdminLayout>
  </AdminShellProvider>
</AdminProvider>
```

Leave `AdminLayout`'s `sidebar`/`header` props undefined — with a shell provider mounted,
it renders the shell's own config-driven `Sidebar`/`Topbar`/`CommandPalette`
automatically (active-state highlighting, permission filtering, breadcrumb, Cmd/Ctrl+K
palette, all included). The **other** path — passing `AdminLayout` explicit `sidebar`/
`header` JSX built from `AdminSidebar`/`AdminSidebarItem`/`AdminHeader` — is what
`apps/playground` demonstrates, but it bypasses navigation/permission filtering, i18n,
and the command palette entirely. Don't copy the playground's pattern for a real app.

Key contracts (`NavigationItem`/`NavigationGroup`/`Application`/`AdminUser`/
`PermissionChecker`) support `permission`/`requireAllPermissions` fields — the shell
filters navigation and commands by these automatically, given `hasPermission`. See
reference/authorization.md.

`PermissionGate` (`./layout` export) does **not** read shell context automatically — pass
`can` explicitly (e.g. `can={checkPermission}` from `useAdminShell()`, or
`can={hasAnyPermission}` from `useCurrentUser()`).

Use `ShellPageHeader` (from the `./shell` or root export) over the plain `PageHeader`
(from `./layout`) for any page rendered inside a mounted shell — it resolves i18n
`Label`s and can auto-derive breadcrumbs from the navigation config
(`autoBreadcrumb`).

The package implements **no authentication** — session resolution, login redirects, and
protected routes are entirely the app's responsibility; the shell only renders whatever
`AdminUser` you hand it. See reference/authentication.md.

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
