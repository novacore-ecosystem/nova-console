/** Backend-shaped even though nothing calls a real backend yet (see subscription.dev-adapter.ts) — keeps a future real-endpoint swap type-compatible. */
export interface PackageGroupDto {
  id: string;
  name: string;
  description: string | null;
}

export interface PackageTagDto {
  id: string;
  name: string;
}

export interface PackageHistoryEntryDto {
  id: string;
  changedAt: string;
  changedBy: string;
  summary: string;
}

export type PackageStatus = "active" | "archived";

export interface PackageSummaryDto {
  id: string;
  name: string;
  groupId: string | null;
  tagIds: string[];
  status: PackageStatus;
}

export interface PackageDetailDto extends PackageSummaryDto {
  description: string | null;
  createdAt: string;
  updatedAt: string;
  history: PackageHistoryEntryDto[];
}
