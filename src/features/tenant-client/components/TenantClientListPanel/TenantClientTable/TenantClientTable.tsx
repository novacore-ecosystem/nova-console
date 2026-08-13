import {
  DataTable,
  type DataTableColumn,
  StatusBadge,
  type StatusTone,
} from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import { TenantClientActions } from "@/features/tenant-client/components/TenantClientListPanel/TenantClientActions";
import type { TenantClientRecord, TenantClientStatus } from "@/services/tenant-client";

const STATUS_TONE: Record<TenantClientStatus, StatusTone> = {
  active: "success",
  revoked: "destructive",
  expired: "neutral",
};

function maskKey(key: string): string {
  return `••••••••${key.slice(-4)}`;
}

export interface TenantClientTableProps {
  clients: TenantClientRecord[];
  loading: boolean;
  error: boolean;
  onRetry: () => void;
}

export function TenantClientTable({ clients, loading, error, onRetry }: TenantClientTableProps) {
  const { t } = useAppTranslation();

  const columns: DataTableColumn<TenantClientRecord>[] = [
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
          label={t(`tenantClient.status.${client.status}`, client.status)}
          tone={STATUS_TONE[client.status]}
        />
      ),
    },
    {
      id: "actions",
      header: "",
      cell: (client) => <TenantClientActions client={client} />,
    },
  ];

  return (
    <DataTable
      data={clients}
      columns={columns}
      getRowId={(client) => client.id}
      loading={loading}
      error={error ? t("tenantClient.list.loadError", "Failed to load keys.") : undefined}
      onRetry={onRetry}
      emptyMessage={t("tenantClient.list.empty", "No keys found.")}
    />
  );
}
