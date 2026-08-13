"use client";

import { useState } from "react";

import { useScopesQuery } from "@/features/scope/api/scope.queries";
import type { ScopeRecord } from "@/services/scope";

export function useScopeListPanel(tenantId: string) {
  const scopesQuery = useScopesQuery(tenantId);
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingScope, setEditingScope] = useState<ScopeRecord | null>(null);

  return {
    scopes: scopesQuery.data ?? [],
    isLoading: scopesQuery.isLoading,
    isError: scopesQuery.isError,
    refetch: scopesQuery.refetch,
    isCreateDialogOpen,
    openCreateDialog: () => setCreateDialogOpen(true),
    setCreateDialogOpen,
    editingScope,
    openEditDialog: setEditingScope,
    closeEditDialog: () => setEditingScope(null),
  };
}
