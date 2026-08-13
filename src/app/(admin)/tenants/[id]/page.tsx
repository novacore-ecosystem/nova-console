import { Permissions } from "@novacore/frontend-foundation";
import { RequirePermission } from "@/features/auth";
import { TenantDetailPage } from "@/features/tenant";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <RequirePermission permission={Permissions.Root}>
      <TenantDetailPage tenantId={id} />
    </RequirePermission>
  );
}
