import Link from "next/link";
import { AdminBreadcrumb, Button, PageHeader } from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";

export function TenantListHeader() {
  const { t } = useAppTranslation();

  return (
    <PageHeader
      title={t("tenant.list.title", "Tenants")}
      description={t("tenant.list.description", "Manage NovaCore tenants.")}
      breadcrumb={<AdminBreadcrumb items={[{ label: t("tenant.list.title", "Tenants") }]} />}
      actions={
        <Button asChild>
          <Link href="/tenants/new">{t("tenant.list.newTenant", "New tenant")}</Link>
        </Button>
      }
    />
  );
}
