"use client";

import { useState } from "react";

import { useScopesQuery } from "@/features/scope/api/scope.queries";

export function useScopeListPanel(tenantId: string) {
  const scopesQuery = useScopesQuery(tenantId);
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);

  return {
    scopes: scopesQuery.data ?? [],
    isLoading: scopesQuery.isLoading,
    isError: scopesQuery.isError,
    refetch: scopesQuery.refetch,
    isCreateDialogOpen,
    openCreateDialog: () => setCreateDialogOpen(true),
    setCreateDialogOpen,
  };
}
