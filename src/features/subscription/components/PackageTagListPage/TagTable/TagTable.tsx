import { Button, DataTable, type DataTableColumn } from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import type { PackageTagDto } from "@/services/subscription";

export interface TagTableProps {
  tags: PackageTagDto[];
  loading: boolean;
  onEdit: (tag: PackageTagDto) => void;
  onDelete: (tag: PackageTagDto) => void;
}

export function TagTable({ tags, loading, onEdit, onDelete }: TagTableProps) {
  const { t } = useAppTranslation();

  const columns: DataTableColumn<PackageTagDto>[] = [
    { id: "name", header: t("subscription.form.name", "Name") },
    {
      id: "actions",
      header: "",
      cell: (tag) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => onEdit(tag)}>
            {t("common.actions.edit", "Edit")}
          </Button>
          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => onDelete(tag)}>
            {t("common.actions.delete", "Delete")}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={tags}
      columns={columns}
      getRowId={(tag) => tag.id}
      loading={loading}
      emptyMessage={t("subscription.tag.empty", "No tags yet.")}
    />
  );
}
