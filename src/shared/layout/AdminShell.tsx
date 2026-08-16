"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AdminLayout, AdminSidebar, AdminHeader, Button } from "@novacore/frontend-next-shadcn";

import { navigationConfig } from "@/shared/layout/navigation";
import { useSessionStore } from "@/shared/stores/session.store";
import { useLogoutMutation } from "@/features/auth";
import { useAppTranslation } from "@/shared/i18n";

/**
 * Composes the shell from the shared package's admin primitives. `AdminSidebar` now owns
 * permission-based item filtering and active-route matching itself (see
 * `frontend-next-shadcn`'s `admin-sidebar.tsx`) — this file only supplies the nav config,
 * the current path, and the owned permission set, plus the logged-in user's identity for
 * the header.
 */
export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { t } = useAppTranslation();
  const user = useSessionStore((state) => state.user);
  const ownedPermissions = useSessionStore((state) => state.user?.permissions ?? []);
  const logoutMutation = useLogoutMutation();

  const sidebar = (
    <AdminSidebar
      groups={navigationConfig}
      activeHref={pathname}
      permissions={ownedPermissions}
      header={<span className="font-semibold">{t("app.name", "Nova Console")}</span>}
    />
  );

  const header = (
    <AdminHeader
      userMenu={
        <div className="flex items-center gap-2">
          {user ? <span className="text-sm text-muted-foreground">{user.name}</span> : null}
          <Button variant="ghost" size="sm" onClick={() => logoutMutation.mutate()}>
            {t("auth.logout", "Log out")}
          </Button>
        </div>
      }
    />
  );

  return (
    <AdminLayout sidebar={sidebar} topbar={header}>
      {children}
    </AdminLayout>
  );
}
