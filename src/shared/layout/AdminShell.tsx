"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  AdminLayout,
  AdminShellProvider,
  type PermissionChecker,
} from "@novacore/frontend-next-shadcn";
import { hasAllPermissions, hasAnyPermission } from "@novacore/frontend-foundation";

import { navigationConfig } from "@/shared/layout/navigation";
import { applications } from "@/shared/layout/applications";
import { useSessionStore } from "@/shared/stores/session.store";
import { useLogoutMutation } from "@/features/auth";

/**
 * Config-driven shell composition (see docs/reference/frontend-nextjs.md — "use the
 * config-driven path, not the manual one"). `user`/`hasPermission` come from the
 * session store (see docs/decisions/README.md for why permissions are a stubbed
 * adapter today, not real backend-verified data).
 */
export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const user = useSessionStore((state) => state.user);
  const logoutMutation = useLogoutMutation();

  const checkPermission: PermissionChecker = (requirement, options) => {
    const owned = user?.permissions ?? [];
    const required = Array.isArray(requirement) ? requirement : [requirement];
    return options?.requireAll
      ? hasAllPermissions(owned, required)
      : hasAnyPermission(owned, required);
  };

  return (
    <AdminShellProvider
      branding={{ title: "Nova Console" }}
      navigation={navigationConfig}
      applications={applications}
      currentApplicationId="nova-console"
      pathname={pathname}
      linkComponent={Link}
      user={user ? { id: user.id, name: user.name, email: user.email } : null}
      hasPermission={checkPermission}
      onLogout={() => logoutMutation.mutate()}
    >
      <AdminLayout>{children}</AdminLayout>
    </AdminShellProvider>
  );
}
