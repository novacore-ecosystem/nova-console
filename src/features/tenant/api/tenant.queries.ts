"use client";

import { useQuery } from "@tanstack/react-query";

import { tenantService } from "@/features/tenant/api/tenant.service";

export const tenantKeys = {
  all: ["tenants"] as const,
  lists: () => [...tenantKeys.all, "list"] as const,
};

export function useTenantsQuery() {
  return useQuery({
    queryKey: tenantKeys.lists(),
    queryFn: () => tenantService.list(),
  });
}
