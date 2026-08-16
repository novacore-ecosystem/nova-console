"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { tenantPermissionService } from "@/features/tenant-permission/api/tenant-permission.service";

export const tenantPermissionKeys = {
  all: ["tenant-permission-scope"] as const,
  scope: (tenantId: string) => [...tenantPermissionKeys.all, tenantId] as const,
};

export function useTenantPermissionScopeQuery(tenantId: string) {
  return useQuery({
    queryKey: tenantPermissionKeys.scope(tenantId),
    queryFn: () => tenantPermissionService.getScope(tenantId),
  });
}

export function useUpdateTenantPermissionScopeMutation(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (keys: string[]) => tenantPermissionService.setScope(tenantId, keys),
    onSuccess: (keys) => {
      queryClient.setQueryData(tenantPermissionKeys.scope(tenantId), keys);
    },
  });
}
