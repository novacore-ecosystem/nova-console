"use client";

import { useState } from "react";

export function useTenantListHeader() {
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);

  return {
    isCreateDialogOpen,
    openCreateDialog: () => setCreateDialogOpen(true),
    setCreateDialogOpen,
  };
}
