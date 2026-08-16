"use client";

import { Button, FormActions, FormField, Input } from "@novacore/frontend-next-shadcn";

import { Form } from "@/shared/forms";
import { useAppTranslation } from "@/shared/i18n";
import {
  useTenantIdentityForm,
  type TenantIdentityFormMode,
} from "@/features/tenant/components/TenantPage/TenantIdentityForm/useTenantIdentityForm";
import type { TenantDetailDto } from "@/services/tenant";

export interface TenantIdentityFormProps {
  mode: TenantIdentityFormMode;
  tenant?: TenantDetailDto;
  onSuccess: (tenantId: string) => void;
  onCancel?: () => void;
}

/** The one component whose fields/API call change with `TenantPage`'s action — see useTenantIdentityForm. */
export function TenantIdentityForm({ mode, tenant, onSuccess, onCancel }: TenantIdentityFormProps) {
  const { t } = useAppTranslation();
  const { form, onSubmit, isSubmitting, errorMessage } = useTenantIdentityForm({ mode, tenant, onSuccess });
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <Form form={form} onSubmit={onSubmit} className="grid max-w-xl gap-4">
      <FormField
        label={t("tenant.form.code", "Code")}
        htmlFor="code"
        error={mode === "insert" ? errors.code?.message : undefined}
        description={
          mode === "insert"
            ? t("tenant.form.codeHint", 'Lowercase snake_case, e.g. "acme_corp". Cannot be changed after creation.')
            : undefined
        }
      >
        {mode === "insert" ? (
          <Input id="code" invalid={!!errors.code} {...register("code")} />
        ) : (
          <Input id="code" value={tenant?.code} disabled readOnly />
        )}
      </FormField>
      <FormField label={t("tenant.form.name", "Name")} htmlFor="name" error={errors.name?.message}>
        <Input id="name" invalid={!!errors.name} {...register("name")} />
      </FormField>
      <FormField label={t("tenant.form.logoUrl", "Logo URL")} htmlFor="logoUrl" error={errors.logoUrl?.message}>
        <Input id="logoUrl" invalid={!!errors.logoUrl} {...register("logoUrl")} />
      </FormField>
      <FormField
        label={t("tenant.form.faviconUrl", "Favicon URL")}
        htmlFor="faviconUrl"
        error={errors.faviconUrl?.message}
      >
        <Input id="faviconUrl" invalid={!!errors.faviconUrl} {...register("faviconUrl")} />
      </FormField>
      {errorMessage ? (
        <p role="alert" className="text-sm text-destructive">
          {errorMessage}
        </p>
      ) : null}
      <FormActions>
        {onCancel ? (
          <Button type="button" variant="outline" onClick={onCancel}>
            {t("common.actions.cancel", "Cancel")}
          </Button>
        ) : null}
        <Button type="submit" loading={isSubmitting}>
          {mode === "insert" ? t("tenant.create.submit", "Create tenant") : t("tenant.edit.submit", "Save changes")}
        </Button>
      </FormActions>
    </Form>
  );
}
