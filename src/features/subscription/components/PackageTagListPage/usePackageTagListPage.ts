"use client";

import { useState } from "react";

import { useDeleteTagMutation, useTagsQuery } from "@/features/subscription/api/subscription.queries";
import type { PackageTagDto } from "@/services/subscription";

export function usePackageTagListPage() {
  const tagsQuery = useTagsQuery();
  const deleteMutation = useDeleteTagMutation();

  const [isCreateOpen, setCreateOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<PackageTagDto | null>(null);
  const [deletingTag, setDeletingTag] = useState<PackageTagDto | null>(null);

  const confirmDelete = async () => {
    if (!deletingTag) return;
    await deleteMutation.mutateAsync(deletingTag.id);
    setDeletingTag(null);
  };

  return {
    tags: tagsQuery.data ?? [],
    isLoading: tagsQuery.isLoading,

    isCreateOpen,
    openCreate: () => setCreateOpen(true),
    setCreateOpen,

    editingTag,
    openEdit: setEditingTag,
    closeEdit: () => setEditingTag(null),

    deletingTag,
    openDelete: setDeletingTag,
    closeDelete: () => setDeletingTag(null),
    confirmDelete,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error instanceof Error ? deleteMutation.error.message : null,
  };
}
