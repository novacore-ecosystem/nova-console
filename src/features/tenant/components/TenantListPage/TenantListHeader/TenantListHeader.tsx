import { ShellPageHeader } from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";

export function TenantListHeader() {
  const { t } = useAppTranslation();

  return (
    <ShellPageHeader
      title={t("tenant.list.title", "Tenants")}
      description={t("tenant.list.description", "Manage NovaCore tenants.")}
    />
  );
}
