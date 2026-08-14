import { formatDateTime } from "@novacore/frontend-foundation";
import { DataTable, type DataTableColumn, StatusBadge, type StatusTone } from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import type { TenantClientSummaryDto } from "@/services/tenant";

const STATUS_TONE: Record<string, StatusTone> = {
  Active: "success",
  Revoked: "destructive",
  Expired: "neutral",
};

function maskKey(key: string): string {
  return `••••••••${key.slice(-4)}`;
}

export interface TenantClientTableProps {
  clients: TenantClientSummaryDto[];
}

/** Read-only — clients only ever change via rotation (see TenantClientRotateAction), never a per-row action. */
export function TenantClientTable({ clients }: TenantClientTableProps) {
  const { t } = useAppTranslation();

  const columns: DataTableColumn<TenantClientSummaryDto>[] = [
    { id: "name", header: t("tenantClient.table.name", "Name") },
    {
      id: "publicKey",
      header: t("tenantClient.table.key", "Key"),
      cell: (client) => <span className="font-mono text-xs">{maskKey(client.publicKey)}</span>,
    },
    {
      id: "status",
      header: t("tenantClient.table.status", "Status"),
      cell: (client) => (
        <StatusBadge
          label={t(`tenantClient.status.${client.status.toLowerCase()}`, client.status)}
          tone={STATUS_TONE[client.status] ?? "neutral"}
        />
      ),
    },
    {
      id: "expiresAt",
      header: t("tenantClient.table.expiresAt", "Expires"),
      cell: (client) =>
        client.expiresAt
          ? formatDateTime(client.expiresAt)
          : t("tenantClient.table.noExpiry", "Never"),
    },
    {
      id: "revokedAt",
      header: t("tenantClient.table.revokedAt", "Revoked"),
      cell: (client) => (client.revokedAt ? formatDateTime(client.revokedAt) : "—"),
    },
  ];

  return (
    <DataTable
      data={clients}
      columns={columns}
      getRowId={(client) => client.id}
      loading={false}
      emptyMessage={t("tenantClient.list.empty", "No keys found.")}
    />
  );
}
