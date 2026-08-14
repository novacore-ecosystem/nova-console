"use client";

import { useAppForm } from "@/shared/forms";
import { useCreateTenantMutation } from "@/features/tenant/api/tenant.queries";
import { createTenantSchema, type CreateTenantFormValues } from "@/features/tenant/tenant.schema";

export function useTenantFormDialog(onOpenChange: (open: boolean) => void) {
  const form = useAppForm(createTenantSchema, {
    defaultValues: { code: "", name: "", logoUrl: "", faviconUrl: "" },
  });
  const createTenantMutation = useCreateTenantMutation();

  const onSubmit = async (values: CreateTenantFormValues) => {
    try {
      await createTenantMutation.mutateAsync({
        code: values.code,
        name: values.name,
        logoUrl: values.logoUrl || undefined,
        faviconUrl: values.faviconUrl || undefined,
      });
      form.reset();
      onOpenChange(false);
    } catch {
      // surfaced via errorMessage below
    }
  };

  const errorMessage =
    createTenantMutation.error instanceof Error ? createTenantMutation.error.message : null;

  return {
    form,
    onSubmit,
    isSubmitting: createTenantMutation.isPending,
    errorMessage,
  };
}
