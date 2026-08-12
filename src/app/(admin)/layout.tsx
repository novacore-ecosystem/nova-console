import { RequireAuth } from "@/features/auth";
import { AdminShell } from "@/shared/layout";

export default function AdminAreaLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <AdminShell>{children}</AdminShell>
    </RequireAuth>
  );
}
