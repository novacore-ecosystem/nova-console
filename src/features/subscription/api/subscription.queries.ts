"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { subscriptionService } from "@/features/subscription/api/subscription.service";
import type {
  CreatePackageInput,
  ListPackagesParams,
  UpdatePackageInput,
  UpsertGroupInput,
  UpsertTagInput,
} from "@/services/subscription";

export const subscriptionKeys = {
  all: ["subscription"] as const,
  packageLists: () => [...subscriptionKeys.all, "package", "list"] as const,
  packageList: (params: ListPackagesParams) => [...subscriptionKeys.packageLists(), params] as const,
  packageDetail: (id: string) => [...subscriptionKeys.all, "package", "detail", id] as const,
  groups: () => [...subscriptionKeys.all, "groups"] as const,
  tags: () => [...subscriptionKeys.all, "tags"] as const,
};

export function usePackagesQuery(params: ListPackagesParams) {
  return useQuery({
    queryKey: subscriptionKeys.packageList(params),
    queryFn: () => subscriptionService.listPackages(params),
    placeholderData: (previousData) => previousData,
  });
}

export function usePackageQuery(id: string) {
  return useQuery({
    queryKey: subscriptionKeys.packageDetail(id),
    queryFn: () => subscriptionService.getPackage(id),
  });
}

export function useCreatePackageMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePackageInput) => subscriptionService.createPackage(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.packageLists() });
    },
  });
}

export function useUpdatePackageMutation(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdatePackageInput) => subscriptionService.updatePackage(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.packageLists() });
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.packageDetail(id) });
    },
  });
}

export function useGroupsQuery() {
  return useQuery({ queryKey: subscriptionKeys.groups(), queryFn: () => subscriptionService.listGroups() });
}

export function useCreateGroupMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpsertGroupInput) => subscriptionService.createGroup(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: subscriptionKeys.groups() }),
  });
}

export function useUpdateGroupMutation(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpsertGroupInput) => subscriptionService.updateGroup(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: subscriptionKeys.groups() }),
  });
}

export function useDeleteGroupMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => subscriptionService.deleteGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.groups() });
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.packageLists() });
    },
  });
}

export function useTagsQuery() {
  return useQuery({ queryKey: subscriptionKeys.tags(), queryFn: () => subscriptionService.listTags() });
}

export function useCreateTagMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpsertTagInput) => subscriptionService.createTag(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: subscriptionKeys.tags() }),
  });
}

export function useUpdateTagMutation(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpsertTagInput) => subscriptionService.updateTag(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: subscriptionKeys.tags() }),
  });
}

export function useDeleteTagMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => subscriptionService.deleteTag(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.tags() });
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.packageLists() });
    },
  });
}
