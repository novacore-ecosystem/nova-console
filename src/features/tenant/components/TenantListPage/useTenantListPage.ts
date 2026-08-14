"use client";

import { useEffect, useState } from "react";
import { fromPaginatedResult, type DataTablePaginationState } from "@novacore/frontend-next-shadcn";

import { useDebouncedValue } from "@/shared/hooks";
import { useTenantsQuery } from "@/features/tenant/api/tenant.queries";

const PAGE_SIZE = 20;

export function useTenantListPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search, 300);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const tenantsQuery = useTenantsQuery({ search: debouncedSearch, page, pageSize: PAGE_SIZE });
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);

  const { data, pagination } = tenantsQuery.data
    ? fromPaginatedResult(tenantsQuery.data)
    : { data: [], pagination: undefined };

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
    isCreateDialogOpen,
    openCreateDialog: () => setCreateDialogOpen(true),
    setCreateDialogOpen,
  };
}
