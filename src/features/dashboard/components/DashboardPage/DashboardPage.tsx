"use client";

import { Building2, CheckCircle2, XCircle } from "lucide-react";
import { ContentPanel, PageContainer, PageHeader, StatCard, StatCardRow } from "@novacore/frontend-next-shadcn";

import { useAppTranslation, useLocale } from "@/shared/i18n";
import { useDashboardPage } from "@/features/dashboard/components/DashboardPage/useDashboardPage";
import { RecentTenantsPanel } from "@/features/dashboard/components/DashboardPage/RecentTenantsPanel";

export function DashboardPage() {
  const { t } = useAppTranslation();
  const { locale } = useLocale();
  const {
    totalTenants,
    activeTenants,
    inactiveTenants,
    recentTenants,
    isLoading,
    isError,
    refetch,
    statsUpdatedAt,
    statsIsFetching,
  } = useDashboardPage();
  const freshness = { updatedAt: statsUpdatedAt, isFetching: statsIsFetching, locale };

  return (
    <PageContainer>
      <PageHeader
        title={t("app.name", "Nova Console")}
        description={t("app.description", "NovaCore's central administration console")}
      />
      <StatCardRow freshness={freshness}>
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
