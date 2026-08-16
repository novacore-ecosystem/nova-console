"use client";

import { Archive, CheckCircle2, Package } from "lucide-react";
import { PageContainer, StatCard, StatCardRow } from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import { PackageListHeader } from "@/features/subscription/components/PackageListPage/PackageListHeader";
import { PackageFilters } from "@/features/subscription/components/PackageListPage/PackageFilters";
import { PackageTable } from "@/features/subscription/components/PackageListPage/PackageTable";
import { usePackageListPage } from "@/features/subscription/components/PackageListPage/usePackageListPage";

export function PackageListPage() {
  const { t } = useAppTranslation();
  const {
    packages,
    groups,
    tags,
    pagination,
    onPaginationChange,
    isLoading,
    isFetching,
    isError,
    refetch,
    search,
    setSearch,
    totalPackages,
    activePackages,
    archivedPackages,
    statsUpdatedAt,
    statsIsFetching,
  } = usePackageListPage();
  const freshness = { updatedAt: statsUpdatedAt, isFetching: statsIsFetching };

  return (
    <PageContainer>
      <PackageListHeader />
      <StatCardRow freshness={freshness}>
        <StatCard
          label={t("subscription.stats.total", "Total packages")}
          value={totalPackages}
          icon={<Package />}
          tone="brand"
        />
        <StatCard
          label={t("subscription.stats.active", "Active")}
          value={activePackages}
          icon={<CheckCircle2 />}
          tone="success"
        />
        <StatCard
          label={t("subscription.stats.archived", "Archived")}
          value={archivedPackages}
          icon={<Archive />}
          tone="neutral"
        />
      </StatCardRow>
      <PackageFilters search={search} onSearchChange={setSearch} isFetching={isFetching} />
      <PackageTable
        packages={packages}
        groups={groups}
        tags={tags}
        loading={isLoading}
        error={isError}
        onRetry={() => refetch()}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
      />
    </PageContainer>
  );
}
