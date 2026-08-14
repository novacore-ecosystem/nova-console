"use client";

import { Button, ConfirmDialog } from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import { useTenantActions } from "@/features/tenant/components/TenantListPage/TenantActions/useTenantActions";
import type { TenantSummaryDto } from "@/services/tenant";

export interface TenantActionsProps {
  tenant: TenantSummaryDto;
}

export function TenantActions({ tenant }: TenantActionsProps) {
  const { t } = useAppTranslation();
  const {
    isDisableConfirmOpen,
    openDisableConfirm,
    setDisableConfirmOpen,
    confirmDisable,
    isDisabling,
    disableError,
    isDeleteConfirmOpen,
    openDeleteConfirm,
    setDeleteConfirmOpen,
    confirmDelete,
    isDeleting,
    deleteError,
  } = useTenantActions(tenant);

  return (
    <div className="flex items-center gap-2">
      {tenant.isActive ? (
        <Button variant="ghost" size="sm" onClick={openDisableConfirm}>
          {t("tenant.actions.disable", "Disable")}
        </Button>
      ) : null}
      <Button variant="ghost" size="sm" className="text-destructive" onClick={openDeleteConfirm}>
        {t("common.actions.delete", "Delete")}
      </Button>

      <ConfirmDialog
        open={isDisableConfirmOpen}
        onOpenChange={setDisableConfirmOpen}
        title={t("tenant.disable.title", "Disable tenant?")}
        description={t(
          "tenant.disable.description",
          `"${tenant.name}" will lose access immediately. It can only be re-enabled by contacting engineering — there is no self-service re-enable yet.`,
          { name: tenant.name },
        )}
        confirmLabel={t("tenant.actions.disable", "Disable")}
        confirmVariant="destructive"
        loading={isDisabling}
        error={disableError}
        onConfirm={confirmDisable}
      />

      <ConfirmDialog
        open={isDeleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title={t("tenant.delete.title", "Delete tenant?")}
        description={t(
          "tenant.delete.description",
          `"${tenant.name}" will be permanently removed from the tenant list. This cannot be undone.`,
          { name: tenant.name },
        )}
        confirmLabel={t("common.actions.delete", "Delete")}
        confirmVariant="destructive"
        loading={isDeleting}
        error={deleteError}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
