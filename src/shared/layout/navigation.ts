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
 * (contextual to one tenant, not a global list). `system` is intentionally empty: reserved
 * IA slot for a future real system-settings capability — see docs/roadmap, don't add
 * Bootstrap/internal-API entries here just because the group exists.
 */
export const navigationConfig: NavigationConfig = [
  {
    id: "root",
    items: [{ id: "dashboard", label: "Dashboard", href: "/" }],
  },
  {
    id: "tenants",
    title: "Tenants",
    items: [
      { id: "tenants", label: "All tenants", href: "/tenants", permission: Permissions.Tenant.View },
      { id: "tenants-new", label: "New tenant", href: "/tenants/new", permission: Permissions.Tenant.Manage },
    ],
  },
  {
    id: "subscriptions",
    title: "Subscriptions",
    // No `Subscription.*` permission key exists (no backend at all yet, see
    // services/subscription/subscription.dev-adapter.ts) — gated on Root, same as every
    // other ungoverned domain, rather than inventing a permission or borrowing Tenant's.
    items: [{ id: "subscriptions", label: "Packages", href: "/subscriptions", permission: Permissions.Root }],
  },
  {
    id: "console",
    title: "Console",
    items: [{ id: "localization", label: "Console Language", href: "/localization", permission: Permissions.Root }],
  },
  {
    id: "system",
    title: "System",
    items: [],
  },
];
