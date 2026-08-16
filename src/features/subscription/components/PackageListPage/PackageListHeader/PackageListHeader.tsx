import Link from "next/link";
import { AdminBreadcrumb, Button, PageHeader } from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";

export function PackageListHeader() {
  const { t } = useAppTranslation();

  return (
    <PageHeader
      title={t("subscription.list.title", "Packages")}
      description={t("subscription.list.description", "Manage NovaCore subscription packages.")}
      breadcrumb={<AdminBreadcrumb items={[{ label: t("subscription.list.title", "Packages") }]} />}
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/subscriptions/groups">{t("subscription.list.manageGroups", "Groups")}</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/subscriptions/tags">{t("subscription.list.manageTags", "Tags")}</Link>
          </Button>
          <Button asChild>
            <Link href="/subscriptions/new">{t("subscription.list.newPackage", "New package")}</Link>
          </Button>
        </div>
      }
    />
  );
}
