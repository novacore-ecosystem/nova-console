"use client";

import { useAppForm } from "@/shared/forms";
import { useUpdateTenantMutation } from "@/features/tenant/api/tenant.queries";
import { updateTenantSchema, type UpdateTenantFormValues } from "@/features/tenant/tenant.schema";
import type { TenantDetailDto } from "@/services/tenant";

/** Always seeded from the full `TenantDetailDto` — `UpdateTenant` is a full replace, so every field needs its current value. */
export function useTenantBrandingEditDialog(tenant: TenantDetailDto, onClose: () => void) {
  const form = useAppForm(updateTenantSchema, {
    defaultValues: {
      name: tenant.name,
      logoUrl: tenant.logoUrl ?? "",
      faviconUrl: tenant.faviconUrl ?? "",
    },
  });
  const updateTenantMutation = useUpdateTenantMutation(tenant.id);

  const onSubmit = async (values: UpdateTenantFormValues) => {
    try {
      await updateTenantMutation.mutateAsync({
        name: values.name,
        logoUrl: values.logoUrl || undefined,
        faviconUrl: values.faviconUrl || undefined,
      });
      onClose();
    } catch {
      // surfaced via errorMessage below
    }
  };

  const errorMessage =
    updateTenantMutation.error instanceof Error ? updateTenantMutation.error.message : null;

  return {
    form,
    onSubmit,
    isSubmitting: updateTenantMutation.isPending,
    errorMessage,
  };
}
