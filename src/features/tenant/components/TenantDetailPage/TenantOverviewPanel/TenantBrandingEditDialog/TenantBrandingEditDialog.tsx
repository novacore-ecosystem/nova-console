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
import { useTenantBrandingEditDialog } from "@/features/tenant/components/TenantDetailPage/TenantOverviewPanel/TenantBrandingEditDialog/useTenantBrandingEditDialog";
import type { TenantDetailDto } from "@/services/tenant";

export interface TenantBrandingEditDialogProps {
  tenant: TenantDetailDto;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TenantBrandingEditDialog({ tenant, open, onOpenChange }: TenantBrandingEditDialogProps) {
  const { t } = useAppTranslation();
  const onClose = () => onOpenChange(false);
  const { form, onSubmit, isSubmitting, errorMessage } = useTenantBrandingEditDialog(tenant, onClose);
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
