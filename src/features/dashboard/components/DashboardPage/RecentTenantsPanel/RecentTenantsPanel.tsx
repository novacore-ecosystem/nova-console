import Link from "next/link";
import { ErrorState, PageSection, SkeletonList, StatusBadge } from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import type { TenantSummaryDto } from "@/features/tenant";

export interface RecentTenantsPanelProps {
  tenants: TenantSummaryDto[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export function RecentTenantsPanel({ tenants, isLoading, isError, onRetry }: RecentTenantsPanelProps) {
  const { t } = useAppTranslation();

  return (
    <PageSection
      title={t("dashboard.recentTenants.title", "Recent tenants")}
      actions={
        <Link href="/tenants" className="text-sm underline-offset-4 hover:underline">
          {t("dashboard.recentTenants.viewAll", "View all")}
        </Link>
      }
    >
      {isLoading ? (
        <SkeletonList rows={4} />
      ) : isError ? (
        <ErrorState
          description={t("dashboard.recentTenants.loadError", "Failed to load tenants.")}
          onRetry={onRetry}
        />
      ) : (
        <ul className="divide-y divide-border rounded-lg border border-border">
          {tenants.map((tenant) => (
            <li key={tenant.id} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
              <Link href={`/tenants/${tenant.id}`} className="font-medium underline-offset-4 hover:underline">
                {tenant.name}
              </Link>
              <span className="text-muted-foreground">{tenant.code}</span>
              {tenant.isActive ? (
                <StatusBadge label={t("tenant.status.active", "Active")} tone="success" />
              ) : (
                <StatusBadge label={t("tenant.status.inactive", "Inactive")} tone="neutral" />
              )}
            </li>
          ))}
        </ul>
      )}
    </PageSection>
  );
}
