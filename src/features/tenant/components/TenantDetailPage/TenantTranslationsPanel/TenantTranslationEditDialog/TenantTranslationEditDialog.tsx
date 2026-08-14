"use client";

import { useState } from "react";
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

import { useAppTranslation } from "@/shared/i18n";
import type { TenantTranslationRow } from "@/features/tenant/components/TenantDetailPage/TenantTranslationsPanel/useTenantTranslationsPanel";

export interface TenantTranslationEditDialogProps {
  row: TenantTranslationRow;
  isSaving: boolean;
  saveError: string | null;
  onClose: () => void;
  onSave: (value: string) => void;
}

export function TenantTranslationEditDialog({
  row,
  isSaving,
  saveError,
  onClose,
  onSave,
}: TenantTranslationEditDialogProps) {
  const { t } = useAppTranslation();
  const [value, setValue] = useState(row.value);

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("tenant.translations.editTitle", "Edit translation")}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <FormField label={t("translation.table.key", "Key")}>
            <Input value={row.key} disabled readOnly className="font-mono text-xs" />
          </FormField>
          <FormField label={t("translation.table.value", "Value")} htmlFor="value">
            <Input id="value" value={value} onChange={(event) => setValue(event.target.value)} />
          </FormField>
          {saveError ? (
            <p role="alert" className="text-sm text-destructive">
              {saveError}
            </p>
          ) : null}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            {t("common.actions.cancel", "Cancel")}
          </Button>
          <Button type="button" onClick={() => onSave(value)} loading={isSaving}>
            {t("common.actions.save", "Save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
