"use client";

import {
  Button,
  ConfirmDialog,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
} from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import { useTenantClientRotateAction } from "@/features/tenant-client/components/TenantClientListPanel/TenantClientRotateAction/useTenantClientRotateAction";

export interface TenantClientRotateActionProps {
  tenantId: string;
}

/**
 * A tenant-level action, not per-client — rotating revokes every currently-active client
 * key for this tenant and issues exactly one new one (see `POST /tenants/{id}/client/rotate`).
 */
export function TenantClientRotateAction({ tenantId }: TenantClientRotateActionProps) {
  const { t } = useAppTranslation();
  const { isConfirmOpen, openConfirm, setConfirmOpen, confirmRotate, isRotating, rotateError, rotated, closeReveal } =
    useTenantClientRotateAction(tenantId);

  return (
    <>
      <Button variant="outline" size="sm" className="text-destructive" onClick={openConfirm}>
        {t("tenantClient.actions.rotate", "Rotate client key")}
      </Button>

      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setConfirmOpen}
        title={t("tenantClient.rotate.title", "Rotate this tenant's client key?")}
        description={t(
          "tenantClient.rotate.description",
          "Every currently active client key for this tenant stops working immediately and one new key is issued. Anything using the old key (the tenant's own app, pre-login) must be updated with the new key right away.",
        )}
        confirmLabel={t("tenantClient.actions.rotate", "Rotate client key")}
        confirmVariant="destructive"
        loading={isRotating}
        error={rotateError}
        onConfirm={confirmRotate}
      />

      <Dialog open={!!rotated} onOpenChange={(open) => !open && closeReveal()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("tenantClient.rotate.revealTitle", "Save this key now")}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {t(
              "tenantClient.rotate.revealDescription",
              "This key is shown only once and cannot be retrieved again.",
            )}
          </p>
          {rotated ? <Input value={rotated.publicKey} readOnly className="font-mono" /> : null}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (rotated) void navigator.clipboard.writeText(rotated.publicKey);
              }}
            >
              {t("common.actions.copy", "Copy")}
            </Button>
            <Button type="button" onClick={closeReveal}>
              {t("common.actions.done", "Done")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
