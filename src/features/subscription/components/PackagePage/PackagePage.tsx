"use client";

import { useRouter } from "next/navigation";
import { AdminBreadcrumb, ContentPanel, PageContainer, PageHeader } from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import { PackageIdentityForm } from "@/features/subscription/components/PackagePage/PackageIdentityForm";
import { PackageDetailPage } from "@/features/subscription/components/PackageDetailPage";

export interface PackagePageProps {
  /** Absent ⇒ `action=insert`. Present ⇒ delegates to `PackageDetailPage`, which resolves `detail`/`update` from `?action=`. Mirrors `TenantPage`'s dispatch shape. */
  packageId?: string;
}

export function PackagePage({ packageId }: PackagePageProps) {
  const { t } = useAppTranslation();
  const router = useRouter();

  if (!packageId) {
    return (
      <PageContainer>
        <PageHeader
          title={t("subscription.create.title", "New package")}
          breadcrumb={
            <AdminBreadcrumb
              items={[
                { label: t("subscription.list.title", "Packages"), href: "/subscriptions" },
                { label: t("subscription.create.title", "New package") },
              ]}
            />
          }
        />
        <ContentPanel>
          <PackageIdentityForm
            mode="insert"
            onSuccess={(id) => router.push(`/subscriptions/${id}`)}
            onCancel={() => router.push("/subscriptions")}
          />
        </ContentPanel>
      </PageContainer>
    );
  }

  return <PackageDetailPage packageId={packageId} />;
}
