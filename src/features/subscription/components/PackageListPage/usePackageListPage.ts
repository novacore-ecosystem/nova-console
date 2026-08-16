"use client";

import { useEffect, useState } from "react";
import { fromPaginatedResult, useDebouncedValue, type DataTablePaginationState } from "@novacore/frontend-next-shadcn";

import { useGroupsQuery, usePackagesQuery, useTagsQuery } from "@/features/subscription/api/subscription.queries";

const PAGE_SIZE = 20;
/** Same reasoning as `useTenantListPage`'s stats sample — kept independent of the search-scoped table query so the summary strip doesn't fluctuate with the current filter. */
const STATS_SAMPLE_SIZE = 100;

export function usePackageListPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search, 300);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const packagesQuery = usePackagesQuery({ search: debouncedSearch, page, pageSize: PAGE_SIZE });
  const statsQuery = usePackagesQuery({ page: 1, pageSize: STATS_SAMPLE_SIZE });
  const groupsQuery = useGroupsQuery();
  const tagsQuery = useTagsQuery();

  const { data, pagination } = packagesQuery.data
    ? fromPaginatedResult(packagesQuery.data)
    : { data: [], pagination: undefined };

  const statsPackages = statsQuery.data?.items ?? [];

  return {
    packages: data,
    groups: groupsQuery.data ?? [],
    tags: tagsQuery.data ?? [],
    pagination,
    onPaginationChange: (next: DataTablePaginationState) => setPage(next.pageNumber),
    isLoading: packagesQuery.isLoading,
    isFetching: packagesQuery.isFetching,
    isError: packagesQuery.isError,
    refetch: packagesQuery.refetch,
    search,
    setSearch,
    totalPackages: statsQuery.data?.totalCount ?? 0,
    activePackages: statsPackages.filter((pkg) => pkg.status === "active").length,
    archivedPackages: statsPackages.filter((pkg) => pkg.status === "archived").length,
    statsUpdatedAt: statsQuery.dataUpdatedAt,
    statsIsFetching: statsQuery.isFetching,
  };
}
