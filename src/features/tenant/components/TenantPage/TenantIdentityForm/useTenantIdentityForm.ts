"use client";

import { useAppForm } from "@/shared/forms";
import { useCreateTenantMutation, useUpdateTenantMutation } from "@/features/tenant/api/tenant.queries";
import { createTenantSchema, type CreateTenantFormValues } from "@/features/tenant/tenant.schema";
import type { TenantDetailDto } from "@/services/tenant";

export type TenantIdentityFormMode = "insert" | "update";

export interface UseTenantIdentityFormArgs {
  mode: TenantIdentityFormMode;
  /** Required (and used to seed defaults) when `mode` is `"update"`. */
  tenant?: TenantDetailDto;
  onSuccess: (tenantId: string) => void;
}

/**
 * Backs both tenant creation and Tenant Detail's `action=update` mode (see `TenantPage`) —
 * the only piece that changes shape between the two is which mutation/payload `onSubmit`
 * sends, and whether `code` is rendered editable. Always validated against
 * `createTenantSchema` (the superset) rather than switching schema by mode: in update mode
 * `code` is seeded from the already-valid `tenant.code` and never rendered as an editable
 * field, so it always passes validation trivially — this avoids a union form-values type
 * that would make `register("code")` unsound to call at all in update mode.
 */
export function useTenantIdentityForm({ mode, tenant, onSuccess }: UseTenantIdentityFormArgs) {
  const createMutation = useCreateTenantMutation();
  const updateMutation = useUpdateTenantMutation(tenant?.id ?? "");

  const form = useAppForm(createTenantSchema, {
    defaultValues: {
      code: mode === "update" ? (tenant?.code ?? "") : "",
      name: mode === "update" ? (tenant?.name ?? "") : "",
      logoUrl: mode === "update" ? (tenant?.logoUrl ?? "") : "",
      faviconUrl: mode === "update" ? (tenant?.faviconUrl ?? "") : "",
    },
  });

  const onSubmit = async (values: CreateTenantFormValues) => {
    try {
      if (mode === "insert") {
        const id = await createMutation.mutateAsync({
          code: values.code,
          name: values.name,
          logoUrl: values.logoUrl || undefined,
          faviconUrl: values.faviconUrl || undefined,
        });
        onSuccess(id);
      } else if (tenant) {
        await updateMutation.mutateAsync({
          name: values.name,
          logoUrl: values.logoUrl || undefined,
          faviconUrl: values.faviconUrl || undefined,
        });
        onSuccess(tenant.id);
      }
    } catch {
      // surfaced via errorMessage below
    }
  };

  const mutation = mode === "insert" ? createMutation : updateMutation;

  return {
    form,
    onSubmit,
    isSubmitting: mutation.isPending,
    errorMessage: mutation.error instanceof Error ? mutation.error.message : null,
  };
}
