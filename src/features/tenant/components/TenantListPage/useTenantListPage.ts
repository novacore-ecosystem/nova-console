"use client";

import { useEffect, useState } from "react";
import { fromPaginatedResult, type DataTablePaginationState } from "@novacore/frontend-next-shadcn";

import { useDebouncedValue } from "@/shared/hooks";
import { useTenantsQuery } from "@/features/tenant/api/tenant.queries";

const PAGE_SIZE = 20;
/**
 * Stats row intentionally reads from a separate, unfiltered query rather than the current
 * search-scoped page — deriving active/inactive from `tenantsQuery`'s own (searched,
 * paginated) results would make the summary strip fluctuate with whatever the user typed,
 * which misrepresents "tenant health at a glance." Same bounded-sample approach as the
 * Dashboard (see useDashboardPage) — there's no dedicated stats endpoint to call instead.
 */
const STATS_SAMPLE_SIZE = 100;

export function useTenantListPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search, 300);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const tenantsQuery = useTenantsQuery({ search: debouncedSearch, page, pageSize: PAGE_SIZE });
  const statsQuery = useTenantsQuery({ page: 1, pageSize: STATS_SAMPLE_SIZE });

  const { data, pagination } = tenantsQuery.data
    ? fromPaginatedResult(tenantsQuery.data)
    : { data: [], pagination: undefined };

  const statsTenants = statsQuery.data?.items ?? [];
  const totalTenants = statsQuery.data?.totalCount ?? 0;
  const activeTenants = statsTenants.filter((tenant) => tenant.isActive).length;
  const inactiveTenants = statsTenants.filter((tenant) => !tenant.isActive).length;

  return {
    tenants: data,
    pagination,
    onPaginationChange: (next: DataTablePaginationState) => setPage(next.pageNumber),
    isLoading: tenantsQuery.isLoading,
    isFetching: tenantsQuery.isFetching,
    isError: tenantsQuery.isError,
    refetch: tenantsQuery.refetch,
    search,
    setSearch,
    totalTenants,
    activeTenants,
    inactiveTenants,
  };
}
