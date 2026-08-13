"use client";

import { useAppForm } from "@/shared/forms";
import { useUpdateScopeMutation } from "@/features/scope/api/scope.queries";
import { updateScopeSchema, type UpdateScopeFormValues } from "@/features/scope/scope.schema";
import type { ScopeRecord } from "@/services/scope";

export function useScopeEditDialog(scope: ScopeRecord, onClose: () => void) {
  const form = useAppForm(updateScopeSchema, {
    defaultValues: { name: scope.name, description: scope.description ?? "" },
  });
  const updateScopeMutation = useUpdateScopeMutation(scope.tenantId, scope.id);

  const onSubmit = async (values: UpdateScopeFormValues) => {
    await updateScopeMutation.mutateAsync({
      name: values.name,
      description: values.description || undefined,
    });
    onClose();
  };

  return {
    form,
    onSubmit,
    isSubmitting: updateScopeMutation.isPending,
  };
}
