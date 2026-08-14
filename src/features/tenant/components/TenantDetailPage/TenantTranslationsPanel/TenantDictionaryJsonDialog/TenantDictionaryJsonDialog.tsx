"use client";

import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Textarea,
} from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import { useTenantDictionaryJsonDialog } from "@/features/tenant/components/TenantDetailPage/TenantTranslationsPanel/TenantDictionaryJsonDialog/useTenantDictionaryJsonDialog";

export interface TenantDictionaryJsonDialogProps {
  tenantId: string;
  language: string;
  dictionary: unknown;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Advanced/bulk affordance — the primary translation editing flow is the per-key browser, not this. */
export function TenantDictionaryJsonDialog({
  tenantId,
  language,
  dictionary,
  open,
  onOpenChange,
}: TenantDictionaryJsonDialogProps) {
  const { t } = useAppTranslation();
  const onClose = () => onOpenChange(false);
  const { text, setText, parseError, onSave, isSaving, saveError } = useTenantDictionaryJsonDialog(
    tenantId,
    language,
    dictionary,
    onClose,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("tenant.translations.editJsonTitle", "Edit dictionary as JSON")}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          {t(
            "tenant.translations.editJsonDescription",
            "Bulk-replaces this language's dictionary content. Unspecified keys are preserved.",
          )}
        </p>
        <Textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={16}
          className="font-mono text-xs"
          spellCheck={false}
        />
        {parseError ? (
          <p role="alert" className="text-sm text-destructive">
            {parseError}
          </p>
        ) : null}
        {saveError ? (
          <p role="alert" className="text-sm text-destructive">
            {saveError}
          </p>
        ) : null}
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            {t("common.actions.cancel", "Cancel")}
          </Button>
          <Button type="button" onClick={onSave} loading={isSaving}>
            {t("common.actions.save", "Save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
