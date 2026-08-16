"use client";

import {
  AdminBreadcrumb,
  Button,
  ContentPanel,
  ErrorState,
  LoadingState,
  PageContainer,
  PageHeader,
  StatusBadge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import { usePackageDetailPage } from "@/features/subscription/components/PackageDetailPage/usePackageDetailPage";
import { PackageOverviewPanel } from "@/features/subscription/components/PackageDetailPage/PackageOverviewPanel";
import { PackageHistoryPanel } from "@/features/subscription/components/PackageDetailPage/PackageHistoryPanel";
import { PackageIdentityForm } from "@/features/subscription/components/PackagePage/PackageIdentityForm";

export interface PackageDetailPageProps {
  packageId: string;
}

export function PackageDetailPage({ packageId }: PackageDetailPageProps) {
  const { t } = useAppTranslation();
  const { pkg, groups, tags, isLoading, isError, action, startEditing, stopEditing } =
    usePackageDetailPage(packageId);

  if (isLoading) return <LoadingState />;
  if (isError || !pkg) return <ErrorState title={t("subscription.detail.notFound", "Package not found.")} />;

  return (
    <PageContainer>
      <PageHeader
        title={pkg.name}
        breadcrumb={
          <AdminBreadcrumb
            items={[{ label: t("subscription.list.title", "Packages"), href: "/subscriptions" }, { label: pkg.name }]}
          />
        }
        actions={
          <div className="flex items-center gap-2">
            {pkg.status === "active" ? (
              <StatusBadge label={t("subscription.status.active", "Active")} tone="success" />
            ) : (
              <StatusBadge label={t("subscription.status.archived", "Archived")} tone="neutral" />
            )}
            {action === "detail" ? (
              <Button variant="outline" size="sm" onClick={startEditing}>
                {t("common.actions.edit", "Edit")}
              </Button>
            ) : null}
          </div>
        }
      />
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">{t("subscription.detail.tabOverview", "Overview")}</TabsTrigger>
          <TabsTrigger value="history">{t("subscription.detail.tabHistory", "History")}</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          {action === "update" ? (
            <ContentPanel>
              <PackageIdentityForm mode="update" pkg={pkg} onSuccess={stopEditing} onCancel={stopEditing} />
            </ContentPanel>
          ) : (
            <PackageOverviewPanel pkg={pkg} groups={groups} tags={tags} />
          )}
        </TabsContent>
        <TabsContent value="history">
          <PackageHistoryPanel history={pkg.history} />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
