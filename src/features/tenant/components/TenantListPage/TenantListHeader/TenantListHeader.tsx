"use client";

import { Button, ShellPageHeader } from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import { TenantFormDialog } from "@/features/tenant/components/TenantListPage/TenantFormDialog";
import { useTenantListHeader } from "@/features/tenant/components/TenantListPage/TenantListHeader/useTenantListHeader";

export function TenantListHeader() {
  const { t } = useAppTranslation();
  const { isCreateDialogOpen, openCreateDialog, setCreateDialogOpen } = useTenantListHeader();

  return (
    <>
      <ShellPageHeader
        title={t("tenant.list.title", "Tenants")}
        description={t("tenant.list.description", "Manage NovaCore tenants.")}
        actions={
          <Button onClick={openCreateDialog}>{t("tenant.list.newTenant", "New tenant")}</Button>
        }
      />
      <TenantFormDialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen} />
    </>
  );
}
