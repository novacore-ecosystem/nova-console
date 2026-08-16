import { Permissions } from "@novacore/frontend-foundation";
import { RequirePermission } from "@/features/auth";
import { TenantPage } from "@/features/tenant";

export default function Page() {
  return (
    <RequirePermission permission={Permissions.Tenant.Manage}>
      <TenantPage />
    </RequirePermission>
  );
}
