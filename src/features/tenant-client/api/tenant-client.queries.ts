"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { tenantClientService } from "@/features/tenant-client/api/tenant-client.service";
import type { CreateTenantClientInput } from "@/services/tenant-client";

export const tenantClientKeys = {
  all: ["tenant-clients"] as const,
  lists: (tenantId: string | null) =>
    [...tenantClientKeys.all, "list", tenantId ?? "root"] as const,
};

export function useTenantClientsQuery(tenantId: string | null) {
  return useQuery({
    queryKey: tenantClientKeys.lists(tenantId),
    queryFn: () => tenantClientService.list(tenantId),
  });
}

export function useCreateTenantClientMutation(tenantId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Omit<CreateTenantClientInput, "tenantId">) =>
      tenantClientService.create({ ...input, tenantId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantClientKeys.lists(tenantId) });
    },
  });
}

export function useRotateTenantClientMutation(tenantId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tenantClientService.rotate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantClientKeys.lists(tenantId) });
    },
  });
}

export function useRevokeTenantClientMutation(tenantId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      tenantClientService.revoke(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantClientKeys.lists(tenantId) });
    },
  });
}
