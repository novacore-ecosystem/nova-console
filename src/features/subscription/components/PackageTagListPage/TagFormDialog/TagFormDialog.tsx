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
import { useTagFormDialog } from "@/features/subscription/components/PackageTagListPage/TagFormDialog/useTagFormDialog";
import type { PackageTagDto } from "@/services/subscription";

export interface TagFormDialogProps {
  tag?: PackageTagDto;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TagFormDialog({ tag, open, onOpenChange }: TagFormDialogProps) {
  const { t } = useAppTranslation();
  const onClose = () => onOpenChange(false);
  const { form, onSubmit, isSubmitting, errorMessage } = useTagFormDialog(tag, onClose);
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {tag ? t("subscription.tag.editTitle", "Edit tag") : t("subscription.tag.createTitle", "New tag")}
          </DialogTitle>
        </DialogHeader>
        <Form form={form} onSubmit={onSubmit} className="grid gap-4">
          <FormField label={t("subscription.form.name", "Name")} htmlFor="name" error={errors.name?.message}>
            <Input id="name" invalid={!!errors.name} {...register("name")} />
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
              {t("common.actions.save", "Save")}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
