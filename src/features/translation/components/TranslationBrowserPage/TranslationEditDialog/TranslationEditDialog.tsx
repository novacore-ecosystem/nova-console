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
import type { TranslationRow } from "@/features/translation/components/TranslationBrowserPage/useTranslationBrowserPage";

export interface TranslationEditDialogProps {
  row: TranslationRow;
  onClose: () => void;
  onSave: (value: string) => void;
}

/** Single controlled field — deliberately not routed through shared/forms; see rules/components.md ("trivial UI-only behavior can stay inline"). */
export function TranslationEditDialog({ row, onClose, onSave }: TranslationEditDialogProps) {
  const { t } = useAppTranslation();
  const [value, setValue] = useState(row.overrideValue ?? row.baseValue);

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("translation.edit.title", "Edit translation")}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <FormField label={t("translation.table.key", "Key")}>
            <Input value={row.key} disabled readOnly className="font-mono text-xs" />
          </FormField>
          <FormField
            label={t("translation.table.value", "Value")}
            htmlFor="value"
            description={t("translation.edit.defaultHint", `Default: "${row.baseValue}"`, {
              value: row.baseValue,
            })}
          >
            <Input id="value" value={value} onChange={(event) => setValue(event.target.value)} />
          </FormField>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            {t("common.actions.cancel", "Cancel")}
          </Button>
          <Button type="button" onClick={() => onSave(value)}>
            {t("common.actions.save", "Save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
