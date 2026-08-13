"use client";

import { ContentPanel, PageContainer, ShellPageHeader } from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";

export function OverviewPage() {
  const { t } = useAppTranslation();

  return (
    <PageContainer>
      <ShellPageHeader
        title={t("app.name", "Nova Console")}
        description={t("app.description", "NovaCore's central administration console")}
      />
      <ContentPanel>
        <p>
          {t(
            "overview.summary",
            "Manage tenants, scopes, client keys, and localization from the navigation on the left.",
          )}
        </p>
      </ContentPanel>
    </PageContainer>
  );
}
