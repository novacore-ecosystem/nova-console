import { Permissions } from "@novacore/frontend-foundation";
import { RequirePermission } from "@/features/auth";
import { PackageTagListPage } from "@/features/subscription";

export default function Page() {
  return (
    <RequirePermission permission={Permissions.Root}>
      <PackageTagListPage />
    </RequirePermission>
  );
}
