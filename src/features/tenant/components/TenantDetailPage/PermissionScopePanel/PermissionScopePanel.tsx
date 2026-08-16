import Link from "next/link";
import { Badge, Button, EmptyState, PageSection, SkeletonList } from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import { usePermissionScopePanel } from "@/features/tenant/components/TenantDetailPage/PermissionScopePanel/usePermissionScopePanel";

export interface PermissionScopePanelProps {
  tenantId: string;
}

/**
 * Read-only by construction — no `onChange`, no mutation. Auditing/navigation only; actual
 * grant/revoke happens on the dedicated Tenant Permission Management page (see
 * docs brief section 2.3: "must NOT directly modify the tenant's permission scope").
 * Distinct from the existing org-unit "Scopes" tab (`features/scope`) — this is the
 * permission-grant summary described in the brief, not branches/agencies/dealers.
 */
export function PermissionScopePanel({ tenantId }: PermissionScopePanelProps) {
  const { t } = useAppTranslation();
  const { groups, grantedCount, isLoading, isError } = usePermissionScopePanel(tenantId);

  return (
    <PageSection
      title={t("tenantPermission.summary.title", "Permission scope")}
      description={t(
        "tenantPermission.summary.description",
        "What this tenant is currently permitted to use — granted by Root.",
      )}
      actions={
        <Button asChild variant="outline" size="sm">
          <Link href={`/tenants/${tenantId}/permissions`}>
            {t("tenantPermission.summary.manage", "Manage permissions")}
          </Link>
        </Button>
      }
    >
      {isLoading ? (
        <SkeletonList rows={3} />
      ) : isError ? (
        <EmptyState description={t("tenantPermission.summary.loadError", "Failed to load permission scope.")} />
      ) : grantedCount === 0 ? (
        <EmptyState
          description={t("tenantPermission.summary.empty", "No permissions granted to this tenant yet.")}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {groups.map((group) => (
            <div key={group.id} className="flex flex-wrap items-center gap-1.5 text-sm">
              <span className="font-medium">{group.label}</span>
              {group.keys.map((key) => (
                <Badge key={key} variant="secondary">
                  {key}
                </Badge>
              ))}
            </div>
          ))}
        </div>
      )}
    </PageSection>
  );
}
