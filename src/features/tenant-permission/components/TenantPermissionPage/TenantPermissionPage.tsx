"use client";

import {
  AdminBreadcrumb,
  Button,
  ContentPanel,
  ErrorState,
  LoadingState,
  PageContainer,
  PageHeader,
} from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import { PermissionScopeSelector } from "@/shared/authorization";
import { useTenantPermissionPage } from "@/features/tenant-permission/components/TenantPermissionPage/useTenantPermissionPage";

export interface TenantPermissionPageProps {
  tenantId: string;
}

/** The Root → Tenant link of the permission model (see docs brief) — Tenant → its own roles/users has no UI yet, nova-console has no Role/User management screens to constrain. */
export function TenantPermissionPage({ tenantId }: TenantPermissionPageProps) {
  const { t } = useAppTranslation();
  const {
    tenant,
    availablePermissions,
    grantedKeys,
    onChange,
    isLoading,
    isError,
    saving,
    dirty,
    error,
    save,
    discard,
  } = useTenantPermissionPage(tenantId);

  if (isLoading) return <LoadingState />;
  if (isError || !tenant) return <ErrorState title={t("tenant.detail.notFound", "Tenant not found.")} />;

  return (
    <PageContainer>
      <PageHeader
        title={t("tenantPermission.page.title", "Permission scope")}
        description={t(
          "tenantPermission.page.description",
          "Permissions Root has granted to {name} — its own roles and users can only ever be assigned from this set.",
          { name: tenant.name },
        )}
        breadcrumb={
          <AdminBreadcrumb
            items={[
              { label: t("tenant.list.title", "Tenants"), href: "/tenants" },
              { label: tenant.name, href: `/tenants/${tenant.id}` },
              { label: t("tenantPermission.page.title", "Permission scope") },
            ]}
          />
        }
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={discard} disabled={!dirty || saving}>
              {t("common.actions.discard", "Discard")}
            </Button>
            <Button size="sm" onClick={() => save()} loading={saving} disabled={!dirty}>
              {t("common.actions.save", "Save")}
            </Button>
          </div>
        }
      />
      <ContentPanel>
        <PermissionScopeSelector
          availablePermissions={availablePermissions}
          grantedKeys={grantedKeys}
          onChange={onChange}
          saving={saving}
          dirty={dirty}
          error={error}
        />
      </ContentPanel>
    </PageContainer>
  );
}
