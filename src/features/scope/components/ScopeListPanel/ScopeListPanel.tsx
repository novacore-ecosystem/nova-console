"use client";

import { PageSection } from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import { ScopeTable } from "@/features/scope/components/ScopeListPanel/ScopeTable";
import { useScopeListPanel } from "@/features/scope/components/ScopeListPanel/useScopeListPanel";

export interface ScopeListPanelProps {
  tenantId: string;
}

export function ScopeListPanel({ tenantId }: ScopeListPanelProps) {
  const { t } = useAppTranslation();
  const { scopes, isLoading, isError, refetch } = useScopeListPanel(tenantId);

  return (
    <PageSection
      title={t("scope.list.title", "Scopes")}
      description={t(
        "scope.list.description",
        "Branches, agencies, dealers, and regions for this tenant.",
      )}
    >
      <ScopeTable scopes={scopes} loading={isLoading} error={isError} onRetry={() => refetch()} />
    </PageSection>
  );
}
