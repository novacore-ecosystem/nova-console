"use client";

import type { ReactNode } from "react";
import {
  ErrorState,
  useAdminShell,
  type PermissionRequirement,
} from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";

export interface RequirePermissionProps {
  permission: PermissionRequirement;
  requireAll?: boolean;
  children: ReactNode;
}

/**
 * Page-level permission gate — distinct from navigation filtering (which only hides
 * nav entries, not the page itself). A user who navigates directly to a Root-gated
 * route without Root sees this instead of the page. Client-side only, a UI signal —
 * see docs/reference/authorization.md, the backend remains the real boundary.
 */
export function RequirePermission({ permission, requireAll, children }: RequirePermissionProps) {
  const { t } = useAppTranslation();
  const { checkPermission } = useAdminShell();

  if (!checkPermission(permission, { requireAll })) {
    return (
      <ErrorState
        title={t("auth.accessDenied.title", "Access denied")}
        description={t(
          "auth.accessDenied.description",
          "You don't have permission to view this page.",
        )}
      />
    );
  }

  return <>{children}</>;
}
