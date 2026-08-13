"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { scopeService } from "@/features/scope/api/scope.service";
import type { CreateScopeInput } from "@/services/scope";

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

export function useCreateScopeMutation(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Omit<CreateScopeInput, "tenantId">) =>
      scopeService.create({ ...input, tenantId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scopeKeys.lists(tenantId) });
    },
  });
}
