"use client";

import { useState } from "react";

import { useSetTenantActiveMutation } from "@/features/tenant/api/tenant.queries";
import type { TenantRecord } from "@/services/tenant";

export function useTenantActions(tenant: TenantRecord) {
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const setActiveMutation = useSetTenantActiveMutation(tenant.id);

  const confirmToggle = async () => {
    await setActiveMutation.mutateAsync(!tenant.isActive);
    setConfirmOpen(false);
  };

  return {
    isConfirmOpen,
    openConfirm: () => setConfirmOpen(true),
    setConfirmOpen,
    confirmToggle,
    isSubmitting: setActiveMutation.isPending,
  };
}
