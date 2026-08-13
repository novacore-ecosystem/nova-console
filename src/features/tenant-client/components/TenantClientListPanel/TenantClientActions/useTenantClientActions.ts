"use client";

import { useState } from "react";

import { useRotateTenantClientMutation } from "@/features/tenant-client/api/tenant-client.queries";
import type { TenantClientRecord } from "@/services/tenant-client";

export function useTenantClientActions(client: TenantClientRecord) {
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [rotatedClient, setRotatedClient] = useState<TenantClientRecord | null>(null);
  const rotateMutation = useRotateTenantClientMutation(client.tenantId);

  const confirmRotate = async () => {
    const next = await rotateMutation.mutateAsync(client.id);
    setConfirmOpen(false);
    setRotatedClient(next);
  };

  return {
    isConfirmOpen,
    openConfirm: () => setConfirmOpen(true),
    setConfirmOpen,
    confirmRotate,
    isRotating: rotateMutation.isPending,
    rotatedClient,
    closeReveal: () => setRotatedClient(null),
  };
}
