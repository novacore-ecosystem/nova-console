import { Button, DataTable, type DataTableColumn } from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import type { PackageGroupDto } from "@/services/subscription";

export interface GroupTableProps {
  groups: PackageGroupDto[];
  loading: boolean;
  onEdit: (group: PackageGroupDto) => void;
  onDelete: (group: PackageGroupDto) => void;
}

export function GroupTable({ groups, loading, onEdit, onDelete }: GroupTableProps) {
  const { t } = useAppTranslation();

  const columns: DataTableColumn<PackageGroupDto>[] = [
    { id: "name", header: t("subscription.form.name", "Name") },
    {
      id: "description",
      header: t("subscription.form.description", "Description"),
      cell: (group) => group.description ?? "—",
    },
    {
      id: "actions",
      header: "",
      cell: (group) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => onEdit(group)}>
            {t("common.actions.edit", "Edit")}
          </Button>
          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => onDelete(group)}>
            {t("common.actions.delete", "Delete")}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={groups}
      columns={columns}
      getRowId={(group) => group.id}
      loading={loading}
      emptyMessage={t("subscription.group.empty", "No groups yet.")}
    />
  );
}
