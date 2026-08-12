import { SearchInput, Select, Toolbar } from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import type { TenantStatusFilter } from "@/features/tenant/components/TenantListPage/useTenantListPage";

export interface TenantFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: TenantStatusFilter;
  onStatusFilterChange: (value: TenantStatusFilter) => void;
}

export function TenantFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: TenantFiltersProps) {
  const { t } = useAppTranslation();

  return (
    <Toolbar>
      <SearchInput
        value={search}
        onValueChange={onSearchChange}
        placeholder={t("tenant.list.searchPlaceholder", "Search by name or code")}
      />
      <Select
        value={statusFilter}
        onValueChange={(value) => onStatusFilterChange(value as TenantStatusFilter)}
        options={[
          { value: "all", label: t("tenant.list.statusAll", "All statuses") },
          { value: "active", label: t("tenant.list.statusActive", "Active") },
          { value: "inactive", label: t("tenant.list.statusInactive", "Inactive") },
        ]}
      />
    </Toolbar>
  );
}
