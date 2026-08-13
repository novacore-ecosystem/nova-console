"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { tenantService } from "@/features/tenant/api/tenant.service";
import type { CreateTenantInput, UpdateTenantInput } from "@/services/tenant";

export const tenantKeys = {
  all: ["tenants"] as const,
  lists: () => [...tenantKeys.all, "list"] as const,
  detail: (id: string) => [...tenantKeys.all, "detail", id] as const,
};

export function useTenantsQuery() {
  return useQuery({
    queryKey: tenantKeys.lists(),
    queryFn: () => tenantService.list(),
  });
}

export function useTenantQuery(id: string) {
  return useQuery({
    queryKey: tenantKeys.detail(id),
    queryFn: () => tenantService.getById(id),
  });
}

export function useCreateTenantMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTenantInput) => tenantService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.all });
    },
  });
}

export function useUpdateTenantMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateTenantInput) => tenantService.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.all });
    },
  });
}

export function useSetTenantActiveMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (isActive: boolean) => tenantService.setActive(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.all });
    },
  });
}
