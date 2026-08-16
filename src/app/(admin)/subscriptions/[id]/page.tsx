import { Permissions } from "@novacore/frontend-foundation";
import { RequirePermission } from "@/features/auth";
import { PackagePage } from "@/features/subscription";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <RequirePermission permission={Permissions.Root}>
      <PackagePage packageId={id} />
    </RequirePermission>
  );
}
