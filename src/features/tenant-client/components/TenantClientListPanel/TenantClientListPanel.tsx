import { PageSection } from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import { TenantClientTable } from "@/features/tenant-client/components/TenantClientListPanel/TenantClientTable";
import { TenantClientRotateAction } from "@/features/tenant-client/components/TenantClientListPanel/TenantClientRotateAction";
import type { TenantClientSummaryDto } from "@/services/tenant";

export interface TenantClientListPanelProps {
  tenantId: string;
  clients: TenantClientSummaryDto[];
}

/**
 * Clients are embedded in `GetTenant` (`TenantDetailDto.clients`), never fetched
 * standalone — there is no list/create/revoke endpoint, only rotate. See
 * docs/reference/domain-mapping.md's TenantClient section.
 */
export function TenantClientListPanel({ tenantId, clients }: TenantClientListPanelProps) {
  const { t } = useAppTranslation();

  return (
    <PageSection
      title={t("tenantClient.list.title", "Client key")}
      description={t(
        "tenantClient.list.description",
        "The pre-login client identification key (X-Tenant-Client-Key) this tenant's own application uses to resolve itself before a user logs in.",
      )}
      actions={<TenantClientRotateAction tenantId={tenantId} />}
    >
      <TenantClientTable clients={clients} />
    </PageSection>
  );
}
