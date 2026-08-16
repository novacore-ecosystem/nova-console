"use client";

import { useRouter } from "next/navigation";
import { AdminBreadcrumb, ContentPanel, PageContainer, PageHeader } from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import { TenantIdentityForm } from "@/features/tenant/components/TenantPage/TenantIdentityForm";
import { TenantDetailPage } from "@/features/tenant/components/TenantDetailPage";

export interface TenantPageProps {
  /** Absent ⇒ `action=insert`. Present ⇒ delegates to `TenantDetailPage`, which resolves `detail`/`update` from the `?action=` query param. */
  tenantId?: string;
}

/**
 * Dispatches on the target IA's `TenantPage` action architecture (insert/update/detail) —
 * insert has no tenant to load yet, so it's handled directly here; detail/update both need
 * a loaded tenant and the existing tabbed shell, so they delegate to `TenantDetailPage`.
 */
export function TenantPage({ tenantId }: TenantPageProps) {
  const { t } = useAppTranslation();
  const router = useRouter();

  if (!tenantId) {
    return (
      <PageContainer>
        <PageHeader
          title={t("tenant.create.title", "New tenant")}
          breadcrumb={
            <AdminBreadcrumb
              items={[
                { label: t("tenant.list.title", "Tenants"), href: "/tenants" },
                { label: t("tenant.create.title", "New tenant") },
              ]}
            />
          }
        />
        <ContentPanel>
          <TenantIdentityForm
            mode="insert"
            onSuccess={(id) => router.push(`/tenants/${id}`)}
            onCancel={() => router.push("/tenants")}
          />
        </ContentPanel>
      </PageContainer>
    );
  }

  return <TenantDetailPage tenantId={tenantId} />;
}
