"use client";

import { PageContainer } from "@novacore/frontend-next-shadcn";

import { TenantListHeader } from "@/features/tenant/components/TenantListPage/TenantListHeader";
import { TenantFilters } from "@/features/tenant/components/TenantListPage/TenantFilters";
import { TenantTable } from "@/features/tenant/components/TenantListPage/TenantTable";
import { TenantFormDialog } from "@/features/tenant/components/TenantListPage/TenantFormDialog";
import { TenantEditDialog } from "@/features/tenant/components/TenantListPage/TenantEditDialog";
import { useTenantListPage } from "@/features/tenant/components/TenantListPage/useTenantListPage";

export function TenantListPage() {
  const {
    tenants,
    isLoading,
    isError,
    refetch,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    isCreateDialogOpen,
    openCreateDialog,
    setCreateDialogOpen,
    editingTenant,
    openEditDialog,
    closeEditDialog,
  } = useTenantListPage();

  return (
    <PageContainer>
      <TenantListHeader onCreateClick={openCreateDialog} />
      <TenantFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />
      <TenantTable
        tenants={tenants}
        loading={isLoading}
        error={isError}
        onRetry={() => refetch()}
        onEdit={openEditDialog}
      />
      <TenantFormDialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen} />
      {editingTenant ? (
        <TenantEditDialog key={editingTenant.id} tenant={editingTenant} onClose={closeEditDialog} />
      ) : null}
    </PageContainer>
  );
}
