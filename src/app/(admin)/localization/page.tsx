import { Permissions } from "@novacore/frontend-foundation";
import { RequirePermission } from "@/features/auth";
import { TranslationBrowserPage } from "@/features/translation";

export default function Page() {
  return (
    <RequirePermission permission={Permissions.Root}>
      <TranslationBrowserPage />
    </RequirePermission>
  );
}
