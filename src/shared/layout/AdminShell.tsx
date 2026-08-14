"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  AdminLayout,
  AdminSidebar,
  AdminSidebarSection,
  AdminSidebarItem,
  AdminHeader,
  Button,
} from "@novacore/frontend-next-shadcn";

import { navigationConfig, type NavigationItem } from "@/shared/layout/navigation";
import { useSessionStore } from "@/shared/stores/session.store";
import { useLogoutMutation, usePermissionCheck } from "@/features/auth";
import { useAppTranslation } from "@/shared/i18n";

/**
 * Composes the shell from the shared package's presentation-only primitives.
 * `@novacore/frontend-next-shadcn`'s admin components are contract-only — nav
 * rendering and permission resolution are the consuming app's job (see
 * `PermissionGate`'s docstring in that package) — so filtering by permission,
 * active-route matching, and the logged-in user's identity all live here.
 */
export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { t } = useAppTranslation();
  const user = useSessionStore((state) => state.user);
  const logoutMutation = useLogoutMutation();
  const checkPermission = usePermissionCheck();

  const isActive = (item: NavigationItem) =>
    item.match === "exact" ? pathname === item.href : pathname.startsWith(item.href);

  const sidebar = (
    <AdminSidebar>
      {navigationConfig.map((group) => (
        <AdminSidebarSection key={group.id}>
          {group.items
            .filter((item) => !item.permission || checkPermission(item.permission))
            .map((item) => (
              <Link key={item.id} href={item.href}>
                <AdminSidebarItem active={isActive(item)}>{item.label}</AdminSidebarItem>
              </Link>
            ))}
        </AdminSidebarSection>
      ))}
    </AdminSidebar>
  );

  const header = (
    <AdminHeader>
      <span className="font-semibold">{t("app.name", "Nova Console")}</span>
      <div className="flex-1" />
      {user ? <span className="text-sm text-muted-foreground">{user.name}</span> : null}
      <Button variant="ghost" size="sm" onClick={() => logoutMutation.mutate()}>
        {t("auth.logout", "Log out")}
      </Button>
    </AdminHeader>
  );

  return (
    <AdminLayout sidebar={sidebar} header={header}>
      {children}
    </AdminLayout>
  );
}
