"use client";

import { useState } from "react";

import { useAppForm } from "@/shared/forms";
import { useCreateTenantClientMutation } from "@/features/tenant-client/api/tenant-client.queries";
import {
  createTenantClientSchema,
  type CreateTenantClientFormValues,
} from "@/features/tenant-client/tenant-client.schema";
import type { TenantClientRecord } from "@/services/tenant-client";

export function useTenantClientCreateDialog(tenantId: string | null) {
  const form = useAppForm(createTenantClientSchema, { defaultValues: { name: "" } });
  const createMutation = useCreateTenantClientMutation(tenantId);
  const [createdClient, setCreatedClient] = useState<TenantClientRecord | null>(null);

  const onSubmit = async (values: CreateTenantClientFormValues) => {
    try {
      const record = await createMutation.mutateAsync({ name: values.name });
      setCreatedClient(record);
    } catch {
      // surfaced via errorMessage below
    }
  };

  const reset = () => {
    form.reset();
    setCreatedClient(null);
  };

  const errorMessage = createMutation.error instanceof Error ? createMutation.error.message : null;

  return {
    form,
    onSubmit,
    isSubmitting: createMutation.isPending,
    createdClient,
    reset,
    errorMessage,
  };
}
