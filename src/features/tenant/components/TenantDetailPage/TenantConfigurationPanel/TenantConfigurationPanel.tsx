"use client";

import { Button, PageSection, Textarea } from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import { useTenantConfigurationPanel } from "@/features/tenant/components/TenantDetailPage/TenantConfigurationPanel/useTenantConfigurationPanel";
import type { TenantDetailDto } from "@/services/tenant";

export interface TenantConfigurationPanelProps {
  tenant: TenantDetailDto;
}

/** Configuration is a genuinely opaque JSON blob server-side (see docs/reference/domain-mapping.md) — a raw per-locale editor is the correct fit, not a fabricated schema-driven form. */
export function TenantConfigurationPanel({ tenant }: TenantConfigurationPanelProps) {
  const { t } = useAppTranslation();
  const slots = useTenantConfigurationPanel(tenant);

  return (
    <PageSection
      title={t("tenant.config.title", "Configuration")}
      description={t(
        "tenant.config.description",
        "Raw per-locale configuration served to this tenant's own application. The default (fallback) configuration applies wherever a language has no override.",
      )}
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {slots.map((slot) => (
          <div key={slot.key} className="flex flex-col gap-2 rounded-lg border border-border p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">{slot.label}</h3>
              <Button size="sm" onClick={slot.onSave} loading={slot.isSaving}>
                {t("common.actions.save", "Save")}
              </Button>
            </div>
            <Textarea
              value={slot.text}
              onChange={(event) => slot.onChangeText(event.target.value)}
              rows={12}
              className="font-mono text-xs"
              spellCheck={false}
            />
            {slot.parseError ? (
              <p role="alert" className="text-sm text-destructive">
                {slot.parseError}
              </p>
            ) : null}
            {slot.saveError ? (
              <p role="alert" className="text-sm text-destructive">
                {slot.saveError}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </PageSection>
  );
}
