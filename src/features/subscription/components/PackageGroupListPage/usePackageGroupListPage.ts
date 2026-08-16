"use client";

import { useState } from "react";

import { useDeleteGroupMutation, useGroupsQuery } from "@/features/subscription/api/subscription.queries";
import type { PackageGroupDto } from "@/services/subscription";

export function usePackageGroupListPage() {
  const groupsQuery = useGroupsQuery();
  const deleteMutation = useDeleteGroupMutation();

  const [isCreateOpen, setCreateOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<PackageGroupDto | null>(null);
  const [deletingGroup, setDeletingGroup] = useState<PackageGroupDto | null>(null);

  const confirmDelete = async () => {
    if (!deletingGroup) return;
    await deleteMutation.mutateAsync(deletingGroup.id);
    setDeletingGroup(null);
  };

  return {
    groups: groupsQuery.data ?? [],
    isLoading: groupsQuery.isLoading,

    isCreateOpen,
    openCreate: () => setCreateOpen(true),
    setCreateOpen,

    editingGroup,
    openEdit: setEditingGroup,
    closeEdit: () => setEditingGroup(null),

    deletingGroup,
    openDelete: setDeletingGroup,
    closeDelete: () => setDeletingGroup(null),
    confirmDelete,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error instanceof Error ? deleteMutation.error.message : null,
  };
}
