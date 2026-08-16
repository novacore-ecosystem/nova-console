"use client";

import { ContentPanel, PageContainer, PageHeader } from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import { StatTile, StatTileRow } from "@/shared/entity";
import { useDashboardPage } from "@/features/dashboard/components/DashboardPage/useDashboardPage";
import { RecentTenantsPanel } from "@/features/dashboard/components/DashboardPage/RecentTenantsPanel";

export function DashboardPage() {
  const { t } = useAppTranslation();
  const { totalTenants, activeTenants, inactiveTenants, recentTenants, isLoading, isError, refetch } =
    useDashboardPage();

  return (
    <PageContainer>
      <PageHeader
        title={t("app.name", "Nova Console")}
        description={t("app.description", "NovaCore's central administration console")}
      />
      <StatTileRow>
        <StatTile label={t("dashboard.stats.totalTenants", "Total tenants")} value={totalTenants} />
        <StatTile label={t("dashboard.stats.activeTenants", "Active tenants")} value={activeTenants} />
        <StatTile label={t("dashboard.stats.inactiveTenants", "Inactive tenants")} value={inactiveTenants} />
      </StatTileRow>
      <ContentPanel>
        <p className="text-sm text-muted-foreground">
          {t(
            "dashboard.summary",
            "Manage tenants, tenant permission scopes, and subscriptions from the navigation on the left.",
          )}
        </p>
      </ContentPanel>
      <RecentTenantsPanel
        tenants={recentTenants}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
      />
    </PageContainer>
  );
}
