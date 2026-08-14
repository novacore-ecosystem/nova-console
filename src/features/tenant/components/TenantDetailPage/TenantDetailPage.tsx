"use client";

import {
  ErrorState,
  LoadingState,
  PageContainer,
  ShellPageHeader,
  StatusBadge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@novacore/frontend-next-shadcn";
import { ScopeListPanel } from "@/features/scope";
import { TenantClientListPanel } from "@/features/tenant-client";

import { useAppTranslation } from "@/shared/i18n";
import { useTenantDetailPage } from "@/features/tenant/components/TenantDetailPage/useTenantDetailPage";
import { TenantOverviewPanel } from "@/features/tenant/components/TenantDetailPage/TenantOverviewPanel";
import { TenantConfigurationPanel } from "@/features/tenant/components/TenantDetailPage/TenantConfigurationPanel";
import { TenantTranslationsPanel } from "@/features/tenant/components/TenantDetailPage/TenantTranslationsPanel";

export interface TenantDetailPageProps {
  tenantId: string;
}

export function TenantDetailPage({ tenantId }: TenantDetailPageProps) {
  const { t } = useAppTranslation();
  const { tenant, isLoading, isError } = useTenantDetailPage(tenantId);

  if (isLoading) return <LoadingState />;
  if (isError || !tenant)
    return <ErrorState title={t("tenant.detail.notFound", "Tenant not found.")} />;

  return (
    <PageContainer>
      <ShellPageHeader
        title={tenant.name}
        description={tenant.code}
        actions={
          tenant.isActive ? (
            <StatusBadge label={t("tenant.status.active", "Active")} tone="success" />
          ) : (
            <StatusBadge label={t("tenant.status.inactive", "Inactive")} tone="neutral" />
          )
        }
      />
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">{t("tenant.detail.tabOverview", "Overview")}</TabsTrigger>
          <TabsTrigger value="configuration">
            {t("tenant.detail.tabConfiguration", "Configuration")}
          </TabsTrigger>
          <TabsTrigger value="translations">
            {t("tenant.detail.tabTranslations", "Translations")}
          </TabsTrigger>
          <TabsTrigger value="security">{t("tenant.detail.tabSecurity", "Security")}</TabsTrigger>
          <TabsTrigger value="scopes">{t("tenant.detail.tabScopes", "Scopes")}</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <TenantOverviewPanel tenant={tenant} />
        </TabsContent>
        <TabsContent value="configuration">
          <TenantConfigurationPanel tenant={tenant} />
        </TabsContent>
        <TabsContent value="translations">
          <TenantTranslationsPanel tenant={tenant} />
        </TabsContent>
        <TabsContent value="security">
          <TenantClientListPanel tenantId={tenant.id} clients={tenant.clients} />
        </TabsContent>
        <TabsContent value="scopes">
          <ScopeListPanel tenantId={tenant.id} />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
