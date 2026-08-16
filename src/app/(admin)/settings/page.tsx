import { Permissions } from "@novacore/frontend-foundation";
import { RequirePermission } from "@/features/auth";
import { SettingsPage } from "@/features/settings";

export default function Page() {
  return (
    <RequirePermission permission={Permissions.Root}>
      <SettingsPage />
    </RequirePermission>
  );
}
