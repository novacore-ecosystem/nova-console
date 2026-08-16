"use client";

import {
  AdminBreadcrumb,
  Button,
  ContentPanel,
  ErrorState,
  LoadingState,
  PageContainer,
  PageHeader,
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
import { PermissionScopePanel } from "@/features/tenant/components/TenantDetailPage/PermissionScopePanel";
import { TenantIdentityForm } from "@/features/tenant/components/TenantPage/TenantIdentityForm";

export interface TenantDetailPageProps {
  tenantId: string;
}

export function TenantDetailPage({ tenantId }: TenantDetailPageProps) {
  const { t } = useAppTranslation();
  const { tenant, isLoading, isError, action, startEditing, stopEditing } = useTenantDetailPage(tenantId);

  if (isLoading) return <LoadingState />;
  if (isError || !tenant)
    return <ErrorState title={t("tenant.detail.notFound", "Tenant not found.")} />;

  return (
    <PageContainer>
      <PageHeader
        title={tenant.name}
        description={tenant.code}
        breadcrumb={
          <AdminBreadcrumb
            items={[{ label: t("tenant.list.title", "Tenants"), href: "/tenants" }, { label: tenant.name }]}
          />
        }
        actions={
          <div className="flex items-center gap-2">
            {tenant.isActive ? (
              <StatusBadge label={t("tenant.status.active", "Active")} tone="success" />
            ) : (
              <StatusBadge label={t("tenant.status.inactive", "Inactive")} tone="neutral" />
            )}
            {action === "detail" ? (
              <Button variant="outline" size="sm" onClick={startEditing}>
                {t("common.actions.edit", "Edit")}
              </Button>
            ) : null}
          </div>
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
          <TabsTrigger value="permissions">
            {t("tenant.detail.tabPermissions", "Permission scope")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          {action === "update" ? (
            <ContentPanel>
              <TenantIdentityForm mode="update" tenant={tenant} onSuccess={stopEditing} onCancel={stopEditing} />
            </ContentPanel>
          ) : (
            <TenantOverviewPanel tenant={tenant} />
          )}
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
        <TabsContent value="permissions">
          <PermissionScopePanel tenantId={tenant.id} />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
