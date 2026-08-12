"use client";

import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormField,
  Input,
} from "@novacore/frontend-next-shadcn";

import { Form } from "@/shared/forms";
import { useAppTranslation } from "@/shared/i18n";
import { useTenantEditDialog } from "@/features/tenant/components/TenantListPage/TenantEditDialog/useTenantEditDialog";
import type { TenantRecord } from "@/services/tenant";

export interface TenantEditDialogProps {
  tenant: TenantRecord;
  onClose: () => void;
}

/** Mounted only while a tenant is being edited (see TenantListPage) — key={tenant.id} gives each open a fresh form. */
export function TenantEditDialog({ tenant, onClose }: TenantEditDialogProps) {
  const { t } = useAppTranslation();
  const { form, onSubmit, isSubmitting } = useTenantEditDialog(tenant, onClose);
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("tenant.edit.title", "Edit tenant")}</DialogTitle>
        </DialogHeader>
        <Form form={form} onSubmit={onSubmit} className="grid gap-4">
          <FormField label={t("tenant.form.code", "Code")} htmlFor="code">
            <Input id="code" value={tenant.code} disabled readOnly />
          </FormField>
          <FormField
            label={t("tenant.form.name", "Name")}
            htmlFor="name"
            error={errors.name?.message}
          >
            <Input id="name" invalid={!!errors.name} {...register("name")} />
          </FormField>
          <FormField
            label={t("tenant.form.logoUrl", "Logo URL")}
            htmlFor="logoUrl"
            error={errors.logoUrl?.message}
          >
            <Input id="logoUrl" invalid={!!errors.logoUrl} {...register("logoUrl")} />
          </FormField>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t("common.actions.cancel", "Cancel")}
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {t("tenant.edit.submit", "Save changes")}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
