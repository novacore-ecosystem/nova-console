"use client";

import { PageContainer } from "@novacore/frontend-next-shadcn";

import { TenantListHeader } from "@/features/tenant/components/TenantListPage/TenantListHeader";
import { TenantFilters } from "@/features/tenant/components/TenantListPage/TenantFilters";
import { TenantTable } from "@/features/tenant/components/TenantListPage/TenantTable";
import { useTenantListPage } from "@/features/tenant/components/TenantListPage/useTenantListPage";

export function TenantListPage() {
  const { tenants, isLoading, isError, refetch, search, setSearch, statusFilter, setStatusFilter } =
    useTenantListPage();

  return (
    <PageContainer>
      <TenantListHeader />
      <TenantFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />
      <TenantTable
        tenants={tenants}
        loading={isLoading}
        error={isError}
        onRetry={() => refetch()}
      />
    </PageContainer>
  );
}
