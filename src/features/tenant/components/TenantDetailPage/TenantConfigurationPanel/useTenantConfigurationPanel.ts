"use client";

import { useState } from "react";
import { LOCALE_METADATA, type Locale } from "@novacore/frontend-foundation";

import { useAppTranslation } from "@/shared/i18n";
import { useUpdateTenantConfigMutation } from "@/features/tenant/api/tenant.queries";
import type { TenantDetailDto } from "@/services/tenant";

export interface TenantConfigSlot {
  key: string;
  language: string | null;
  label: string;
  text: string;
  parseError: string | null;
  saveError: string | null;
  isSaving: boolean;
  onChangeText: (text: string) => void;
  onSave: () => void;
}

function stringifyJson(value: unknown): string {
  return JSON.stringify(value ?? {}, null, 2);
}

/** One fallback slot + one per supported language — matches `UpdateTenantConfig`'s "omit language = fallback" contract. */
export function useTenantConfigurationPanel(tenant: TenantDetailDto): TenantConfigSlot[] {
  const { t } = useAppTranslation();
  const languages: (string | null)[] = [null, ...tenant.supportedLanguages];
  const initialText: Record<string, string> = {};
  for (const language of languages) {
    const locale = tenant.locales.find((l) => l.languageCode === language);
    initialText[language ?? "__fallback__"] = stringifyJson(locale?.configuration);
  }

  const [textByKey, setTextByKey] = useState(initialText);
  const [parseErrorByKey, setParseErrorByKey] = useState<Record<string, string | null>>({});
  const mutation = useUpdateTenantConfigMutation(tenant.id);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  return languages.map((language) => {
    const key = language ?? "__fallback__";
    const label = language
      ? (LOCALE_METADATA[language as Locale]?.nativeName ?? language)
      : t("tenant.config.fallbackLabel", "Default (fallback)");

    return {
      key,
      language,
      label,
      text: textByKey[key] ?? "",
      parseError: parseErrorByKey[key] ?? null,
      saveError: savingKey === key && mutation.error instanceof Error ? mutation.error.message : null,
      isSaving: savingKey === key && mutation.isPending,
      onChangeText: (text: string) => setTextByKey((prev) => ({ ...prev, [key]: text })),
      onSave: () => {
        let parsed: unknown;
        try {
          parsed = JSON.parse(textByKey[key] ?? "{}");
        } catch {
          setParseErrorByKey((prev) => ({
            ...prev,
            [key]: t("tenant.config.invalidJson", "Invalid JSON — fix the syntax before saving."),
          }));
          return;
        }
        setParseErrorByKey((prev) => ({ ...prev, [key]: null }));
        setSavingKey(key);
        mutation.mutate({ language, config: parsed });
      },
    };
  });
}
