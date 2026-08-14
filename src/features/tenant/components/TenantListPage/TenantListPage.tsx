"use client";

import { PageContainer } from "@novacore/frontend-next-shadcn";

import { TenantListHeader } from "@/features/tenant/components/TenantListPage/TenantListHeader";
import { TenantFilters } from "@/features/tenant/components/TenantListPage/TenantFilters";
import { TenantTable } from "@/features/tenant/components/TenantListPage/TenantTable";
import { TenantFormDialog } from "@/features/tenant/components/TenantListPage/TenantFormDialog";
import { useTenantListPage } from "@/features/tenant/components/TenantListPage/useTenantListPage";

export function TenantListPage() {
  const {
    tenants,
    pagination,
    onPaginationChange,
    isLoading,
    isFetching,
    isError,
    refetch,
    search,
    setSearch,
    isCreateDialogOpen,
    openCreateDialog,
    setCreateDialogOpen,
  } = useTenantListPage();

  return (
    <PageContainer>
      <TenantListHeader onCreateClick={openCreateDialog} />
      <TenantFilters search={search} onSearchChange={setSearch} isFetching={isFetching} />
      <TenantTable
        tenants={tenants}
        loading={isLoading}
        error={isError}
        onRetry={() => refetch()}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
      />
      <TenantFormDialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen} />
    </PageContainer>
  );
}
