import { SearchInput, Toolbar } from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";

export interface PackageFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  isFetching: boolean;
}

export function PackageFilters({ search, onSearchChange, isFetching }: PackageFiltersProps) {
  const { t } = useAppTranslation();

  return (
    <Toolbar>
      <SearchInput
        value={search}
        onValueChange={onSearchChange}
        placeholder={t("subscription.list.searchPlaceholder", "Search by name")}
        aria-busy={isFetching}
      />
    </Toolbar>
  );
}
