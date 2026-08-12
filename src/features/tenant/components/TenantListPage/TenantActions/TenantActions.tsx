"use client";

import { Button, ConfirmDialog } from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import { useTenantActions } from "@/features/tenant/components/TenantListPage/TenantActions/useTenantActions";
import type { TenantRecord } from "@/services/tenant";

export interface TenantActionsProps {
  tenant: TenantRecord;
  onEdit: (tenant: TenantRecord) => void;
}

export function TenantActions({ tenant, onEdit }: TenantActionsProps) {
  const { t } = useAppTranslation();
  const { isConfirmOpen, openConfirm, setConfirmOpen, confirmToggle, isSubmitting } =
    useTenantActions(tenant);

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" onClick={() => onEdit(tenant)}>
        {t("common.actions.edit", "Edit")}
      </Button>
      <Button variant="ghost" size="sm" onClick={openConfirm}>
        {tenant.isActive
          ? t("tenant.actions.deactivate", "Deactivate")
          : t("tenant.actions.activate", "Activate")}
      </Button>
      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setConfirmOpen}
        title={
          tenant.isActive
            ? t("tenant.deactivate.title", "Deactivate tenant?")
            : t("tenant.activate.title", "Activate tenant?")
        }
        description={
          tenant.isActive
            ? t(
                "tenant.deactivate.description",
                `"${tenant.name}" will lose access until reactivated.`,
                { name: tenant.name },
              )
            : t("tenant.activate.description", `"${tenant.name}" will regain access.`, {
                name: tenant.name,
              })
        }
        confirmLabel={
          tenant.isActive
            ? t("tenant.actions.deactivate", "Deactivate")
            : t("tenant.actions.activate", "Activate")
        }
        confirmVariant={tenant.isActive ? "destructive" : "primary"}
        loading={isSubmitting}
        onConfirm={confirmToggle}
      />
    </div>
  );
}
