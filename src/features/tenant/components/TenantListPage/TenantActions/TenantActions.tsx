import { Button } from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import type { TenantRecord } from "@/services/tenant";

export interface TenantActionsProps {
  tenant: TenantRecord;
  onEdit: (tenant: TenantRecord) => void;
}

export function TenantActions({ tenant, onEdit }: TenantActionsProps) {
  const { t } = useAppTranslation();

  return (
    <Button variant="ghost" size="sm" onClick={() => onEdit(tenant)}>
      {t("common.actions.edit", "Edit")}
    </Button>
  );
}
