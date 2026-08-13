import { TenantDetailPage } from "@/features/tenant";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TenantDetailPage tenantId={id} />;
}
