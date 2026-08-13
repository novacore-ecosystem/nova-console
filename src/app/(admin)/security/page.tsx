import { Permissions } from "@novacore/frontend-foundation";
import { RequirePermission } from "@/features/auth";
import { SecurityPage } from "@/features/tenant-client";

export default function Page() {
  return (
    <RequirePermission permission={Permissions.Root}>
      <SecurityPage />
    </RequirePermission>
  );
}
