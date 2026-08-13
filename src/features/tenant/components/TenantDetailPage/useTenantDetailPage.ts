"use client";

import { useTenantQuery } from "@/features/tenant/api/tenant.queries";

export function useTenantDetailPage(tenantId: string) {
  const tenantQuery = useTenantQuery(tenantId);

  return {
    tenant: tenantQuery.data ?? null,
    isLoading: tenantQuery.isLoading,
    isError: tenantQuery.isError,
  };
}
