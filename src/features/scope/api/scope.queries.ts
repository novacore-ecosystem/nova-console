"use client";

import { useQuery } from "@tanstack/react-query";

import { scopeService } from "@/features/scope/api/scope.service";

export const scopeKeys = {
  all: ["scopes"] as const,
  lists: (tenantId: string) => [...scopeKeys.all, "list", tenantId] as const,
};

export function useScopesQuery(tenantId: string) {
  return useQuery({
    queryKey: scopeKeys.lists(tenantId),
    queryFn: () => scopeService.list(tenantId),
  });
}
