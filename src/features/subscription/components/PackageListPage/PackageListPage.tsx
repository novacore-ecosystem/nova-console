"use client";

import { PageContainer } from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import { StatTile, StatTileRow } from "@/shared/entity";
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
  } = usePackageListPage();

  return (
    <PageContainer>
      <PackageListHeader />
      <StatTileRow>
        <StatTile label={t("subscription.stats.total", "Total packages")} value={totalPackages} />
        <StatTile label={t("subscription.stats.active", "Active")} value={activePackages} />
        <StatTile label={t("subscription.stats.archived", "Archived")} value={archivedPackages} />
      </StatTileRow>
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
