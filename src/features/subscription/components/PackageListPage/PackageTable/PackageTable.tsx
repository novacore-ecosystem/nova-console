import Link from "next/link";
import {
  Badge,
  DataTable,
  StatusBadge,
  type DataTableColumn,
  type DataTablePaginationState,
} from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import type { PackageGroupDto, PackageSummaryDto, PackageTagDto } from "@/services/subscription";

export interface PackageTableProps {
  packages: PackageSummaryDto[];
  groups: PackageGroupDto[];
  tags: PackageTagDto[];
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  pagination?: DataTablePaginationState;
  onPaginationChange?: (pagination: DataTablePaginationState) => void;
}

export function PackageTable({
  packages,
  groups,
  tags,
  loading,
  error,
  onRetry,
  pagination,
  onPaginationChange,
}: PackageTableProps) {
  const { t } = useAppTranslation();
  const groupName = (id: string | null) => groups.find((group) => group.id === id)?.name ?? "—";
  const tagNames = (ids: string[]) => tags.filter((tag) => ids.includes(tag.id));

  const columns: DataTableColumn<PackageSummaryDto>[] = [
    {
      id: "name",
      header: t("subscription.table.name", "Name"),
      cell: (pkg) => (
        <Link href={`/subscriptions/${pkg.id}`} className="font-medium underline-offset-4 hover:underline">
          {pkg.name}
        </Link>
      ),
    },
    { id: "group", header: t("subscription.table.group", "Group"), cell: (pkg) => groupName(pkg.groupId) },
    {
      id: "tags",
      header: t("subscription.table.tags", "Tags"),
      cell: (pkg) => (
        <div className="flex flex-wrap gap-1">
          {tagNames(pkg.tagIds).map((tag) => (
            <Badge key={tag.id} variant="secondary">
              {tag.name}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      id: "status",
      header: t("subscription.table.status", "Status"),
      cell: (pkg) =>
        pkg.status === "active" ? (
          <StatusBadge label={t("subscription.status.active", "Active")} tone="success" />
        ) : (
          <StatusBadge label={t("subscription.status.archived", "Archived")} tone="neutral" />
        ),
    },
  ];

  return (
    <DataTable
      data={packages}
      columns={columns}
      getRowId={(pkg) => pkg.id}
      loading={loading}
      error={error ? t("subscription.list.loadError", "Failed to load packages.") : undefined}
      onRetry={onRetry}
      emptyMessage={t("subscription.list.empty", "No packages found.")}
      pagination={pagination}
      onPaginationChange={onPaginationChange}
    />
  );
}
