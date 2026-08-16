"use client";

import { humanizePermissionKey } from "@/shared/authorization";
import { useTenantPermissionScopeQuery } from "@/features/tenant-permission";

export interface PermissionScopeGroupSummary {
  id: string;
  label: string;
  keys: string[];
}

export function usePermissionScopePanel(tenantId: string) {
  const scopeQuery = useTenantPermissionScopeQuery(tenantId);
  const grantedKeys = scopeQuery.data ?? [];

  const groups: PermissionScopeGroupSummary[] = Object.values(
    grantedKeys.reduce<Record<string, PermissionScopeGroupSummary>>((acc, key) => {
      const { moduleId, moduleLabel } = humanizePermissionKey(key);
      acc[moduleId] ??= { id: moduleId, label: moduleLabel, keys: [] };
      acc[moduleId].keys.push(key);
      return acc;
    }, {}),
  );

  return {
    groups,
    grantedCount: grantedKeys.length,
    isLoading: scopeQuery.isLoading,
    isError: scopeQuery.isError,
  };
}
