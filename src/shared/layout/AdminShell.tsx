"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Bell, HelpCircle, Search, Settings as SettingsIcon, Sparkles } from "lucide-react";
import {
  AboutDialog,
  AdminLayout,
  AdminPage,
  AdminSidebar,
  AdminHeader,
  CommandPalette,
  LocaleSwitcher,
  UserProfile,
  useAdminLayout,
  useCommandPalette,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@novacore/frontend-next-shadcn";

import type { Locale } from "@novacore/frontend-foundation";

import packageJson from "../../../package.json";
import { navigationConfig } from "@/shared/layout/navigation";
import { useSidebarPreferences } from "@/shared/layout/useSidebarPreferences";
import { useSessionStore } from "@/shared/stores/session.store";
import { useLogoutMutation } from "@/features/auth";
import { useAppTranslation, useLocale } from "@/shared/i18n";

function ShellLogo() {
  const { t } = useAppTranslation();
  const { sidebarCollapsed } = useAdminLayout();
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Sparkles className="size-4" />
      </span>
      {!sidebarCollapsed ? (
        <span className="truncate font-semibold text-sidebar-foreground">{t("app.name", "Nova Console")}</span>
      ) : null}
    </div>
  );
}

/**
 * Reads `sidebarCollapsed` from `AdminLayout`'s context — must be rendered as a
 * descendant of `<AdminLayout>` (it is: `AdminShell` passes it in as the `sidebar` prop,
 * which `AdminLayout` mounts inside its own context provider), not a sibling of it.
 */
function ShellSidebar({
  activeHref,
  permissions,
  onLogout,
  logoutLoading,
  userName,
  userRole,
  userEmail,
  openGroupIds,
  onGroupOpenChange,
}: {
  activeHref: string;
  permissions: string[];
  onLogout: () => void;
  logoutLoading: boolean;
  userName: string;
  userRole?: string;
  userEmail?: string;
  openGroupIds: Record<string, boolean>;
  onGroupOpenChange: (groupId: string, open: boolean) => void;
}) {
  const { sidebarCollapsed } = useAdminLayout();
  const router = useRouter();
  const { t } = useAppTranslation();

  return (
    <AdminSidebar
      groups={navigationConfig}
      activeHref={activeHref}
      permissions={permissions}
      collapsed={sidebarCollapsed}
      openGroupIds={openGroupIds}
      onGroupOpenChange={onGroupOpenChange}
      header={<ShellLogo />}
      footer={
        <UserProfile
          variant={sidebarCollapsed ? "compact" : "full"}
          user={{ name: userName, role: userRole, email: userEmail }}
          items={[
            {
              key: "settings",
              label: t("nav.settings", "Settings"),
              icon: <SettingsIcon className="size-4" />,
              onSelect: () => router.push("/settings"),
            },
          ]}
          onLogout={onLogout}
          logoutLabel={t("auth.logout", "Log out")}
          loading={logoutLoading}
          align="start"
        />
      }
    />
  );
}

function ShellNotifications() {
  const { t } = useAppTranslation();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={t("nav.notifications", "Notifications")}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <Bell className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 p-4 text-center text-sm text-muted-foreground">
        {t("nav.notificationsEmpty", "No notifications yet.")}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ShellLocaleSwitcher() {
  const { locale, setLocale, availableLocales } = useLocale();
  return (
    <LocaleSwitcher
      locale={locale}
      availableLocales={availableLocales}
      onLocaleChange={(code) => setLocale(code as Locale)}
    />
  );
}

function ShellHelpButton({ onOpen }: { onOpen: () => void }) {
  const { t } = useAppTranslation();
  return (
    <button
      type="button"
      aria-label={t("nav.help", "Help")}
      onClick={onOpen}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      <HelpCircle className="h-4 w-4" />
    </button>
  );
}

/**
 * Composes the shell from the shared package's admin primitives. `AdminSidebar` now owns
 * permission-based item filtering and active-route matching itself (see
 * `frontend-next-shadcn`'s `admin-sidebar.tsx`) — this file only supplies the nav config,
 * the current path, and the owned permission set, plus the logged-in user's identity for
 * the header/sidebar footer.
 */
export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useAppTranslation();
  const user = useSessionStore((state) => state.user);
  const ownedPermissions = useSessionStore((state) => state.user?.permissions ?? []);
  const logoutMutation = useLogoutMutation();
  const commandPalette = useCommandPalette();
  const sidebarPreferences = useSidebarPreferences();
  const [aboutOpen, setAboutOpen] = useState(false);

  const userName = user?.name ?? "";
  const userRole = user?.roles[0] ? user.roles[0][0]?.toUpperCase() + user.roles[0].slice(1) : undefined;

  const sidebar = (
    <ShellSidebar
      activeHref={pathname}
      permissions={ownedPermissions}
      onLogout={() => logoutMutation.mutate()}
      logoutLoading={logoutMutation.isPending}
      userName={userName}
      userRole={userRole}
      userEmail={user?.email}
      openGroupIds={sidebarPreferences.openGroupIds}
      onGroupOpenChange={sidebarPreferences.setGroupOpen}
    />
  );

  const header = (
    <AdminHeader
      notifications={<ShellNotifications />}
      localeSwitcher={<ShellLocaleSwitcher />}
      actions={<ShellHelpButton onOpen={() => setAboutOpen(true)} />}
      userMenu={
        <UserProfile
          variant="compact"
          user={{ name: userName, role: userRole, email: user?.email }}
          onLogout={() => logoutMutation.mutate()}
          logoutLabel={t("auth.logout", "Log out")}
          loading={logoutMutation.isPending}
        />
      }
    >
      {/* `children` renders in AdminHeader's flexible middle region (between the
          breadcrumb area and the trailing icon cluster) — the right place for a search
          box that should actually get real width, unlike the trailing `search` slot
          which sits in a `shrink-0` row alongside the icon buttons. */}
      <button
        type="button"
        onClick={() => commandPalette.setOpen(true)}
        className="flex w-full max-w-md items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="flex-1 text-left">{t("nav.search", "Search…")}</span>
        <kbd className="shrink-0 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium">⌘K</kbd>
      </button>
    </AdminHeader>
  );

  return (
    <AdminLayout
      sidebar={sidebar}
      topbar={header}
      collapsed={sidebarPreferences.collapsed}
      onCollapsedChange={sidebarPreferences.setCollapsed}
    >
      <CommandPalette
        open={commandPalette.open}
        onOpenChange={commandPalette.setOpen}
        navigationGroups={navigationConfig}
        permissions={ownedPermissions}
        onNavigate={(item) => item.href && router.push(item.href)}
      />
      <AboutDialog
        open={aboutOpen}
        onOpenChange={setAboutOpen}
        appName={t("app.name", "Nova Console")}
        description={t("app.description", "NovaCore's central administration console")}
        version={packageJson.version}
      />
      <AdminPage>{children}</AdminPage>
    </AdminLayout>
  );
}
