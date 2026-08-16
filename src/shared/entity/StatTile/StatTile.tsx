import type { ReactNode } from "react";
import { ContentPanel } from "@novacore/frontend-next-shadcn";

export interface StatTileProps {
  label: string;
  value: string | number;
  hint?: string;
}

/** Prop-driven summary stat, shared across every list-shaped admin page (Dashboard, Tenant List, Package List). No data fetching — the caller owns that. */
export function StatTile({ label, value, hint }: StatTileProps) {
  return (
    <ContentPanel className="flex flex-col gap-1">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-2xl font-semibold tracking-tight">{value}</span>
      {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
    </ContentPanel>
  );
}

export function StatTileRow({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{children}</div>;
}
