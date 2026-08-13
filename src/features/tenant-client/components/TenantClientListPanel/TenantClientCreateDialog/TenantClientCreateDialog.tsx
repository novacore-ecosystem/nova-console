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
import { useTenantClientCreateDialog } from "@/features/tenant-client/components/TenantClientListPanel/TenantClientCreateDialog/useTenantClientCreateDialog";

export interface TenantClientCreateDialogProps {
  tenantId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TenantClientCreateDialog({
  tenantId,
  open,
  onOpenChange,
}: TenantClientCreateDialogProps) {
  const { t } = useAppTranslation();
  const { form, onSubmit, isSubmitting, createdClient, reset } =
    useTenantClientCreateDialog(tenantId);
  const {
    register,
    formState: { errors },
  } = form;

  const close = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? onOpenChange(true) : close())}>
      <DialogContent>
        {createdClient ? (
          <>
            <DialogHeader>
              <DialogTitle>{t("tenantClient.create.revealTitle", "Save this key now")}</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              {t(
                "tenantClient.create.revealDescription",
                "This key is shown only once and cannot be retrieved again.",
              )}
            </p>
            <Input value={createdClient.publicKey} readOnly className="font-mono" />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  void navigator.clipboard.writeText(createdClient.publicKey);
                }}
              >
                {t("common.actions.copy", "Copy")}
              </Button>
              <Button type="button" onClick={close}>
                {t("common.actions.done", "Done")}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{t("tenantClient.create.title", "New client key")}</DialogTitle>
            </DialogHeader>
            <Form form={form} onSubmit={onSubmit} className="grid gap-4">
              <FormField
                label={t("tenantClient.form.name", "Name")}
                htmlFor="name"
                error={errors.name?.message}
                description={t("tenantClient.form.nameHint", "e.g. Web, Mobile, Admin")}
              >
                <Input id="name" invalid={!!errors.name} {...register("name")} />
              </FormField>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={close}>
                  {t("common.actions.cancel", "Cancel")}
                </Button>
                <Button type="submit" loading={isSubmitting}>
                  {t("tenantClient.create.submit", "Generate key")}
                </Button>
              </DialogFooter>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
