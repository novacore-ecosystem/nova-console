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
    const record = await createMutation.mutateAsync({ name: values.name });
    setCreatedClient(record);
  };

  const reset = () => {
    form.reset();
    setCreatedClient(null);
  };

  return {
    form,
    onSubmit,
    isSubmitting: createMutation.isPending,
    createdClient,
    reset,
  };
}
