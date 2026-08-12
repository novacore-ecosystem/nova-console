"use client";

import { useAppForm } from "@/shared/forms";
import { useUpdateTenantMutation } from "@/features/tenant/api/tenant.queries";
import { updateTenantSchema, type UpdateTenantFormValues } from "@/features/tenant/tenant.schema";
import type { TenantRecord } from "@/services/tenant";

export function useTenantEditDialog(tenant: TenantRecord, onClose: () => void) {
  const form = useAppForm(updateTenantSchema, {
    defaultValues: { name: tenant.name, logoUrl: tenant.logoUrl ?? "" },
  });
  const updateTenantMutation = useUpdateTenantMutation(tenant.id);

  const onSubmit = async (values: UpdateTenantFormValues) => {
    await updateTenantMutation.mutateAsync({
      name: values.name,
      logoUrl: values.logoUrl || undefined,
    });
    onClose();
  };

  return {
    form,
    onSubmit,
    isSubmitting: updateTenantMutation.isPending,
  };
}
