"use client";

import { useState } from "react";

import { useRotateTenantClientMutation } from "@/features/tenant/api/tenant.queries";
import type { TenantClientRotationDto } from "@/services/tenant";

export function useTenantClientRotateAction(tenantId: string) {
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [rotated, setRotated] = useState<TenantClientRotationDto | null>(null);
  const rotateMutation = useRotateTenantClientMutation(tenantId);

  const confirmRotate = async () => {
    const result = await rotateMutation.mutateAsync(undefined);
    setConfirmOpen(false);
    setRotated(result);
  };

  return {
    isConfirmOpen,
    openConfirm: () => setConfirmOpen(true),
    setConfirmOpen,
    confirmRotate,
    isRotating: rotateMutation.isPending,
    rotateError: rotateMutation.error instanceof Error ? rotateMutation.error.message : null,
    rotated,
    closeReveal: () => setRotated(null),
  };
}
