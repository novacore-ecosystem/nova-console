"use client";

import { useState } from "react";

import { useTenantClientsQuery } from "@/features/tenant-client/api/tenant-client.queries";

export function useTenantClientListPanel(tenantId: string | null) {
  const clientsQuery = useTenantClientsQuery(tenantId);
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);

  return {
    clients: clientsQuery.data ?? [],
    isLoading: clientsQuery.isLoading,
    isError: clientsQuery.isError,
    refetch: clientsQuery.refetch,
    isCreateDialogOpen,
    openCreateDialog: () => setCreateDialogOpen(true),
    setCreateDialogOpen,
  };
}
