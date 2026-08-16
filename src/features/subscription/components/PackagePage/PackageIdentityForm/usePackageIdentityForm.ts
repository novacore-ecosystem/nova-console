"use client";

import { useState } from "react";

import { useAppForm } from "@/shared/forms";
import {
  useCreatePackageMutation,
  useGroupsQuery,
  useTagsQuery,
  useUpdatePackageMutation,
} from "@/features/subscription/api/subscription.queries";
import { packageSchema, type PackageFormValues } from "@/features/subscription/subscription.schema";
import type { PackageDetailDto, PackageStatus } from "@/services/subscription";

export type PackageIdentityFormMode = "insert" | "update";

export interface UsePackageIdentityFormArgs {
  mode: PackageIdentityFormMode;
  pkg?: PackageDetailDto;
  onSuccess: (packageId: string) => void;
}

export function usePackageIdentityForm({ mode, pkg, onSuccess }: UsePackageIdentityFormArgs) {
  const createMutation = useCreatePackageMutation();
  const updateMutation = useUpdatePackageMutation(pkg?.id ?? "");
  const groupsQuery = useGroupsQuery();
  const tagsQuery = useTagsQuery();

  const form = useAppForm(packageSchema, {
    defaultValues: { name: pkg?.name ?? "", description: pkg?.description ?? "" },
  });
  const [groupId, setGroupId] = useState<string | null>(pkg?.groupId ?? null);
  const [tagIds, setTagIds] = useState<string[]>(pkg?.tagIds ?? []);
  const [status, setStatus] = useState<PackageStatus>(pkg?.status ?? "active");

  const toggleTag = (tagId: string, checked: boolean) => {
    setTagIds((current) => (checked ? [...new Set([...current, tagId])] : current.filter((id) => id !== tagId)));
  };

  const onSubmit = async (values: PackageFormValues) => {
    try {
      if (mode === "insert") {
        const id = await createMutation.mutateAsync({
          name: values.name,
          groupId,
          tagIds,
          description: values.description || undefined,
        });
        onSuccess(id);
      } else if (pkg) {
        await updateMutation.mutateAsync({
          name: values.name,
          groupId,
          tagIds,
          description: values.description || undefined,
          status,
        });
        onSuccess(pkg.id);
      }
    } catch {
      // surfaced via errorMessage below
    }
  };

  const mutation = mode === "insert" ? createMutation : updateMutation;

  return {
    form,
    onSubmit,
    groups: groupsQuery.data ?? [],
    tags: tagsQuery.data ?? [],
    groupId,
    setGroupId,
    tagIds,
    toggleTag,
    status,
    setStatus,
    isSubmitting: mutation.isPending,
    errorMessage: mutation.error instanceof Error ? mutation.error.message : null,
  };
}
