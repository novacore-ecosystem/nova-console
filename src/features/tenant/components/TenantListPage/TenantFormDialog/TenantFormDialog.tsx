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
import { useTenantFormDialog } from "@/features/tenant/components/TenantListPage/TenantFormDialog/useTenantFormDialog";

export interface TenantFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TenantFormDialog({ open, onOpenChange }: TenantFormDialogProps) {
  const { t } = useAppTranslation();
  const { form, onSubmit, isSubmitting } = useTenantFormDialog(onOpenChange);
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("tenant.create.title", "New tenant")}</DialogTitle>
        </DialogHeader>
        <Form form={form} onSubmit={onSubmit} className="grid gap-4">
          <FormField
            label={t("tenant.form.code", "Code")}
            htmlFor="code"
            error={errors.code?.message}
            description={t("tenant.form.codeHint", "Lowercase letters, numbers, and hyphens only.")}
          >
            <Input id="code" invalid={!!errors.code} {...register("code")} />
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
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("common.actions.cancel", "Cancel")}
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {t("tenant.create.submit", "Create tenant")}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
