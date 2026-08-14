import Link from "next/link";
import {
  DataTable,
  type DataTableColumn,
  type DataTablePaginationState,
  StatusBadge,
} from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import { TenantActions } from "@/features/tenant/components/TenantListPage/TenantActions";
import type { TenantSummaryDto } from "@/services/tenant";

export interface TenantTableProps {
  tenants: TenantSummaryDto[];
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  pagination?: DataTablePaginationState;
  onPaginationChange?: (pagination: DataTablePaginationState) => void;
}

export function TenantTable({
  tenants,
  loading,
  error,
  onRetry,
  pagination,
  onPaginationChange,
}: TenantTableProps) {
  const { t } = useAppTranslation();

  const columns: DataTableColumn<TenantSummaryDto>[] = [
    { id: "code", header: t("tenant.table.code", "Code") },
    {
      id: "name",
      header: t("tenant.table.name", "Name"),
      cell: (tenant) => (
        <Link
          href={`/tenants/${tenant.id}`}
          className="font-medium underline-offset-4 hover:underline"
        >
          {tenant.name}
        </Link>
      ),
    },
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
    {
      id: "actions",
      header: "",
      cell: (tenant) => <TenantActions tenant={tenant} />,
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
      pagination={pagination}
      onPaginationChange={onPaginationChange}
    />
  );
}
