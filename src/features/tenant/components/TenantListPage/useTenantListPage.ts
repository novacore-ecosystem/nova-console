"use client";

import { useMemo, useState } from "react";

import { useTenantsQuery } from "@/features/tenant/api/tenant.queries";
import type { TenantRecord } from "@/services/tenant";

export type TenantStatusFilter = "all" | "active" | "inactive";

export function useTenantListPage() {
  const tenantsQuery = useTenantsQuery();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TenantStatusFilter>("all");
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<TenantRecord | null>(null);

  const tenantsData = tenantsQuery.data;

  const filteredTenants = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (tenantsData ?? []).filter((tenant) => {
      const matchesSearch =
        !term ||
        tenant.name.toLowerCase().includes(term) ||
        tenant.code.toLowerCase().includes(term);
      const matchesStatus =
        statusFilter === "all" || (statusFilter === "active") === tenant.isActive;
      return matchesSearch && matchesStatus;
    });
  }, [tenantsData, search, statusFilter]);

  return {
    tenants: filteredTenants,
    isLoading: tenantsQuery.isLoading,
    isError: tenantsQuery.isError,
    refetch: tenantsQuery.refetch,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    isCreateDialogOpen,
    openCreateDialog: () => setCreateDialogOpen(true),
    setCreateDialogOpen,
    editingTenant,
    openEditDialog: setEditingTenant,
    closeEditDialog: () => setEditingTenant(null),
  };
}
