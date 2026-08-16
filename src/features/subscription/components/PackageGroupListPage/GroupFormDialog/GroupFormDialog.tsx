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
import { useGroupFormDialog } from "@/features/subscription/components/PackageGroupListPage/GroupFormDialog/useGroupFormDialog";
import type { PackageGroupDto } from "@/services/subscription";

export interface GroupFormDialogProps {
  group?: PackageGroupDto;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GroupFormDialog({ group, open, onOpenChange }: GroupFormDialogProps) {
  const { t } = useAppTranslation();
  const onClose = () => onOpenChange(false);
  const { form, onSubmit, isSubmitting, errorMessage } = useGroupFormDialog(group, onClose);
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {group
              ? t("subscription.group.editTitle", "Edit group")
              : t("subscription.group.createTitle", "New group")}
          </DialogTitle>
        </DialogHeader>
        <Form form={form} onSubmit={onSubmit} className="grid gap-4">
          <FormField label={t("subscription.form.name", "Name")} htmlFor="name" error={errors.name?.message}>
            <Input id="name" invalid={!!errors.name} {...register("name")} />
          </FormField>
          <FormField
            label={t("subscription.form.description", "Description")}
            htmlFor="description"
            error={errors.description?.message}
          >
            <Input id="description" invalid={!!errors.description} {...register("description")} />
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
