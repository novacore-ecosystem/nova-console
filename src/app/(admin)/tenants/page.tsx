import { Permissions } from "@novacore/frontend-foundation";
import { RequirePermission } from "@/features/auth";
import { TenantListPage } from "@/features/tenant";

export default function Page() {
  return (
    <RequirePermission permission={Permissions.Root}>
      <TenantListPage />
    </RequirePermission>
  );
}
