"use client";

import { Button, ConfirmDialog } from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import { useScopeActions } from "@/features/scope/components/ScopeListPanel/ScopeActions/useScopeActions";
import type { ScopeRecord } from "@/services/scope";

export interface ScopeActionsProps {
  scope: ScopeRecord;
  onEdit: (scope: ScopeRecord) => void;
}

export function ScopeActions({ scope, onEdit }: ScopeActionsProps) {
  const { t } = useAppTranslation();
  const { isConfirmOpen, openConfirm, setConfirmOpen, confirmToggle, isSubmitting } =
    useScopeActions(scope);

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" onClick={() => onEdit(scope)}>
        {t("common.actions.edit", "Edit")}
      </Button>
      <Button variant="ghost" size="sm" onClick={openConfirm}>
        {scope.isActive
          ? t("scope.actions.deactivate", "Deactivate")
          : t("scope.actions.activate", "Activate")}
      </Button>
      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setConfirmOpen}
        title={
          scope.isActive
            ? t("scope.deactivate.title", "Deactivate scope?")
            : t("scope.activate.title", "Activate scope?")
        }
        description={
          scope.isActive
            ? t("scope.deactivate.description", `"${scope.name}" will be deactivated.`, {
                name: scope.name,
              })
            : t("scope.activate.description", `"${scope.name}" will be activated.`, {
                name: scope.name,
              })
        }
        confirmLabel={
          scope.isActive
            ? t("scope.actions.deactivate", "Deactivate")
            : t("scope.actions.activate", "Activate")
        }
        confirmVariant={scope.isActive ? "destructive" : "primary"}
        loading={isSubmitting}
        onConfirm={confirmToggle}
      />
    </div>
  );
}
