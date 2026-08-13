import { Button } from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import type { ScopeRecord } from "@/services/scope";

export interface ScopeActionsProps {
  scope: ScopeRecord;
  onEdit: (scope: ScopeRecord) => void;
}

export function ScopeActions({ scope, onEdit }: ScopeActionsProps) {
  const { t } = useAppTranslation();

  return (
    <Button variant="ghost" size="sm" onClick={() => onEdit(scope)}>
      {t("common.actions.edit", "Edit")}
    </Button>
  );
}
