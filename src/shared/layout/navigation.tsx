import { Building2, LayoutDashboard, Package, Plus, Settings, Languages } from "lucide-react";
import { Permissions } from "@novacore/frontend-foundation";
import type { NavigationGroup } from "@novacore/frontend-next-shadcn";

export type NavigationConfig = NavigationGroup[];

/**
 * Only routes that actually exist. Add a group's entries in the same commit that adds
 * the route itself — see docs/rules/architecture.md's router-as-boundary rule. `Tenants`
 * gates on the real `tenant:view` permission (see docs/reference/domain-mapping.md — the
 * backend now has granular Tenant permission keys). The Dashboard page itself needs no
 * permission. There is no Security nav entry: TenantClient has no standalone management
 * surface — its one real capability (rotate) lives on the Tenant detail page's Security tab.
 * There is no Permission Management entry either — it's only reachable from Tenant Detail
 * (contextual to one tenant, not a global list). `system` now holds Settings — the one
 * real system-settings capability (Appearance, wired to `AdminProvider`'s theme mode; see
 * docs/reference/design-system.md) — don't add Bootstrap/internal-API entries here just
 * because the group exists.
 *
 * Every titled group is `collapsible` — open/closed state is persisted per group id via
 * `useSidebarPreferences` (`AdminShell.tsx`), so `id` here is a storage key: never rename
 * one without expecting existing users' persisted state for it to silently reset.
 */
export const navigationConfig: NavigationConfig = [
  {
    id: "root",
    items: [{ id: "dashboard", label: "Dashboard", href: "/", icon: <LayoutDashboard className="h-4 w-4" /> }],
  },
  {
    id: "tenants",
    title: "Tenants",
    collapsible: true,
    items: [
      {
        id: "tenants",
        label: "All tenants",
        href: "/tenants",
        permission: Permissions.Tenant.View,
        icon: <Building2 className="h-4 w-4" />,
      },
      {
        id: "tenants-new",
        label: "New tenant",
        href: "/tenants/new",
        permission: Permissions.Tenant.Manage,
        icon: <Plus className="h-4 w-4" />,
      },
    ],
  },
  {
    id: "subscriptions",
    title: "Subscriptions",
    collapsible: true,
    // No `Subscription.*` permission key exists (no backend at all yet, see
    // services/subscription/subscription.dev-adapter.ts) — gated on Root, same as every
    // other ungoverned domain, rather than inventing a permission or borrowing Tenant's.
    items: [
      {
        id: "subscriptions",
        label: "Packages",
        href: "/subscriptions",
        permission: Permissions.Root,
        icon: <Package className="h-4 w-4" />,
      },
    ],
  },
  {
    id: "console",
    title: "Console",
    collapsible: true,
    items: [
      {
        id: "localization",
        label: "Console Language",
        href: "/localization",
        permission: Permissions.Root,
        icon: <Languages className="h-4 w-4" />,
      },
    ],
  },
  {
    id: "system",
    title: "System",
    collapsible: true,
    items: [
      {
        id: "settings",
        label: "Settings",
        href: "/settings",
        permission: Permissions.Root,
        icon: <Settings className="h-4 w-4" />,
      },
    ],
  },
];
