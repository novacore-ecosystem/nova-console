import type { NavigationConfig } from "@novacore/frontend-next-shadcn";
import { Permissions } from "@novacore/frontend-foundation";

/**
 * Only routes that actually exist. Add a group's entries in the same commit that adds
 * the route itself — see docs/rules/architecture.md's router-as-boundary rule. Entries
 * for Root-gated features set `permission: Permissions.Root` (see
 * docs/decisions/README.md for why — no Tenant- or Scope-prefixed permission keys exist
 * in the backend catalog yet). The Overview page itself needs no permission.
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
        permission: Permissions.Root,
      },
      {
        id: "security",
        label: "Security",
        href: "/security",
        match: "prefix",
        permission: Permissions.Root,
      },
      {
        id: "localization",
        label: "Localization",
        href: "/localization",
        match: "prefix",
        permission: Permissions.Root,
      },
    ],
  },
];
