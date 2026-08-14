import { Permissions, type Permission } from "@novacore/frontend-foundation";

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  match: "exact" | "prefix";
  permission?: Permission;
}

export interface NavigationGroup {
  id: string;
  items: NavigationItem[];
}

export type NavigationConfig = NavigationGroup[];

/**
 * Only routes that actually exist. Add a group's entries in the same commit that adds
 * the route itself — see docs/rules/architecture.md's router-as-boundary rule. `Tenants`
 * gates on the real `tenant:view` permission (see docs/reference/domain-mapping.md — the
 * backend now has granular Tenant permission keys). The Overview page itself needs no
 * permission. There is no Security nav entry: TenantClient has no standalone management
 * surface — its one real capability (rotate) lives on the Tenant detail page's Security tab.
 */
export const navigationConfig: NavigationConfig = [
  {
    id: "root",
    items: [
      {
        id: "overview",
        label: "Overview",
        href: "/",
        match: "exact",
      },
      {
        id: "tenants",
        label: "Tenants",
        href: "/tenants",
        match: "prefix",
        permission: Permissions.Tenant.View,
      },
      {
        id: "localization",
        label: "Console Language",
        href: "/localization",
        match: "prefix",
        permission: Permissions.Root,
      },
    ],
  },
];
