import { Permissions } from "@novacore/frontend-foundation";
import { RequirePermission } from "@/features/auth";
import { TenantPage } from "@/features/tenant";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <RequirePermission permission={Permissions.Tenant.View}>
      <TenantPage tenantId={id} />
    </RequirePermission>
  );
}
