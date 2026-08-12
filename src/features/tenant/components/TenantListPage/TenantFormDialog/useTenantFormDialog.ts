"use client";

import { useAppForm } from "@/shared/forms";
import { useCreateTenantMutation } from "@/features/tenant/api/tenant.queries";
import { createTenantSchema, type CreateTenantFormValues } from "@/features/tenant/tenant.schema";

export function useTenantFormDialog(onOpenChange: (open: boolean) => void) {
  const form = useAppForm(createTenantSchema, {
    defaultValues: { code: "", name: "", logoUrl: "" },
  });
  const createTenantMutation = useCreateTenantMutation();

  const onSubmit = async (values: CreateTenantFormValues) => {
    await createTenantMutation.mutateAsync({
      code: values.code,
      name: values.name,
      logoUrl: values.logoUrl || undefined,
    });
    form.reset();
    onOpenChange(false);
  };

  return {
    form,
    onSubmit,
    isSubmitting: createTenantMutation.isPending,
  };
}
