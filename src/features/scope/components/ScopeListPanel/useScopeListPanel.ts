"use client";

import { useScopesQuery } from "@/features/scope/api/scope.queries";

export function useScopeListPanel(tenantId: string) {
  const scopesQuery = useScopesQuery(tenantId);

  return {
    scopes: scopesQuery.data ?? [],
    isLoading: scopesQuery.isLoading,
    isError: scopesQuery.isError,
    refetch: scopesQuery.refetch,
  };
}
