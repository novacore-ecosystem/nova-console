"use client";

import { useState } from "react";

import { useDeleteTenantMutation, useDisableTenantMutation } from "@/features/tenant/api/tenant.queries";
import type { TenantSummaryDto } from "@/services/tenant";

export function useTenantActions(tenant: TenantSummaryDto) {
  const [isDisableConfirmOpen, setDisableConfirmOpen] = useState(false);
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const disableMutation = useDisableTenantMutation(tenant.id);
  const deleteMutation = useDeleteTenantMutation(tenant.id);

  const confirmDisable = async () => {
    await disableMutation.mutateAsync();
    setDisableConfirmOpen(false);
  };

  const confirmDelete = async () => {
    await deleteMutation.mutateAsync();
    setDeleteConfirmOpen(false);
  };

  return {
    isDisableConfirmOpen,
    openDisableConfirm: () => setDisableConfirmOpen(true),
    setDisableConfirmOpen,
    confirmDisable,
    isDisabling: disableMutation.isPending,
    disableError: disableMutation.error instanceof Error ? disableMutation.error.message : null,

    isDeleteConfirmOpen,
    openDeleteConfirm: () => setDeleteConfirmOpen(true),
    setDeleteConfirmOpen,
    confirmDelete,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error instanceof Error ? deleteMutation.error.message : null,
  };
}
