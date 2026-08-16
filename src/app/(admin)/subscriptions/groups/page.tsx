import { Permissions } from "@novacore/frontend-foundation";
import { RequirePermission } from "@/features/auth";
import { PackageGroupListPage } from "@/features/subscription";

export default function Page() {
  return (
    <RequirePermission permission={Permissions.Root}>
      <PackageGroupListPage />
    </RequirePermission>
  );
}
