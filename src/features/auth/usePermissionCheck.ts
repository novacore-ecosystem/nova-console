"use client";

import { hasAllPermissions, hasAnyPermission, type Permission } from "@novacore/frontend-foundation";

import { useSessionStore } from "@/shared/stores/session.store";

export type PermissionRequirement = Permission | Permission[];

export interface PermissionCheckOptions {
  requireAll?: boolean;
}

/**
 * Single source of truth for permission checks — used by both `RequirePermission`
 * (page gating) and `AdminShell` (nav filtering). Reads directly off the session
 * store rather than through a context provider since Zustand is already global.
 */
export function usePermissionCheck() {
  const owned = useSessionStore((state) => state.user?.permissions ?? []);

  return (requirement: PermissionRequirement, options?: PermissionCheckOptions): boolean => {
    const required = Array.isArray(requirement) ? requirement : [requirement];
    return options?.requireAll ? hasAllPermissions(owned, required) : hasAnyPermission(owned, required);
  };
}
