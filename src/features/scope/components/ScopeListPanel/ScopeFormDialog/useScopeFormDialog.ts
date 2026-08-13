"use client";

import { useState } from "react";

import { useAppForm } from "@/shared/forms";
import { useCreateScopeMutation } from "@/features/scope/api/scope.queries";
import { createScopeSchema, type CreateScopeFormValues } from "@/features/scope/scope.schema";

export function useScopeFormDialog(tenantId: string, onOpenChange: (open: boolean) => void) {
  const form = useAppForm(createScopeSchema, {
    defaultValues: { code: "", name: "", description: "" },
  });
  const [parentScopeId, setParentScopeId] = useState<string | null>(null);
  const createScopeMutation = useCreateScopeMutation(tenantId);

  const onSubmit = async (values: CreateScopeFormValues) => {
    await createScopeMutation.mutateAsync({
      parentScopeId,
      code: values.code,
      name: values.name,
      description: values.description || undefined,
    });
    form.reset();
    setParentScopeId(null);
    onOpenChange(false);
  };

  return {
    form,
    onSubmit,
    parentScopeId,
    setParentScopeId,
    isSubmitting: createScopeMutation.isPending,
  };
}
