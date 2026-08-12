import { ContentPanel, PageContainer, ShellPageHeader } from "@novacore/frontend-next-shadcn";

export function OverviewPage() {
  return (
    <PageContainer>
      <ShellPageHeader
        title="Overview"
        description="Nova Console — NovaCore's central administration console."
      />
      <ContentPanel>
        <p>Tenant, Scope, Security, and Localization management land here as they ship.</p>
      </ContentPanel>
    </PageContainer>
  );
}
