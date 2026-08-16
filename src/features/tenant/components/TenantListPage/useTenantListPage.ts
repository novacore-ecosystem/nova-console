"use client";

import { useEffect, useState } from "react";
import { applyCriteriaFilters, applyCriteriaSorts, type CriteriaFilter, type CriteriaSort } from "@novacore/frontend-foundation";
import {
  fromPaginatedResult,
  usePersistentState,
  useDebouncedValue,
  type DataTablePaginationState,
  type DataTableSortState,
} from "@novacore/frontend-next-shadcn";

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

const HIDDEN_COLUMNS_KEY = "novacore.admin.preferences.table.tenants.columns";

export function useTenantListPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search, 300);

  const [filters, setFilters] = useState<CriteriaFilter[]>([]);
  const [sorts, setSorts] = useState<CriteriaSort[]>([]);
  const [hiddenColumns, setHiddenColumns, clearHiddenColumns] = usePersistentState<string[]>(HIDDEN_COLUMNS_KEY, []);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const tenantsQuery = useTenantsQuery({ search: debouncedSearch, page, pageSize: PAGE_SIZE });
  const statsQuery = useTenantsQuery({ page: 1, pageSize: STATS_SAMPLE_SIZE });

  const { data, pagination } = tenantsQuery.data
    ? fromPaginatedResult(tenantsQuery.data)
    : { data: [], pagination: undefined };

  /**
   * `AdvancedFilter`/`AdvancedSort` produce the real `CriteriaFilter[]`/`CriteriaSort[]`
   * contract shapes, but there's no `/tenants/search` backend endpoint to send them to yet
   * (`GET /auth/tenants` only takes `search/page/pageSize`) — so they're applied locally to
   * whichever page is already on screen, same "honest about what's real vs. approximated"
   * pattern as the stats row. This means filtering/sorting only affects the current page's
   * rows, not the full result set across pages — a known, documented limitation, not a bug.
   */
  const tenants = applyCriteriaSorts(applyCriteriaFilters(data, filters), sorts);

  // DataTable's own header-click sort is single-column; it maps onto the first (and, in
  // that case, only) entry of the richer multi-field `sorts` state. A multi-field advanced
  // sort has no single column to visually highlight, so headers show no active sort then.
  const quickSort: DataTableSortState | undefined =
    sorts.length === 1 ? { columnId: sorts[0]!.field, direction: sorts[0]!.direction } : undefined;

  function onQuickSortChange(next: DataTableSortState | undefined) {
    setSorts(next ? [{ field: next.columnId, direction: next.direction }] : []);
  }

  const statsTenants = statsQuery.data?.items ?? [];
  const totalTenants = statsQuery.data?.totalCount ?? 0;
  const activeTenants = statsTenants.filter((tenant) => tenant.isActive).length;
  const inactiveTenants = statsTenants.filter((tenant) => !tenant.isActive).length;

  return {
    tenants,
    pagination,
    onPaginationChange: (next: DataTablePaginationState) => setPage(next.pageNumber),
    isLoading: tenantsQuery.isLoading,
    isFetching: tenantsQuery.isFetching,
    isError: tenantsQuery.isError,
    refetch: tenantsQuery.refetch,
    search,
    setSearch,
    filters,
    setFilters,
    sorts,
    setSorts,
    quickSort,
    onQuickSortChange,
    hiddenColumns,
    setHiddenColumns,
    clearHiddenColumns,
    totalTenants,
    activeTenants,
    inactiveTenants,
    statsUpdatedAt: statsQuery.dataUpdatedAt,
    statsIsFetching: statsQuery.isFetching,
  };
}
