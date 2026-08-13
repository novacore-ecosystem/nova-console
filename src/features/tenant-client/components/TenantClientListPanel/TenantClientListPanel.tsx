"use client";

import { Button, PageSection } from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import { TenantClientTable } from "@/features/tenant-client/components/TenantClientListPanel/TenantClientTable";
import { TenantClientCreateDialog } from "@/features/tenant-client/components/TenantClientListPanel/TenantClientCreateDialog";
import { useTenantClientListPanel } from "@/features/tenant-client/components/TenantClientListPanel/useTenantClientListPanel";

export interface TenantClientListPanelProps {
  tenantId: string | null;
}

export function TenantClientListPanel({ tenantId }: TenantClientListPanelProps) {
  const { t } = useAppTranslation();
  const {
    clients,
    isLoading,
    isError,
    refetch,
    isCreateDialogOpen,
    openCreateDialog,
    setCreateDialogOpen,
  } = useTenantClientListPanel(tenantId);

  return (
    <PageSection
      title={t("tenantClient.list.title", "Client keys")}
      description={t(
        "tenantClient.list.description",
        "Pre-login client identification keys (X-Tenant-Client-Key).",
      )}
      actions={
        <Button onClick={openCreateDialog}>{t("tenantClient.list.newKey", "New key")}</Button>
      }
    >
      <TenantClientTable
        clients={clients}
        loading={isLoading}
        error={isError}
        onRetry={() => refetch()}
      />
      <TenantClientCreateDialog
        tenantId={tenantId}
        open={isCreateDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </PageSection>
  );
}
