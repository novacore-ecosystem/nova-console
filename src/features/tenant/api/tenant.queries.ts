"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { tenantService } from "@/features/tenant/api/tenant.service";
import type { CreateTenantInput } from "@/services/tenant";

export const tenantKeys = {
  all: ["tenants"] as const,
  lists: () => [...tenantKeys.all, "list"] as const,
};

export function useTenantsQuery() {
  return useQuery({
    queryKey: tenantKeys.lists(),
    queryFn: () => tenantService.list(),
  });
}

export function useCreateTenantMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTenantInput) => tenantService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.lists() });
    },
  });
}
