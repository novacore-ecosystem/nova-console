"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import type { ReactNode } from "react";
import { AdminLayout, AdminShellProvider } from "@novacore/frontend-next-shadcn";

import { navigationConfig } from "@/shared/layout/navigation";
import { applications } from "@/shared/layout/applications";

/**
 * Config-driven shell composition (see docs/reference/frontend-nextjs.md — "use the
 * config-driven path, not the manual one"). `user`/`hasPermission`/`onLogout` are wired
 * in the auth phase; until then the shell renders with no identity and unfiltered
 * navigation (nothing in navigationConfig requires a permission yet).
 */
export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AdminShellProvider
      branding={{ title: "Nova Console" }}
      navigation={navigationConfig}
      applications={applications}
      currentApplicationId="nova-console"
      pathname={pathname}
      linkComponent={Link}
    >
      <AdminLayout>{children}</AdminLayout>
    </AdminShellProvider>
  );
}
