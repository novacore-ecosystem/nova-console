"use client";

import { useState } from "react";

import { useSetScopeActiveMutation } from "@/features/scope/api/scope.queries";
import type { ScopeRecord } from "@/services/scope";

export function useScopeActions(scope: ScopeRecord) {
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const setActiveMutation = useSetScopeActiveMutation(scope.tenantId, scope.id);

  const confirmToggle = async () => {
    await setActiveMutation.mutateAsync(!scope.isActive);
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
