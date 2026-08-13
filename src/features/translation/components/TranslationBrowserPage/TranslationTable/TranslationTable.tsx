import {
  Button,
  DataTable,
  type DataTableColumn,
  StatusBadge,
} from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import type { TranslationRow } from "@/features/translation/components/TranslationBrowserPage/useTranslationBrowserPage";

export interface TranslationTableProps {
  rows: TranslationRow[];
  onEdit: (key: string) => void;
  onReset: (key: string) => void;
}

export function TranslationTable({ rows, onEdit, onReset }: TranslationTableProps) {
  const { t } = useAppTranslation();

  const columns: DataTableColumn<TranslationRow>[] = [
    {
      id: "key",
      header: t("translation.table.key", "Key"),
      cell: (row) => <span className="font-mono text-xs">{row.key}</span>,
    },
    {
      id: "value",
      header: t("translation.table.value", "Value"),
      cell: (row) => row.overrideValue ?? row.baseValue,
    },
    {
      id: "status",
      header: "",
      cell: (row) =>
        row.overrideValue !== null ? (
          <StatusBadge label={t("translation.table.overridden", "Overridden")} tone="info" />
        ) : null,
    },
    {
      id: "actions",
      header: "",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => onEdit(row.key)}>
            {t("common.actions.edit", "Edit")}
          </Button>
          {row.overrideValue !== null ? (
            <Button variant="ghost" size="sm" onClick={() => onReset(row.key)}>
              {t("translation.actions.reset", "Reset")}
            </Button>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={rows}
      columns={columns}
      getRowId={(row) => row.key}
      loading={false}
      emptyMessage={t("translation.list.empty", "No keys found.")}
    />
  );
}
