"use client";

import { useEffect, useState } from "react";
import { PERMISSION_VALUES } from "@novacore/frontend-foundation";

import { useTenantQuery } from "@/features/tenant";
import {
  useTenantPermissionScopeQuery,
  useUpdateTenantPermissionScopeMutation,
} from "@/features/tenant-permission/api/tenant-permission.queries";

function sameKeys(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const set = new Set(a);
  return b.every((key) => set.has(key));
}

/**
 * `keys` mirrors the fetched scope only once, on first load — after that it's the user's
 * local pending edit, compared back against the fetched value to derive `dirty`. Root can
 * grant from the full catalog (`PERMISSION_VALUES`) — there's no narrower "Root's own
 * scope" to intersect against, unlike a hypothetical future non-Root granter.
 */
export function useTenantPermissionPage(tenantId: string) {
  const tenantQuery = useTenantQuery(tenantId);
  const scopeQuery = useTenantPermissionScopeQuery(tenantId);
  const updateMutation = useUpdateTenantPermissionScopeMutation(tenantId);

  const [keys, setKeys] = useState<string[] | null>(null);

  useEffect(() => {
    if (scopeQuery.data && keys === null) setKeys(scopeQuery.data);
  }, [scopeQuery.data, keys]);

  const grantedKeys = keys ?? scopeQuery.data ?? [];
  const dirty = scopeQuery.data ? !sameKeys(grantedKeys, scopeQuery.data) : false;

  return {
    tenant: tenantQuery.data ?? null,
    availablePermissions: PERMISSION_VALUES,
    grantedKeys,
    onChange: setKeys,
    isLoading: tenantQuery.isLoading || scopeQuery.isLoading,
    isError: tenantQuery.isError || scopeQuery.isError,
    saving: updateMutation.isPending,
    dirty,
    error: updateMutation.error instanceof Error ? updateMutation.error.message : null,
    save: () => updateMutation.mutateAsync(grantedKeys),
    discard: () => setKeys(scopeQuery.data ?? []),
  };
}
