"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { useTenantQuery } from "@/features/tenant/api/tenant.queries";

export type TenantDetailAction = "detail" | "update";

/** `action` is query-param-driven per the Tenant Page architecture (insert/update/detail) — default is `"detail"`. */
export function useTenantDetailPage(tenantId: string) {
  const tenantQuery = useTenantQuery(tenantId);
  const router = useRouter();
  const searchParams = useSearchParams();
  const action: TenantDetailAction = searchParams.get("action") === "update" ? "update" : "detail";

  return {
    tenant: tenantQuery.data ?? null,
    isLoading: tenantQuery.isLoading,
    isError: tenantQuery.isError,
    action,
    startEditing: () => router.push(`/tenants/${tenantId}?action=update`),
    stopEditing: () => router.replace(`/tenants/${tenantId}`),
  };
}
