import { Button, ShellPageHeader } from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";

export interface TenantListHeaderProps {
  onCreateClick: () => void;
}

export function TenantListHeader({ onCreateClick }: TenantListHeaderProps) {
  const { t } = useAppTranslation();

  return (
    <ShellPageHeader
      title={t("tenant.list.title", "Tenants")}
      description={t("tenant.list.description", "Manage NovaCore tenants.")}
      actions={<Button onClick={onCreateClick}>{t("tenant.list.newTenant", "New tenant")}</Button>}
    />
  );
}
