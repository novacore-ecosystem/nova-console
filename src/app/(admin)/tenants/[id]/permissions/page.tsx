import { Permissions } from "@novacore/frontend-foundation";
import { RequirePermission } from "@/features/auth";
import { TenantPermissionPage } from "@/features/tenant-permission";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <RequirePermission permission={Permissions.Tenant.Manage}>
      <TenantPermissionPage tenantId={id} />
    </RequirePermission>
  );
}
