"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { tenantService } from "@/features/tenant/api/tenant.service";
import type {
  CreateTenantInput,
  ListTenantsParams,
  UpdateTenantInput,
  UpsertTenantTranslationInput,
} from "@/services/tenant";

export const tenantKeys = {
  all: ["tenants"] as const,
  lists: () => [...tenantKeys.all, "list"] as const,
  list: (params: ListTenantsParams) => [...tenantKeys.lists(), params] as const,
  detail: (id: string) => [...tenantKeys.all, "detail", id] as const,
};

export function useTenantsQuery(params: ListTenantsParams) {
  return useQuery({
    queryKey: tenantKeys.list(params),
    queryFn: () => tenantService.list(params),
    placeholderData: (previousData) => previousData,
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
      queryClient.invalidateQueries({ queryKey: tenantKeys.lists() });
    },
  });
}

export function useUpdateTenantMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateTenantInput) => tenantService.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.lists() });
      queryClient.invalidateQueries({ queryKey: tenantKeys.detail(id) });
    },
  });
}

export function useDisableTenantMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => tenantService.disable(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.lists() });
      queryClient.invalidateQueries({ queryKey: tenantKeys.detail(id) });
    },
  });
}

export function useDeleteTenantMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => tenantService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.lists() });
      queryClient.removeQueries({ queryKey: tenantKeys.detail(id) });
    },
  });
}

export function useRotateTenantClientMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name?: string) => tenantService.rotateClient(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.detail(id) });
    },
  });
}

export function useUpdateTenantConfigMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ language, config }: { language: string | null; config: unknown }) =>
      tenantService.updateConfig(id, language, config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.detail(id) });
    },
  });
}

export function useUpdateTenantDictionaryMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ language, dictionary }: { language: string; dictionary: unknown }) =>
      tenantService.updateDictionary(id, language, dictionary),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.detail(id) });
    },
  });
}

export function useUpsertTenantTranslationMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpsertTenantTranslationInput) => tenantService.upsertTranslation(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.detail(id) });
    },
  });
}
