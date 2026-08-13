"use client";

import { useState } from "react";

import {
  useRevokeTenantClientMutation,
  useRotateTenantClientMutation,
} from "@/features/tenant-client/api/tenant-client.queries";
import type { TenantClientRecord } from "@/services/tenant-client";

export function useTenantClientActions(client: TenantClientRecord) {
  const [isRotateConfirmOpen, setRotateConfirmOpen] = useState(false);
  const [isRevokeConfirmOpen, setRevokeConfirmOpen] = useState(false);
  const [rotatedClient, setRotatedClient] = useState<TenantClientRecord | null>(null);
  const rotateMutation = useRotateTenantClientMutation(client.tenantId);
  const revokeMutation = useRevokeTenantClientMutation(client.tenantId);

  const confirmRotate = async () => {
    const next = await rotateMutation.mutateAsync(client.id);
    setRotateConfirmOpen(false);
    setRotatedClient(next);
  };

  const confirmRevoke = async () => {
    await revokeMutation.mutateAsync({ id: client.id, reason: "manual" });
    setRevokeConfirmOpen(false);
  };

  return {
    isRotateConfirmOpen,
    openRotateConfirm: () => setRotateConfirmOpen(true),
    setRotateConfirmOpen,
    confirmRotate,
    isRotating: rotateMutation.isPending,
    rotatedClient,
    closeReveal: () => setRotatedClient(null),
    isRevokeConfirmOpen,
    openRevokeConfirm: () => setRevokeConfirmOpen(true),
    setRevokeConfirmOpen,
    confirmRevoke,
    isRevoking: revokeMutation.isPending,
  };
}
