"use client";

import { useState } from "react";

import { useAppTranslation } from "@/shared/i18n";
import { useUpdateTenantDictionaryMutation } from "@/features/tenant/api/tenant.queries";

export function useTenantDictionaryJsonDialog(tenantId: string, language: string, dictionary: unknown, onClose: () => void) {
  const { t } = useAppTranslation();
  const [text, setText] = useState(JSON.stringify(dictionary ?? {}, null, 2));
  const [parseError, setParseError] = useState<string | null>(null);
  const mutation = useUpdateTenantDictionaryMutation(tenantId);

  const onSave = async () => {
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      setParseError(t("tenant.config.invalidJson", "Invalid JSON — fix the syntax before saving."));
      return;
    }
    setParseError(null);
    try {
      await mutation.mutateAsync({ language, dictionary: parsed });
      onClose();
    } catch {
      // surfaced via mutation.error below
    }
  };

  return {
    text,
    setText,
    parseError,
    onSave,
    isSaving: mutation.isPending,
    saveError: mutation.error instanceof Error ? mutation.error.message : null,
  };
}
