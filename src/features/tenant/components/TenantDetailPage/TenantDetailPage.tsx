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
      <Tabs defaultValue="scopes">
        <TabsList>
          <TabsTrigger value="details">{t("tenant.detail.tabDetails", "Details")}</TabsTrigger>
          <TabsTrigger value="scopes">{t("tenant.detail.tabScopes", "Scopes")}</TabsTrigger>
          <TabsTrigger value="keys">{t("tenant.detail.tabKeys", "Keys")}</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <dl className="grid gap-2 text-sm">
            <div>
              <dt className="text-muted-foreground">{t("tenant.form.code", "Code")}</dt>
              <dd>{tenant.code}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{t("tenant.form.name", "Name")}</dt>
              <dd>{tenant.name}</dd>
            </div>
          </dl>
        </TabsContent>
        <TabsContent value="scopes">
          <ScopeListPanel tenantId={tenant.id} />
        </TabsContent>
        <TabsContent value="keys">
          <TenantClientListPanel tenantId={tenant.id} />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
