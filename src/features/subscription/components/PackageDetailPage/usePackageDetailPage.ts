"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { useGroupsQuery, usePackageQuery, useTagsQuery } from "@/features/subscription/api/subscription.queries";

export type PackageDetailAction = "detail" | "update";

/** Same `?action=` query-param pattern as `useTenantDetailPage` — default `"detail"`. */
export function usePackageDetailPage(packageId: string) {
  const packageQuery = usePackageQuery(packageId);
  const groupsQuery = useGroupsQuery();
  const tagsQuery = useTagsQuery();
  const router = useRouter();
  const searchParams = useSearchParams();
  const action: PackageDetailAction = searchParams.get("action") === "update" ? "update" : "detail";

  return {
    pkg: packageQuery.data ?? null,
    groups: groupsQuery.data ?? [],
    tags: tagsQuery.data ?? [],
    isLoading: packageQuery.isLoading,
    isError: packageQuery.isError,
    action,
    startEditing: () => router.push(`/subscriptions/${packageId}?action=update`),
    stopEditing: () => router.replace(`/subscriptions/${packageId}`),
  };
}
