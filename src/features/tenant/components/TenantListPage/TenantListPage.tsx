"use client";

import { PageContainer } from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import { StatTile, StatTileRow } from "@/shared/entity";
import { TenantListHeader } from "@/features/tenant/components/TenantListPage/TenantListHeader";
import { TenantFilters } from "@/features/tenant/components/TenantListPage/TenantFilters";
import { TenantTable } from "@/features/tenant/components/TenantListPage/TenantTable";
import { useTenantListPage } from "@/features/tenant/components/TenantListPage/useTenantListPage";

export function TenantListPage() {
  const { t } = useAppTranslation();
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
    totalTenants,
    activeTenants,
    inactiveTenants,
  } = useTenantListPage();

  return (
    <PageContainer>
      <TenantListHeader />
      <StatTileRow>
        <StatTile label={t("dashboard.stats.totalTenants", "Total tenants")} value={totalTenants} />
        <StatTile label={t("dashboard.stats.activeTenants", "Active tenants")} value={activeTenants} />
        <StatTile label={t("dashboard.stats.inactiveTenants", "Inactive tenants")} value={inactiveTenants} />
      </StatTileRow>
      <TenantFilters search={search} onSearchChange={setSearch} isFetching={isFetching} />
      <TenantTable
        tenants={tenants}
        loading={isLoading}
        error={isError}
        onRetry={() => refetch()}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
      />
    </PageContainer>
  );
}
