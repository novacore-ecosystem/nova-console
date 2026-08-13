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
import { useScopeEditDialog } from "@/features/scope/components/ScopeListPanel/ScopeEditDialog/useScopeEditDialog";
import type { ScopeRecord } from "@/services/scope";

export interface ScopeEditDialogProps {
  scope: ScopeRecord;
  onClose: () => void;
}

/** Mounted only while a scope is being edited — key={scope.id} gives each open a fresh form, same as TenantEditDialog. */
export function ScopeEditDialog({ scope, onClose }: ScopeEditDialogProps) {
  const { t } = useAppTranslation();
  const { form, onSubmit, isSubmitting } = useScopeEditDialog(scope, onClose);
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("scope.edit.title", "Edit scope")}</DialogTitle>
        </DialogHeader>
        <Form form={form} onSubmit={onSubmit} className="grid gap-4">
          <FormField label={t("scope.form.code", "Code")} htmlFor="code">
            <Input id="code" value={scope.code} disabled readOnly />
          </FormField>
          <FormField
            label={t("scope.form.name", "Name")}
            htmlFor="name"
            error={errors.name?.message}
          >
            <Input id="name" invalid={!!errors.name} {...register("name")} />
          </FormField>
          <FormField
            label={t("scope.form.description", "Description")}
            htmlFor="description"
            error={errors.description?.message}
          >
            <Input id="description" invalid={!!errors.description} {...register("description")} />
          </FormField>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t("common.actions.cancel", "Cancel")}
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {t("scope.edit.submit", "Save changes")}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
