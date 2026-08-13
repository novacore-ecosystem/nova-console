"use client";

import { PageContainer, ShellPageHeader } from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import { TenantClientListPanel } from "@/features/tenant-client/components/TenantClientListPanel";

/** Root TenantClient keys only (TenantId = null) — per-tenant keys live on the Tenant detail page's "Keys" tab. */
export function SecurityPage() {
  const { t } = useAppTranslation();

  return (
    <PageContainer>
      <ShellPageHeader
        title={t("security.title", "Security")}
        description={t(
          "security.description",
          "Root client keys used for pre-login tenant resolution.",
        )}
      />
      <TenantClientListPanel tenantId={null} />
    </PageContainer>
  );
}
