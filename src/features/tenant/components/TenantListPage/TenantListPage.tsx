"use client";

import { HowTo, PageContainer, StatCard, StatCardRow } from "@novacore/frontend-next-shadcn";
import { Building2, CheckCircle2, XCircle } from "lucide-react";

import { TenantFilters } from "@/features/tenant/components/TenantListPage/TenantFilters";
import { TenantListHeader } from "@/features/tenant/components/TenantListPage/TenantListHeader";
import { TenantTable } from "@/features/tenant/components/TenantListPage/TenantTable";
import { useTenantListPage } from "@/features/tenant/components/TenantListPage/useTenantListPage";
import { useAppTranslation, useLocale } from "@/shared/i18n";

export function TenantListPage() {
  const { t } = useAppTranslation();
  const { locale } = useLocale();
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
    statsUpdatedAt,
    statsIsFetching,
  } = useTenantListPage();
  const freshness = { updatedAt: statsUpdatedAt, isFetching: statsIsFetching, locale };

  return (
    <PageContainer>
      <TenantListHeader />
      <StatCardRow freshness={freshness} className="mb-4">
        <StatCard
          label={t("dashboard.stats.totalTenants", "Total tenants")}
          value={totalTenants}
          icon={<Building2 />}
          tone="brand"
        />
        <StatCard
          label={t("dashboard.stats.activeTenants", "Active tenants")}
          value={activeTenants}
          icon={<CheckCircle2 />}
          tone="success"
        />
        <StatCard
          label={t("dashboard.stats.inactiveTenants", "Inactive tenants")}
          value={inactiveTenants}
          icon={<XCircle />}
          tone="neutral"
        />
      </StatCardRow>
      <TenantFilters
        className="mb-2"
        search={search}
        onSearchChange={setSearch}
        isFetching={isFetching}
        filters={filters}
        onFiltersChange={setFilters}
        sorts={sorts}
        onSortsChange={setSorts}
        hiddenColumns={hiddenColumns}
        onHiddenColumnsChange={setHiddenColumns}
        onClearHiddenColumns={clearHiddenColumns}
      />
      <TenantTable
        tenants={tenants}
        loading={isLoading}
        error={isError}
        onRetry={() => refetch()}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        sorting={quickSort}
        onSortingChange={onQuickSortChange}
        hiddenColumns={hiddenColumns}
      />
      <HowTo title={t("tenant.list.howToTitle", "Managing tenants")}>
        {t(
          "tenant.list.howToBody",
          "Use search for a quick name/code match, or Filter and Sort for more precise criteria — including fields not shown as table columns. Use Columns to hide fields you don't need; your choice is remembered.",
        )}
      </HowTo>
    </PageContainer>
  );
}
