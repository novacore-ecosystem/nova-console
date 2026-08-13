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
import { useTenantClientActions } from "@/features/tenant-client/components/TenantClientListPanel/TenantClientActions/useTenantClientActions";
import type { TenantClientRecord } from "@/services/tenant-client";

export interface TenantClientActionsProps {
  client: TenantClientRecord;
}

export function TenantClientActions({ client }: TenantClientActionsProps) {
  const { t } = useAppTranslation();
  const {
    isConfirmOpen,
    openConfirm,
    setConfirmOpen,
    confirmRotate,
    isRotating,
    rotatedClient,
    closeReveal,
  } = useTenantClientActions(client);

  if (client.status !== "active") return null;

  return (
    <>
      <Button variant="ghost" size="sm" onClick={openConfirm}>
        {t("tenantClient.actions.rotate", "Rotate")}
      </Button>
      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setConfirmOpen}
        title={t("tenantClient.rotate.title", "Rotate this key?")}
        description={t(
          "tenantClient.rotate.description",
          "The current key stops working immediately. Anything using it must be updated with the new key.",
        )}
        confirmLabel={t("tenantClient.actions.rotate", "Rotate")}
        confirmVariant="destructive"
        loading={isRotating}
        onConfirm={confirmRotate}
      />
      <Dialog open={!!rotatedClient} onOpenChange={(open) => !open && closeReveal()}>
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
          {rotatedClient ? (
            <Input value={rotatedClient.publicKey} readOnly className="font-mono" />
          ) : null}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (rotatedClient) void navigator.clipboard.writeText(rotatedClient.publicKey);
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
