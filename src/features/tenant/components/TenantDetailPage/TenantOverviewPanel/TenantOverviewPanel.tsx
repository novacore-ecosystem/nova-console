"use client";

import {
  Button,
  ConfirmDialog,
  ContentPanel,
  PageSection,
  RelativeTime,
  StatusBadge,
} from "@novacore/frontend-next-shadcn";

import { useAppTranslation, useLocale } from "@/shared/i18n";
import { useTenantOverviewPanel } from "@/features/tenant/components/TenantDetailPage/TenantOverviewPanel/useTenantOverviewPanel";
import type { TenantDetailDto } from "@/services/tenant";

export interface TenantOverviewPanelProps {
  tenant: TenantDetailDto;
}

export function TenantOverviewPanel({ tenant }: TenantOverviewPanelProps) {
  const { t } = useAppTranslation();
  const { locale } = useLocale();
  const {
    isDisableConfirmOpen,
    openDisableConfirm,
    setDisableConfirmOpen,
    confirmDisable,
    isDisabling,
    disableError,
    isDeleteConfirmOpen,
    openDeleteConfirm,
    setDeleteConfirmOpen,
    confirmDelete,
    isDeleting,
    deleteError,
  } = useTenantOverviewPanel(tenant);

  return (
    <PageSection
      title={t("tenant.overview.title", "Identity")}
      actions={
        <div className="flex items-center gap-2">
          {tenant.isActive ? (
            <Button variant="outline" size="sm" onClick={openDisableConfirm}>
              {t("tenant.actions.disable", "Disable")}
            </Button>
          ) : null}
          <Button
            variant="outline"
            size="sm"
            className="text-destructive"
            onClick={openDeleteConfirm}
          >
            {t("common.actions.delete", "Delete")}
          </Button>
        </div>
      }
    >
      <ContentPanel>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-5 text-sm md:grid-cols-3">
          <div>
            <dt className="text-muted-foreground">{t("tenant.form.code", "Code")}</dt>
            <dd className="font-mono">{tenant.code}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{t("tenant.form.name", "Name")}</dt>
            <dd>{tenant.name}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{t("tenant.table.status", "Status")}</dt>
            <dd>
              {tenant.isActive ? (
                <StatusBadge label={t("tenant.status.active", "Active")} tone="success" />
              ) : (
                <StatusBadge label={t("tenant.status.inactive", "Inactive")} tone="neutral" />
              )}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">
              {t("tenant.overview.version", "Bootstrap version")}
            </dt>
            <dd>{tenant.version}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{t("tenant.overview.createdAt", "Created")}</dt>
            <dd>
              <RelativeTime date={tenant.createdAt} mode="absolute" locale={locale} />
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{t("tenant.overview.updatedAt", "Updated")}</dt>
            <dd>
              <RelativeTime date={tenant.updatedAt} mode="absolute" locale={locale} />
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{t("tenant.form.logoUrl", "Logo")}</dt>
            <dd className="flex items-center gap-2">
              {tenant.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={tenant.logoUrl} alt="" className="h-6 w-6 rounded object-contain" />
              ) : null}
              <span className="truncate text-muted-foreground">
                {tenant.logoUrl ?? t("tenant.overview.none", "Not set")}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{t("tenant.form.faviconUrl", "Favicon")}</dt>
            <dd className="flex items-center gap-2">
              {tenant.faviconUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={tenant.faviconUrl} alt="" className="h-4 w-4 rounded object-contain" />
              ) : null}
              <span className="truncate text-muted-foreground">
                {tenant.faviconUrl ?? t("tenant.overview.none", "Not set")}
              </span>
            </dd>
          </div>
        </dl>
      </ContentPanel>

      <ConfirmDialog
        open={isDisableConfirmOpen}
        onOpenChange={setDisableConfirmOpen}
        title={t("tenant.disable.title", "Disable tenant?")}
        description={t(
          "tenant.disable.description",
          `"${tenant.name}" will lose access immediately. It can only be re-enabled by contacting engineering — there is no self-service re-enable yet.`,
          { name: tenant.name },
        )}
        confirmLabel={t("tenant.actions.disable", "Disable")}
        confirmVariant="destructive"
        loading={isDisabling}
        error={disableError}
        onConfirm={confirmDisable}
      />

      <ConfirmDialog
        open={isDeleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title={t("tenant.delete.title", "Delete tenant?")}
        description={t(
          "tenant.delete.description",
          `"${tenant.name}" will be permanently removed from the tenant list. This cannot be undone.`,
          { name: tenant.name },
        )}
        confirmLabel={t("common.actions.delete", "Delete")}
        confirmVariant="destructive"
        loading={isDeleting}
        error={deleteError}
        onConfirm={confirmDelete}
      />
    </PageSection>
  );
}
