"use client";

import { useTenantsQuery } from "@/features/tenant";

const RECENT_TENANTS_COUNT = 5;
/**
 * There's no dedicated stats/aggregate endpoint (`GET /tenants` is the only real one — see
 * docs/reference/domain-mapping.md) — counts are derived client-side from one bounded fetch
 * rather than inventing a backend aggregate. `totalCount` itself is exact; active/inactive
 * are only exact within this fetched page, which is fine for the realistic current tenant
 * volume and avoids paginating through everything just to render a dashboard tile.
 */
const STATS_SAMPLE_SIZE = 100;

export function useDashboardPage() {
  const tenantsQuery = useTenantsQuery({ page: 1, pageSize: STATS_SAMPLE_SIZE });
  const tenants = tenantsQuery.data?.items ?? [];

  return {
    totalTenants: tenantsQuery.data?.totalCount ?? 0,
    activeTenants: tenants.filter((tenant) => tenant.isActive).length,
    inactiveTenants: tenants.filter((tenant) => !tenant.isActive).length,
    recentTenants: tenants.slice(0, RECENT_TENANTS_COUNT),
    isLoading: tenantsQuery.isLoading,
    isError: tenantsQuery.isError,
    refetch: tenantsQuery.refetch,
  };
}
