import { AdminShell } from "@/shared/layout";

export default function AdminAreaLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
