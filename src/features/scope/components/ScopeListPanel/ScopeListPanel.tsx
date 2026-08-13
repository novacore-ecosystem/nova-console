"use client";

import { Button, PageSection } from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import { ScopeTable } from "@/features/scope/components/ScopeListPanel/ScopeTable";
import { ScopeFormDialog } from "@/features/scope/components/ScopeListPanel/ScopeFormDialog";
import { ScopeEditDialog } from "@/features/scope/components/ScopeListPanel/ScopeEditDialog";
import { useScopeListPanel } from "@/features/scope/components/ScopeListPanel/useScopeListPanel";

export interface ScopeListPanelProps {
  tenantId: string;
}

export function ScopeListPanel({ tenantId }: ScopeListPanelProps) {
  const { t } = useAppTranslation();
  const {
    scopes,
    isLoading,
    isError,
    refetch,
    isCreateDialogOpen,
    openCreateDialog,
    setCreateDialogOpen,
    editingScope,
    openEditDialog,
    closeEditDialog,
  } = useScopeListPanel(tenantId);

  return (
    <PageSection
      title={t("scope.list.title", "Scopes")}
      description={t(
        "scope.list.description",
        "Branches, agencies, dealers, and regions for this tenant.",
      )}
      actions={<Button onClick={openCreateDialog}>{t("scope.list.newScope", "New scope")}</Button>}
    >
      <ScopeTable
        scopes={scopes}
        loading={isLoading}
        error={isError}
        onRetry={() => refetch()}
        onEdit={openEditDialog}
      />
      <ScopeFormDialog
        tenantId={tenantId}
        scopes={scopes}
        open={isCreateDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
      {editingScope ? (
        <ScopeEditDialog key={editingScope.id} scope={editingScope} onClose={closeEditDialog} />
      ) : null}
    </PageSection>
  );
}
