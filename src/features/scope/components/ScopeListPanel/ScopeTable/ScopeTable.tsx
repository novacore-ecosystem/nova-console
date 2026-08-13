import { DataTable, type DataTableColumn, StatusBadge } from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import { ScopeActions } from "@/features/scope/components/ScopeListPanel/ScopeActions";
import type { ScopeRecord } from "@/services/scope";

export interface ScopeTableProps {
  scopes: ScopeRecord[];
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  onEdit: (scope: ScopeRecord) => void;
}

export function ScopeTable({ scopes, loading, error, onRetry, onEdit }: ScopeTableProps) {
  const { t } = useAppTranslation();

  const columns: DataTableColumn<ScopeRecord>[] = [
    { id: "path", header: t("scope.table.path", "Path") },
    { id: "name", header: t("scope.table.name", "Name") },
    { id: "code", header: t("scope.table.code", "Code") },
    {
      id: "status",
      header: t("scope.table.status", "Status"),
      cell: (scope) =>
        scope.isActive ? (
          <StatusBadge label={t("scope.status.active", "Active")} tone="success" />
        ) : (
          <StatusBadge label={t("scope.status.inactive", "Inactive")} tone="neutral" />
        ),
    },
    {
      id: "actions",
      header: "",
      cell: (scope) => <ScopeActions scope={scope} onEdit={onEdit} />,
    },
  ];

  return (
    <DataTable
      data={scopes}
      columns={columns}
      getRowId={(scope) => scope.id}
      loading={loading}
      error={error ? t("scope.list.loadError", "Failed to load scopes.") : undefined}
      onRetry={onRetry}
      emptyMessage={t("scope.list.empty", "No scopes found.")}
    />
  );
}
