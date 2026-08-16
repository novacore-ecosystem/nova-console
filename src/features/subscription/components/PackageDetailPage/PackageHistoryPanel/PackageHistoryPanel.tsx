import { formatDateTime } from "@novacore/frontend-foundation";
import { DataTable, type DataTableColumn } from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import type { PackageHistoryEntryDto } from "@/services/subscription";

export interface PackageHistoryPanelProps {
  history: PackageHistoryEntryDto[];
}

/** Read-only — no write path exists (or is planned) for history; entries are appended automatically by the create/update mutations (see subscription.dev-adapter.ts). */
export function PackageHistoryPanel({ history }: PackageHistoryPanelProps) {
  const { t } = useAppTranslation();

  const columns: DataTableColumn<PackageHistoryEntryDto>[] = [
    {
      id: "changedAt",
      header: t("subscription.history.changedAt", "When"),
      cell: (entry) => formatDateTime(entry.changedAt),
    },
    { id: "changedBy", header: t("subscription.history.changedBy", "Who") },
    { id: "summary", header: t("subscription.history.summary", "Change") },
  ];

  return (
    <DataTable
      data={[...history].reverse()}
      columns={columns}
      getRowId={(entry) => entry.id}
      loading={false}
      emptyMessage={t("subscription.history.empty", "No history yet.")}
    />
  );
}
