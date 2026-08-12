import { DataTable, type DataTableColumn, StatusBadge } from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import type { TenantRecord } from "@/services/tenant";

export interface TenantTableProps {
  tenants: TenantRecord[];
  loading: boolean;
  error: boolean;
  onRetry: () => void;
}

export function TenantTable({ tenants, loading, error, onRetry }: TenantTableProps) {
  const { t } = useAppTranslation();

  const columns: DataTableColumn<TenantRecord>[] = [
    { id: "code", header: t("tenant.table.code", "Code") },
    { id: "name", header: t("tenant.table.name", "Name") },
    {
      id: "status",
      header: t("tenant.table.status", "Status"),
      cell: (tenant) =>
        tenant.isActive ? (
          <StatusBadge label={t("tenant.status.active", "Active")} tone="success" />
        ) : (
          <StatusBadge label={t("tenant.status.inactive", "Inactive")} tone="neutral" />
        ),
    },
  ];

  return (
    <DataTable
      data={tenants}
      columns={columns}
      getRowId={(tenant) => tenant.id}
      loading={loading}
      error={error ? t("tenant.list.loadError", "Failed to load tenants.") : undefined}
      onRetry={onRetry}
      emptyMessage={t("tenant.list.empty", "No tenants found.")}
    />
  );
}
