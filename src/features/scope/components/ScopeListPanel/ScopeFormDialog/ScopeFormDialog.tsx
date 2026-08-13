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
  Select,
} from "@novacore/frontend-next-shadcn";

import { Form } from "@/shared/forms";
import { useAppTranslation } from "@/shared/i18n";
import { useScopeFormDialog } from "@/features/scope/components/ScopeListPanel/ScopeFormDialog/useScopeFormDialog";
import type { ScopeRecord } from "@/services/scope";

const NO_PARENT = "none";

export interface ScopeFormDialogProps {
  tenantId: string;
  scopes: ScopeRecord[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ScopeFormDialog({ tenantId, scopes, open, onOpenChange }: ScopeFormDialogProps) {
  const { t } = useAppTranslation();
  const { form, onSubmit, parentScopeId, setParentScopeId, isSubmitting } = useScopeFormDialog(
    tenantId,
    onOpenChange,
  );
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("scope.create.title", "New scope")}</DialogTitle>
        </DialogHeader>
        <Form form={form} onSubmit={onSubmit} className="grid gap-4">
          <FormField label={t("scope.form.parent", "Parent scope")} htmlFor="parentScopeId">
            <Select
              value={parentScopeId ?? NO_PARENT}
              onValueChange={(value) => setParentScopeId(value === NO_PARENT ? null : value)}
              options={[
                { value: NO_PARENT, label: t("scope.form.noParent", "None (root)") },
                ...scopes.map((scope) => ({ value: scope.id, label: scope.name })),
              ]}
            />
          </FormField>
          <FormField
            label={t("scope.form.code", "Code")}
            htmlFor="code"
            error={errors.code?.message}
            description={t("scope.form.codeHint", "Lowercase letters, numbers, and hyphens only.")}
          >
            <Input id="code" invalid={!!errors.code} {...register("code")} />
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
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("common.actions.cancel", "Cancel")}
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {t("scope.create.submit", "Create scope")}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
