import type { CriteriaFilter, CriteriaSort } from "@novacore/frontend-foundation";
import { AdvancedFilter, AdvancedSort, ColumnVisibility, FilterToolbar, SearchInput } from "@novacore/frontend-next-shadcn";

import {
  TENANT_COLUMNS,
  TENANT_FILTER_FIELDS,
  TENANT_SORT_FIELDS,
} from "@/features/tenant/components/TenantListPage/tenant-list.config";
import { useAppTranslation } from "@/shared/i18n";

export interface TenantFiltersProps {
  className: string | undefined;
  search: string;
  onSearchChange: (value: string) => void;
  isFetching: boolean;
  filters: CriteriaFilter[];
  onFiltersChange: (filters: CriteriaFilter[]) => void;
  sorts: CriteriaSort[];
  onSortsChange: (sorts: CriteriaSort[]) => void;
  hiddenColumns: string[];
  onHiddenColumnsChange: (hidden: string[]) => void;
  onClearHiddenColumns: () => void;
}

export function TenantFilters({
  className,
  search,
  onSearchChange,
  isFetching,
  filters,
  onFiltersChange,
  sorts,
  onSortsChange,
  hiddenColumns,
  onHiddenColumnsChange,
  onClearHiddenColumns,
}: TenantFiltersProps) {
  const { t } = useAppTranslation();

  return (
    <FilterToolbar
      className={className}
      search={
        <SearchInput
          value={search}
          onValueChange={onSearchChange}
          placeholder={t("tenant.list.searchPlaceholder", "Search by name or code")}
          aria-busy={isFetching}
        />
      }
      filters={
        <>
          <AdvancedFilter
            fields={TENANT_FILTER_FIELDS}
            value={filters}
            onApply={onFiltersChange}
            triggerLabel={t("common.filters.advanced", "Filter")}
          />
          <AdvancedSort
            fields={TENANT_SORT_FIELDS}
            value={sorts}
            onApply={onSortsChange}
            triggerLabel={t("common.sort.advanced", "Sort")}
          />
          <ColumnVisibility
            columns={TENANT_COLUMNS}
            hidden={hiddenColumns}
            onHiddenChange={onHiddenColumnsChange}
            onClear={onClearHiddenColumns}
            triggerLabel={t("common.columns", "Columns")}
          />
        </>
      }
    />
  );
}
