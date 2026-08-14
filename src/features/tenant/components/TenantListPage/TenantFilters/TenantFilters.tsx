import { SearchInput, Toolbar } from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";

export interface TenantFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  isFetching: boolean;
}

export function TenantFilters({ search, onSearchChange, isFetching }: TenantFiltersProps) {
  const { t } = useAppTranslation();

  return (
    <Toolbar>
      <SearchInput
        value={search}
        onValueChange={onSearchChange}
        placeholder={t("tenant.list.searchPlaceholder", "Search by name or code")}
        aria-busy={isFetching}
      />
    </Toolbar>
  );
}
